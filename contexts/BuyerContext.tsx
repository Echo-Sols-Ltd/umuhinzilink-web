
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { UserType } from '@/types';


interface BuyerCardItem { [key: string]: any }
interface BuyerContextType {
    
}

const BuyerContext = createContext<BuyerContextType | null>(null)

function useBuyer(): BuyerContextType {
    const context = useContext(BuyerContext)
    if (!context) {
        throw new Error("useBuyer must be used within an BuyerProvider")
    }
    return context
}

function BuyerProvider({ children }: { children: React.ReactNode }) {
    const [marketCard, setMarketCard] = useState<BuyerCardItem[]>()
    const [orderCard, setOrderCard] = useState<BuyerCardItem[]>()
    const { user } = useAuth()

  
    return (
        <BuyerContext.Provider value={{ }}>
            {children}
        </BuyerContext.Provider>
    )
}

export { useBuyer, BuyerProvider }