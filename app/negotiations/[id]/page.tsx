import NegotiationChat from "@/components/negotiation/NegotiationChat";
import { UserRole } from "@/types";
import { useParams } from "next/navigation";

export default function NegotiationDetailPage() {
    const role = UserRole.BUYER;
    const { id } = useParams() as { id: string };
    const negotiationId = id;

    return (
        <div>
            <NegotiationChat negotiationId={negotiationId} currentRole={role} />
        </div>
    )
}