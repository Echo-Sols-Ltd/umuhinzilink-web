import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { negotiationService } from '@/services/negotiation';
import { Negotiation, NegotiationStatus, NegotiationMessage, NegotiationMessageRequest, MessageType } from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';

type NegotiationContextValue = {
  // State
  negotiations: Negotiation[];
  loading: boolean;
  error: string | null;
  currentNegotiation: Negotiation | null

  // Actions
  fetchNegotiations: (page?: number, size?: number) => Promise<void>;
  updateNegotiation: (negotiation: Partial<Negotiation> & { id: string }) => void;
  setCurrentNegotiation: (data: Negotiation) => void

  // Utilities
  refreshNegotiations: () => Promise<void>;
  getNegotiationsByStatus: (status: NegotiationStatus) => Negotiation[];
  hasActiveNegotiations: () => boolean;
  lastUpdated: Date;
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
  const [currentNegotiation, setCurrentNegotiation] = useState<Negotiation | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch buyer negotiations
  const fetchNegotiations = useCallback(async (page = 0, size = 10) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await negotiationService.getNegotiations(page, size);
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



  // Update single negotiation
  const updateNegotiation = useCallback((updatedNegotiation: Partial<Negotiation> & { id: string }) => {
    setNegotiations(prev =>
      prev.map(n => n.id === updatedNegotiation.id ? { ...n, ...updatedNegotiation } as Negotiation : n)
    );
  }, []);

  // Refresh negotiations
  const refreshNegotiations = useCallback(async () => {
    await fetchNegotiations();
  }, [user, fetchNegotiations]);

  // Get negotiations by status
  const getNegotiationsByStatus = useCallback((status: NegotiationStatus): Negotiation[] => {
    return negotiations.filter(n => n.status === status);
  }, [negotiations]);

  // Check if has active negotiations
  const hasActiveNegotiations = useCallback((): boolean => {
    return negotiations.some(n => n.status === NegotiationStatus.PENDING);
  }, [negotiations]);

  // Load negotiations on mount
  React.useEffect(() => {
    if (user) {
      refreshNegotiations();
    }
  }, [user, refreshNegotiations]);


  const value = {
    negotiations,
    loading,
    error,
    fetchNegotiations,
    updateNegotiation,
    refreshNegotiations,
    getNegotiationsByStatus,
    hasActiveNegotiations,
    currentNegotiation,
    setCurrentNegotiation,
    lastUpdated
  }

  return <NegotiationContext.Provider value={value}>{children}</NegotiationContext.Provider>;
};
