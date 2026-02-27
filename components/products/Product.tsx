import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, SupplierProduct } from "@/types";
import { Heart, MessageSquare, Trash2, UserIcon, Clock } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/contexts/ProductContext";

interface ProductCardProps {
    product: SupplierProduct | FarmerProduct
    onSelect?: () => void;
    onPurchase?: () => void;
    onContact?: () => void;
    onEdit?: (product: any) => void;
}


export default function ProductCard({ product, onSelect, onPurchase, onContact, onEdit }: ProductCardProps) {
    const { user } = useAuth()
    const { deleteFarmerProduct, deleteSupplierProduct } = useProduct()
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

    return (
        <div
            onClick={onSelect}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-green-100/30 transition-all duration-300 cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden bg-white">
                <img
                    src={imageUrl(product.image!)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-colors text-gray-400 hover:text-red-500"
                    >
                        <Heart className="w-4 h-4" />
                    </button>

                    {isProductOwner && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id, product.name);
                            }}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white transition-colors text-gray-400 hover:text-red-500"
                            title="Delete product"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase  rounded-md bg-white/90 backdrop-blur-sm shadow-sm ${product.productStatus === 'IN_STOCK' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                        {product.productStatus?.replace('_', ' ') || 'Available'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors uppercase text-sm ">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-lg font-extrabold text-green-700">{Number(product.unitPrice).toLocaleString()}</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">RWF / {product.measurementUnit || 'unit'}</span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-[11px] font-medium text-gray-500">
                        <UserIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        <span className="truncate">{product.owner?.names || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center text-[11px] font-medium text-gray-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        <span>Qty: {product.quantity}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    {isProductOwner ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onEdit) onEdit(product);
                                else router.push(`/${product.owner.role.toLowerCase()}/products/${product.id}/edit`);
                            }}
                            className="flex-1 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white py-2 rounded-lg text-xs font-semibold uppercase  transition-all duration-300"
                        >
                            Edit Item
                        </button>
                    ) : (
                        <>
                            <button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-semibold uppercase  transition-all duration-300 shadow-lg shadow-green-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onPurchase) onPurchase();
                                }}
                            >
                                Buy Now
                            </button>
                            <button
                                className="p-2 bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-300 border border-transparent hover:border-green-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onContact) onContact();
                                    else handleContactFarmer(product);
                                }}
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}