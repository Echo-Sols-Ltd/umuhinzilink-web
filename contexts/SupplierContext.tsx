import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { UserType } from '@/types';

interface SupplierMarketAnalysisItem {
  [key: string]: any;
}
interface SupplierOrderCardItem {
  [key: string]: any;
}
interface SupplierInventoryCardItem {
  [key: string]: any;
}
interface SupplierContextType {}

const SupplierContext = createContext<SupplierContextType | null>(null);

function useSupplier(): SupplierContextType {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within an SupplierProvider');
  }
  return context;
}

function SupplierProvider({ children }: { children: React.ReactNode }) {
  const [marketAnalysis, setMarketAnalysis] = useState<SupplierMarketAnalysisItem[]>();
  const [orderCard, setOrderCard] = useState<SupplierOrderCardItem[]>();
  const [inventoryCard, setInventoryCard] = useState<SupplierInventoryCardItem[]>();
  const { user } = useAuth();

  return <SupplierContext.Provider value={{}}>{children}</SupplierContext.Provider>;
}

export { useSupplier, SupplierProvider };
