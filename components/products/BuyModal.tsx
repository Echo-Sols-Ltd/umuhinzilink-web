'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Minus, Plus, ShoppingBag, TrendingUp,
    Wallet, AlertCircle, ChevronRight,
    CheckCircle, MapPin, User, Package,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn, imageUrl } from '@/lib/utils';
import { OrderRequest, PaymentMethod, Product } from '@/types';
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

function formatRWF(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function clamp(val: number, min: number, max: number) {
    return Math.min(max, Math.max(min, val));
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
    const steps: Step[] = ['config', 'confirm', 'done'];
    const labels = ['Details', 'Confirm', 'Done'];
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
    const { user } = useAuth();
    const router = useRouter();
    const { createOrder } = useOrderAction()
    const [mode, setMode] = useState<Mode>(product.isNegotiable ? 'negotiate' : 'buy');
    const [step, setStep] = useState<Step>('config');
    const [quantity, setQuantity] = useState(1);
    const [proposedPrice, setProposedPrice] = useState('');
    const [priceError, setPriceError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
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
    const unit = product.measurementUnit?.toLowerCase() ?? 'unit';
    const maxQty = product.stockQuantity;

    const discount = proposedPriceNum && proposedPriceNum < unitPrice
        ? Math.round((1 - proposedPriceNum / unitPrice) * 100)
        : 0;

    // ── Validation ────────────────────────────────────────────────────────

    const validatePrice = (): boolean => {
        if (mode === 'buy') return true;
        if (!proposedPrice || isNaN(proposedPriceNum) || proposedPriceNum <= 0) {
            setPriceError('Enter a valid price');
            return false;
        }
        if (proposedPriceNum > unitPrice) {
            setPriceError('Your offer cannot exceed the listed price');
            return false;
        }
        if (proposedPriceNum < unitPrice * 0.3) {
            setPriceError('Offer is too low — minimum 30% of listed price');
            return false;
        }
        setPriceError('');
        return true;
    };

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validatePrice()) return;
        setLoading(true);
        try {
            if (mode === 'buy') {
                const requestData: OrderRequest = {
                    productId: product.id,
                    quantity,
                    paymentMethod: PaymentMethod.WALLET
                }

                await createOrder(requestData)
            } else {
                const requestData: OrderRequest = {
                    productId: product.id,
                    quantity,
                    proposedPrice: proposedPriceNum,
                    paymentMethod: PaymentMethod.WALLET
                }

                await createOrder(requestData)
            }
            setStep('done');
        } catch {
            notify.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoToNegotiation = () => {
        onClose();
        router.push('/negotiations');
    };

    const handleGoToOrders = () => {
        onClose();
        router.push('orders');
    };

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
                                                    ? <><ShoppingBag size={13} /> Buy now</>
                                                    : <><TrendingUp size={13} /> Negotiate</>
                                                }
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Price info */}
                                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3.5 border border-green-100 dark:border-green-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Listed price</span>
                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                            {formatRWF(unitPrice)} / {unit}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground">Available</span>
                                        <span className="text-xs font-medium text-foreground">
                                            {maxQty} {unit}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Quantity</label>
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
                                            Your offer per {unit}
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
                                                You're offering {discount}% below listed price
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            The seller will review your offer and respond via chat. You can continue negotiating there.
                                        </p>
                                    </div>
                                )}

                                {/* Total preview */}
                                <div className="flex items-center justify-between py-3 border-t border-border">
                                    <span className="text-sm text-muted-foreground">
                                        {mode === 'negotiate' && proposedPriceNum > 0 ? 'Proposed total' : 'Total'}
                                    </span>
                                    <span className="text-lg font-extrabold text-green-700 dark:text-green-400">
                                        {mode === 'negotiate' && proposedPriceNum > 0
                                            ? formatRWF(proposedTotal)
                                            : formatRWF(totalPrice)
                                        }
                                    </span>
                                </div>

                                <button
                                    onClick={() => { if (validatePrice()) setStep('confirm'); }}
                                    className="w-full h-11 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                    Continue <ChevronRight size={15} />
                                </button>
                            </>
                        )}

                        {/* ── STEP: Confirm ─────────────────────────────── */}
                        {step === 'confirm' && (
                            <>
                                <Stepper step="confirm" />

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order summary</p>

                                    {[
                                        { label: 'Product', value: product.name },
                                        { label: 'Quantity', value: `${quantity} ${unit}` },
                                        { label: 'Listed price', value: formatRWF(unitPrice) + ` / ${unit}` },
                                        ...(mode === 'negotiate' ? [
                                            { label: 'Your offer', value: formatRWF(proposedPriceNum) + ` / ${unit}` },
                                            { label: 'Proposed total', value: formatRWF(proposedTotal), bold: true },
                                        ] : [
                                            { label: 'Total', value: formatRWF(totalPrice), bold: true },
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
                                            Payment will be deducted from your wallet balance. Make sure you have enough funds before confirming.
                                        </p>
                                    </div>
                                )}

                                {mode === 'negotiate' && (
                                    <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900">
                                        <TrendingUp size={15} className="text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                                            Your offer will be sent to the seller. They can accept, reject, or propose a counter-price through the negotiation chat.
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('config')}
                                        className="flex-1 h-11 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        Back
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
                                                {mode === 'negotiate' ? 'Sending offer…' : 'Processing…'}
                                            </>
                                        ) : (
                                            mode === 'negotiate' ? 'Send offer' : 'Confirm & pay'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ── STEP: Done ────────────────────────────────── */}
                        {step === 'done' && (
                            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-400">
                                <Stepper step="done" />

                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-600" />
                                </div>

                                <h3 className="text-lg font-extrabold text-foreground">
                                    {mode === 'negotiate' ? 'Offer sent!' : 'Order placed!'}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
                                    {mode === 'negotiate'
                                        ? `Your offer of ${formatRWF(proposedPriceNum)} / ${unit} has been sent to ${product.owner?.firstName}. You'll be notified when they respond.`
                                        : `Your order for ${quantity} ${unit} of ${product.name} has been confirmed. The seller will be notified.`
                                    }
                                </p>

                                <div className="flex flex-col gap-2.5 mt-6">
                                    <button
                                        onClick={mode === 'negotiate' ? handleGoToNegotiation : handleGoToOrders}
                                        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors">
                                        {mode === 'negotiate' ? 'View negotiation' : 'View order'}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full h-10 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        Continue shopping
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