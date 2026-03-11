import { useCart } from '@/contexts/CartContext';
import { cartService } from '@/services/cart';
import { notify } from '@/lib/notify';
import { Cart, CartItem, CartItemRequest, CartUpdateRequest, CartNegotiateRequest, CartCheckoutRequest, Order, CartItemType } from '@/types';
import { useState } from 'react';

/**
 * Cart actions hook that handles cart mutations and business logic
 * Uses CartContext for state management and updates
 */
export const useCartAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    fetchCart,
    addItem,
    addItemForNegotiation,
    updateItem,
    removeItem,
    clearCart,
    negotiateItems,
    cleanupExpiredNegotiations,
    getItemsReadyForCheckout,
    getNormalItems,
    getAcceptedNegotiationItems,
    checkoutNormal,
    checkoutNegotiated,
    checkoutMixed,
    refreshCart,
  } = useCart();

  // Add product to cart
  const addProductToCart = async (productId: string, quantity: number, proposedPrice?: number) => {
    setLoading(true);
    setError(null);
    try {
      const request: CartItemRequest = {
        productId,
        quantity,
        proposedPrice,
        type: proposedPrice ? CartItemType.NEGOTIATION : CartItemType.NORMAL,
      };
      
      if (proposedPrice) {
        await addItemForNegotiation(request);
      } else {
        await addItem(request);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product to cart';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const request: CartUpdateRequest = { quantity };
      await updateItem(itemId, request);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item quantity';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item proposed price
  const updateCartItemPrice = async (itemId: string, proposedPrice: number, quantity?: number) => {
    setLoading(true);
    setError(null);
    try {
      const request: CartUpdateRequest = { quantity: quantity || 1, proposedPrice };
      await updateItem(itemId, request);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item price';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeItem(itemId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Batch negotiate items
  const negotiateSelectedItems = async (itemIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const request: CartNegotiateRequest = { itemIds };
      await negotiateItems(request);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to negotiate items';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Checkout with automatic type detection
  const checkoutItems = async (itemIds: string[]): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      // Get the items to determine checkout type
      const readyItems = await getItemsReadyForCheckout();
      const checkoutItems = readyItems.filter(item => itemIds.includes(item.id));
      
      const hasNormalItems = checkoutItems.some(item => item.type === CartItemType.NORMAL);
      const hasNegotiatedItems = checkoutItems.some(item => item.type === CartItemType.NEGOTIATION_ACCEPTED);
      
      let request: CartCheckoutRequest = {
        itemIds,
        checkoutType: 'NORMAL',
      };

      let order: Order | null = null;

      if (hasNormalItems && hasNegotiatedItems) {
        request.checkoutType = 'MIXED';
        order = await checkoutMixed(request);
      } else if (hasNegotiatedItems) {
        request.checkoutType = 'NEGOTIATED';
        order = await checkoutNegotiated(request);
      } else {
        order = await checkoutNormal(request);
      }

      return order;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to checkout items';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Quick checkout for all ready items
  const checkoutAllReadyItems = async (): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const readyItems = await getItemsReadyForCheckout();
      if (readyItems.length === 0) {
        notify.warning('No items ready for checkout', 'Warning');
        return null;
      }

      const itemIds = readyItems.map(item => item.id);
      return await checkoutItems(itemIds);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to checkout all items';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clean up expired negotiations
  const cleanupExpired = async () => {
    setLoading(true);
    setError(null);
    try {
      await cleanupExpiredNegotiations();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cleanup expired negotiations';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearUserCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await clearCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addProductToCart,
    updateCartItemQuantity,
    updateCartItemPrice,
    removeCartItem,
    negotiateSelectedItems,
    checkoutItems,
    checkoutAllReadyItems,
    cleanupExpired,
    clearUserCart,
    refreshCart,
  };
};
