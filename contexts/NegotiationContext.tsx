import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { negotiationService } from '@/services/negotiation';
import { Negotiation, CounterOfferRequest, NegotiationStatus } from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';

type NegotiationContextValue = {
  // State
  negotiations: Negotiation[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBuyerNegotiations: (page?: number, size?: number) => Promise<void>;
  fetchSellerNegotiations: (page?: number, size?: number) => Promise<void>;
  getNegotiation: (orderId: string) => Promise<Negotiation | null>;
  acceptNegotiation: (orderId: string) => Promise<Negotiation | null>;
  rejectNegotiation: (orderId: string, message?: string) => Promise<Negotiation | null>;
  counterOffer: (orderId: string, request: CounterOfferRequest) => Promise<Negotiation | null>;
  
  // Utilities
  refreshNegotiations: () => Promise<void>;
  getNegotiationsByStatus: (status: NegotiationStatus) => Negotiation[];
  hasActiveNegotiations: () => boolean;
};

const NegotiationContext = createContext<NegotiationContextValue | undefined>(undefined);

export const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (context === undefined) {
    throw new Error('useNegotiation must be used within a NegotiationProvider');
  }
  return context;
};

interface NegotiationProviderProps {
  children: ReactNode;
  userType?: 'buyer' | 'seller';
}

export const NegotiationProvider: React.FC<NegotiationProviderProps> = ({ 
  children, 
}) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch buyer negotiations
  const fetchBuyerNegotiations = useCallback(async (page = 0, size = 10) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.getBuyerNegotiations(page, size);
      if (response.success && response.data) {
        setNegotiations(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch buyer negotiations');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch buyer negotiations';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch seller negotiations
  const fetchSellerNegotiations = useCallback(async (page = 0, size = 10) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.getSellerNegotiations(page, size);
      if (response.success && response.data) {
        setNegotiations(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch seller negotiations');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch seller negotiations';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get specific negotiation
  const getNegotiation = useCallback(async (orderId: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    try {
      const response = await negotiationService.getNegotiation(orderId);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch negotiation';
      notify.error(errorMessage, 'Error');
      return null;
    }
  }, [user]);

  // Accept negotiation
  const acceptNegotiation = useCallback(async (orderId: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.acceptNegotiation(orderId);
      if (response.success && response.data) {
        // Update the negotiation in the list
        setNegotiations(prev => 
          prev.map(n => n.id === response.data!.id ? response.data! : n)
        );
        notify.success('Negotiation accepted successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to accept negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept negotiation';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reject negotiation
  const rejectNegotiation = useCallback(async (orderId: string, message?: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.rejectNegotiation(orderId, message);
      if (response.success && response.data) {
        // Update the negotiation in the list
        setNegotiations(prev => 
          prev.map(n => n.id === response.data!.id ? response.data! : n)
        );
        notify.success('Negotiation rejected', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reject negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject negotiation';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Make counter offer
  const counterOffer = useCallback(async (orderId: string, request: CounterOfferRequest): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.counterOffer(orderId, request);
      if (response.success && response.data) {
        // Update the negotiation in the list
        setNegotiations(prev => 
          prev.map(n => n.id === response.data!.id ? response.data! : n)
        );
        notify.success('Counter offer sent', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to send counter offer');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send counter offer';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh negotiations
  const refreshNegotiations = useCallback(async () => {
    if (user?.role === 'BUYER') {
      await fetchBuyerNegotiations();
    } else {
      await fetchSellerNegotiations();
    }
  }, [user, fetchBuyerNegotiations, fetchSellerNegotiations]);

  // Get negotiations by status
  const getNegotiationsByStatus = useCallback((status: NegotiationStatus): Negotiation[] => {
    return negotiations.filter(n => n.status === status);
  }, [negotiations]);

  // Check if has active negotiations
  const hasActiveNegotiations = useCallback((): boolean => {
    return negotiations.some(n => 
      n.status === NegotiationStatus.PENDING || 
      n.status === NegotiationStatus.COUNTERED
    );
  }, [negotiations]);

  // Load negotiations on mount
  React.useEffect(() => {
    if (user) {
      refreshNegotiations();
    }
  }, [user, refreshNegotiations]);

  const value = useMemo(
    () => ({
      negotiations,
      loading,
      error,
      fetchBuyerNegotiations,
      fetchSellerNegotiations,
      getNegotiation,
      acceptNegotiation,
      rejectNegotiation,
      counterOffer,
      refreshNegotiations,
      getNegotiationsByStatus,
      hasActiveNegotiations,
    }),
    [
      negotiations,
      loading,
      error,
      fetchBuyerNegotiations,
      fetchSellerNegotiations,
      getNegotiation,
      acceptNegotiation,
      rejectNegotiation,
      counterOffer,
      refreshNegotiations,
      getNegotiationsByStatus,
      hasActiveNegotiations,
    ]
  );

  return <NegotiationContext.Provider value={value}>{children}</NegotiationContext.Provider>;
};
