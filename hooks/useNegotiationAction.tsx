import { useAuth } from "@/contexts/AuthContext";

export function useNegotiationAction() {

    const { user } = useAuth()

    const sendNegotiationMessage = async (orderId: string, message: string) => {
        if (!user) return

    }
    return {

    }
}