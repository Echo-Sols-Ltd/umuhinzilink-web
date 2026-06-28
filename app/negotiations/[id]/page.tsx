'use client';

import NegotiationChat from '@/components/negotiation/NegotiationChat';
import PortalShell from '@/components/layout/PortalShell';
import ParticipantGuard from '@/contexts/guard/ParticipantGuard';
import PageLoading from '@/components/layout/PageLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useNegotiation } from '@/contexts/NegotiationContext';

export default function NegotiationDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams() as { id: string };
  const negotiationId = id;
  const { loadNegotiationDetail, setViewingNegotiationId, clearNegotiationDetail } = useNegotiation();
  const router = useRouter();
  const userId = user?.id;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/auth/signin?redirect=/negotiations/${negotiationId}`);
    }
  }, [authLoading, user, router, negotiationId]);

  useEffect(() => {
    if (!negotiationId || !userId) return;

    setViewingNegotiationId(negotiationId);

    let cancelled = false;

    const load = async () => {
      await loadNegotiationDetail(negotiationId);
      if (cancelled) return;
    };

    load();

    return () => {
      cancelled = true;
      clearNegotiationDetail();
    };
  }, [negotiationId, userId, loadNegotiationDetail, setViewingNegotiationId, clearNegotiationDetail]);

  if (authLoading || !user) {
    return <PageLoading label="Opening negotiation" description="Loading messages and deal details…" />;
  }

  return (
    <PortalShell>
      <ParticipantGuard>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
          <NegotiationChat
            negotiationId={negotiationId}
            currentRole={user.role}
            onBack={() => router.push('/negotiations')}
          />
        </div>
      </ParticipantGuard>
    </PortalShell>
  );
}
