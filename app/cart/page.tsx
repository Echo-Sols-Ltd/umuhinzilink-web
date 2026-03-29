'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCartAction } from '@/hooks/useCartAction';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag, Truck, Wallet, ChevronRight, Minus, Plus,
    Trash2, Clock, CheckCircle2, ArrowLeft, Package,
    Phone, CreditCard, Leaf,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem, CartItemType, PaymentMethod } from '@/types';
import { notify } from '@/lib/notify';
import { imageUrl } from '@/lib/utils';

// ─── types ────────────────────────────────────────────────────────
enum Step { REVIEW = 0, PAYMENT = 1 }

// ─── helpers ──────────────────────────────────────────────────────
function timeRemaining(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmt(n: number) {
    return `RWF ${Math.round(n).toLocaleString()}`;
}

// ─── sub-components ───────────────────────────────────────────────
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
            ${done  ? 'bg-green-600 text-white'
            : active ? 'bg-foreground text-background'
            :          'bg-muted text-muted-foreground'}`}>
            {done ? <CheckCircle2 size={16} /> : n}
        </div>
    );
}

function CartItemRow({
    item,
    onAdd, onRemove, onDelete,
}: {
    item: CartItem;
    onAdd: () => void;
    onRemove: () => void;
    onDelete: () => void;
}) {
    const isPending  = item.type === CartItemType.NEGOTIATION_PENDING;
    const isAccepted = item.type === CartItemType.NEGOTIATION_ACCEPTED;
    const price      = (isAccepted && item.proposedPrice) ? item.proposedPrice : item.unitPrice;

    return (
        <div className={`flex gap-4 py-4 border-b border-border last:border-0
            ${isPending ? 'opacity-70' : ''}`}>

            {/* image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <Image src={imageUrl(item.product.image) || '/placeholder.png'}
                    alt={item.product.name} fill className="object-cover" />
                {isPending && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Clock size={18} className="text-white" />
                    </div>
                )}
            </div>

            {/* details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[14px] text-foreground leading-snug truncate">
                        {item.product.name}
                    </p>
                    <button onClick={onDelete}
                        className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors rounded-lg">
                        <Trash2 size={14} />
                    </button>
                </div>

                {/* price */}
                <div className="mt-1 flex items-baseline gap-2">
                    {(isPending || isAccepted) && item.proposedPrice ? (
                        <>
                            <span className="text-[13px] line-through text-muted-foreground">
                                {fmt(item.unitPrice)}
                            </span>
                            <span className={`text-[13px] font-semibold
                                ${isAccepted ? 'text-green-600' : 'text-amber-600'}`}>
                                {fmt(item.proposedPrice)}
                            </span>
                        </>
                    ) : (
                        <span className="text-[13px] text-muted-foreground">{fmt(item.unitPrice)}</span>
                    )}
                </div>

                {/* status badges */}
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={10} />
                            Awaiting seller · {item.negotiationExpiresAt ? timeRemaining(item.negotiationExpiresAt) : '—'}
                        </span>
                    )}
                    {isAccepted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 size={10} />
                            Price agreed
                        </span>
                    )}
                </div>

                {/* quantity controls — disabled for pending negotiations */}
                {!isPending && (
                    <div className="mt-2 flex items-center gap-2">
                        <button onClick={onRemove}
                            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
                            <Minus size={12} />
                        </button>
                        <span className="text-[13px] font-semibold w-6 text-center">{item.quantity}</span>
                        <button onClick={onAdd}
                            className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
                            <Plus size={12} />
                        </button>
                        <span className="ml-auto text-[13px] font-semibold text-foreground">
                            {fmt(price * item.quantity)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── main page ────────────────────────────────────────────────────
export default function CartPage() {
    const { cart, loading, getCartTotal } = useCart();
    const { updateCartItemQuantity, removeCartItem, checkoutItems } = useCartAction();
    const { user } = useAuth();
    const router   = useRouter();

    const [step, setStep]   = useState<Step>(Step.REVIEW);
    const [method, setMethod] = useState<'wallet' | 'mobile_money' | 'bank'>('wallet');
    const [placing, setPlacing] = useState(false);

    const [checkoutableItems, setCheckoutableItems] = useState<CartItem[]>([]);
    const [fetchingReady, setFetchingReady] = useState(true);

    const { getItemsReadyForCheckout } = useCart();

    useEffect(() => {
        const fetchReady = async () => {
            if (!cart) {
                setCheckoutableItems([]);
                setFetchingReady(false);
                return;
            }
            setFetchingReady(true);
            const readyItems = await getItemsReadyForCheckout();
            setCheckoutableItems(readyItems);
            setFetchingReady(false);
        };
        fetchReady();
    }, [cart, getItemsReadyForCheckout]);

    const pendingItems = useMemo(() =>
        cart?.items.filter(i => i.type === CartItemType.NEGOTIATION_PENDING) ?? [],
    [cart]);

    const subtotal = useMemo(() => checkoutableItems.reduce((sum, i) => {
        const price = (i.type === CartItemType.NEGOTIATION_ACCEPTED && i.proposedPrice) ? i.proposedPrice : i.unitPrice;
        return sum + price * i.quantity;
    }, 0), [checkoutableItems]);

    const handleQuantity = (item: CartItem, delta: number) => {
        const next = item.quantity + delta;
        if (next <= 0) removeCartItem(item.id);
        else updateCartItemQuantity(item.id, next);
    };

    const handlePlaceOrder = async () => {
        if (!checkoutableItems.length) {
            notify.warning('No items ready to checkout', 'Nothing to checkout');
            return;
        }
        setPlacing(true);
        const pm =
            method === 'wallet'       ? PaymentMethod.WALLET :
            method === 'mobile_money' ? PaymentMethod.MOBILE_MONEY :
                                        PaymentMethod.BANK_TRANSFER;

        const result = await checkoutItems(checkoutableItems.map(i => i.id), pm);
        setPlacing(false);
        if (result && result.length > 0) {
            notify.success('Orders placed successfully', 'Done');
            const orderIds = result.map(o => o.id).join(',');
            // If the payment method was Mobile Money, you might open a modal here using order details
            router.push(`/orders/success?ids=${orderIds}`);
        }
    };

    // ── loading ────────────────────────────────────────────────────
    if ((loading && !cart) || fetchingReady) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── empty ──────────────────────────────────────────────────────
    if (!cart || cart.items.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <ShoppingBag size={28} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Browse the marketplace and add products to get started.
                </p>
                <Link href="/buyer/products"
                    className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Browse products
                </Link>
            </div>
        );
    }

    // ── main ───────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background">

            {/* topbar */}
            <div className="sticky top-0 z-20 bg-card border-b border-border h-14 flex items-center px-4 lg:px-8 gap-4">
                <Link href="/buyer/products"
                    className="p-1.5 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-1.5">
                    <Leaf size={16} className="text-green-600" />
                    <span className="font-semibold text-[14px] text-foreground">Checkout</span>
                </div>

                {/* steps */}
                <div className="hidden sm:flex items-center gap-2 ml-auto text-[13px]">
                    <StepDot n={1} active={step === Step.REVIEW}  done={step > Step.REVIEW} />
                    <span className={step === Step.REVIEW ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                        Review
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground/40" />
                    <StepDot n={2} active={step === Step.PAYMENT} done={false} />
                    <span className={step === Step.PAYMENT ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                        Payment
                    </span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                {/* ── left col ──────────────────────────────────── */}
                <div className="space-y-6">

                    {/* pending negotiation notice */}
                    {pendingItems.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
                            <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[13px] font-semibold text-amber-800">
                                    {pendingItems.length} item{pendingItems.length > 1 ? 's' : ''} awaiting seller response
                                </p>
                                <p className="text-[12px] text-amber-700 mt-0.5">
                                    These will be available to checkout once the seller accepts your price.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 1 — review */}
                    {step === Step.REVIEW && (
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <h2 className="font-semibold text-[15px] text-foreground mb-4 flex items-center gap-2">
                                <Package size={16} className="text-muted-foreground" />
                                Your items
                            </h2>

                            {/* checkouteable */}
                            <div>
                                {checkoutableItems.map(item => (
                                    <CartItemRow key={item.id} item={item}
                                        onAdd={() => handleQuantity(item, 1)}
                                        onRemove={() => handleQuantity(item, -1)}
                                        onDelete={() => removeCartItem(item.id)} />
                                ))}
                            </div>

                            {/* pending — read only section */}
                            {pendingItems.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-border">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                        Pending negotiations (not included in total)
                                    </p>
                                    {pendingItems.map(item => (
                                        <CartItemRow key={item.id} item={item}
                                            onAdd={() => {}}
                                            onRemove={() => {}}
                                            onDelete={() => removeCartItem(item.id)} />
                                    ))}
                                </div>
                            )}

                            {checkoutableItems.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-[13px] text-muted-foreground">
                                        No items ready to checkout yet.
                                        {pendingItems.length > 0 && ' Waiting for sellers to respond.'}
                                    </p>
                                </div>
                            )}

                            {checkoutableItems.length > 0 && (
                                <div className="mt-6 flex justify-end">
                                    <button onClick={() => setStep(Step.PAYMENT)}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors">
                                        Continue to payment
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2 — payment */}
                    {step === Step.PAYMENT && (
                        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setStep(Step.REVIEW)}
                                    className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                                    <ArrowLeft size={16} />
                                </button>
                                <h2 className="font-semibold text-[15px] text-foreground">Payment method</h2>
                            </div>

                            {/* payment options */}
                            <div className="space-y-3">
                                {[
                                    { id: 'wallet',       icon: Wallet,      label: 'Wallet balance',     sub: `Available: ${fmt(0)}` },
                                    { id: 'mobile_money', icon: Phone,       label: 'Mobile Money',       sub: 'MTN or Airtel' },
                                    { id: 'bank',         icon: CreditCard,  label: 'Bank transfer',      sub: 'Any Rwandan bank' },
                                ].map(opt => (
                                    <label key={opt.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                                            ${method === opt.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-border/80 hover:bg-accent/50'}`}>
                                        <input type="radio" name="method" value={opt.id}
                                            checked={method === opt.id as typeof method}
                                            onChange={() => setMethod(opt.id as typeof method)}
                                            className="sr-only" />
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                                            ${method === opt.id ? 'bg-primary/10' : 'bg-muted'}`}>
                                            <opt.icon size={16} className={method === opt.id ? 'text-primary' : 'text-muted-foreground'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-foreground">{opt.label}</p>
                                            <p className="text-[12px] text-muted-foreground">{opt.sub}</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                                            ${method === opt.id ? 'border-primary' : 'border-border'}`}>
                                            {method === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* contact info — pre-filled, read only */}
                            <div className="pt-2 border-t border-border">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                    Order contact
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-[13px]">
                                    <div>
                                        <p className="text-muted-foreground">Name</p>
                                        <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Phone</p>
                                        <p className="font-medium text-foreground">{user?.phoneNumber || '—'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium text-foreground">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handlePlaceOrder} disabled={placing}
                                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-[14px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {placing
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing order…</>
                                    : <>Place order · {fmt(subtotal)}</>}
                            </button>

                            <p className="text-center text-[11px] text-muted-foreground">
                                By placing this order you agree to our{' '}
                                <Link href="/terms" className="underline">Terms of Service</Link>
                            </p>
                        </div>
                    )}
                </div>

                {/* ── right col — order summary ──────────────────── */}
                <div className="lg:sticky lg:top-20 h-fit">
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                        <h3 className="font-semibold text-[14px] text-foreground">Order summary</h3>

                        {/* line items */}
                        <div className="space-y-2">
                            {checkoutableItems.map(item => {
                                const price = (item.type === CartItemType.NEGOTIATION_ACCEPTED && item.proposedPrice)
                                    ? item.proposedPrice : item.unitPrice;
                                return (
                                    <div key={item.id} className="flex justify-between text-[13px]">
                                        <span className="text-muted-foreground truncate pr-2 max-w-[180px]">
                                            {item.product.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-foreground shrink-0">
                                            {fmt(price * item.quantity)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-3 border-t border-border space-y-2">
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground font-medium">{fmt(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>Delivery</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>VAT (incl.)</span>
                                <span className="text-foreground font-medium">{fmt(subtotal * 0.18)}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-border flex justify-between">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-bold text-[16px] text-foreground">{fmt(subtotal)}</span>
                        </div>

                        {pendingItems.length > 0 && (
                            <div className="pt-2 border-t border-dashed border-border">
                                <p className="text-[11px] text-muted-foreground">
                                    <span className="font-medium text-amber-600">{pendingItems.length} item{pendingItems.length > 1 ? 's' : ''}</span>{' '}
                                    not included — awaiting seller approval
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}