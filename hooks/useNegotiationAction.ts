import { useState, useCallback } from 'react';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { negotiationService } from '@/services/negotiation';
import { Negotiation, CounterOfferRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';

export default function useNegotiationAction() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateNegotiation } = useNegotiation();

  // Get specific negotiation
  const getNegotiation = useCallback(async (orderId: string): Promise<Negotiation | null> => {
    console.log("wow user are you there")
 
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Accept negotiation
  const acceptNegotiation = useCallback(async (orderId: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const response = await negotiationService.acceptNegotiation(orderId);
      if (response.success && response.data) {
        // Update the negotiation in the context list
        updateNegotiation(response.data);
        notify.success('Negotiation accepted successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to accept negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept negotiation';
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, updateNegotiation]);

  // Reject negotiation
  const rejectNegotiation = useCallback(async (orderId: string, message?: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const response = await negotiationService.rejectNegotiation(orderId, message);
      if (response.success && response.data) {
        // Update the negotiation in the context list
        updateNegotiation(response.data);
        notify.success('Negotiation rejected', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reject negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject negotiation';
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, updateNegotiation]);

  // Make counter offer
  const counterOffer = useCallback(async (orderId: string, request: CounterOfferRequest): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const response = await negotiationService.counterOffer(orderId, request);
      if (response.success && response.data) {
        // Update the negotiation in the context list
        updateNegotiation(response.data);
        notify.success('Counter offer sent', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to send counter offer');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send counter offer';
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, updateNegotiation]);

  return {
    loading,
    getNegotiation,
    acceptNegotiation,
    rejectNegotiation,
    counterOffer,
  };
}
