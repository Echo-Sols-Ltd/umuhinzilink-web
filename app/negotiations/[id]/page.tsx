'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Negotiation, NegotiationStatus } from '@/types';
import { DealCard } from '@/components/negotiations/DealCard';
import { NegotiationThread } from '@/components/negotiations/NegotiationThread';
import { NegotiationActionBar } from '@/components/negotiations/NegotiationActionBar';
import { NegotiationEmptyState } from '@/components/negotiations/NegotiationEmptyState';
import Navbar from '@/components/Navbar';
import { useNegotiation } from '@/contexts/NegotiationContext';
import { useNegotiationSocket } from '@/hooks/useNegotiationSocket';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/lib/notify';
import { ChevronLeft } from 'lucide-react';

export default function NegotiationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getNegotiation, acceptNegotiation, rejectNegotiation, counterOffer } = useNegotiation();
  const { messages: socketMessages, lastStatusUpdate } = useNegotiationSocket(params.id as string);
  
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNegotiation = useCallback(async () => {
    if (!params.id) return;
    const data = await getNegotiation(params.id as string);
    if (data) {
      setNegotiation(data);
    }
    setLoading(false);
  }, [params.id, getNegotiation]);

  useEffect(() => {
    fetchNegotiation();
  }, [fetchNegotiation]);

  // Handle real-time status updates
  useEffect(() => {
    if (lastStatusUpdate) {
      fetchNegotiation();
      
      // Handle browser notifications for counter offers
      if (lastStatusUpdate.action === 'COUNTER' && document.hidden) {
          if ("Notification" in window && Notification.permission === "granted") {
              new Notification(`New counter offer on ${negotiation?.order.product.name}`);
          }
      }
    }
  }, [lastStatusUpdate, fetchNegotiation, negotiation?.order.product.name]);

  const handleAction = async (action: string, data?: any) => {
    if (!negotiation) return;

    try {
      let result: Negotiation | null = null;
      if (action === 'ACCEPT') {
        result = await acceptNegotiation(negotiation.order.id);
      } else if (action === 'COUNTER') {
        // Validate limits (backend also does this)
        const originalPrice = negotiation.order.product.unitPrice;
        if (data.price < originalPrice * 0.5 || data.price > originalPrice * 1.5) {
            notify.error('Proposed price must be between 50% and 150% of listed price');
            return;
        }
        result = await counterOffer(negotiation.order.id, {
          counterPrice: data.price,
          message: data.message || ''
        });
      } else if (action === 'REJECT') {
        result = await rejectNegotiation(negotiation.order.id, data?.message || 'Negotiation declined');
      } else if (action === 'GO_TO_CART') {
        router.push('/cart');
      }

      if (result) {
        setNegotiation(result);
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const isMyTurn = negotiation && user && (
    (user.role === 'BUYER' && negotiation.canBuyerRespond) ||
    (['FARMER', 'SUPPLIER'].includes(user.role) && negotiation.canSellerRespond)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Negotiation...</p>
        </div>
      </div>
    );
  }

  if (!negotiation) return <NegotiationEmptyState />;

  const buyerOrSeller: 'buyer' | 'seller' = user?.role === 'BUYER' ? 'buyer' : 'seller';

  return (
    <div className="h-screen bg-[#FBFBFB] overflow-auto">
      {/* <Navbar /> */}
      
      {/* Mobile Top Mini-Bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div>
                <h1 className="font-bold text-gray-900 text-sm">{negotiation.order.product.name}</h1>
                <p className="text-[10px] text-green-600 font-bold uppercase">
                  {negotiation.status === 'EXPIRED' && !negotiation.isExpired ? 'ACTIVE' : negotiation.status}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
            <p className="font-black text-gray-900 text-sm">RWF {negotiation.buyerProposedPrice.toLocaleString()}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ">
        <div className="hidden lg:flex items-center justify-between mb-8">
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Back to negotiations</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          <div className="lg:col-span-4 hidden lg:block">
            <DealCard negotiation={negotiation} />
          </div>

          <div className="lg:col-span-6 flex flex-col h-full lg:min-h-[700px]">
            <NegotiationThread 
              negotiation={negotiation} 
              messages={socketMessages} 
              currentUserType={buyerOrSeller} 
            />
            <div className="mt-4">
                <NegotiationActionBar 
                    negotiation={negotiation} 
                    currentUserType={buyerOrSeller} 
                    onAction={handleAction}
                    isMyTurn={!!isMyTurn}
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
