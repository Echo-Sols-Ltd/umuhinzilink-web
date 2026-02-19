'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import GovernmentGuard from '@/contexts/guard/GovernmentGuard';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';
import { useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { userService } from '@/services/users';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function GovernmentMessageDetailComponent() {
  const params = useParams();
  const { activeChatUser, setActiveChatUser } = useMessages();
  const { user: government } = useAuth();
  const chatId = params.id as string;

  useEffect(() => {
    if (chatId && government) {
      // Fetch user details by ID and set as active chat
      const fetchUserAndSetChat = async () => {
        try {
          const response = await userService.getUserById(chatId);
          if (response.success && response.data) {
            setActiveChatUser(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };

      fetchUserAndSetChat();
    }
  }, [chatId, government, setActiveChatUser]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={UserType.GOVERNMENT}
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

export default function GovernmentMessageDetail() {
  return (
    <GovernmentGuard>
      <GovernmentMessageDetailComponent />
    </GovernmentGuard>
  );
}
