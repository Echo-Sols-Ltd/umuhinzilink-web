import { Negotiation } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface NegotiationContextType {
    negotiations: Negotiation[]
    loading: boolean
    error: string | null
    fetchNegotiationById: (id: string) => Promise<void>

}

const NegotiationContext = createContext<NegotiationContextType | null>(null)


function NegotiationProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [negotiations, setNegotiations] = useState<Negotiation | null>(null)

    const fetchNegotiationById = async (id: string) => {
        try {
            setLoading(true)
            const res = await negotiationService.getNegotiation(id)
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

    return (<>
        {children}
    </>)
}

const useNegotiation = () => {
    const context = useContext(NegotiationContext)
    if (!context) {
        throw new Error("useNegotiation must be used within NegotiationProvider")
    }
    return context
}

export { useNegotiation, NegotiationProvider }