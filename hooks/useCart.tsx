import { useCart } from '@/contexts/CartContext';
import { CartItem, CartItemType } from '@/types';

/**
 * Simple cart hook for common cart operations and state access
 */
export const useCartData = () => {
  const { cart, loading, error, getCartItemCount, getCartTotal } = useCart();

  // Get cart items by type
  const getItemsByType = (type: CartItemType): CartItem[] => {
    if (!cart?.items) return [];
    return cart.items.filter(item => item.type === type);
  };

  // Get normal items
  const getNormalItems = (): CartItem[] => {
    return getItemsByType(CartItemType.NORMAL);
  };

  // Get negotiation items
  const getNegotiationItems = (): CartItem[] => {
    return getItemsByType(CartItemType.NEGOTIATION_PENDING);
  };

  // Get accepted negotiation items
  const getAcceptedNegotiationItems = (): CartItem[] => {
    return getItemsByType(CartItemType.NEGOTIATION_ACCEPTED);
  };

  // Check if cart is empty
  const isEmpty = (): boolean => {
    return !cart?.items || cart.items.length === 0;
  };

  // Check if item exists in cart
  const hasItem = (productId: string): boolean => {
    if (!cart?.items) return false;
    return cart.items.some(item => item.product.id === productId);
  };

  // Get item by product ID
  const getItemByProductId = (productId: string): CartItem | undefined => {
    if (!cart?.items) return undefined;
    return cart.items.find(item => item.product.id === productId);
  };

  // Get total for items by type
  const getTotalByType = (type: CartItemType): number => {
    const items = getItemsByType(type);
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  // Get normal items total
  const getNormalItemsTotal = (): number => {
    return getTotalByType(CartItemType.NORMAL);
  };

  // Get negotiation items total
  const getNegotiationItemsTotal = (): number => {
    return getTotalByType(CartItemType.NEGOTIATION_PENDING);
  };

  // Get accepted negotiation items total
  const getAcceptedNegotiationItemsTotal = (): number => {
    return getTotalByType(CartItemType.NEGOTIATION_ACCEPTED);
  };

  // Count items by type
  const getCountByType = (type: CartItemType): number => {
    return getItemsByType(type).length;
  };

  // Check if cart has any negotiations
  const hasNegotiations = (): boolean => {
    return getNegotiationItems().length > 0 || getAcceptedNegotiationItems().length > 0;
  };

  // Check if cart has any accepted negotiations ready for checkout
  const hasAcceptedNegotiations = (): boolean => {
    return getAcceptedNegotiationItems().length > 0;
  };

  return {
    // Cart state
    cart,
    loading,
    error,
    isEmpty,
    
    // Counts
    getCartItemCount,
    getNormalItemsCount: () => getCountByType(CartItemType.NORMAL),
    getNegotiationItemsCount: () => getCountByType(CartItemType.NEGOTIATION_PENDING),
    getAcceptedNegotiationItemsCount: () => getCountByType(CartItemType.NEGOTIATION_ACCEPTED),
    
    // Totals
    getCartTotal,
    getNormalItemsTotal,
    getNegotiationItemsTotal,
    getAcceptedNegotiationItemsTotal,
    
    // Items
    getNormalItems,
    getNegotiationItems,
    getAcceptedNegotiationItems,
    getItemsByType,
    
    // Utilities
    hasItem,
    getItemByProductId,
    hasNegotiations,
    hasAcceptedNegotiations,
  };
};
