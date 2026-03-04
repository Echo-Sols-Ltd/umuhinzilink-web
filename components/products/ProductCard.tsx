import React from "react";
import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, ProductRef, SupplierProduct } from "@/types";
import { Heart, MapPin, Package, CheckCircle2, ShoppingCart, Trash2, Edit } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { useProduct } from "@/contexts/ProductContext";
import { ChatUser } from "@/types/chat";

interface ProductCardProps {
    product: SupplierProduct | FarmerProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth();
    const { deleteFarmerProduct, deleteSupplierProduct, showOrderModal } = useProduct();
    const { handleUserClick, handleSendMessage } = useChat();
    const router = useRouter();

    const isProductOwner = user?.id === product.owner?.id;
    const isAvailable = product.productStatus === 'IN_STOCK';
    const isLowStock = product.productStatus === 'LOW_STOCK';
    const isCertified = product.certification && product.certification !== 'NONE';

    const handleDeleteProduct = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

        try {
            if (product.owner.role === 'FARMER') await deleteFarmerProduct(product.id);
            else await deleteSupplierProduct(product.id);
            notify.success("Product removed successfully");
        } catch (error) {
            notify.error("Failed to delete product");
        }
    };

    const handleCardClick = () => {
        if (!user || (!isProductOwner)) {
            router.push(`/buyer/products/${product.id}`);
            return;
        }
        if (isProductOwner) {
            router.push(`/${user.role.toLowerCase()}/products/${product.id}/edit`);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        notify.success(`${product.name} saved to favorites`, "Saved");
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
            className="group relative bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden w-full max-w-sm mx-auto"
        >
            {/* Top Section – Product Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                    src={imageUrl(product.image || (product as any).images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start pointer-events-none">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter backdrop-blur-md shadow-sm border ${isAvailable ? 'bg-success/90 text-success-foreground border-success/20' :
                            isLowStock ? 'bg-warning/90 text-warning-foreground border-warning/20' :
                                'bg-destructive/90 text-destructive-foreground border-destructive/20'
                        }`}>
                        {isAvailable ? 'In Stock' : isLowStock ? 'Low Stock' : 'Sold Out'}
                    </span>

                    {isCertified && (
                        <div className="bg-primary/90 text-primary-foreground p-1 rounded-lg shadow-sm backdrop-blur-md" title="Certified Product">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>

                {/* Owner Action Buttons */}
                {isProductOwner && (
                    <div className="absolute bottom-2.5 right-2.5 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={handleDeleteProduct}
                            className="p-1.5 bg-destructive text-white rounded-lg shadow-lg active:scale-95"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3.5 flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        {product.category?.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-primary">
                        <Package className="w-2.5 h-2.5" />
                        {product.quantity} {product.measurementUnit}
                    </div>
                </div>

                <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 truncate uppercase leading-tight">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    <span className="truncate">{product.location || 'Rwanda'}</span>
                </div>

                <div className="mt-3 pt-3 flex items-center justify-between border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Price / {product.measurementUnit}</span>
                        <span className="text-base font-black text-foreground">
                            RWF {Number(product.unitPrice).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleSave}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                        >
                            <Heart className="w-4.5 h-4.5" />
                        </button>
                        <button
                            onClick={handleAction}
                            className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground h-9 w-9 sm:w-auto sm:px-3.5 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                        >
                            {isProductOwner ? <Edit className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline-block ml-1.5 text-[10px] font-black uppercase tracking-widest">
                                {isProductOwner ? 'Edit' : 'View'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}