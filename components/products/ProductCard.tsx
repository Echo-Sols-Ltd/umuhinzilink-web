import React from "react";
import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, ProductRef, SupplierProduct } from "@/types";
import { MapPin, Package, CheckCircle2, ShoppingCart, ArrowRight, Edit, MessageSquare } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useProduct } from "@/contexts/ProductContext";
import { useChat, userToChatUser } from "@/hooks/useChat";

interface ProductCardProps {
    product: SupplierProduct | FarmerProduct;
    featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
    const { user } = useAuth();
    const { showOrderModal } = useProduct();
    const { handleUserClick, handleSendMessage } = useChat();
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
            router.push(`/buyer/products/${product.id}`);
        }
    }

    const handleNegotiate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            notify.error("Please log in to negotiate", "Authentication Required");
            return;
        }

        if (!product.owner) {
            notify.error("Unable to find producer information", "Unavailable");
            return;
        }

        try {
            const owner = product.owner;
            handleUserClick(userToChatUser(owner));

            const productRef: ProductRef = {
                productId: product.id,
                productType: owner.role
            };

            await handleSendMessage(
                `Hi! I'm interested in your ${product.name}. Let's discuss a deal!`,
                MessageType.PRODUCT,
                undefined,
                productRef,
                owner
            );

            notify.success(`Redirecting to chat with ${owner.names}`, "Inquiry Sent");
            router.push(`/chat/${owner.id}`);
        } catch (error) {
            console.error('Failed to initiate negotiation:', error);
            notify.error("Could not start conversation", "Error");
        }
    };

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

                    <div className="flex items-center gap-2">
                        {isProductOwner ? (
                            <button
                                onClick={handleAction}
                                className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground h-10 px-4 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span className="ml-2 text-[10px] font-black uppercase tracking-widest">Edit</span>
                            </button>
                        ) : (
                            <>
                                {product.isNegotiable && (
                                    <button
                                        onClick={handleNegotiate}
                                        className="flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground h-10 px-3 rounded-xl transition-all active:scale-95"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                        <span className="ml-1.5 text-[9px] font-black uppercase tracking-tight">Negotiate</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleAction}
                                    className="flex items-center justify-center bg-primary hover:bg-primary/95 text-primary-foreground h-10 px-4 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                                >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest">Buy Now</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}