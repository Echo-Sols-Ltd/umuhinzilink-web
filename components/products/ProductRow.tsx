import { imageUrl } from "@/lib/utils";
import { FarmerProduct, MessageType, ProductRef, SupplierProduct } from "@/types";
import { Heart, MessageSquare, Trash2, UserIcon } from "lucide-react";
import { notify } from "@/lib/notify";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, userToChatUser } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/contexts/ProductContext";
import { useI18n } from "@/contexts/I18nContext";

interface ProductRowProps {
    product: FarmerProduct | SupplierProduct
    onSelect: () => void;
    onPurchase: () => void;
    onContact: () => void;
}

export default function ProductRow({ product, onSelect, onPurchase, onContact }: ProductRowProps) {
    const { user } = useAuth()
    const { deleteFarmerProduct } = useProduct()
    const { handleUserClick, handleSendMessage } = useChat()
    const router = useRouter()
    const { t } = useI18n()

    const handleContactFarmer = async (product: FarmerProduct) => {
        if (!user) {
            notify.error(t('productRow.loginToContact'), t('productCard.authRequired'));
            return;
        }

        if (!product.owner) {
            notify.error(t('productRow.noFarmerInfo'), t('productRow.farmerNotAvailable'));
            return;
        }

        try {
            const farmerUser = product.owner;
            handleUserClick(userToChatUser(farmerUser));

            const productRef: ProductRef = {
                productId: product.id,
                productType: product.owner.role
            }
            await handleSendMessage(
                t('productRow.contactMessage').replace('{productName}', product.name),
                MessageType.PRODUCT,
                product.owner.names,
                productRef
            );

            notify.success(t('productRow.chatWithFarmer').replace('{farmerName}', product.owner.names).replace('{productName}', product.name), t('productRow.messageSent'));

            router.push(`/chat/${farmerUser.id}`);
        } catch (error) {
            console.error('Failed to contact farmer:', error);
            notify.error(t('productRow.tryAgainLater'), t('productRow.failedToSend'));
        }
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (!confirm(t('productRow.confirmDelete').replace('{productName}', productName))) {
            return;
        }

        try {
            await deleteFarmerProduct(productId);
        } catch (error) {
            console.error('Failed to delete product:', error);
            notify.error(t('productRow.deleteFailed'), t('productRow.deleteTitle'));
        }
    };

    const isProductOwner = user?.id === product.owner.id

    return (
        <div key={product.name} className="flex bg-card rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-48 shrink-0">
                <img
                    src={imageUrl(product.image!)}
                    alt={product.name}
                    className="h-full w-full object-cover" />
            </div>
            <div className="p-4 flex flex-col justify-between w-full">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                        <p className="text-green-600 font-semibold text-lg">{product.unitPrice} RWF / {t(`enums.units.${product.measurementUnit}`) === `enums.units.${product.measurementUnit}` ? product.measurementUnit : t(`enums.units.${product.measurementUnit}`)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t('productRow.available')} {product.quantity} {t(`enums.units.${product.measurementUnit}`) === `enums.units.${product.measurementUnit}` ? product.measurementUnit : t(`enums.units.${product.measurementUnit}`)}</p>
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
                                {t('productRow.edit')}
                            </Link>
                            <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                title={t('productRow.deleteProduct')}
                            >
                                <Trash2 className="w-4 h-4" /> {t('productRow.delete')}
                            </button>
                        </>
                    ) : (<>
                        <button className="border border-border hover:bg-primary transition-colors p-2.5 rounded-lg flex items-center justify-center"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleContactFarmer(product as FarmerProduct)
                            }}>
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="border border-border hover:bg-red-50 transition-colors p-2.5 rounded-lg flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-500" />
                        </button>
                        <button className="bg-primary hover:bg-green-700 transition-colors text-foreground px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                onPurchase();
                            }}>
                            {t('productRow.buyNow')}
                        </button>
                    </>
                    )}
                </div>
            </div>
        </div >
    )
}
