'use client'

import NegotiationChat from "@/components/negotiation/NegotiationChat";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useNegotiation } from "@/contexts/NegotiationContext";

export default function NegotiationDetailPage() {
    const { user } = useAuth()
    const { id } = useParams() as { id: string };
    const negotiationId = id;
    const { fetchNegotiationMessages } = useNegotiation()

    useEffect(() => {
        const load = async () => {

            if (!negotiationId) return;
            await fetchNegotiationMessages(negotiationId);
        }
        load()
    }, [negotiationId]);
    return (
        <div>
            <NegotiationChat negotiationId={negotiationId} currentRole={user!.role} />
        </div>
    )
}