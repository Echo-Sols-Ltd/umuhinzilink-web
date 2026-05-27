import React from "react";
import { createPortal } from "react-dom";
import { cn, imageUrl } from "@/lib/utils";
import { Product } from "@/types";
import { MapPin, Package, CheckCircle2, ShoppingCart, ArrowRight, Edit, MessageSquare, Heart, UserIcon, Trash2 } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/contexts/ProductContext";
import { useI18n } from "@/contexts/I18nContext";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
    const { user } = useAuth();
    const { showOrderModal } = useProduct();
    const router = useRouter();
    const { t } = useI18n();

    const isProductOwner = user?.id === product.owner?.id;
    const isAvailable = product.status === 'IN_STOCK';
    const isLowStock = product.status === 'LOW_STOCK';

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
            router.push(`/products/${product.id}/edit`);
        } else {
            if (!user) {
                notify.error(t('productCard.loginToBuy'), t('auth.required'));
                router.push('/auth/signin');
                return;
            }

        }
    };

    return (
        <div key={product.name} className="bg-card rounded-lg shadow-sm border overflow-hidden">
            <div className="relative">
                <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                <button className="absolute top-3 right-3 bg-card p-1 rounded-full shadow">
                    <Heart className="w-5 h-5 text-destructive" />
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                    <p className="text-success font-semibold text-sm">{product.unitPrice}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('buyer.saved.available')}: {product.stockQuantity}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <UserIcon className="w-4 h-4 mr-1" /> {product.owner.firstName} {product.owner.lastName}
                    <span className="mx-1">•</span>
                    {product.district}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center gap-2">
                    <button className="bg-success text-primary-foreground px-4 py-2 rounded text-sm flex-1">
                        {t('buyer.saved.buyNow')}
                    </button>
                    <button className="border border-border p-2 rounded">
                        <MessageSquare className="w-4 h-4 text-foreground" />
                    </button>
                    <button className="border border-destructive p-2 rounded" title={t('buyer.saved.remove')}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                </div>
            </div>
        </div>
    );
}