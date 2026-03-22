'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Negotiation, NegotiationMessage, NegotiationStatus } from '@/types';
import { DealCard } from '@/components/negotiations/DealCard';
import { NegotiationThread } from '@/components/negotiations/NegotiationThread';
import { NegotiationActionBar } from '@/components/negotiations/NegotiationActionBar';
import { NegotiationEmptyState } from '@/components/negotiations/NegotiationEmptyState';
import { Navbar } from '@/components/Navbar';
import { notify } from '@/lib/notify';
import { ChevronLeft, Info, Bell } from 'lucide-react';

// Mock Data Generator
const mockNegotiation: Negotiation = {
  id: 'neg-123',
  order: {
    id: 'ord-456',
    quantity: 10,
    totalPrice: 40000,
    status: 'PENDING',
    buyer: { id: 'u-1', name: 'John Doe', email: 'john@example.com', role: 'BUYER' },
    product: {
      id: 'p-789',
      name: 'Premium Maize (Grade A)',
      description: 'High quality maize from Eastern Province.',
      unitPrice: 4500,
      unit: 'kg',
      category: 'Cereals',
      image: 'https://images.unsplash.com/photo-1551717743-49959800b146?auto=format&fit=crop&q=80&w=800',
      stockQuantity: 500,
      farmerId: 'f-1',
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  buyerProposedPrice: 4000,
  sellerResponsePrice: 4500,
  lastMessage: "I can do RWF 4,500 for 10kg",
  status: NegotiationStatus.COUNTERED,
  expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isExpired: false,
  timeRemaining: "2d 14h remaining",
  canBuyerRespond: true,
  canSellerRespond: false
};

const mockMessages: NegotiationMessage[] = [
  {
    type: 'SYSTEM',
    content: 'Negotiation started',
    timestamp: Date.now() - 3600000 * 5,
  },
  {
    type: 'OFFER',
    content: "I'd like to buy 10kg at RWF 4,000",
    proposedPrice: 4000,
    timestamp: Date.now() - 3600000 * 4,
  },
  {
    type: 'COUNTER_OFFER',
    content: "I can do RWF 4,500 for 10kg",
    proposedPrice: 4500,
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    type: 'SYSTEM',
    content: 'Negotiation expires in 2 days',
    timestamp: Date.now() - 3600000,
  }
];

export default function NegotiationPage() {
  const params = useParams();
  const router = useRouter();
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType] = useState<'buyer' | 'seller'>('buyer'); // In reality, get from session

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setNegotiation(mockNegotiation);
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleAction = (action: string, data?: any) => {
    if (action === 'ACCEPT') {
      notify.success('Offer accepted!', 'Success');
      setNegotiation(prev => prev ? { ...prev, status: NegotiationStatus.ACCEPTED, canBuyerRespond: false, canSellerRespond: false } : null);
      setMessages(prev => [...prev, { type: 'SYSTEM', content: 'Seller accepted your offer', timestamp: Date.now() }]);
    } else if (action === 'COUNTER') {
      notify.success('Counter offer sent', 'Success');
      setNegotiation(prev => prev ? { ...prev, status: NegotiationStatus.COUNTERED, buyerProposedPrice: data.price, canBuyerRespond: false, canSellerRespond: true } : null);
      setMessages(prev => [...prev, { type: 'OFFER', content: data.message || 'Counter offer', proposedPrice: data.price, timestamp: Date.now() }]);
      
      // Simulate seller response after 3 seconds
      setTimeout(() => {
          const counterPrice = data.price + 200;
          setNegotiation(prev => prev ? { ...prev, sellerResponsePrice: counterPrice, canBuyerRespond: true, canSellerRespond: false } : null);
          setMessages(prev => [...prev, { type: 'COUNTER_OFFER', content: `I can go down to ${counterPrice}`, proposedPrice: counterPrice, timestamp: Date.now() }]);
          
          if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Amina Uwase made a counter offer on Maize 10kg");
          } else {
              notify.info("Amina Uwase made a counter offer on Maize 10kg", "New Counter Offer");
          }
      }, 3000);
    } else if (action === 'REJECT') {
      notify.error('Negotiation rejected', 'Ended');
      setNegotiation(prev => prev ? { ...prev, status: NegotiationStatus.REJECTED, canBuyerRespond: false, canSellerRespond: false } : null);
      setMessages(prev => [...prev, { type: 'SYSTEM', content: 'Negotiation ended by buyer', timestamp: Date.now() }]);
    } else if (action === 'GO_TO_CART') {
      router.push('/cart');
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Navbar />
      
      {/* Mobile Top Mini-Bar (Sticky) */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full">
                <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div>
                <h1 className="font-bold text-gray-900 text-sm">{negotiation.order.product.name}</h1>
                <p className="text-[10px] text-green-600 font-bold uppercase">{negotiation.status}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Price</p>
            <p className="font-black text-gray-900 text-sm">RWF {negotiation.buyerProposedPrice.toLocaleString()}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb / Back Navigation (Desktop) */}
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
            <div className="flex items-center gap-4">
               <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
               </button>
               <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Info className="w-5 h-5" />
               </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          {/* Left Column (40%) */}
          <div className="lg:col-span-4 hidden lg:block">
            <DealCard negotiation={negotiation} />
          </div>

          {/* Right Column (60%) */}
          <div className="lg:col-span-6 flex flex-col h-full lg:min-h-[700px]">
            <NegotiationThread 
              negotiation={negotiation} 
              messages={messages} 
              currentUserType={userType} 
            />
            <div className="mt-4">
                <NegotiationActionBar 
                    negotiation={negotiation} 
                    currentUserType={userType} 
                    onAction={handleAction}
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
