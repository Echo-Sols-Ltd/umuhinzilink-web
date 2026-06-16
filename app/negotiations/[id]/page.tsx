'use client';

import NegotiationChat from '@/components/negotiation/NegotiationChat';
import Navbar from '@/components/Navbar';
import PageLoading from '@/components/layout/PageLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useNegotiation } from '@/contexts/NegotiationContext';

export default function NegotiationDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams() as { id: string };
  const negotiationId = id;
  const { loadNegotiationDetail } = useNegotiation();
  const router = useRouter();
  const userId = user?.id;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/auth/signin?redirect=/negotiations/${negotiationId}`);
    }
  }, [authLoading, user, router, negotiationId]);

  useEffect(() => {
    if (!negotiationId || !userId) return;

    let cancelled = false;

    const load = async () => {
      await loadNegotiationDetail(negotiationId);
      if (cancelled) return;
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [negotiationId, userId, loadNegotiationDetail]);

  if (authLoading || !user) {
    return <PageLoading label="Opening negotiation" description="Loading messages and deal details…" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 min-h-0 flex flex-col max-h-[calc(100dvh-4rem)]">
        <NegotiationChat
          negotiationId={negotiationId}
          currentRole={user.role}
          onBack={() => router.push('/negotiations')}
        />
      </div>
    </div>
  );
}
