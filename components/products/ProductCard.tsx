import React from "react";
import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, ProductRef, SupplierProduct, UserType } from "@/types";
import { Heart, MapPin, Calendar, Package, User as UserIcon, CheckCircle2, ShoppingCart, Trash2, Edit } from "lucide-react";
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

    // Normalizing harvest date
    const harvestDateValue = product.harvestDate instanceof Date
        ? product.harvestDate
        : product.harvestDate ? new Date(product.harvestDate) : null;

    const formattedDate = harvestDateValue && !isNaN(harvestDateValue.getTime())
        ? harvestDateValue.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'N/A';

    const handleSendMessageToOwner = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            notify.error("Please log in to contact owner", "Authentication Required");
            return;
        }

        try {
            const partnerUser = product.owner as unknown as ChatUser;
            handleUserClick(partnerUser);

            const productRef: ProductRef = {
                productId: product.id,
                productType: product.owner.role
            };

            await handleSendMessage(
                `Hi! I'm interested in your ${product.name}. Could you provide more details?`,
                MessageType.PRODUCT,
                product.owner.names,
                productRef,
                partnerUser
            );

            notify.success(`Chat started with ${product.owner.names}`, "Message Sent");
            router.push(`/chat/${partnerUser.id}`);
        } catch (error) {
            console.error('Failed to contact owner:', error);
            notify.error("Please try again later", "Error");
        }
    };

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
            className="group relative bg-card rounded-[24px] border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden w-full max-w-sm mx-auto"
        >
            {/* Top Section – Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageUrl(product.image || (product as any).images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Status Badge Top-Left */}
                <div className="absolute top-5 left-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md shadow-sm border ${isAvailable ? 'bg-success/90 text-success-foreground border-success/20' :
                            isLowStock ? 'bg-warning/90 text-warning-foreground border-warning/20' :
                                'bg-destructive/90 text-destructive-foreground border-destructive/20'
                        }`}>
                        {isAvailable ? 'Available' : isLowStock ? 'Low Stock' : 'Out of Stock'}
                    </span>
                </div>

                {/* Optional Badge Top-Right */}
                <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                    {isCertified && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card/95 backdrop-blur-sm text-primary rounded-full text-[10px] font-extrabold shadow-sm border border-primary/10">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            CERTIFIED
                        </span>
                    )}
                    {product.isNegotiable && (
                        <span className="px-3 py-1.5 bg-card/95 backdrop-blur-sm text-accent rounded-full text-[10px] font-extrabold shadow-sm border border-accent/10">
                            NEGOTIABLE
                        </span>
                    )}
                </div>

                {/* Owner Actions Overlay */}
                {isProductOwner && (
                    <div className="absolute bottom-5 right-5 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                            onClick={handleDeleteProduct}
                            className="p-2.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-xl shadow-lg backdrop-blur-md transition-all duration-300"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Middle Section – Product Info */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 truncate uppercase tracking-tight">
                        {product.name}
                    </h3>
                    <div className="bg-muted px-3 py-1 rounded-full shrink-0">
                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                            {product.category?.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-2xl font-black text-primary">
                        RWF {Number(product.unitPrice).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">/ {product.measurementUnit}</span>
                </div>

                <p className="text-[13px] text-muted-foreground line-clamp-2 mb-5 h-10 leading-relaxed font-medium">
                    {product.description || "Premium agricultural product sourced sustainably and ready for delivery to your location."}
                </p>

                <div className="flex items-center gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-[11px] font-bold truncate max-w-[140px] uppercase tracking-wide">{product.location || 'Rwanda'}</span>
                    </div>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center justify-between py-4 border-y border-border/50 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary/60" />
                        <span>STOCK: {product.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/60" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {/* Footer Section – Seller & Action */}
                <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 group/seller cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover/seller:ring-primary/20 transition-all">
                            {product.owner?.avatar ? (
                                <img src={imageUrl(product.owner.avatar)} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-foreground line-clamp-1">{product.owner?.names?.split(' ')[0] || 'Seller'}</span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{product.owner?.role?.toLowerCase()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={handleSave}
                            className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all duration-300 active:scale-90"
                        >
                            <Heart className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleAction}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all duration-300"
                        >
                            {isProductOwner ? <Edit className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                            {isProductOwner ? 'Edit' : 'View'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}