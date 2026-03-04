import React from "react";
import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, ProductRef, SupplierProduct } from "@/types";
import { Heart, MapPin, Package, CheckCircle2, ShoppingCart, ArrowRight, Edit } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/contexts/ProductContext";

interface ProductCardProps {
    product: SupplierProduct | FarmerProduct;
    featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
    const { user } = useAuth();
    const { showOrderModal } = useProduct();
    const router = useRouter();

    const isProductOwner = user?.id === product.owner?.id;
    const isAvailable = product.productStatus === 'IN_STOCK';
    const isLowStock = product.productStatus === 'LOW_STOCK';
    const isCertified = product.certification && product.certification !== 'NONE';

    const handleCardClick = () => {
        if (isProductOwner) {
            router.push(`/${user.role.toLowerCase()}/products/${product.id}/edit`);
            return;
        }
        router.push(`/buyer/products/${product.id}`);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        notify.success(`${product.name} saved`, "Wishlist Updated");
    };

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isProductOwner) {
            router.push(`/${user?.role?.toLowerCase()}/products/${product.id}/edit`);
        } else {
            const productType = product.owner.role === 'FARMER' ? 'farmer' : 'supplier';
            showOrderModal(product, productType);
        }
    }

    return (
        <div
            onClick={handleCardClick}
            className={`group relative bg-card rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden w-full mx-auto
                ${featured
                    ? 'border-primary/30 shadow-xl shadow-primary/5 ring-1 ring-primary/10'
                    : 'border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1'
                }`}
        >
            {/* 1️⃣ Top Section — Product Image (Increased Size) */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                    src={imageUrl(product.image || (product as any).images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter backdrop-blur-md shadow-sm border ${isAvailable ? 'bg-success/90 text-white border-white/20' :
                        isLowStock ? 'bg-warning/90 text-white border-white/20' :
                            'bg-destructive/90 text-white border-white/20'
                        }`}>
                        {isAvailable ? 'In Stock' : isLowStock ? 'Low Stock' : 'Out of Stock'}
                    </span>

                    {isCertified && (
                        <div className="bg-primary/90 text-white p-1 rounded-lg shadow-sm backdrop-blur-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>
            </div>

            {/* 2️⃣ Essential Info Only */}
            <div className="p-5 flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        {product.category?.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-primary">
                        <Package className="w-2.5 h-2.5" />
                        {product.quantity} {product.measurementUnit}
                    </div>
                </div>

                <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 truncate uppercase leading-tight">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mb-1">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    <span className="truncate">{product.location || 'Rwanda'}</span>
                </div>

                {/* Footer Section — Price & Primary Action */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Unit Price</span>
                        <span className="text-lg font-black text-foreground">
                            RWF {Number(product.unitPrice).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleSave}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all active:scale-90"
                        >
                            <Heart className="w-4.5 h-4.5" />
                        </button>
                        <button
                            onClick={handleAction}
                            className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground h-10 w-10 sm:w-auto sm:px-4 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                        >
                            {isProductOwner ? <Edit className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline-block ml-2 text-[10px] font-black uppercase tracking-widest">
                                {isProductOwner ? 'Edit' : 'View'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}