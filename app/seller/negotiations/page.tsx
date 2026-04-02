'use client';

import React, { useState } from 'react';
import NegotiationDashboard from '@/components/negotiations/NegotiationDashboard';
import NegotiationChat from '@/components/negotiations/NegotiationChat';
import { NegotiationProvider } from '@/contexts/NegotiationContext';
import { Negotiation } from '@/types';

export default function SellerNegotiationsPage() {
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatOpen = (negotiationId: string) => {
    // In a real app, you would fetch the full negotiation details
    // For now, we'll use a mock negotiation object
    setSelectedNegotiation({
      id: negotiationId,
      order: {
        id: 'mock-order-id',
        buyer: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' } as any,
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
        delivery: undefined as any,
        negotiation: undefined as any,
      },
      buyerProposedPrice: 4500,
      agreedPrice: 4800,
      status: 'PENDING' as any,
      rejectedBy: null,
      rejectionReason: null,
      sellerNote: null,
      priceSetAt: null,
      closedAt: null,
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
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
    <NegotiationProvider userType="seller">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <NegotiationDashboard 
            userType="seller" 
            onChatOpen={handleChatOpen}
          />
        </div>
        
        {selectedNegotiation && (
          <NegotiationChat
            negotiation={selectedNegotiation}
            isOpen={chatOpen}
            onClose={handleChatClose}
            userType="seller"
          />
        )}
      </div>
    </NegotiationProvider>
  );
}
