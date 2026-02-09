'use client';

import React from 'react';
import BuyerGuard from '@/contexts/guard/BuyerGuard';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';
import { useMessages } from '@/contexts/MessageContext';
import { cn } from '@/lib/utils';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function BuyerMessagesComponent() {
  const { activeChatUser } = useMessages();

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={UserType.BUYER}
            activeItem='Messages'
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex h-full overflow-hidden">
          {/* Conversations Sidebar */}
          <ConversationSidebar className={cn(
            "w-full md:w-80 shrink-0",
            activeChatUser ? "hidden md:flex" : "flex"
          )} />

          {/* Chat Interface */}
          <ChatInterface className={cn(
            "flex-1 overflow-hidden",
            activeChatUser ? "flex" : "hidden md:flex"
          )} />
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
