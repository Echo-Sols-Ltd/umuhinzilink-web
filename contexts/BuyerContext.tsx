import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { User, UserType } from '@/types';
import { useProduct } from './ProductContext';
import { useOrder } from './OrderContext';
import { toast } from '@/hooks/use-toast';


interface BuyerContextType {

}

const BuyerContext = createContext<BuyerContextType | null>(null);

function useBuyer(): BuyerContextType {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within an BuyerProvider');
  }
  return context;
}

function BuyerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { fetchBuyerProducts } = useProduct()
  const { fetchBuyerOrders } = useOrder()

  const fetchAllData = async (user: User) => {
    if (!user) return


    try {
      await fetchBuyerProducts()
      await fetchBuyerOrders()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch farmer data'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
     
    }
  }

  useEffect(()=>{
    if(user?.role === 'BUYER'){
      fetchAllData(user)
    }
  },[user])

  return <BuyerContext.Provider value={{}}>{children}</BuyerContext.Provider>;
}

export { useBuyer, BuyerProvider };
