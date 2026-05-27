'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Heart, MessageSquare, MapPin, Eye,
    ShoppingBag, Edit3, Trash2, User,
    AlertTriangle, XCircle, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { notify } from '@/lib/notify';
import { cn, imageUrl } from '@/lib/utils';
import { Product } from '@/types';
import BuyModal from './BuyModal';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductCardProps {
    product: Product;
    onSave?: (productId: string) => void;
    onDelete?: (productId: string) => void;
    isSaved?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRWF(price: number) {
    return new Intl.NumberFormat('rw-RW').format(price) + ' RWF';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductCard({
    product,
    onSave,
    onDelete,
    isSaved = false,
}: ProductCardProps) {
    const { user } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const [buyOpen, setBuyOpen] = useState(false);
    const [saved, setSaved] = useState(isSaved);
    const [imgError, setImgError] = useState(false);

    const isOwner = user?.id === product.owner?.id;
    const isOutOfStock = product.status === 'OUT_OF_STOCK';
    const isLowStock = product.status === 'LOW_STOCK';
    const isInStock = product.status === 'IN_STOCK';

    // ── Handlers ──────────────────────────────────────────────────────────

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/auth/signin'); return; }
        setSaved(v => !v);
        onSave?.(product.id);
        notify.success(saved ? `Removed from saved` : `${product.name} saved`);
    };

    const handleChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/auth/signin'); return; }
        router.push(`/buyer/negotiations?seller=${product.owner.id}&product=${product.id}`);
    };

    const handleBuy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { router.push('/auth/signin'); return; }
        setBuyOpen(true);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/seller/listings/${product.id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(product.id);
    };

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    // ── Stock indicator ───────────────────────────────────────────────────

    const stockBadge = isOutOfStock ? (
        <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
            <XCircle size={10} /> Out of stock
        </span>
    ) : isLowStock ? (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
            <AlertTriangle size={10} /> Low stock
        </span>
    ) : null;

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <>
            <div
                onClick={handleCardClick}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:border-green-200 dark:hover:border-green-800 transition-all duration-200 flex flex-col">

                {/* Image */}
                <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    {!imgError && product.image ? (
                        <img
                            src={imageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-red-200">
                                Unavailable
                            </span>
                        </div>
                    )}

                    {/* Top badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                        {product.isNegotiable && (
                            <span className="text-xs font-semibold text-white bg-green-600/90 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                Negotiable
                            </span>
                        )}
                    </div>

                    {/* Save / owner actions */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                        {isOwner ? (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow text-muted-foreground hover:text-foreground transition-colors">
                                    <Edit3 size={13} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 size={13} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow transition-colors">
                                <Heart
                                    size={14}
                                    className={cn(
                                        'transition-colors',
                                        saved ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-400'
                                    )}
                                />
                            </button>
                        )}
                    </div>

                    {/* View count — bottom left */}
                    {(product.viewCount ?? 0) > 0 && (
                        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Eye size={10} />
                            {product.viewCount}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-3.5 flex flex-col flex-1">

                    {/* Name + category */}
                    <div className="mb-1.5">
                        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1">
                            {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-2">
                        <p className="text-base font-extrabold text-green-700 dark:text-green-400">
                            {formatRWF(product.unitPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            / {product.measurementUnit?.toLowerCase()}
                        </p>
                    </div>

                    {/* Stock + location */}
                    <div className="flex items-center justify-between mb-3">
                        {stockBadge ?? (
                            <span className="text-xs text-muted-foreground">
                                {product.stockQuantity} {product.measurementUnit?.toLowerCase()} left
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={10} />
                            <span className="truncate max-w-[80px]">
                                {product.district?.charAt(0) + product.district?.slice(1).toLowerCase()}
                            </span>
                        </div>
                    </div>

                    {/* Seller */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                            <User size={11} className="text-green-700 dark:text-green-300" />
                        </div>
                        <span className="truncate font-medium text-foreground/80">
                            {product.owner?.firstName} {product.owner?.lastName}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto">
                        {isOwner ? (
                            <button
                                onClick={handleEdit}
                                className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground text-xs font-semibold rounded-xl transition-colors">
                                <Edit3 size={13} /> Edit listing
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleBuy}
                                    disabled={isOutOfStock}
                                    className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors active:scale-[0.97]">
                                    <ShoppingBag size={13} />
                                    {product.isNegotiable ? 'Negotiate' : 'Buy now'}
                                </button>
                                <button
                                    onClick={handleChat}
                                    className="w-9 h-9 flex items-center justify-center border border-border rounded-xl text-muted-foreground hover:text-green-600 hover:border-green-300 transition-colors">
                                    <MessageSquare size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Buy modal */}
            {buyOpen && (
                <BuyModal
                    product={product}
                    onClose={() => setBuyOpen(false)}
                />
            )}
        </>
    );
}