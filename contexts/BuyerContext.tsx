import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';
import { useOrder } from './OrderContext';
import { useToast } from '@/components/ui/use-toast';


interface BuyerContextType {
  loading: boolean;
  error: string | null;
  fetchBuyerProducts: () => Promise<void>;
  fetchBuyerOrders: () => Promise<unknown>;
  fetchAllData: () => Promise<void>;
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
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchBuyerProducts } = useProduct();
  const { fetchBuyerOrders } = useOrder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await fetchBuyerProducts();
      await fetchBuyerOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch buyer data';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, fetchBuyerProducts, fetchBuyerOrders, toast]);

  useEffect(() => {
    if (user?.role === 'BUYER') {
      fetchAllData();
    }
  }, [user]);

  const value: BuyerContextType = {
    loading,
    error,
    fetchBuyerProducts,
    fetchBuyerOrders,
    fetchAllData,
  };

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}

export { useBuyer, BuyerProvider };
