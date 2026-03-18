import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react';
import { cartService } from '@/services/cart';
import { Cart, CartItem, CartItemType } from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';

// ─── Storage ────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  CART: 'cart',
};

// ─── Context Type ────────────────────────────────────────────────────────────

/**
 * CartContext is responsible ONLY for:
 * - Cart state (cart, loading, error)
 * - Fetching / refreshing the cart (GETs)
 * - Computed utilities derived from cart state
 *
 * All mutations (POST / PUT / DELETE) live in useCartAction.
 */
type CartContextValue = {
  // State
  cart: Cart | null;
  loading: boolean;
  error: string | null;

  // Core fetch
  fetchCart: () => Promise<void>;
  refreshCart: () => Promise<void>;

  // Read-only item queries (GET)
  getItemsReadyForCheckout: () => Promise<CartItem[]>;
  getNormalItems: () => Promise<CartItem[]>;
  getAcceptedNegotiationItems: () => Promise<CartItem[]>;

  // Computed utilities (derived from cart state — no network calls)
  getCartItemCount: () => number;
  getCartTotal: () => number;
};

// ─── Context & Hook ──────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// ─── Provider ────────────────────────────────────────────────────────────────

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // ── Fetch cart from server ──────────────────────────────────────────────

  const fetchCart = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // Auto-cleanup expired negotiations silently before fetching
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
      if (errorMessage !== 'Failed to fetch cart') {
        notify.error(errorMessage, 'Error');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  // ── Read-only item queries (GET) ────────────────────────────────────────

  const getItemsReadyForCheckout = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    try {
      const response = await cartService.getItemsReadyForCheckout();
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to get items ready for checkout');
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : 'Failed to get items ready for checkout', 'Error');
      return [];
    }
  }, [user]);

  const getNormalItems = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    try {
      const response = await cartService.getNormalItems();
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to get normal items');
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : 'Failed to get normal items', 'Error');
      return [];
    }
  }, [user]);

  const getAcceptedNegotiationItems = useCallback(async (): Promise<CartItem[]> => {
    if (!user) return [];
    try {
      const response = await cartService.getAcceptedNegotiationItems();
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to get accepted negotiation items');
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : 'Failed to get accepted negotiation items', 'Error');
      return [];
    }
  }, [user]);

  // ── Computed utilities ──────────────────────────────────────────────────

  const getCartItemCount = useCallback((): number => {
    return cart?.items?.length ?? 0;
  }, [cart]);

  const getCartTotal = useCallback((): number => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price =
        item.proposedPrice &&
        (item.type === CartItemType.NEGOTIATION_ACCEPTED || item.type === CartItemType.NEGOTIATION_PENDING)
          ? item.proposedPrice
          : item.unitPrice;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  // ── Bootstrap cart from localStorage then server ────────────────────────

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          localStorage.removeItem(STORAGE_KEYS.CART);
        }
      }
      fetchCart();
    } else {
      setCart(null);
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, [user, fetchCart]);

  // ── Context value ───────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      fetchCart,
      refreshCart,
      getItemsReadyForCheckout,
      getNormalItems,
      getAcceptedNegotiationItems,
      getCartItemCount,
      getCartTotal,
    }),
    [
      cart,
      loading,
      error,
      fetchCart,
      refreshCart,
      getItemsReadyForCheckout,
      getNormalItems,
      getAcceptedNegotiationItems,
      getCartItemCount,
      getCartTotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
