'use client';

import React from 'react';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
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
      <div className="flex flex-1 min-h-0">
        <Sidebar
          userType={UserType.BUYER}
          activeItem='Message'
        />

        {/* Main Content */}
        <main className="flex-1 flex">
          {/* Conversations Sidebar */}
          <ConversationSidebar className="flex-1" />

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
