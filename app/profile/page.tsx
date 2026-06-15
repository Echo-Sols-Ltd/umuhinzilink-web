'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Negotiation } from '@/types';
import { Loader2 } from 'lucide-react';

import ProfileComponent from '@/components/profile/Profile';
import { useWallet } from '@/contexts/WalletContext';
import { useOrder } from '@/contexts/OrderContext';


function GlobalProfileComponent() {
  const { user, loading: authLoading } = useAuth();
  const { wallet } = useWallet()
  const { completedBuyingOrders: orders } = useOrder()
  const router = useRouter();
  const loading = authLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className='text-success animate-spin' size={50} />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }


  const walletBalance = wallet?.balance || 0
  const totalOrders = orders.length
  const completedOrders = orders.length
  const savedProductsCount = user.savedProducts.length
  const activeNegotiations: Negotiation[] = []

  return (
    <div className="flex  h-screen bg-background overflow-hidden">
      <div className="flex-1 overflow-auto pb-20">
        <ProfileComponent
          user={user}
          walletBalance={walletBalance}
          totalOrders={totalOrders}
          completedOrders={completedOrders}
          savedProductsCount={savedProductsCount}
          activeNegotiations={activeNegotiations}
        />
      </div>
    </div>
  );
}

export default function GlobalProfilePage() {
  return <GlobalProfileComponent />;
}
