'use client'

import NegotiationChat from "@/components/negotiation/NegotiationChat";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useParams } from "next/navigation";

export default function NegotiationDetailPage() {
    const { user } = useAuth()
    const { id } = useParams() as { id: string };
    const negotiationId = id;

    return (
        <div>
            <NegotiationChat negotiationId={negotiationId} currentRole={user!.role} />
        </div>
    )
}