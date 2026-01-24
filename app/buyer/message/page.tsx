'use client';

import React from 'react';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import BuyerSidebar from '@/components/buyer/Navbar';
import { BuyerPages } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function BuyerMessagesComponent() {
  const handleLogout = async () => {
    // Logout logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        <BuyerSidebar
          activePage={BuyerPages.MESSAGE}
          handleLogout={handleLogout}
          logoutPending={false}
        />

        {/* Main Content */}
        <main className="flex-1 flex min-h-0 ml-64">
          {/* Conversations Sidebar */}
          <ConversationSidebar className="w-80" />
          
          {/* Chat Interface */}
          <ChatInterface className="flex-1" />
        </main>
      </div>
    </div>
  );
}

export default function BuyerMessages() {
  return (
    <BuyerGuard>
      <BuyerMessagesComponent />
    </BuyerGuard>
  );
}
