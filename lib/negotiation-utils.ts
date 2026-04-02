import { Negotiation, NegotiationStatus } from '@/types';

/**
 * Derives utility properties from a Negotiation object
 */
export const getNegotiationUtils = (negotiation: Negotiation, userType?: 'buyer' | 'seller') => {
  const now = new Date();
  const expiresAt = new Date(negotiation.expiresAt);
  const isExpired = expiresAt < now;

  // Calculate time remaining string
  const diffMs = expiresAt.getTime() - now.getTime();
  let timeRemaining = 'Expired';
  
  if (diffMs > 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      timeRemaining = `${diffHours}h ${diffMins}m`;
    } else {
      timeRemaining = `${diffMins}m`;
    }
  }

  // Actionable states
  const canSellerRespond = !isExpired && 
    (negotiation.status === NegotiationStatus.PENDING || negotiation.status === NegotiationStatus.COUNTERED) &&
    userType === 'seller';

  const canBuyerRespond = !isExpired && 
    (negotiation.status === NegotiationStatus.PENDING || negotiation.status === NegotiationStatus.COUNTERED) &&
    userType === 'buyer';

  return {
    isExpired,
    timeRemaining,
    canSellerRespond,
    canBuyerRespond
  };
};
