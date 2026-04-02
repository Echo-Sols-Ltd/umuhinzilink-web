'use client';

import React from 'react';
import NegotiationDashboard from '@/components/negotiations/NegotiationDashboard';

export default function BuyerNegotiationsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-20 lg:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NegotiationDashboard userType="buyer" />
      </div>
    </div>
  );
}
