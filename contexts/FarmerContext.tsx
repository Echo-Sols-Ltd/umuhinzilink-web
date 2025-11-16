
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { UserType } from '@/types';


interface FarmerMarketAnalysisItem { [key: string]: any }
interface FarmerOrderCardItem { [key: string]: any }
interface InventoryCardItem { [key: string]: any }
interface FarmerContextType {

}

const FarmerContext = createContext<FarmerContextType | null>(null)

function useFarmer(): FarmerContextType {
    const context = useContext(FarmerContext)
    if (!context) {
        throw new Error("useFarmer must be used within an FarmerProvider")
    }
    return context
}

function FarmerProvider({ children }: { children: React.ReactNode }) {
    
    const [marketAnalysis, setMarketAnalysis] = useState<FarmerMarketAnalysisItem[]>()
    const [orderCard, setOrderCard] = useState<FarmerOrderCardItem[]>()
    const [inventoryCard, setInventoryCard] = useState<InventoryCardItem[]>()
    const { user } = useAuth()

  
    return (
        <FarmerContext.Provider value={{ marketAnalysis, orderCard, inventoryCard }}>
            {children}
        </FarmerContext.Provider>
    )
}

export { useFarmer, FarmerProvider }