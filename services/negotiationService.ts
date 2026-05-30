import { Negotiation, NegotiationMessage } from "@/types"
import { apiClient } from "./client"
import { API_ENDPOINTS } from "./constants"

class NegotiationService {

    async getNegotiation(id: string) {
        const res = await apiClient.get<Negotiation>(API_ENDPOINTS.NEGOTIATION.BY_ID(id))
        return res
    }

    async getAllNegotiations() {
        const res = await apiClient.get<Negotiation[]>(API_ENDPOINTS.NEGOTIATION.ALL)
        return res
    }

    async getNegotiationMessages(id: string) {
        const res = await apiClient.get<NegotiationMessage[]>(API_ENDPOINTS.NEGOTIATION.MESSAGES(id))
        return res
    }


    async updateNegotiation(id: string, payload: UpdateNegotiationPayload) {
        const res = await apiClient.put<Negotiation>(API_ENDPOINTS.NEGOTIATION.BY_ID(id), payload)
        return res
    }

    async deleteNegotiation(id: string) {
        const res = await apiClient.delete<Negotiation>(API_ENDPOINTS.NEGOTIATION.BY_ID(id))
        return res
    }

    




}