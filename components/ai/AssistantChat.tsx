'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Brain, X, Send, Loader2, Camera, TrendingUp, AlertCircle, Sprout, MessageCircle, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { aiService } from '@/services/ai';
import {
  compressHistory,
  extractApiErrorMessage,
  resolveAiErrorMessage,
  trimForAi,
} from '@/lib/aiErrors';
import { shouldUseSmartSearch } from '@/lib/assistantRouting';
import { toAiLocale } from '@/lib/localeFormat';
import { UserRole, AiChatTurn, AiProductSummary, AiUserContext } from '@/types';
import { cn } from '@/lib/utils';

type SellerTool = 'chat' | 'farming' | 'crop' | 'price';

export type AssistantChatLayout = 'panel' | 'full';

interface AssistantChatProps {
  layout?: AssistantChatLayout;
  onClose?: () => void;
  className?: string;
}

const BUYER_SUGGESTION_KEYS = [
  'assistant.suggestions.whatAvailable',
  'assistant.suggestions.findProduce',
  'assistant.suggestions.howToBuy',
] as const;

export default function AssistantChat({
  layout = 'panel',
  onClose,
  className,
}: AssistantChatProps) {
  const { user, isAuthenticated } = useAuth();
  const { t, locale } = useI18n();

  const [available, setAvailable] = useState(false);
  const [userContext, setUserContext] = useState<AiUserContext | null>(null);
  const [sellerTool, setSellerTool] = useState<SellerTool>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AiChatTurn[]>([]);
  const [searchProducts, setSearchProducts] = useState<AiProductSummary[]>([]);

  const [cropHint, setCropHint] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [cropName, setCropName] = useState('');
  const [district, setDistrict] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const contextLoadedRef = useRef(false);

  const isSeller = user?.role === UserRole.SELLER;
  const isBuyer = !isSeller;
  const aiLocale = toAiLocale(locale);
  const isFull = layout === 'full';

  useEffect(() => {
    aiService.getStatus().then(res => {
      if (res.success && res.data) {
        setAvailable(res.data.enabled && res.data.configured);
      }
    }).catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    if (!available || !isAuthenticated || contextLoadedRef.current) return;
    aiService.getContext().then(res => {
      if (res.success && res.data) {
        contextLoadedRef.current = true;
        setUserContext(res.data);
        if (res.data.district) {
          setDistrict(prev => prev || res.data!.district!);
        }
        if (res.data.crops?.length) {
          setCropName(prev => prev || res.data!.crops![0]);
          setCropHint(prev => prev || res.data!.crops![0]);
        }
      }
    }).catch(() => setUserContext(null));
  }, [available, isAuthenticated]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, loading, searchProducts]);

  const pushAssistant = useCallback((content: string) => {
    setHistory(prev => [...prev, { role: 'assistant', content }]);
  }, []);

  const pushError = useCallback((raw?: string) => {
    const message = resolveAiErrorMessage(raw, t);
    setHistory(prev => [...prev, { role: 'assistant', content: message, isError: true }]);
  }, [t]);

  const handleApiFailure = useCallback((message?: string) => {
    pushError(message);
  }, [pushError]);

  const handleSend = async (overrideText?: string) => {
    const text = trimForAi(overrideText ?? input);
    if (!text || loading) return;

    if (!overrideText) setInput('');
    setHistory(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setSearchProducts([]);

    try {
      if (isBuyer && shouldUseSmartSearch(text)) {
        const res = await aiService.smartSearch({ query: text, locale: aiLocale });
        if (!res.success || !res.data) {
          handleApiFailure(res.message);
          return;
        }
        pushAssistant(res.data.reply);
        setSearchProducts(res.data.products ?? []);
      } else if (isSeller && sellerTool === 'farming') {
        const res = await aiService.farmingTips({ message: text, locale: aiLocale });
        if (!res.success || !res.data?.reply) {
          handleApiFailure(res.message);
          return;
        }
        pushAssistant(res.data.reply);
      } else {
        const res = await aiService.chat({
          message: text,
          locale: aiLocale,
          history: compressHistory(history),
        });
        if (!res.success || !res.data?.reply) {
          handleApiFailure(res.message);
          return;
        }
        pushAssistant(res.data.reply);
        if (res.data.products?.length) {
          setSearchProducts(res.data.products);
        }
      }
    } catch (err) {
      handleApiFailure(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePriceAdvice = async () => {
    const crop = trimForAi(cropName, 80);
    if (!crop || loading) {
      if (!crop) pushError(t('assistant.errors.emptyInput'));
      return;
    }
    setLoading(true);
    const userMsg = `${t('assistant.price.for')} ${crop}${district ? ` (${district.trim()})` : ''}`;
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const res = await aiService.priceAdvice({
        cropName: crop,
        district: district.trim() || undefined,
        locale: aiLocale,
      });
      if (!res.success || !res.data?.reply) {
        handleApiFailure(res.message);
        return;
      }
      pushAssistant(res.data.reply);
    } catch (err) {
      handleApiFailure(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCropAnalyze = async () => {
    if (!cropFile || loading) return;
    if (cropFile.size > 5 * 1024 * 1024) {
      pushError(t('assistant.errors.imageTooLarge'));
      return;
    }

    setLoading(true);
    setHistory(prev => [...prev, { role: 'user', content: t('assistant.crop.uploaded') }]);

    try {
      const res = await aiService.analyzeCropDisease(cropFile, cropHint || undefined, aiLocale);
      if (!res.success || !res.data) {
        handleApiFailure(res.message);
        return;
      }
      const d = res.data;
      const parts = [
        d.diagnosis && `${t('assistant.crop.diagnosis')}: ${d.diagnosis}`,
        d.treatment && `${t('assistant.crop.treatment')}: ${d.treatment}`,
        d.prevention && `${t('assistant.crop.prevention')}: ${d.prevention}`,
        d.confidenceNote && `${t('assistant.crop.confidence')}: ${d.confidenceNote}`,
      ].filter(Boolean);

      if (parts.length === 0) {
        handleApiFailure(t('assistant.errors.cropAnalysis'));
        return;
      }
      pushAssistant(parts.join('\n\n'));
    } catch (err) {
      handleApiFailure(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onFilePick = (file: File | null) => {
    setCropFile(file);
    if (cropPreview) URL.revokeObjectURL(cropPreview);
    setCropPreview(file ? URL.createObjectURL(file) : null);
  };

  const switchSellerTool = (tool: SellerTool) => {
    setSellerTool(tool);
    setSearchProducts([]);
  };

  if (!isAuthenticated) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center',
        isFull ? 'min-h-[50vh]' : 'h-full',
        className,
      )}>
        <Brain size={32} className="text-primary mb-3" />
        <p className="text-sm text-muted-foreground mb-4">{t('assistant.signInPrompt')}</p>
        <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">
          {t('auth.signIn.signIn')}
        </Link>
      </div>
    );
  }

  if (!available) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center',
        isFull ? 'min-h-[50vh]' : 'h-full',
        className,
      )}>
        <p className="text-sm text-muted-foreground">{t('assistant.errors.unavailable')}</p>
      </div>
    );
  }

  const welcomeText = isBuyer
    ? (userContext?.welcomeMessage ?? t('assistant.welcomeBuyer'))
    : (userContext?.welcomeMessage ?? t('assistant.welcome'));

  const inputPlaceholder = isBuyer
    ? t('assistant.inputPlaceholderBuyer')
    : sellerTool === 'farming'
      ? t('assistant.farmingPlaceholder')
      : t('assistant.inputPlaceholder');

  const showChatInput = isBuyer || sellerTool === 'chat' || sellerTool === 'farming';

  return (
    <div
      className={cn(
        'flex flex-col border border-border bg-card shadow-sm overflow-hidden',
        isFull
          ? 'w-full min-h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)] rounded-2xl'
          : 'w-full h-full rounded-2xl shadow-2xl',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Brain size={isFull ? 22 : 18} className="text-primary shrink-0" />
          <div className="min-w-0">
            <p className={cn('font-semibold text-foreground truncate', isFull ? 'text-base' : 'text-sm')}>
              {t('assistant.title')}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {isBuyer ? t('assistant.subtitleBuyer') : t('assistant.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isFull && (
            <Link
              href="/assistant"
              onClick={onClose}
              className="text-[11px] text-primary hover:underline px-2 whitespace-nowrap"
            >
              {t('assistant.expand')}
            </Link>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              aria-label={t('assistant.close')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Seller tools — optional, not tabs for buyers */}
      {isSeller && (
        <div className="flex flex-wrap gap-2 px-4 py-2.5 border-b border-border bg-muted/30 shrink-0">
          {sellerTool !== 'chat' && (
            <button
              type="button"
              onClick={() => switchSellerTool('chat')}
              className="flex items-center gap-1 text-[11px] text-primary font-medium mr-1"
            >
              <ArrowLeft size={12} />
              {t('assistant.backToChat')}
            </button>
          )}
          {([
            { id: 'chat' as const, icon: MessageCircle, label: 'assistant.modes.chat' },
            { id: 'farming' as const, icon: Sprout, label: 'assistant.modes.farming' },
            { id: 'crop' as const, icon: Camera, label: 'assistant.modes.crop' },
            { id: 'price' as const, icon: TrendingUp, label: 'assistant.modes.price' },
          ]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchSellerTool(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                sellerTool === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:bg-accent',
              )}
            >
              <Icon size={14} />
              {t(label)}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-4 py-4 space-y-3',
          isFull && 'px-6 md:px-8',
        )}
      >
        {history.length === 0 && (
          <div className={cn(
            'text-muted-foreground py-6 space-y-4',
            isFull ? 'text-sm max-w-2xl mx-auto text-center' : 'text-xs text-center',
          )}>
            <p className="leading-relaxed">{welcomeText}</p>
            {isBuyer && userContext?.availableProducts && userContext.availableProducts.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-left">
                <p className="text-xs font-semibold text-foreground mb-2">
                  {t('assistant.availableNow')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {userContext.availableProducts.map(name => (
                    <button
                      key={name}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSend(`${t('assistant.askAbout')} ${name}`)}
                      className="px-2.5 py-1 rounded-full bg-background border border-border text-foreground text-xs hover:border-primary/40 hover:bg-accent transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isBuyer && userContext?.availableProducts?.length === 0 && (
              <p className="text-[11px] text-muted-foreground/80 italic">
                {t('assistant.noListingsYet')}
              </p>
            )}
            {isBuyer && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {BUYER_SUGGESTION_KEYS.map(key => (
                  <button
                    key={key}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSend(t(key))}
                    className="px-3 py-2 rounded-full border border-primary/30 bg-primary/5 text-foreground text-xs font-medium hover:bg-primary/10 transition-colors"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            )}
            {isSeller && userContext?.crops && userContext.crops.length > 0 && (
              <p className="text-[11px] text-muted-foreground/80">
                {t('assistant.profile.crops')}: {userContext.crops.slice(0, 4).join(', ')}
                {userContext.district && ` · ${userContext.district}`}
              </p>
            )}
          </div>
        )}

        <div className={cn(isFull && 'max-w-3xl mx-auto w-full space-y-3')}>
          {history.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap',
                isFull ? 'text-sm' : 'text-[13px]',
                isFull ? 'max-w-[85%]' : 'max-w-[90%]',
                msg.isError
                  ? 'bg-destructive/10 text-destructive border border-destructive/20 flex gap-2 items-start'
                  : msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
              )}
            >
              {msg.isError && <AlertCircle size={14} className="shrink-0 mt-0.5" />}
              <span>{msg.content}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 size={14} className="animate-spin" />
              {t('assistant.thinking')}
            </div>
          )}

          {searchProducts.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-foreground">{t('assistant.search.results')}</p>
              <div className={cn('grid gap-2', isFull && 'sm:grid-cols-2')}>
                {searchProducts.slice(0, isFull ? 8 : 5).map(p => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={onClose}
                    className="block px-4 py-3 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-colors"
                  >
                    <span className="font-medium text-foreground text-sm">{p.name}</span>
                    <span className="text-muted-foreground text-xs block mt-0.5">
                      {p.unitPrice} RWF
                      {p.district && ` · ${String(p.district)}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className={cn(
        'shrink-0 border-t border-border p-4 space-y-2 bg-background',
        isFull && 'px-6 md:px-8 pb-6',
      )}>
        <div className={cn(isFull && 'max-w-3xl mx-auto w-full')}>
          {isSeller && sellerTool === 'crop' && (
            <div className="space-y-2">
              <input
                type="text"
                value={cropHint}
                onChange={e => setCropHint(e.target.value.slice(0, 80))}
                placeholder={t('assistant.crop.hintPlaceholder')}
                className="w-full h-10 px-3 text-sm rounded-xl border border-border bg-background"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => onFilePick(e.target.files?.[0] ?? null)}
              />
              {cropPreview ? (
                <div className="relative">
                  <img src={cropPreview} alt="" className="w-full max-h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => onFilePick(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-24 flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground hover:bg-accent text-sm"
                >
                  <Camera size={22} />
                  {t('assistant.crop.pickPhoto')}
                </button>
              )}
              <button
                type="button"
                disabled={!cropFile || loading}
                onClick={handleCropAnalyze}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
              >
                {t('assistant.crop.analyze')}
              </button>
            </div>
          )}

          {isSeller && sellerTool === 'price' && (
            <div className="space-y-2">
              <input
                type="text"
                value={cropName}
                onChange={e => setCropName(e.target.value.slice(0, 80))}
                placeholder={t('assistant.price.cropPlaceholder')}
                className="w-full h-10 px-3 text-sm rounded-xl border border-border bg-background"
              />
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value.slice(0, 40))}
                placeholder={t('assistant.price.districtPlaceholder')}
                className="w-full h-10 px-3 text-sm rounded-xl border border-border bg-background"
              />
              <button
                type="button"
                disabled={!cropName.trim() || loading}
                onClick={handlePriceAdvice}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <TrendingUp size={16} />
                {t('assistant.price.getAdvice')}
              </button>
            </div>
          )}

          {showChatInput && (
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.slice(0, 500))}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={inputPlaceholder}
                className={cn(
                  'flex-1 px-4 rounded-xl border border-border bg-background',
                  isFull ? 'h-12 text-base' : 'h-10 text-sm',
                )}
              />
              <button
                type="button"
                disabled={!input.trim() || loading}
                onClick={() => handleSend()}
                className={cn(
                  'flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 shrink-0',
                  isFull ? 'h-12 w-12' : 'h-10 w-10',
                )}
                aria-label={t('assistant.send')}
              >
                <Send size={isFull ? 18 : 16} />
              </button>
            </div>
          )}

          {isBuyer && (
            <p className="text-[11px] text-muted-foreground text-center pt-1">
              {t('assistant.buyerHint')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
