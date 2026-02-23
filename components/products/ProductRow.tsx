import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, SupplierProduct } from "@/types";
import { Heart, MessageSquare, Trash2, UserIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, userToChatUser } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/contexts/ProductContext";

interface ProductRowProps {
    product: FarmerProduct | SupplierProduct
    onSelect: () => void;
    onPurchase: () => void;
    onContact: () => void;
}

export default function ProductRow({ product, onSelect, onPurchase, onContact }: ProductRowProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const { deleteFarmerProduct } = useProduct()
    const { handleUserClick, handleSendMessage } = useChat()
    const router = useRouter()

    const handleContactFarmer = async (product: FarmerProduct) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to contact farmers",
                variant: "error"
            });
            return;
        }

        if (!product.owner) {
            toast({
                title: "Farmer Not Available",
                description: "Unable to find farmer information for this product",
                variant: "error"
            });
            return;
        }

        try {
            const farmerUser = product.owner;
            handleUserClick(userToChatUser(farmerUser));
            await handleSendMessage(
                `Hi! I'm interested in your ${product.name}\n Send me more details about this product to reach me`,
                MessageType.PRODUCT,
                product.owner.names,
                product.id
            );

            toast({
                title: "Message Sent",
                description: `You can now chat with ${product.owner.names} about ${product.name}`,
                variant: "success"
            });

            router.push(`/chat/${farmerUser.id}`);
        } catch (error) {
            console.error('Failed to contact farmer:', error);
            toast({
                title: "Failed to Send Message",
                description: "Please try again later",
                variant: "error"
            });
        }
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteFarmerProduct(productId);
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast({
                title: "Delete Failed",
                description: "Failed to delete product. Please try again.",
                variant: "error"
            });
        }
    };

    const isProductOwner = user?.id === product.owner.id

    return (
        <div key={product.name} className="flex bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-48 shrink-0">
                <img
                    src={imageUrl(product.image!)}
                    alt={product.name}
                    className="h-full w-full object-cover" />
                <button className="absolute top-3 right-3 bg-white p-1 rounded-full shadow">
                    <Heart className="w-5 h-5 text-red-500" />
                </button>
            </div>
            <div className="p-4 flex flex-col justify-between w-full">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                        <p className="text-green-600 font-semibold text-lg">{product.unitPrice} RWF / {product.measurementUnit}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Available: {product.quantity} {product.measurementUnit}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <UserIcon className="w-4 h-4 mr-1" /> {product.owner.names}
                        <span className="mx-2">•</span>
                        {product.location}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
                    {isProductOwner ? (
                        <>
                            <Link
                                href={`/farmer/products/${product.id}/edit`}
                                className="bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-2 rounded-lg text-sm font-medium"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                title="Delete product"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </>
                    ) : (<>
                        <button className="border border-gray-300 hover:bg-white transition-colors p-2.5 rounded-lg flex items-center justify-center"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleContactFarmer(product as FarmerProduct)
                            }}>
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="border border-red-200 hover:bg-red-50 transition-colors p-2.5 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-500" />
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                onPurchase();
                            }}>
                            Buy Now
                        </button>
                    </>
                    )}
                </div>
            </div>
        </div >
    )
}
