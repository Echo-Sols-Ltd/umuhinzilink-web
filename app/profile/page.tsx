'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useOrder } from '@/contexts/OrderContext';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { useRouter } from 'next/navigation';
import ProfileComponent from '@/components/profile/Profile';
import AppLayout from '@/components/layout/AppLayout';
import PageLoading from '@/components/layout/PageLoading';
import { UserRole } from '@/types';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { wallet } = useWallet();
  const { orders, ordersTotalElements, completedBuyingOrders, completedSellingOrders } = useOrder();
  const { negotiations, loading: negotiationsLoading } = useNegotiation();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/signin?redirect=/profile');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <PageLoading label="Loading profile" description="Fetching your account details…" />;
  }

  if (!user) {
    return <PageLoading label="Redirecting" description="Taking you to sign in…" />;
  }

  const walletBalance = wallet?.balance ?? 0;
  const isSeller = user.role === UserRole.SELLER;
  const totalOrders = ordersTotalElements > 0 ? ordersTotalElements : orders.length;
  const completedOrders = isSeller ? completedSellingOrders.length : completedBuyingOrders.length;
  const savedProductsCount = user.savedProducts?.length ?? 0;

  const activeNegotiations = negotiations.filter(
    (n) => n.order?.buyer?.id === user.id || n.order?.product?.owner?.id === user.id,
  );

  return (
    <AppLayout maxWidth="max-w-6xl" mainClassName="space-y-6 pb-8">
      <ProfileComponent
        user={user}
        walletBalance={walletBalance}
        totalOrders={totalOrders}
        completedOrders={completedOrders}
        savedProductsCount={savedProductsCount}
        activeNegotiations={activeNegotiations}
        negotiationsLoading={negotiationsLoading}
      />
    </AppLayout>
  );
}
