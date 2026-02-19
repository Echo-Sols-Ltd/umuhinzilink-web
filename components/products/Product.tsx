import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, SupplierProduct } from "@/types";
import { Heart, MessageSquare, Trash2, UserIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useProductAction from "@/hooks/useProductAction";

interface ProductCardProps {
    product: FarmerProduct | SupplierProduct
    onSelect: () => void;
    onPurchase: () => void;
    onContact: () => void;
}


export default function ProductCard({ product, onSelect, onPurchase, onContact }: ProductCardProps) {
    const { toast } = useToast()
    const { user } = useAuth()
    const {deleteFarmerProduct}=useProductAction()
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
            // Create a user object for farmer
            const farmerUser = product.owner;

            // Switch to chat with the farmer
            handleUserClick(farmerUser);

            // Send product reference message
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

            // Navigate to chat page with specific user ID
            router.push(`/buyer/message/${farmerUser.id}`);
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
        <div key={product.name} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative">
                <img
                    src={imageUrl(product.image!)}
                    alt={product.name}
                    className="h-48 w-full object-cover" />
                <button className="absolute top-3 right-3 bg-white p-1 rounded-full shadow">
                    <Heart className="w-5 h-5 text-red-500" />
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-green-600 font-bold text-sm">{product.unitPrice}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Available: {product.quantity}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <UserIcon className="w-4 h-4 mr-1" /> { product.owner.names}
                    <span className="mx-1">•</span>
                    {product.location}
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center gap-2">
                    {isProductOwner ? (
                        <div className="flex gap-x-5 justify-end">
                            <Link
                                href={`/farmer/products/${product.id}/edit`}
                                className="bg-green-600 text-white px-4 py-2 rounded text-sm flex-1"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-600 text-white px-4 py-2 rounded text-sm flex-1 items-center"
                                title="Delete product"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (<>
                        <button className="bg-green-600 text-white px-4 py-2 rounded text-sm flex-1"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                onPurchase();
                            }}>
                            Buy Now
                        </button>
                        <button className="border border-gray-300 p-2 rounded"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleContactFarmer(product as FarmerProduct)
                            }}>
                            <MessageSquare className="w-4 h-4 text-black" />
                        </button>
                        <button className="border border-red-300 p-2 rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </>
                    )}
                </div>
            </div>
        </div >
    )
}