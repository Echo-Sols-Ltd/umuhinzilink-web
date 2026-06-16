import { ApiResponse, Negotiation, NegotiationMessage, PaginatedResponse } from "@/types"
import { apiClient } from "./client"
import { API_ENDPOINTS } from "./constants"

class NegotiationService {

    async getNegotiation(id: string) {
        const res = await apiClient.get<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.BY_ID(id))
        return res
    }

    async getNegotiationMessages(id: string) {
        const res = await apiClient.get<PaginatedResponse<NegotiationMessage[]>>(
            API_ENDPOINTS.NEGOTIATION.MESSAGES(id)
        )
        return {
            success: res.success,
            message: res.message,
            data: res.data ?? [],
        } as ApiResponse<NegotiationMessage[]>
    }

    async getBuyerNegotiations(page = 0, size = 50) {
        const res = await apiClient.get<PaginatedResponse<Negotiation[]>>(
            `${API_ENDPOINTS.NEGOTIATION.BUYER}?page=${page}&size=${size}`
        )
        return {
            success: res.success,
            message: res.message,
            data: res.data ?? [],
        } as ApiResponse<Negotiation[]>
    }

    async getSellerNegotiations(page = 0, size = 50) {
        const res = await apiClient.get<PaginatedResponse<Negotiation[]>>(
            `${API_ENDPOINTS.NEGOTIATION.SELLER}?page=${page}&size=${size}`
        )
        return {
            success: res.success,
            message: res.message,
            data: res.data ?? [],
        } as ApiResponse<Negotiation[]>
    }

    async setSellerOffer(id: string, price: number) {
        return apiClient.put<ApiResponse<Negotiation>>(
            API_ENDPOINTS.NEGOTIATION.SET_AGREED_PRICE(id), { price }
        )
    }

    async setBuyerOffer(id: string, price: number) {
        return apiClient.put<ApiResponse<Negotiation>>(
            API_ENDPOINTS.NEGOTIATION.SET_BUYER_PRICE(id), { price }
        )
    }

    async buyerAcceptSellerOffer(id: string) {
        return apiClient.put<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.BUYER_ACCEPT(id))
    }

    async sellerAcceptBuyerOffer(id: string) {
        return apiClient.put<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.SELLER_ACCEPT(id))
    }

    async rejectNegotiation(id: string) {
        return apiClient.put<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.BUYER_REJECT(id))
    }
}

export const negotiationService = new NegotiationService()
