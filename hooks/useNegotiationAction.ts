import { useState, useCallback } from 'react';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { useCart } from '@/contexts/CartContext';
import { negotiationService } from '@/services/negotiation';
import { Negotiation, NegotiationStatus, SetAgreedPriceRequest, CartItemType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';

export default function useNegotiationAction() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateNegotiation } = useNegotiation();
  const { fetchCart } = useCart();

  // Temporary optimistic update helper
  const optimisticUpdateNegotiation = useCallback((updatedNegotiation: Partial<Negotiation> & { id: string }) => {
    updateNegotiation(updatedNegotiation);
    // Trigger cart refresh to sync with negotiation changes
    setTimeout(() => {
      fetchCart();
    }, 1000); // Delay to allow backend to update
  }, [updateNegotiation, fetchCart]);

  // Get specific negotiation
  const getNegotiation = useCallback(async (orderId: string): Promise<Negotiation | null> => {

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
      // Optimistic update - create temporary accepted negotiation
      const tempNegotiation = {
        id: orderId,
        status: NegotiationStatus.ACCEPTED,
        updatedAt: new Date().toISOString()
      };
      
      optimisticUpdateNegotiation(tempNegotiation);
      
      const response = await negotiationService.acceptNegotiation(orderId);
      if (response.success && response.data) {
        // Update with real data
        updateNegotiation(response.data);
        fetchCart(); // Refresh cart to update item types
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
  }, [user, updateNegotiation, optimisticUpdateNegotiation, fetchCart]);

  // Reject negotiation
  const rejectNegotiation = useCallback(async (orderId: string, message?: string): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Optimistic update - create temporary rejected negotiation
      const tempNegotiation = {
        id: orderId,
        status: NegotiationStatus.REJECTED,
        updatedAt: new Date().toISOString()
      };
      
      optimisticUpdateNegotiation(tempNegotiation);
      
      const response = await negotiationService.rejectNegotiation(orderId, message);
      if (response.success && response.data) {
        // Update with real data
        updateNegotiation(response.data);
        fetchCart(); // Refresh cart to update item types
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
  }, [user, updateNegotiation, optimisticUpdateNegotiation, fetchCart]);

  // Make counter offer
  const setAgreedPrice = useCallback(async (negotiationId: string, request:SetAgreedPriceRequest): Promise<Negotiation | null> => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Optimistic update - create temporary countered negotiation
      const tempNegotiation = {
        id: negotiationId,
        status: NegotiationStatus.COUNTERED,
        agreedPrice: request.agreedPrice,
        updatedAt: new Date().toISOString()
      };
      
      optimisticUpdateNegotiation(tempNegotiation);
      
      const response = await negotiationService.setAgreedPrice(negotiationId, request);
      if (response.success && response.data) {
        // Update with real data
        updateNegotiation(response.data);
        fetchCart(); // Refresh cart to update item types
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
  }, [user, updateNegotiation, optimisticUpdateNegotiation, fetchCart]);

  return {
    loading,
    getNegotiation,
    acceptNegotiation,
    rejectNegotiation,
    setAgreedPrice
  };
}
