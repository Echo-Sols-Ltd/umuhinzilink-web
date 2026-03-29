import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode, useEffect } from 'react';
import { negotiationService } from '@/services/negotiation';
import { Negotiation, CounterOfferRequest, NegotiationStatus, Message, SendMessageRequest, MessageType } from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';
import { useSocket } from './SocketContext';

type NegotiationContextValue = {
  // State
  negotiations: Negotiation[];
  loading: boolean;
  error: string | null;
  messages: Message[];
  isConnected: boolean;
  
  // Actions
  sendNegotiationMessage: (negotiationId: string, content: string, type?: MessageType) => void;
  fetchBuyerNegotiations: (page?: number, size?: number) => Promise<void>;
  fetchSellerNegotiations: (page?: number, size?: number) => Promise<void>;
  updateNegotiation: (negotiation: Negotiation) => void;

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNegotiation, setCurrentNegotiation] = useState<Negotiation | null>(null);

  const socket = useSocket()
  
  const isConnected = !!socket?.isConnected();

  useEffect(() => {
    if (socket) {
      socket.onNegotiationMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
      })
    }

  }, [socket])

  const sendNegotiationMessage = useCallback((negotiationId: string, content: string, type: MessageType = MessageType.TEXT) => {
    if (!socket || !user) return;
    
    const negotiation = negotiations.find(n => n.id === negotiationId);
    if (!negotiation) return;

    const receiverId = user.id === negotiation.order.buyer.id 
      ? negotiation.order.product.owner.id 
      : negotiation.order.buyer.id;

    const finalRequest: SendMessageRequest = {
      content,
      type,
      senderId: user.id,
      receiverId,
      negotiationId
    };

    socket.sendMessage(finalRequest);
  }, [socket, user, negotiations]);

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

  // Update single negotiation
  const updateNegotiation = useCallback((updatedNegotiation: Negotiation) => {
    setNegotiations(prev =>
      prev.map(n => n.id === updatedNegotiation.id ? updatedNegotiation : n)
    );
  }, []);

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
      updateNegotiation,
      refreshNegotiations,
      getNegotiationsByStatus,
      hasActiveNegotiations,
      messages,
      sendNegotiationMessage,
      isConnected
    }),
    [
      negotiations,
      loading,
      error,
      fetchBuyerNegotiations,
      fetchSellerNegotiations,
      updateNegotiation,
      refreshNegotiations,
      getNegotiationsByStatus,
      hasActiveNegotiations,
      messages,
      sendNegotiationMessage,
      isConnected
    ]
  );

  return <NegotiationContext.Provider value={value}>{children}</NegotiationContext.Provider>;
};
