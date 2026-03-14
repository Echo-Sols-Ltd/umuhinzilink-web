import React from "react";
import { createPortal } from "react-dom";
import { cn, imageUrl } from "@/lib/utils";
import { Product, MessageType, ProductRef } from "@/types";
import { MapPin, Package, CheckCircle2, ShoppingCart, ArrowRight, Edit, MessageSquare } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/contexts/ProductContext";
import { useChat } from "@/hooks/useChat";
import { useI18n } from "@/contexts/I18nContext";
import { useCart } from "@/contexts/CartContext";
import { CartItemType } from "@/types";
import NegotiationModal from "./NegotiationModal";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
    const { user } = useAuth();
    const { showOrderModal } = useProduct();
    const { handleUserClick, handleSendMessage } = useChat();
    const { addItem } = useCart();
    const router = useRouter();
    const { t } = useI18n();
    const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);

    const isProductOwner = user?.id === product.owner?.id;
    const isAvailable = product.productStatus === 'IN_STOCK';
    const isLowStock = product.productStatus === 'LOW_STOCK';
    const isCertified = product.certification && product.certification !== 'NONE';

    const handleCardClick = () => {
        if (isProductOwner) {
            router.push(`/products/${product.id}/edit`);
            return;
        }
        router.push(`/products/${product.id}`);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        notify.success(`${product.name} saved`, "Wishlist Updated");
    };

    const handleAction = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isProductOwner) {
            router.push(`/${user?.role?.toLowerCase()}/products/${product.id}/edit`);
        } else {
            if (!user) {
                notify.error(t('productCard.loginToBuy'), t('auth.required'));
                router.push('/auth/signin');
                return;
            }
            await addItem({
                productId: product.id,
                quantity: 1,
                type: CartItemType.NORMAL
            });
            router.push(`/cart`);
        }
    }

    const handleNegotiate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            notify.error(t('productCard.loginToNegotiate'), t('productCard.authRequired'));
            router.push('/auth/signin');
            return;
        }

        if (!product.owner) {
            notify.error(t('productCard.noProducerInfo'), t('productCard.unavailable'));
            return;
        }

        setIsNegotiateModalOpen(true);
    };

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group bg-card rounded-xl transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden w-full mx-auto",
                featured
                    ? 'border-primary/30 shadow-xl shadow-primary/5 ring-1 ring-primary/10'
                    : 'border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1'
            )}
        >
            {/* 1️⃣ Image Section */}
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
                <img
                    src={imageUrl(product.image || (product as any).images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 pointer-events-none">
                    <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase  backdrop-blur-md shadow-sm border text-white",
                        isAvailable ? 'bg-success/90 border-white/20' :
                            isLowStock ? 'bg-warning/90 border-white/20' :
                                'bg-destructive/90 border-white/20'
                    )}>
                        {isAvailable ? t('productCard.inStock') : isLowStock ? t('productCard.lowStock') : t('productCard.outOfStock')}
                    </span>
                </div>

                {/* Certification Badge */}
                {isCertified && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                        <div className="bg-primary/90 text-white p-1.5 rounded-lg shadow-sm backdrop-blur-md border border-white/20">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>

            {/* 2️⃣ Info Section */}
            <div className="p-5 flex-1 flex flex-col gap-3">
                {/* Category + Quantity */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase ">
                        {t(`enums.categories.${product.category}`) === `enums.categories.${product.category}`
                            ? product.category?.replace(/_/g, ' ')
                            : t(`enums.categories.${product.category}`)}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-full text-xs font-bold text-primary border border-primary/10">
                        <Package className="w-3 h-3" />
                        {product.quantity} {t(`enums.units.${product.measurementUnit}`) === `enums.units.${product.measurementUnit}`
                            ? product.measurementUnit
                            : t(`enums.units.${product.measurementUnit}`)}
                    </div>
                </div>

                {/* Name + Location */}
                <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 truncate uppercase leading-tight ">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/80">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        <span className="truncate">{product.location || 'Rwanda'}</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        {/* Price */}
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-muted-foreground">RWF</span>
                                <span className="font-bold text-foreground">
                                    {Number(product.unitPrice).toLocaleString()}
                                </span>/
                                <span className="font-bold text-foreground">
                                    {t(`enums.units.${product.measurementUnit}`) === `enums.units.${product.measurementUnit}`
                                    ? product.measurementUnit
                                    : t(`enums.units.${product.measurementUnit}`)}</span>
                            </div>
                        </div>

                        {/* Primary Buttons Layout (Horizontal for most desktop, vertical/stacked flex handling via container) */}
                        <div className="flex items-center gap-2">
                            {isProductOwner ? (
                                <button
                                    onClick={handleAction}
                                    className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground h-11 px-5 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 group/btn"
                                >
                                    <Edit className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase ">{t('productCard.edit')}</span>
                                </button>
                            ) : (
                                <>
                                    {product.isNegotiable && (
                                        <button
                                            onClick={handleNegotiate}
                                            className="flex items-center justify-center bg-muted hover:bg-muted/80 text-foregroun px-6 py-2 rounded-xl transition-all active:scale-95 border border-border/50"
                                            title={t('productCard.negotiatePrice')}
                                        >
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleAction}
                                        className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground  px-6 py-2 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 group/btn"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                        <span className="text-[11px] font-black uppercase ">{t('productCard.buy')}</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {createPortal(
                <NegotiationModal
                    product={product}
                    isOpen={isNegotiateModalOpen}
                    onClose={() => setIsNegotiateModalOpen(false)}
                />,
                document.body
            )}
        </div>
    );
}