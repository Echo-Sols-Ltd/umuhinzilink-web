import { ApiResponse, Negotiation, NegotiationMessage } from "@/types"
import { apiClient } from "./client"
import { API_ENDPOINTS } from "./constants"

class NegotiationService {

    async getNegotiation(id: string) {
        const res = await apiClient.get<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.BY_ID(id))
        return res
    }

    async getNegotiationMessages(id: string) {
        const res = await apiClient.get<ApiResponse<NegotiationMessage[]>>(API_ENDPOINTS.NEGOTIATION.MESSAGES(id))
        return res
    }

    async deleteNegotiation(id: string) {
        const res = await apiClient.delete<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.BY_ID(id))
        return res
    }

    async getBuyerNegotiations() {
        const res = await apiClient.get<ApiResponse<Negotiation[]>>(API_ENDPOINTS.NEGOTIATION.BUYER)
        return res
    }

    async getSellerNegotiations() {
        const res = await apiClient.get<ApiResponse<Negotiation[]>>(API_ENDPOINTS.NEGOTIATION.SELLER)
        return res
    }

    async setAgreedPrice(id: string, price: number) {
        const res = await apiClient.put<ApiResponse<Negotiation>>(API_ENDPOINTS.NEGOTIATION.SET_AGREED_PRICE(id), { price })
        return res
    }
}

export const negotiationService = new NegotiationService()
