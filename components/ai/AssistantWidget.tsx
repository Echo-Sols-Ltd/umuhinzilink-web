'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Brain, X, Send, Loader2, Camera, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { aiService } from '@/services/ai';
import { notify } from '@/lib/notify';
import { UserRole, AiChatTurn, Product } from '@/types';
import { cn } from '@/lib/utils';

type AssistantMode = 'chat' | 'farming' | 'crop' | 'price' | 'search';

const SELLER_MODES: AssistantMode[] = ['chat', 'farming', 'crop', 'price'];
const BUYER_MODES: AssistantMode[] = ['chat', 'search'];

function modeLabel(mode: AssistantMode, t: (k: string) => string) {
  const keys: Record<AssistantMode, string> = {
    chat: 'assistant.modes.chat',
    farming: 'assistant.modes.farming',
    crop: 'assistant.modes.crop',
    price: 'assistant.modes.price',
    search: 'assistant.modes.search',
  };
  return t(keys[mode]);
}

export default function AssistantWidget() {
  const { user, isAuthenticated } = useAuth();
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AiChatTurn[]>([]);
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);

  // Crop disease
  const [cropHint, setCropHint] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropPreview, setCropPreview] = useState<string | null>(null);

  // Price advice
  const [cropName, setCropName] = useState('');
  const [district, setDistrict] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === UserRole.ADMIN;
  const isSeller = user?.role === UserRole.SELLER;
  const modes = isSeller ? SELLER_MODES : BUYER_MODES;
  const aiLocale = locale === 'rw' ? 'rw' : 'en';

  const hiddenOnRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/auth') ||
    !isAuthenticated ||
    isAdmin;

  useEffect(() => {
    aiService.getStatus().then(res => {
      if (res.success && res.data) {
        setAvailable(res.data.enabled && res.data.configured);
      }
    }).catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, loading]);

  useEffect(() => {
    if (!modes.includes(mode)) {
      setMode('chat');
    }
  }, [mode, modes]);

  const pushAssistant = useCallback((content: string) => {
    setHistory(prev => [...prev, { role: 'assistant', content }]);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setSearchProducts([]);

    try {
      if (mode === 'search') {
        const res = await aiService.smartSearch({ query: text, locale: aiLocale });
        if (!res.success || !res.data) {
          notify.error(res.message || t('assistant.errors.generic'));
          return;
        }
        pushAssistant(res.data.reply);
        setSearchProducts(res.data.products ?? []);
      } else if (mode === 'farming') {
        const res = await aiService.farmingTips({
          message: text,
          locale: aiLocale,
          history: history.slice(-8),
        });
        if (!res.success || !res.data) {
          notify.error(res.message || t('assistant.errors.generic'));
          return;
        }
        pushAssistant(res.data.reply);
      } else {
        const res = await aiService.chat({
          message: text,
          locale: aiLocale,
          history: history.slice(-8),
        });
        if (!res.success || !res.data) {
          notify.error(res.message || t('assistant.errors.generic'));
          return;
        }
        pushAssistant(res.data.reply);
      }
    } catch {
      notify.error(t('assistant.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handlePriceAdvice = async () => {
    if (!cropName.trim() || loading) return;
    setLoading(true);
    const userMsg = `${t('assistant.price.for')} ${cropName}${district ? ` (${district})` : ''}`;
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const res = await aiService.priceAdvice({
        cropName: cropName.trim(),
        district: district.trim() || undefined,
        locale: aiLocale,
      });
      if (!res.success || !res.data) {
        notify.error(res.message || t('assistant.errors.generic'));
        return;
      }
      pushAssistant(res.data.reply);
    } catch {
      notify.error(t('assistant.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleCropAnalyze = async () => {
    if (!cropFile || loading) return;
    setLoading(true);
    setHistory(prev => [...prev, { role: 'user', content: t('assistant.crop.uploaded') }]);

    try {
      const res = await aiService.analyzeCropDisease(cropFile, cropHint || undefined, aiLocale);
      if (!res.success || !res.data) {
        notify.error(res.message || t('assistant.errors.generic'));
        return;
      }
      const d = res.data;
      const reply = [
        d.diagnosis && `**${t('assistant.crop.diagnosis')}:** ${d.diagnosis}`,
        d.treatment && `**${t('assistant.crop.treatment')}:** ${d.treatment}`,
        d.prevention && `**${t('assistant.crop.prevention')}:** ${d.prevention}`,
        d.confidenceNote && `**${t('assistant.crop.confidence')}:** ${d.confidenceNote}`,
      ].filter(Boolean).join('\n\n');
      pushAssistant(reply);
    } catch {
      notify.error(t('assistant.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const onFilePick = (file: File | null) => {
    setCropFile(file);
    if (cropPreview) URL.revokeObjectURL(cropPreview);
    setCropPreview(file ? URL.createObjectURL(file) : null);
  };

  if (hiddenOnRoute || !available) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
          aria-label={t('assistant.open')}
        >
          <Brain size={20} />
          <span className="text-sm font-semibold hidden sm:inline">{t('assistant.title')}</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,400px)] h-[min(85vh,560px)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5 shrink-0">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t('assistant.title')}</p>
                <p className="text-[11px] text-muted-foreground">{t('assistant.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/assistant"
                onClick={() => setOpen(false)}
                className="text-[11px] text-primary hover:underline px-2"
              >
                {t('assistant.expand')}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto shrink-0 scrollbar-hide">
            {modes.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setSearchProducts([]); }}
                className={cn(
                  'shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors',
                  mode === m
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {modeLabel(m, t)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {history.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                {t('assistant.welcome')}
              </p>
            )}
            {history.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[90%] rounded-xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {msg.content}
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
                {searchProducts.slice(0, 3).map(p => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg border border-border hover:bg-accent text-xs"
                  >
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-muted-foreground"> — {p.unitPrice} RWF</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-border p-3 space-y-2">
            {mode === 'crop' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={cropHint}
                  onChange={e => setCropHint(e.target.value)}
                  placeholder={t('assistant.crop.hintPlaceholder')}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background"
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
                    <img src={cropPreview} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => onFilePick(null)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full h-20 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:bg-accent text-xs"
                  >
                    <Camera size={18} />
                    {t('assistant.crop.pickPhoto')}
                  </button>
                )}
                <button
                  type="button"
                  disabled={!cropFile || loading}
                  onClick={handleCropAnalyze}
                  className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50"
                >
                  {t('assistant.crop.analyze')}
                </button>
              </div>
            )}

            {mode === 'price' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={cropName}
                  onChange={e => setCropName(e.target.value)}
                  placeholder={t('assistant.price.cropPlaceholder')}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background"
                />
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder={t('assistant.price.districtPlaceholder')}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background"
                />
                <button
                  type="button"
                  disabled={!cropName.trim() || loading}
                  onClick={handlePriceAdvice}
                  className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <TrendingUp size={14} />
                  {t('assistant.price.getAdvice')}
                </button>
              </div>
            )}

            {(mode === 'chat' || mode === 'farming' || mode === 'search') && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={
                    mode === 'search'
                      ? t('assistant.search.placeholder')
                      : t('assistant.inputPlaceholder')
                  }
                  className="flex-1 h-10 px-3 text-sm rounded-xl border border-border bg-background"
                />
                <button
                  type="button"
                  disabled={!input.trim() || loading}
                  onClick={handleSend}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
