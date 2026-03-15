import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { cartService } from '@/services/cart';
import { notify } from '@/lib/notify';
import {
  CartItemRequest,
  CartUpdateRequest,
  CartNegotiateRequest,
  CartCheckoutRequest,
  CartItemType,
  PaymentMethod,
  Order,
} from '@/types';

/**
 * useCartAction owns ALL cart mutations (POST / PUT / DELETE).
 *
 * Responsibilities:
 * - Calls cartService directly for every write operation
 * - Re-syncs CartContext state after each mutation via fetchCart()
 * - Manages local loading & error state for UI feedback
 * - Handles notifications (success / error)
 *
 * CartContext is intentionally kept GET-only after this separation.
 */
export const useCartAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchCart, refreshCart, getItemsReadyForCheckout } = useCart();

  // ── Internal helper ─────────────────────────────────────────────────────

  /**
   * Wraps any async cart mutation with:
   * - Loading/error state management
   * - Automatic cart refresh on success
   * - Consistent error notification
   */
  
  const withMutation = async <T,>(
    fn: () => Promise<T>,
    fallbackError: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : fallbackError;
      setError(message);
      notify.error(message, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Add to cart ─────────────────────────────────────────────────────────

  /** Add item to cart. If proposedPrice is provided, creates a negotiation item. */
  const addProductToCart = async (productId: string, quantity: number, proposedPrice?: number) => {
    const request: CartItemRequest = {
      productId,
      quantity,
      proposedPrice,
      type: proposedPrice ? CartItemType.NEGOTIATION : CartItemType.NORMAL,
    };

    return withMutation(async () => {
      if (proposedPrice) {
        const response = await cartService.addItemForNegotiation(request);
        if (!response.success) throw new Error(response.message || 'Failed to add item for negotiation');
        notify.success('Item added for negotiation', 'Success');
      } else {
        const response = await cartService.addItem(request);
        if (!response.success) throw new Error(response.message || 'Failed to add item to cart');
        notify.success('Item added to cart', 'Success');
      }
      await fetchCart();
    }, 'Failed to add product to cart');
  };

  // ── Update ──────────────────────────────────────────────────────────────

  /** Update the quantity of an existing cart item. */
  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    const request: CartUpdateRequest = { quantity };
    return withMutation(async () => {
      const response = await cartService.updateItem(itemId, request);
      if (!response.success) throw new Error(response.message || 'Failed to update quantity');
      notify.success('Quantity updated', 'Success');
      await fetchCart();
    }, 'Failed to update item quantity');
  };

  /** Update the proposed price of a negotiation item. */
  const updateCartItemPrice = async (itemId: string, proposedPrice: number, quantity: number = 1) => {
    const request: CartUpdateRequest = { quantity, proposedPrice };
    return withMutation(async () => {
      const response = await cartService.updateItem(itemId, request);
      if (!response.success) throw new Error(response.message || 'Failed to update price');
      notify.success('Price proposal updated', 'Success');
      await fetchCart();
    }, 'Failed to update item price');
  };

  // ── Remove ──────────────────────────────────────────────────────────────

  /** Remove a single item from the cart. */
  const removeCartItem = async (itemId: string) => {
    return withMutation(async () => {
      const response = await cartService.removeItem(itemId);
      if (!response.success) throw new Error(response.message || 'Failed to remove item');
      notify.success('Item removed from cart', 'Success');
      await fetchCart();
    }, 'Failed to remove item from cart');
  };

  // ── Negotiate ───────────────────────────────────────────────────────────

  /** Send negotiation requests for the given item IDs. */
  const negotiateSelectedItems = async (itemIds: string[]) => {
    const request: CartNegotiateRequest = { itemIds };
    return withMutation(async () => {
      const response = await cartService.negotiateItems(request);
      if (!response.success) throw new Error(response.message || 'Failed to negotiate items');
      notify.success('Negotiation requests sent', 'Success');
      await fetchCart();
    }, 'Failed to negotiate items');
  };

  /** Manually clean up expired negotiation items. */
  const cleanupExpired = async () => {
    return withMutation(async () => {
      const response = await cartService.cleanupExpiredNegotiations();
      if (!response.success) throw new Error(response.message || 'Cleanup failed');
      notify.success('Expired negotiations removed', 'Success');
      await fetchCart();
    }, 'Failed to cleanup expired negotiations');
  };

  // ── Checkout ────────────────────────────────────────────────────────────

  /**
   * Checkout selected items with automatic strategy detection:
   * - NORMAL: only standard items
   * - NEGOTIATED: only accepted negotiation items
   * - MIXED: both types
   */
  const checkoutItems = async (itemIds: string[]): Promise<Order[] | null> => {
    if (!itemIds.length) {
      notify.warning('Please select items to checkout', 'Empty Selection');
      return null;
    }

    return withMutation(async () => {
      // Determine which items are ready and filter to the requested selection
      const readyItems = await getItemsReadyForCheckout();
      const selected = readyItems.filter(item => itemIds.includes(item.id));

      if (selected.length === 0) {
        notify.warning('Selected items are not ready for checkout', 'Warning');
        return null;
      }

      const hasNormal = selected.some(item => item.type === CartItemType.NORMAL);
      const hasNegotiated = selected.some(item => item.type === CartItemType.NEGOTIATION_ACCEPTED);

      const request: CartCheckoutRequest = {
        paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
        itemIds,
        checkoutType: hasNormal && hasNegotiated ? 'MIXED' : hasNegotiated ? 'NEGOTIATED' : 'NORMAL',
      };

      let response;
      if (request.checkoutType === 'MIXED') {
        response = await cartService.checkoutMixed(request);
      } else if (request.checkoutType === 'NEGOTIATED') {
        response = await cartService.checkoutNegotiated(request);
      } else {
        response = await cartService.checkoutNormal(request);
      }

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Checkout failed');
      }

      notify.success('Orders placed successfully', 'Success');
      await fetchCart();
      return response.data;
    }, 'Failed to checkout items');
  };

  /** Checkout all items currently ready in the cart. */
  const checkoutAllReadyItems = async (): Promise<Order[] | null> => {
    const readyItems = await getItemsReadyForCheckout();
    if (readyItems.length === 0) {
      notify.warning('No items ready for checkout', 'Warning');
      return null;
    }
    // checkoutItems already handles loading/error state via withMutation
    return checkoutItems(readyItems.map(item => item.id));
  };

  // ── Clear ───────────────────────────────────────────────────────────────

  /** Remove all items from the cart. */
  const clearUserCart = async () => {
    return withMutation(async () => {
      const response = await cartService.clearCart();
      if (!response.success) throw new Error(response.message || 'Failed to clear cart');
      notify.success('Cart cleared', 'Success');
      await fetchCart();
    }, 'Failed to clear cart');
  };

  // ── Public API ──────────────────────────────────────────────────────────

  return {
    loading,
    error,
    addProductToCart,
    updateCartItemQuantity,
    updateCartItemPrice,
    removeCartItem,
    negotiateSelectedItems,
    cleanupExpired,
    checkoutItems,
    checkoutAllReadyItems,
    clearUserCart,
    refreshCart,
  };
};
