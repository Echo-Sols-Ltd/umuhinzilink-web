import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { User } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { useOrder } from './OrderContext'
import { useProduct } from './ProductContext'

interface FarmerContextType {
  loading: boolean
  error: string | null
}

const FarmerContext = createContext<FarmerContextType | null>(null)

export function useFarmer(): FarmerContextType {
  const context = useContext(FarmerContext)
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider')
  }
  return context
}

export function FarmerProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { fetchFarmerOrders, fetchFarmerBuyerOrders } = useOrder()
  const { fetchFarmerProducts, fetchFarmerBuyerProducts, fetchFarmerStats } = useProduct()
  const {toast } = useToast()
  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await fetchFarmerOrders()
      await fetchFarmerBuyerOrders()
      await fetchFarmerProducts()
      await fetchFarmerBuyerProducts()
      await fetchFarmerStats()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch farmer data'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'FARMER') {
      fetchAllData(user)
    }
  }, [user])


  return (
    <FarmerContext.Provider value={{ loading, error }}>
      {children}
    </FarmerContext.Provider>
  )
}
