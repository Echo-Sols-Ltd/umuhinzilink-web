import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { UserType, User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface FarmerContextType {
  loading: boolean;
  error: string | null;
  isValidFarmer: () => boolean;
  startFetchingFarmerResources: () => Promise<void>;
}

const FarmerContext = createContext<FarmerContextType | null>(null);

export function useFarmer(): FarmerContextType {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
}

export function FarmerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (user: User) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Mock fetching data
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Fetching farmer data...');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch farmer data';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const isValidFarmer = useCallback(() => {
    if (!user) return false;
    return user.role === UserType.FARMER;
  }, [user]);

  const startFetchingFarmerResources = useCallback(async () => {
    if (!isValidFarmer()) {
      throw new Error('Unauthorized access');
    }
    await fetchAllData(user!);
  }, [isValidFarmer, fetchAllData, user]);

  return (
    <FarmerContext.Provider value={{ loading, error, isValidFarmer, startFetchingFarmerResources }}>
      {children}
    </FarmerContext.Provider>
  );
}
