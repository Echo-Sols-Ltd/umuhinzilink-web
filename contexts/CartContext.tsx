import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react';
import { cartService } from '@/services/cart';
import {
  Cart,
  CartItem,
  CartItemRequest,
  CartUpdateRequest,
  CartNegotiateRequest,
  CartCheckoutRequest,
  CartItemType,
  Order,
} from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';

const STORAGE_KEYS = {
  CART: 'cart',
};

type CartContextValue = {
  // State
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  
  // Cart operations
  fetchCart: () => Promise<void>;
  addItem: (request: CartItemRequest) => Promise<void>;
  addItemForNegotiation: (request: CartItemRequest) => Promise<void>;
  updateItem: (itemId: string, request: CartUpdateRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Negotiation operations
  negotiateItems: (request: CartNegotiateRequest) => Promise<void>;
  cleanupExpiredNegotiations: () => Promise<void>;
  
  // Item filtering
  getItemsReadyForCheckout: () => Promise<CartItem[]>;
  getNormalItems: () => Promise<CartItem[]>;
  getAcceptedNegotiationItems: () => Promise<CartItem[]>;
  
  // Checkout operations
  checkoutNormal: (request: CartCheckoutRequest) => Promise<Order[] | null>;
  checkoutNegotiated: (request: CartCheckoutRequest) => Promise<Order[] | null>;
  checkoutMixed: (request: CartCheckoutRequest) => Promise<Order[] | null>;
  
  // Utility methods
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch cart
  const fetchCart = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      // Auto-cleanup expired negotiations before fetching
      await cartService.cleanupExpiredNegotiations();

      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCart(response.data);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      } else {
        throw new Error(response.message || 'Failed to fetch cart');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      // Only notify if it's not a background fetch or if it's a critical error
      if (errorMessage !== 'Failed to fetch cart') {
         notify.error(errorMessage, 'Error');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add item to cart
  const addItem = useCallback(async (request: CartItemRequest) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addItem(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Item added to cart', 'Success');
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Add item for negotiation
  const addItemForNegotiation = useCallback(async (request: CartItemRequest) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addItemForNegotiation(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Item added for negotiation', 'Success');
      } else {
        throw new Error(response.message || 'Failed to add item for negotiation');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item for negotiation';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Update cart item
  const updateItem = useCallback(async (itemId: string, request: CartUpdateRequest) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateItem(itemId, request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Item updated', 'Success');
      } else {
        throw new Error(response.message || 'Failed to update item');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.removeItem(itemId);
      if (response.success) {
        await fetchCart(); // Refresh cart
        notify.success('Item removed from cart', 'Success');
      } else {
        throw new Error(response.message || 'Failed to remove item');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        setCart(null);
        localStorage.removeItem(STORAGE_KEYS.CART);
        notify.success('Cart cleared', 'Success');
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Negotiate items
  const negotiateItems = useCallback(async (request: CartNegotiateRequest) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.negotiateItems(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Negotiation requests sent', 'Success');
      } else {
        throw new Error(response.message || 'Failed to negotiate items');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to negotiate items';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Clean up expired negotiations
  const cleanupExpiredNegotiations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.cleanupExpiredNegotiations();
      if (response.success) {
        await fetchCart(); // Refresh cart
        notify.success('Expired negotiations cleaned up', 'Success');
      } else {
        throw new Error(response.message || 'Failed to cleanup expired negotiations');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cleanup expired negotiations';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Get items ready for checkout
  const getItemsReadyForCheckout = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    
    try {
      const response = await cartService.getItemsReadyForCheckout();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get items ready for checkout');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get items ready for checkout';
      notify.error(errorMessage, 'Error');
      return [];
    }
  }, [user]);

  // Get normal items
  const getNormalItems = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    
    try {
      const response = await cartService.getNormalItems();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get normal items');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get normal items';
      notify.error(errorMessage, 'Error');
      return [];
    }
  }, [user]);

  // Get accepted negotiation items
  const getAcceptedNegotiationItems = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    
    try {
      const response = await cartService.getAcceptedNegotiationItems();
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get accepted negotiation items');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get accepted negotiation items';
      notify.error(errorMessage, 'Error');
      return [];
    }
  }, [user]);

  // Checkout normal items
  const checkoutNormal = useCallback(async (request: CartCheckoutRequest): Promise<Order[] | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.checkoutNormal(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Orders placed successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to checkout');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to checkout';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Checkout negotiated items
  const checkoutNegotiated = useCallback(async (request: CartCheckoutRequest): Promise<Order[] | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.checkoutNegotiated(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Orders placed successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to checkout');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to checkout';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Mixed checkout
  const checkoutMixed = useCallback(async (request: CartCheckoutRequest): Promise<Order[] | null> => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.checkoutMixed(request);
      if (response.success && response.data) {
        await fetchCart(); // Refresh cart
        notify.success('Orders placed successfully', 'Success');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to checkout');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to checkout';
      setError(errorMessage);
      notify.error(errorMessage, 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchCart]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // Get cart item count
  const getCartItemCount = useCallback((): number => {
    return cart?.items?.length || 0;
  }, [cart]);

  // Get cart total
  const getCartTotal = useCallback((): number => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.proposedPrice && (item.type === CartItemType.NEGOTIATION_ACCEPTED || item.type === CartItemType.NEGOTIATION)
        ? item.proposedPrice
        : item.unitPrice;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
          localStorage.removeItem(STORAGE_KEYS.CART);
        }
      }
      fetchCart();
    } else {
      setCart(null);
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, [user, fetchCart]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
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
      getCartItemCount,
      getCartTotal,
    }),
    [
      cart,
      loading,
      error,
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
      getCartItemCount,
      getCartTotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
