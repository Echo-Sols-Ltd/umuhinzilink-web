import { ApiResponse, Cart, CartItem, CartItemRequest, CartUpdateRequest, CartNegotiateRequest, CartCheckoutRequest, Order } from "@/types";
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';

class CartService {
  // Get user's cart
  async getCart(): Promise<ApiResponse<Cart>> {
    return await apiClient.get<ApiResponse<Cart>>(API_ENDPOINTS.CART.GET);
  }

  // Add item to cart
  async addItem(request: CartItemRequest): Promise<ApiResponse<CartItem>> {
    return await apiClient.post<ApiResponse<CartItem>>(API_ENDPOINTS.CART.ITEMS.ADD, request);
  }

  // Add item for negotiation
  async addItemForNegotiation(request: CartItemRequest): Promise<ApiResponse<CartItem>> {
    return await apiClient.post<ApiResponse<CartItem>>(API_ENDPOINTS.CART.ITEMS.ADD_NEGOTIATE, request);
  }

  // Update cart item
  async updateItem(itemId: string, request: CartUpdateRequest): Promise<ApiResponse<CartItem>> {
    return await apiClient.put<ApiResponse<CartItem>>(API_ENDPOINTS.CART.ITEMS.UPDATE(itemId), request);
  }

  // Remove item from cart
  async removeItem(itemId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.CART.ITEMS.DELETE(itemId));
  }

  // Create negotiations from cart
  async negotiateItems(request: CartNegotiateRequest): Promise<ApiResponse<CartItem[]>> {
    return await apiClient.post<ApiResponse<CartItem[]>>(API_ENDPOINTS.CART.NEGOTIATE, request);
  }

  // Clean up expired negotiations
  async cleanupExpiredNegotiations(): Promise<ApiResponse<void>> {
    return await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.CART.CLEANUP_EXPIRED);
  }

  // Get items ready for checkout
  async getItemsReadyForCheckout(): Promise<ApiResponse<CartItem[]>> {
    return await apiClient.get<ApiResponse<CartItem[]>>(API_ENDPOINTS.CART.ITEMS.READY_FOR_CHECKOUT);
  }

  // Get normal items
  async getNormalItems(): Promise<ApiResponse<CartItem[]>> {
    return await apiClient.get<ApiResponse<CartItem[]>>(API_ENDPOINTS.CART.ITEMS.NORMAL);
  }

  // Get accepted negotiation items
  async getAcceptedNegotiationItems(): Promise<ApiResponse<CartItem[]>> {
    return await apiClient.get<ApiResponse<CartItem[]>>(API_ENDPOINTS.CART.ITEMS.ACCEPTED_NEGOTIATIONS);
  }

  // Checkout normal items
  async checkoutNormal(request: CartCheckoutRequest): Promise<ApiResponse<Order[]>> {
    return await apiClient.post<ApiResponse<Order[]>>(API_ENDPOINTS.CART.CHECKOUT.NORMAL, request);
  }

  // Checkout accepted negotiations
  async checkoutNegotiated(request: CartCheckoutRequest): Promise<ApiResponse<Order[]>> {
    return await apiClient.post<ApiResponse<Order[]>>(API_ENDPOINTS.CART.CHECKOUT.NEGOTIATED, request);
  }

  // Mixed checkout
  async checkoutMixed(request: CartCheckoutRequest): Promise<ApiResponse<Order[]>> {
    return await apiClient.post<ApiResponse<Order[]>>(API_ENDPOINTS.CART.CHECKOUT.MIXED, request);
  }

  // Clear cart
  async clearCart(): Promise<ApiResponse<void>> {
    return await apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.CART.CLEAR);
  }
}

export const cartService = new CartService();