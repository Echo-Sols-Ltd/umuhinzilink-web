import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, SupplierProduct, UserType } from "@/types";
import { Heart, MessageSquare, Trash2, UserIcon, Clock, Eye, Edit } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/contexts/ProductContext";

interface ProductCardProps {
    product: SupplierProduct | FarmerProduct
    // Remove individual callbacks - will be handled internally based on user role
}

// Role-based action handlers
const getRoleBasedActions = (product: SupplierProduct | FarmerProduct, user: any, router: any, handlers: any, showOrderModal: any) => {
    const isProductOwner = user?.id === product.owner?.id;
    const userRole = user?.role?.toLowerCase();

    // Common actions for all authenticated users
    const commonActions = [];

    // Owner actions
    if (isProductOwner) {
        commonActions.push({
            key: 'edit',
            label: 'Edit Item',
            icon: Edit,
            variant: 'secondary',
            action: () => {
                if (handlers.onEdit) handlers.onEdit(product);
                else router.push(`/${userRole}/products/${product.id}/edit`);
            }
        });
    }

    // Non-owner actions based on user role
    if (!isProductOwner && user) {
        switch (userRole) {
            case 'buyer':
                commonActions.push({
                    key: 'view',
                    label: 'View Details',
                    icon: Eye,
                    variant: 'primary',
                    action: () => router.push(`/buyer/products/${product.id}`)
                });
                commonActions.push({
                    key: 'purchase',
                    label: 'Buy Now',
                    icon: null,
                    variant: 'primary',
                    action: () => {
                        const productType = product.owner.role === 'FARMER' ? 'farmer' : 'supplier';
                        showOrderModal(product, productType);
                    }
                });
                break;
                
            case 'farmer':
            case 'supplier':
                commonActions.push({
                    key: 'contact',
                    label: 'Contact',
                    icon: MessageSquare,
                    variant: 'outline',
                    action: () => {
                        if (handlers.onContact) handlers.onContact();
                        else handlers.handleContactFarmer(product);
                    }
                });
                break;
                
            case 'admin':
                commonActions.push({
                    key: 'view',
                    label: 'Manage',
                    icon: Eye,
                    variant: 'secondary',
                    action: () => router.push(`/admin/products/${product.id}`)
                });
                break;
        }
    }

    // Unauthenticated users
    if (!user) {
        commonActions.push({
            key: 'view',
            label: 'View Details',
            icon: Eye,
            variant: 'primary',
            action: () => router.push(`/buyer/products/${product.id}`)
        });
    }

    return commonActions;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth()
    const { deleteFarmerProduct, deleteSupplierProduct, showOrderModal } = useProduct()
    const { handleUserClick, handleSendMessage } = useChat()
    const router = useRouter()

    const handleContactFarmer = async (product: any) => {
        if (!user) {
            notify.error("Please log in to contact farmers", "Authentication Required");
            return;
        }

        if (!product.owner) {
            notify.error("Unable to find contact information for this product", "Information Not Available");
            return;
        }

        try {
            const partnerUser = product.owner;
            handleUserClick(partnerUser);

            await handleSendMessage(
                `Hi! I'm interested in your ${product.name}\n Send me more details about this product to reach me`,
                MessageType.PRODUCT,
                product.owner.names,
                product.id,
                partnerUser // overrideReceiver: bypasses stale activeChatUser state
            );

            notify.success(`You can now chat with ${product.owner.names} about ${product.name}`, "Message Sent");

            router.push(`/chat/${partnerUser.id}`);
        } catch (error) {
            console.error('Failed to contact owner:', error);
            notify.error("Please try again later", "Failed to Send Message");
        }
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            if (product.owner.role === 'FARMER') {
                await deleteFarmerProduct(productId);
            } else {
                await deleteSupplierProduct(productId);
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            notify.error("Failed to delete product. Please try again.", "Delete Failed");
        }
    };

    const isProductOwner = user?.id === product.owner?.id;
    
    // Get role-based actions
    const actions = getRoleBasedActions(product, user, router, {
        handleContactFarmer,
        onPurchase: null,
        onContact: null,
        onEdit: null
    }, showOrderModal);

    // Handle card click - navigate to appropriate detail page
    const handleCardClick = () => {
        if (!user) {
            router.push(`/buyer/products/${product.id}`);
            return;
        }

        const userRole = user.role?.toLowerCase();
        switch (userRole) {
            case 'buyer':
                router.push(`/buyer/products/${product.id}`);
                break;
            case 'farmer':
            case 'supplier':
                if (isProductOwner) {
                    router.push(`/${userRole}/products/${product.id}/edit`);
                } else {
                    router.push(`/buyer/products/${product.id}`);
                }
                break;
            case 'admin':
                router.push(`/admin/products/${product.id}`);
                break;
            default:
                router.push(`/buyer/products/${product.id}`);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden bg-background">
                <img
                    src={imageUrl(product.image!)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {isProductOwner && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id, product.name);
                            }}
                            className="bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-card transition-colors text-muted-foreground hover:text-destructive"
                            title="Delete product"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase  rounded-md bg-card/90 backdrop-blur-sm shadow-sm ${product.productStatus === 'IN_STOCK' ? 'text-success' : 'text-warning'
                        }`}>
                        {product.productStatus?.replace('_', ' ') || 'Available'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors uppercase text-sm ">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-lg font-extrabold text-primary">{Number(product.unitPrice).toLocaleString()}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">RWF / {product.measurementUnit || 'unit'}</span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-[11px] font-medium text-muted-foreground">
                        <UserIcon className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        <span className="truncate">{product.owner?.names || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center text-[11px] font-medium text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        <span>Qty: {product.quantity}</span>
                    </div>
                </div>

                {/* Role-based Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    {actions.map((action, index) => {
                        const isPrimary = action.variant === 'primary';
                        const isSecondary = action.variant === 'secondary';
                        const isOutline = action.variant === 'outline';
                        
                        return (
                            <button
                                key={action.key}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                }}
                                className={`
                                    ${index === 0 && actions.length > 1 ? 'flex-1' : 'p-2'}
                                    ${isPrimary ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
                                    ${isSecondary ? 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground' : ''}
                                    ${isOutline ? 'p-2 bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20' : ''}
                                    ${index === 0 && actions.length > 1 ? 'rounded-xl' : 'rounded-lg'}
                                    text-xs font-semibold uppercase transition-all duration-300
                                    ${isPrimary ? 'shadow-lg shadow-primary/20' : ''}
                                `}
                            >
                                {action.icon && <action.icon className="w-4 h-4" />}
                                {!action.icon && action.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}