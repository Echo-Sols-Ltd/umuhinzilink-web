import { cn, imageUrl } from "@/lib/utils";
import { Negotiation } from "@/types";
import { AlertCircle, CheckCircle, Clock, Loader2, Package, Send, XCircle } from "lucide-react";
import { useState } from "react";

function fmt(n: number) {
    return new Intl.NumberFormat('rw-RW').format(n) + ' RWF';
}

function timeUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hrs}h left`;
    return `${hrs}h left`;
}

interface PricePanelProps {
    negotiation: Negotiation;
    onSetOffer: (price: number) => Promise<void>;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
    loading: boolean;
    isSeller: boolean
}

export default function PricePanel({
    negotiation,
    onSetOffer,
    onAccept,
    onReject,
    loading,
    isSeller
}: PricePanelProps) {
    const [offerInput, setOfferInput] = useState('');
    const [offerError, setOfferError] = useState('');
    const [confirming, setConfirming] = useState<'accept' | 'reject' | null>(null);

    const product = negotiation.order.product;
    const buyerPrice = negotiation.buyerProposedPrice;
    const listedPrice = product.unitPrice;
    const agreedPrice = negotiation.agreedPrice;
    const isActive = negotiation.status === 'PENDING';
    const discount = Math.round((1 - buyerPrice / listedPrice) * 100);

    const handleSubmitOffer = async () => {
        console.log(offerInput)
        const val = parseFloat(offerInput);
        if (!offerInput || isNaN(val) || val <= 0) {
            setOfferError('Enter a valid price');
            return;
        }
        if (val > listedPrice) {
            setOfferError("Can't exceed your listed price");
            return;
        }
        setOfferError('');
        await onSetOffer(val);
        setOfferInput('');
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-border">

            {/* Panel header */}
            <div className="px-4 py-3.5 border-b border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Negotiation</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                    {negotiation.order.orderNumber}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Status */}
                <div className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold',
                    negotiation.status === 'PENDING' && 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
                    negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
                    negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/30 text-red-600',
                    negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800 text-gray-500',
                )}>
                    {negotiation.status === 'PENDING' && <AlertCircle size={13} />}
                    {negotiation.status === 'ACCEPTED' && <CheckCircle size={13} />}
                    {negotiation.status === 'REJECTED' && <XCircle size={13} />}
                    {negotiation.status === 'EXPIRED' && <Clock size={13} />}
                    {negotiation.status === 'PENDING' ? `Expires in ${timeUntil(negotiation.expiresAt)}` : negotiation.status}
                </div>

                {/* Product */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                        {product.image ? (
                            <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {negotiation.order.quantity} {product.measurementUnit?.toLowerCase()}
                        </p>
                    </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price breakdown</p>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="text-xs text-muted-foreground">Your listed price</span>
                            <span className="text-xs font-bold text-foreground">{fmt(listedPrice)}</span>
                        </div>

                        <div className={cn(
                            'flex items-center justify-between py-2 px-3 rounded-xl',
                            discount > 30
                                ? 'bg-red-50 dark:bg-red-950/20'
                                : 'bg-amber-50 dark:bg-amber-950/20'
                        )}>
                            <div>
                                <span className="text-xs text-muted-foreground">Buyer's offer</span>
                                {discount > 0 && (
                                    <span className={cn(
                                        'ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        discount > 30
                                            ? 'bg-red-100 dark:bg-red-900/40 text-red-600'
                                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600'
                                    )}>
                                        -{discount}%
                                    </span>
                                )}
                            </div>
                            <span className={cn(
                                'text-sm font-extrabold',
                                discount > 30 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
                            )}>{fmt(buyerPrice)}</span>
                        </div>

                        {agreedPrice && (
                            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                                <span className="text-xs text-muted-foreground">Your counter offer</span>
                                <span className="text-sm font-extrabold text-green-700 dark:text-green-400">{fmt(agreedPrice)}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border">
                            <span className="text-xs font-semibold text-foreground">Order total</span>
                            <span className="text-sm font-extrabold text-green-700 dark:text-green-400">
                                {fmt((agreedPrice ?? buyerPrice) * negotiation.order.quantity)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Set counter offer */}
                {isActive && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Set your price</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Enter the price you're willing to accept. The buyer will be notified.
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">RWF</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder={String(Math.round(buyerPrice * 1.1))}
                                    value={offerInput}
                                    onChange={e => { setOfferInput(e.target.value); setOfferError(''); }}
                                    className={cn(
                                        'w-full h-10 pl-11 pr-3 text-sm font-semibold text-foreground bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all',
                                        offerError ? 'border-red-400' : 'border-border'
                                    )}
                                />
                            </div>
                            <button
                                onClick={handleSubmitOffer}
                                disabled={loading || !offerInput}
                                className="h-10 px-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5">
                                {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                Send
                            </button>
                        </div>
                        {offerError && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle size={11} /> {offerError}
                            </p>
                        )}
                    </div>
                )}

                {/* Accept / Reject */}
                {isActive && (
                    <div className="space-y-2 pt-2 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or decide now</p>

                        {confirming === 'accept' ? (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                    Accept buyer's offer of {fmt(buyerPrice)}?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { onAccept(); setConfirming(null); }}
                                        disabled={loading}
                                        className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                        {loading ? 'Accepting…' : 'Yes, accept'}
                                    </button>
                                    <button
                                        onClick={() => setConfirming(null)}
                                        className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : confirming === 'reject' ? (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800 space-y-3">
                                <p className="text-xs text-red-600 font-medium">
                                    Reject this negotiation? The order will be cancelled.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { onReject(); setConfirming(null); }}
                                        disabled={loading}
                                        className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                                        {loading ? 'Rejecting…' : 'Yes, reject'}
                                    </button>
                                    <button
                                        onClick={() => setConfirming(null)}
                                        className="h-8 px-3 border border-border text-xs text-muted-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setConfirming('accept')}
                                    className="h-9 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors flex items-center justify-center gap-1.5">
                                    <CheckCircle size={13} /> Accept offer
                                </button>
                                <button
                                    onClick={() => setConfirming('reject')}
                                    className="h-9 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5">
                                    <XCircle size={13} /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Closed state */}
                {!isActive && (
                    <div className={cn(
                        'p-4 rounded-xl text-center space-y-1',
                        negotiation.status === 'ACCEPTED' && 'bg-emerald-50 dark:bg-emerald-950/20',
                        negotiation.status === 'REJECTED' && 'bg-red-50 dark:bg-red-950/20',
                        negotiation.status === 'EXPIRED' && 'bg-gray-100 dark:bg-gray-800',
                    )}>
                        {negotiation.status === 'ACCEPTED' && <CheckCircle size={24} className="text-emerald-500 mx-auto" />}
                        {negotiation.status === 'REJECTED' && <XCircle size={24} className="text-red-500 mx-auto" />}
                        {negotiation.status === 'EXPIRED' && <Clock size={24} className="text-gray-400 mx-auto" />}
                        <p className="text-sm font-bold text-foreground mt-2">
                            {negotiation.status === 'ACCEPTED' && 'Deal agreed!'}
                            {negotiation.status === 'REJECTED' && 'Negotiation closed'}
                            {negotiation.status === 'EXPIRED' && 'Offer expired'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {negotiation.status === 'ACCEPTED' && `Final price: ${fmt(negotiation.agreedPrice ?? buyerPrice)}`}
                            {negotiation.status === 'REJECTED' && 'This negotiation was rejected'}
                            {negotiation.status === 'EXPIRED' && 'No agreement was reached'}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
