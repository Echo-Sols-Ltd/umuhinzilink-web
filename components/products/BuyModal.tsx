'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Minus, Plus, ShoppingBag, TrendingUp,
    Wallet, AlertCircle, ChevronRight,
    CheckCircle, MapPin, User, Package,
} from '@/lib/icons';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useI18n } from '@/contexts/I18nContext';
import { formatCurrency } from '@/lib/localeFormat';
import { cn, imageUrl } from '@/lib/utils';
import { MeasurementUnit, OrderRequest, PaymentMethod, Product } from '@/types';
import { notify } from '@/lib/notify';
import useOrderAction from '@/hooks/useOrderAction';

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = 'buy' | 'negotiate';
type Step = 'config' | 'confirm' | 'done';

interface BuyModalProps {
    product: Product;
    onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
    return Math.min(max, Math.max(min, val));
}

function unitLabel(unit: string, t: (key: string) => string): string {
    const byKey = t(`enums.units.${unit}`);
    if (byKey !== `enums.units.${unit}`) return byKey.toLowerCase();
    const entry = Object.entries(MeasurementUnit).find(([, v]) => v === unit);
    if (entry) return t(`enums.units.${entry[0]}`).toLowerCase();
    return unit?.toLowerCase() ?? 'unit';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ModalOverlay({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
    );
}

function Stepper({ step }: { step: Step }) {
    const { t } = useI18n();
    const steps: Step[] = ['config', 'confirm', 'done'];
    const labels = [
        t('products.buyModal.steps.details'),
        t('products.buyModal.steps.confirm'),
        t('products.buyModal.steps.done'),
    ];
    const current = steps.indexOf(step);
    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                        i < current ? 'bg-green-600 text-white' :
                            i === current ? 'bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900' :
                                'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                    )}>
                        {i < current ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <span className={cn(
                        'text-xs font-medium hidden sm:block',
                        i === current ? 'text-foreground' : 'text-muted-foreground'
                    )}>{labels[i]}</span>
                    {i < steps.length - 1 && (
                        <div className={cn('w-8 h-px', i < current ? 'bg-green-600' : 'bg-border')} />
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export default function BuyModal({ product, onClose }: BuyModalProps) {
    const { t, locale } = useI18n();
    const router = useRouter();
    const { createOrder } = useOrderAction()
    const [mode, setMode] = useState<Mode>(product.isNegotiable ? 'negotiate' : 'buy');
    const [step, setStep] = useState<Step>('config');
    const [quantity, setQuantity] = useState(1);
    const [proposedPrice, setProposedPrice] = useState('');
    const [priceError, setPriceError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [orderPaid, setOrderPaid] = useState(false);
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);

    // close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // ── Computed ──────────────────────────────────────────────────────────

    const unitPrice = product.unitPrice;
    const totalPrice = unitPrice * quantity;
    const proposedPriceNum = parseFloat(proposedPrice.replace(/,/g, ''));
    const proposedTotal = proposedPriceNum * quantity;
    const unit = unitLabel(String(product.measurementUnit), t);
    const maxQty = product.stockQuantity;

    const discount = proposedPriceNum && proposedPriceNum < unitPrice
        ? Math.round((1 - proposedPriceNum / unitPrice) * 100)
        : 0;

    // ── Validation ────────────────────────────────────────────────────────

    const validatePrice = (): boolean => {
        if (mode === 'buy') return true;
        if (!proposedPrice || isNaN(proposedPriceNum) || proposedPriceNum <= 0) {
            setPriceError(t('products.buyModal.validation.priceInvalid'));
            return false;
        }
        if (proposedPriceNum > unitPrice) {
            setPriceError(t('products.buyModal.validation.priceTooHigh'));
            return false;
        }
        if (proposedPriceNum < unitPrice * 0.3) {
            setPriceError(t('products.buyModal.validation.priceTooLow'));
            return false;
        }
        setPriceError('');
        return true;
    };

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validatePrice()) return;
        setLoading(true);
        setOrderPaid(false);
        setPaymentRequired(false);
        setCreatedOrderId(null);
        try {
            if (mode === 'buy') {
                const requestData: OrderRequest = {
                    productId: product.id,
                    quantity,
                    paymentMethod: PaymentMethod.WALLET
                };
                const result = await createOrder(requestData, { payImmediately: true });
                if (!result) return;
                setCreatedOrderId(result.order.id);
                setOrderPaid(result.paid);
                setPaymentRequired(!result.paid);
            } else {
                const requestData: OrderRequest = {
                    productId: product.id,
                    quantity,
                    proposedPrice: proposedPriceNum,
                    paymentMethod: PaymentMethod.WALLET
                };
                const result = await createOrder(requestData);
                if (!result) return;
                setCreatedOrderId(result.order.id);
            }
            setStep('done');
        } catch {
            notify.error(t('products.buyModal.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoToNegotiation = () => {
        onClose();
        router.push('/negotiations');
    };

    const handleGoToOrders = () => {
        const target = paymentRequired
            ? `${ROUTES.orders}?payment=required${createdOrderId ? `&orderId=${createdOrderId}` : ''}`
            : createdOrderId
                ? ROUTES.orderDetail(createdOrderId)
                : ROUTES.orders;
        onClose();
        router.push(target);
    };

    const formatPrice = (amount: number) => formatCurrency(amount, locale);

    // ── Modal content ─────────────────────────────────────────────────────

    const modal = (
        <>
            <ModalOverlay onClose={onClose} />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <div
                    onClick={e => e.stopPropagation()}
                    className="pointer-events-auto w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">

                    {/* Handle bar (mobile) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                {product.image ? (
                                    <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={18} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <User size={10} />
                                    <span>{product.owner?.firstName} {product.owner?.lastName}</span>
                                    <span>·</span>
                                    <MapPin size={10} />
                                    <span>{product.district?.charAt(0) + product.district?.slice(1).toLowerCase()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                        {/* ── STEP: Config ─────────────────────────────── */}
                        {step === 'config' && (
                            <>
                                <Stepper step="config" />

                                {/* Mode selector — only show if product is negotiable */}
                                {product.isNegotiable && (
                                    <div className="flex rounded-xl overflow-hidden border border-border bg-gray-50 dark:bg-gray-800/50 p-1 gap-1">
                                        {(['buy', 'negotiate'] as const).map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-semibold rounded-lg transition-all',
                                                    mode === m
                                                        ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-sm border border-border'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                )}>
                                                {m === 'buy'
                                                    ? <><ShoppingBag size={13} /> {t('products.buyModal.buyNow')}</>
                                                    : <><TrendingUp size={13} /> {t('products.buyModal.negotiate')}</>
                                                }
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Price info */}
                                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3.5 border border-green-100 dark:border-green-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{t('products.buyModal.listedPrice')}</span>
                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                            {formatPrice(unitPrice)} / {unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground">{t('products.buyModal.available')}</span>
                                        <span className="text-xs font-medium text-foreground">
                                            {maxQty} {unit}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">{t('products.buyModal.quantity')}</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(q => clamp(q - 1, 1, maxQty))}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            max={maxQty}
                                            value={quantity}
                                            onChange={e => setQuantity(clamp(parseInt(e.target.value) || 1, 1, maxQty))}
                                            className="flex-1 h-10 text-center text-sm font-bold text-foreground bg-gray-50 dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => clamp(q + 1, 1, maxQty))}
                                            disabled={quantity >= maxQty}
                                            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <Plus size={14} />
                                        </button>
                                        <span className="text-sm text-muted-foreground shrink-0">{unit}</span>
                                    </div>
                                </div>

                                {/* Proposed price — negotiate mode only */}
                                {mode === 'negotiate' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                            {t('products.buyModal.yourOffer', { unit })}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">RWF</span>
                                            <input
                                                ref={inputRef}
                                                type="number"
                                                min={1}
                                                placeholder={String(Math.round(unitPrice * 0.85))}
                                                value={proposedPrice}
                                                onChange={e => {
                                                    setProposedPrice(e.target.value);
                                                    if (priceError) setPriceError('');
                                                }}
                                                className={cn(
                                                    'w-full h-11 pl-12 pr-4 text-sm font-semibold text-foreground bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all',
                                                    priceError ? 'border-red-400' : 'border-border'
                                                )}
                                            />
                                        </div>
                                        {priceError && (
                                            <p className="flex items-center gap-1.5 text-xs text-red-500">
                                                <AlertCircle size={11} /> {priceError}
                                            </p>
                                        )}
                                        {proposedPriceNum > 0 && !priceError && discount > 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                {t('products.buyModal.discountBelow', { discount })}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {t('products.buyModal.negotiateHint')}
                                        </p>
                                    </div>
                                )}

                                {/* Total preview */}
                                <div className="flex items-center justify-between py-3 border-t border-border">
                                    <span className="text-sm text-muted-foreground">
                                        {mode === 'negotiate' && proposedPriceNum > 0
                                            ? t('products.buyModal.proposedTotal')
                                            : t('products.buyModal.total')}
                                    </span>
                                    <span className="text-lg font-extrabold text-green-700 dark:text-green-400">
                                        {mode === 'negotiate' && proposedPriceNum > 0
                                            ? formatPrice(proposedTotal)
                                            : formatPrice(totalPrice)
                                        }
                                    </span>
                                </div>

                                <button
                                    onClick={() => { if (validatePrice()) setStep('confirm'); }}
                                    className="w-full h-11 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                    {t('products.buyModal.continue')} <ChevronRight size={15} />
                                </button>
                            </>
                        )}

                        {/* ── STEP: Confirm ─────────────────────────────── */}
                        {step === 'confirm' && (
                            <>
                                <Stepper step="confirm" />

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {t('products.buyModal.orderSummary')}
                                    </p>

                                    {[
                                        { label: t('products.buyModal.product'), value: product.name },
                                        { label: t('products.buyModal.quantity'), value: `${quantity} ${unit}` },
                                        { label: t('products.buyModal.listedPriceLabel'), value: `${formatPrice(unitPrice)} / ${unit}` },
                                        ...(mode === 'negotiate' ? [
                                            { label: t('products.buyModal.yourOfferLabel'), value: `${formatPrice(proposedPriceNum)} / ${unit}` },
                                            { label: t('products.buyModal.proposedTotal'), value: formatPrice(proposedTotal), bold: true },
                                        ] : [
                                            { label: t('products.buyModal.total'), value: formatPrice(totalPrice), bold: true },
                                        ]),
                                    ].map(({ label, value, bold }) => (
                                        <div key={label} className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{label}</span>
                                            <span className={cn('text-sm', bold ? 'font-extrabold text-green-700 dark:text-green-400' : 'font-medium text-foreground')}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {mode === 'buy' && (
                                    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                                        <Wallet size={15} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            {t('products.buyModal.walletNote')}
                                        </p>
                                    </div>
                                )}

                                {mode === 'negotiate' && (
                                    <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
                                        <TrendingUp size={15} className="text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                            {t('products.buyModal.negotiateNote')}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('config')}
                                        className="flex-1 h-11 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        {t('products.buyModal.back')}
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-[2] h-11 bg-green-600 hover:bg-green-700 disabled:opacity-60 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                                </svg>
                                                {mode === 'negotiate'
                                                    ? t('products.buyModal.sendingOffer')
                                                    : t('products.buyModal.processing')}
                                            </>
                                        ) : (
                                            mode === 'negotiate'
                                                ? t('products.buyModal.sendOffer')
                                                : t('products.buyModal.confirmPay')
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── STEP: Done ────────────────────────────────── */}
                        {step === 'done' && (
                            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-400">
                                <Stepper step="done" />

                                <div className={cn(
                                    'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                                    paymentRequired && mode === 'buy'
                                        ? 'bg-amber-100 dark:bg-amber-950/40'
                                        : 'bg-green-100 dark:bg-green-950/40',
                                )}>
                                    {paymentRequired && mode === 'buy' ? (
                                        <AlertCircle size={32} className="text-amber-600" />
                                    ) : (
                                        <CheckCircle size={32} className="text-green-600" />
                                    )}
                                </div>

                                <h3 className="text-lg font-extrabold text-foreground">
                                    {mode === 'negotiate'
                                        ? t('products.buyModal.done.offerSent')
                                        : orderPaid
                                            ? t('products.buyModal.done.paymentSuccess')
                                            : paymentRequired
                                                ? t('products.buyModal.done.orderPaymentRequired')
                                                : t('products.buyModal.done.orderPlaced')}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
                                    {mode === 'negotiate'
                                        ? t('products.buyModal.done.offerSentDesc', {
                                            price: formatPrice(proposedPriceNum),
                                            unit,
                                            name: product.owner?.firstName ?? '',
                                        })
                                        : orderPaid
                                            ? t('products.buyModal.done.paymentSuccessDesc', { amount: formatPrice(totalPrice) })
                                            : paymentRequired
                                                ? t('products.buyModal.done.paymentRequiredDesc')
                                                : t('products.buyModal.done.orderPlacedDesc', {
                                                    quantity,
                                                    unit,
                                                    name: product.name,
                                                })}
                                </p>

                                <div className="flex flex-col gap-2.5 mt-6">
                                    <button
                                        onClick={mode === 'negotiate' ? handleGoToNegotiation : handleGoToOrders}
                                        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors">
                                        {mode === 'negotiate'
                                            ? t('products.buyModal.done.viewNegotiation')
                                            : paymentRequired
                                                ? t('products.buyModal.done.payFromOrders')
                                                : t('products.buyModal.done.viewOrder')}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full h-10 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        {t('products.buyModal.done.continueShopping')}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );

    if (!mounted) return null;
    return createPortal(modal, document.body);
}
