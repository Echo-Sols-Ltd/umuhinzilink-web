'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Negotiation } from '@/types';
import ProfileComponent from '@/components/profile/Profile';
import { useWallet } from '@/contexts/WalletContext';
import { useOrder } from '@/contexts/OrderContext';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import PageLoading from '@/components/layout/PageLoading';

function GlobalProfileComponent() {
  const { user, loading: authLoading } = useAuth();
  const { wallet } = useWallet();
  const { completedBuyingOrders: orders } = useOrder();
  const router = useRouter();
  const loading = authLoading;

  if (loading) {
    return <PageLoading label="Loading profile" description="Fetching your account details…" />;
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const walletBalance = wallet?.balance || 0;
  const totalOrders = orders.length;
  const completedOrders = orders.length;
  const savedProductsCount = user.savedProducts.length;
  const activeNegotiations: Negotiation[] = [];

  return (
    <AppLayout maxWidth="max-w-2xl" mainClassName="space-y-0">
      <PageHeader
        title="My Profile"
        description="Your account overview, wallet, and activity."
      />
      <ProfileComponent
        user={user}
        walletBalance={walletBalance}
        totalOrders={totalOrders}
        completedOrders={completedOrders}
        savedProductsCount={savedProductsCount}
        activeNegotiations={activeNegotiations}
      />
    </AppLayout>
  );
}

export default GlobalProfileComponent;
