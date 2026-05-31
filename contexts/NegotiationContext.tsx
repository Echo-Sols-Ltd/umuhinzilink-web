import { Negotiation } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { negotiationService } from "@/services/negotiationService";
import { notify } from "@/lib/notify";

interface NegotiationContextType {
    negotiations: Negotiation[]
    loading: boolean
    error: string | null
    fetchNegotiationById: (id: string) => Promise<Negotiation | null>
}

const NegotiationContext = createContext<NegotiationContextType | null>(null)


function NegotiationProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);

    const fetchNegotiationById = async (id: string) => {
        try {
            setLoading(true)
            const res = await negotiationService.getNegotiation(id)
            if (!res.success) {
                setError(res.message)
                notify.error(res.message)
                return null
            }
            if (res.data) {
                return res.data
            }
            return null
        } catch (err: any) {
            setError(err.message)
            notify.error(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }

    return (<NegotiationContext.Provider value={{
        negotiations,
        loading,
        error,
        fetchNegotiationById
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