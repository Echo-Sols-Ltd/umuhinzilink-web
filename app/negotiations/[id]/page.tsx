'use client'

import NegotiationChat from "@/components/negotiation/NegotiationChat";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNegotiation } from "@/contexts/NegotiationContext";

export default function NegotiationDetailPage() {
    const { user } = useAuth()
    const { id } = useParams() as { id: string };
    const negotiationId = id;
    const { fetchNegotiationMessages, fetchNegotiationById } = useNegotiation()
    const router = useRouter()

    useEffect(() => {
        const load = async () => {

            if (!negotiationId) return;
            await fetchNegotiationById(negotiationId);
            await fetchNegotiationMessages(negotiationId);
        }
        load()
    }, [negotiationId]);

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div>
            <NegotiationChat
                negotiationId={negotiationId}
                currentRole={user.role}
                onBack={() => router.back()} />
        </div>
    )
}