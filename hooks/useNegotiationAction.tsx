import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/lib/notify";
import { negotiationService } from "@/services/negotiation";
import { socketService } from "@/services/socket";
import { MessageType, NegotiationMessageRequest } from "@/types";
import { useState } from "react";

export function useNegotiationAction() {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const sendNegotiationMessage = async (negotiationId: string, message: string) => {
        if (!user) return
        try {
            const request: NegotiationMessageRequest = {
                negotiationId: negotiationId,
                content: message,
                type: MessageType.TEXT,
            }
            // send message to socket

            socketService.sendNegotiationMessage(request)
        } catch (error) {
            console.error(error)
        }
    }

    const setAgreedPrice = async (negotiationId: string, price: number) => {
        if (!user) return
        setLoading(true)
        try {
            const res = await negotiationService.setAgreedPrice(negotiationId, price)
            if (res.success) {
                notify.success('Agreed price set successfully', 'Negotiation Updated')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    return {
        sendNegotiationMessage,
        setAgreedPrice
    }
}