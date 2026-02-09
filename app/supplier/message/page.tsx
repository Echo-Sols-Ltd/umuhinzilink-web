'use client';

import React from 'react';
import SupplierGuard from '@/contexts/guard/SupplierGuard';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';

import { useMessages } from '@/contexts/MessageContext';
import { cn } from '@/lib/utils';

function SupplierMessagesComponent() {
  const { activeChatUser } = useMessages();

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={UserType.SUPPLIER}
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

export default function SupplierMessages() {
  return (
    <SupplierGuard>
      <SupplierMessagesComponent />
    </SupplierGuard>
  );
}
