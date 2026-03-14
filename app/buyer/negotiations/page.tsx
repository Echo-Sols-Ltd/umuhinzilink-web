'use client';

import React, { useState } from 'react';
import NegotiationDashboard from '@/components/negotiations/NegotiationDashboard';
import NegotiationChat from '@/components/negotiations/NegotiationChat';
import { NegotiationProvider } from '@/contexts/NegotiationContext';
import { Negotiation } from '@/types';

export default function NegotiationsPage() {
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatOpen = (negotiationId: string) => {
    // In a real app, you would fetch the full negotiation details
    // For now, we'll use a mock negotiation object
    setSelectedNegotiation({
      id: negotiationId,
      order: {
        id: 'mock-order-id',
        buyer: { id: '1', names: 'John Doe', email: 'john@example.com' } as any,
        product: { id: '1', name: 'Fresh Tomatoes', unitPrice: 5000 } as any,
        quantity: 10,
        totalPrice: 50000,
        isPaid: false,
        status: 'PROCESSING' as any,
        paymentMethod: 'WALLET' as any,
        isBuyerSatisfied: false,
        orderType: 'NEGOTIATED' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      buyerProposedPrice: 4500,
      sellerResponsePrice: 4800,
      lastMessage: 'Can you do better on the price?',
      status: 'PENDING' as any,
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
      expired: false,
      timeRemaining: '23h 45m',
      canBuyerRespond: true,
      canSellerRespond: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedNegotiation(null);
  };

  return (
    <NegotiationProvider userType="buyer">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <NegotiationDashboard 
            userType="buyer" 
            onChatOpen={handleChatOpen}
          />
        </div>
        
        {selectedNegotiation && (
          <NegotiationChat
            negotiation={selectedNegotiation}
            isOpen={chatOpen}
            onClose={handleChatClose}
            userType="buyer"
          />
        )}
      </div>
    </NegotiationProvider>
  );
}
