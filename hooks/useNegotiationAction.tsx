import { useAuth } from "@/contexts/AuthContext";
import { socketService } from "@/services/socket";
import { MessageType, NegotiationMessageRequest } from "@/types";

export function useNegotiationAction() {

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
    return {
        sendNegotiationMessage
    }
}