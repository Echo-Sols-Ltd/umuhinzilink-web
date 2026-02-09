'use client';

import React from 'react';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';

function FarmerMessagesComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          userType={UserType.FARMER}
          activeItem='Messages'
        />

        {/* Main Content */}
        <main className="flex-1 flex h-full overflow-hidden">
          {/* Conversations Sidebar */}
          <ConversationSidebar className="w-80 shrink-0" />

          {/* Chat Interface */}
          <ChatInterface className="flex-1" />
        </main>
      </div>
    </div>
  );
}

export default function FarmerMessages() {
  return (
    <FarmerGuard>
      <FarmerMessagesComponent />
    </FarmerGuard>
  );
}
