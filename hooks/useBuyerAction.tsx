import { useToast } from "@/components/ui/toast/Toast";
import { buyerService } from "@/services/buyers";
import { useTranslation } from 'react-i18next';
import { useState } from "react"

export default function useBuyerAction() {
    const { showToast } = useToast()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const bookmarkProduct = async (id: string) => {
        setLoading(true)
        try {
            const res = await buyerService.saveProduct(id)
            if (!res) {
                showToast({
                    title: t('errors.failedToBookmark'),
                    description: t('errors.tryAgainLater'),
                    type: 'error'
                })
            }
            showToast({
                title: t('success.productBookmarked'),
                description: t('success.productBookmarkedSuccess'),
                type: 'default'
            })

        } catch (error) {
            showToast({
                title: t('errors.failedToBookmark'),
                description: t('errors.tryAgainLater'),
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    return{
        loading,
        bookmarkProduct
    }
}
