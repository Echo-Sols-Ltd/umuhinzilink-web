import { useAuth } from "@/contexts/AuthContext";
import { useNegotiation } from "@/contexts/NegotiationContext";
import { notify } from "@/lib/notify";
import { negotiationService } from "@/services/negotiation";
import { socketService } from "@/services/socket";
import { MessageType, NegotiationMessageRequest } from "@/types";
import { useState } from "react";

export function useNegotiationAction(negotiationId?: string) {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { fetchNegotiationById } = useNegotiation()

    const refresh = async () => {
        if (negotiationId) await fetchNegotiationById(negotiationId, true)
    }

    const handleResponse = async (success: boolean, message: string, successTitle: string) => {
        if (success) {
            const needsPayment = message.toLowerCase().includes('top up')
                || message.toLowerCase().includes('pay from');
            if (needsPayment) {
                notify.warning(message, 'Payment required');
            } else {
                notify.success(message, successTitle);
            }
            await refresh();
        } else {
            notify.error(message);
        }
    }

    const sendNegotiationMessage = async (id: string, message: string) => {
        if (!user) return
        const request: NegotiationMessageRequest = {
            negotiationId: id,
            content: message,
            type: MessageType.TEXT,
        }
        socketService.sendNegotiationMessage(request)
    }

    const setSellerOffer = async (id: string, price: number) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.setSellerOffer(id, price)
            await handleResponse(res.success, res.message, 'Counter offer sent')
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Failed to set price')
        } finally {
            setLoading(false)
        }
    }

    const setBuyerOffer = async (id: string, price: number) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.setBuyerOffer(id, price)
            await handleResponse(res.success, res.message, 'Offer updated')
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Failed to update offer')
        } finally {
            setLoading(false)
        }
    }

    const sellerAcceptBuyerOffer = async (id: string) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.sellerAcceptBuyerOffer(id)
            await handleResponse(res.success, res.message, 'Buyer offer accepted')
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Failed to accept offer')
        } finally {
            setLoading(false)
        }
    }

    const buyerAcceptSellerOffer = async (id: string) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.buyerAcceptSellerOffer(id)
            await handleResponse(res.success, res.message, 'Offer accepted')
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Failed to accept offer')
        } finally {
            setLoading(false)
        }
    }

    const rejectNegotiation = async (id: string) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.rejectNegotiation(id)
            await handleResponse(res.success, res.message, 'Negotiation cancelled')
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Failed to reject')
        } finally {
            setLoading(false)
        }
    }

    return {
        sendNegotiationMessage,
        setSellerOffer,
        setBuyerOffer,
        sellerAcceptBuyerOffer,
        buyerAcceptSellerOffer,
        rejectNegotiation,
        loading,
        refresh,
    }
}
