import { Negotiation, NegotiationMessage, NotificationType } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback, useRef } from "react";
import { negotiationService } from "@/services/negotiation";
import { notify } from "@/lib/notify";
import { useAuth } from "./AuthContext";
import { socketService } from "@/services/socket";

interface NegotiationContextType {
    currentNegotiation: Negotiation | null
    negotiations: Negotiation[]
    negotiationMessages: NegotiationMessage[]
    loading: boolean
    error: string | null
    fetchNegotiationById: (id: string) => Promise<void>
    fetchNegotiationMessages: (negotiationId: string) => Promise<void>
    fetchNegotiations: () => Promise<void>
    setCurrentNegotiation: (negotiation: Negotiation | null) => void
}

const NegotiationContext = createContext<NegotiationContextType | null>(null)

function NegotiationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
    const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
    const [currentNegotiation, setCurrentNegotiation] = useState<Negotiation | null>(null)
    const currentNegotiationIdRef = useRef<string | null>(null)

    useEffect(() => {
        currentNegotiationIdRef.current = currentNegotiation?.id ?? null
    }, [currentNegotiation?.id])

    const fetchNegotiationMessages = async (negotiationId: string) => {
        try {
            setLoading(true)
            const res = await negotiationService.getNegotiationMessages(negotiationId)
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
                return
            }
            if (res.data) {
                setNegotiationMessages(res.data)
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load messages'
            setError(msg)
            notify.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const fetchBuyerNegotiations = async () => {
        const res = await negotiationService.getBuyerNegotiations()
        if (res.success && res.data) setNegotiations(res.data)
    }

    const fetchSellerNegotiations = async () => {
        const res = await negotiationService.getSellerNegotiations()
        if (res.success && res.data) setNegotiations(res.data)
    }

    const fetchNegotiations = useCallback(async () => {
        if (user?.role === "BUYER") {
            await fetchBuyerNegotiations()
        } else if (user?.role === "SELLER") {
            await fetchSellerNegotiations()
        }
    }, [user?.role])

    useEffect(() => {
        if (user) fetchNegotiations()
    }, [user, fetchNegotiations])

    const fetchNegotiationById = async (id: string) => {
        try {
            setLoading(true)
            const res = await negotiationService.getNegotiation(id)
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
            }
            if (res.data) setCurrentNegotiation(res.data)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load negotiation'
            setError(msg)
            notify.error(msg)
        } finally {
            setLoading(false)
        }
    }

    // Live chat messages
    useEffect(() => {
        const unsubscribeChat = socketService.onNegotiationMessage((negotiationMessage) => {
            const msgNegotiationId = negotiationMessage.negotiation?.id
            const activeId = currentNegotiationIdRef.current

            if (msgNegotiationId && activeId && msgNegotiationId === activeId) {
                setNegotiationMessages((prev) => {
                    if (prev.some(m => m.id === negotiationMessage.id)) return prev
                    return [...prev, negotiationMessage]
                })
            } else if (msgNegotiationId) {
                notify.info('New message in a negotiation', 'Chat')
            }
        })

        const unsubscribeNotif = socketService.onNotification((notification) => {
            if (notification.type === NotificationType.NEGOTIATION) {
                fetchNegotiations()
                const activeId = currentNegotiationIdRef.current
                if (activeId) fetchNegotiationById(activeId)
            }
        })

        const unsubscribeError = socketService.onSocketError((message) => {
            notify.error(message, 'Chat error')
        })

        return () => {
            unsubscribeChat()
            unsubscribeNotif()
            unsubscribeError()
        }
    }, [fetchNegotiations])

    return (
        <NegotiationContext.Provider value={{
            currentNegotiation,
            negotiations,
            negotiationMessages,
            loading,
            error,
            fetchNegotiationById,
            fetchNegotiationMessages,
            fetchNegotiations,
            setCurrentNegotiation,
        }}>
            {children}
        </NegotiationContext.Provider>
    )
}

const useNegotiation = () => {
    const context = useContext(NegotiationContext)
    if (!context) {
        throw new Error("useNegotiation must be used within NegotiationProvider")
    }
    return context
}

export { useNegotiation, NegotiationProvider }
