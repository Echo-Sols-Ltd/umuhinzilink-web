import { Negotiation, NegotiationMessage } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
        } catch (err: any) {
            setError(err.message)
            notify.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchBuyerNegotiations = async () => {
        try {
            setLoading(true)
            const res = await negotiationService.getBuyerNegotiations()
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
                return
            }
            if (res.data) {
                setNegotiations(res.data)
            }
        } catch (err: any) {
            setError(err.message)
            notify.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchSellerNegotiations = async () => {
        try {
            setLoading(true)
            const res = await negotiationService.getSellerNegotiations()
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
                return
            }
            if (res.data) {
                setNegotiations(res.data)
            }
        } catch (err: any) {
            setError(err.message)
            notify.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchNegotiations = async () => {
        if (user?.role === "BUYER") {
            fetchBuyerNegotiations()
        } else if (user?.role === "SELLER") {
            fetchSellerNegotiations()
        }
    }

    useEffect(() => {
        if (user) fetchNegotiations()
    }, [user])

    const fetchNegotiationById = async (id: string) => {
        try {
            setLoading(true)
            const res = await negotiationService.getNegotiation(id)
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
            }
            if (res.data) setCurrentNegotiation(res.data)

        } catch (err: any) {
            setError(err.message)
            notify.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        socketService.onNegotiationMessage((negotiationMessage) => {
            console.log(negotiationMessage.negotiation.id,currentNegotiation?.id)
            if (negotiationMessage.negotiation.id == currentNegotiation?.id) {
                setNegotiationMessages((prev) => [...prev, negotiationMessage])
            }
        })

        return () => {
            socketService.removeNegotiationMessageListener((message) => {
            })
        }
    }, [currentNegotiation?.id])

    return (<NegotiationContext.Provider value={{
        currentNegotiation,
        negotiations,
        negotiationMessages,
        loading,
        error,
        fetchNegotiationById,
        fetchNegotiationMessages,
        setCurrentNegotiation,
    }} >
        {children}
    </NegotiationContext.Provider>)
}

const useNegotiation = () => {
    const context = useContext(NegotiationContext)
    if (!context) {
        throw new Error("useNegotiation must be used within NegotiationProvider")
    }
    return context
}

export { useNegotiation, NegotiationProvider }