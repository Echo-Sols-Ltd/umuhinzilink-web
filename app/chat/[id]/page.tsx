'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { User, UserType } from '@/types';
import { ChatUser } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';
import { useMessages } from '@/contexts/MessageContext';
import { cn } from '@/lib/utils';
import { userService } from '@/services/users';
import { Message } from '@/types';

// Helper function to convert User to ChatUser
const userToChatUser = (user: User): ChatUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  avatar: user.avatar,
  unreadMessage: 0, 
  totalMessage: 0,
  lastMessage: {} as Message, 
});

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function GlobalChatComponent() {
  const params = useParams();
  const { user } = useAuth();
  const { users, currentUser, setCurrentUser } = useUser();
  const router = useRouter();
  const { activeChatUser, setActiveChatUser, loadMessages } = useMessages();
  const chatId = params.id as string;

  useEffect(() => {
    if (chatId && user) {
      // Step 1: Check if user is already in context
      let foundUser = users?.find(u => u.id === chatId);
      
      // Step 2: Check if it's the current context user
      if (!foundUser && currentUser?.id === chatId) {
        foundUser = currentUser;
      }
      
      if (foundUser) {
        // ✅ Found in context - use immediately
        setActiveChatUser(userToChatUser(foundUser));
        setCurrentUser(foundUser);
        loadMessages(chatId);
      } else {
        // ❌ Not in context - fetch from server
        const fetchUserAndSetChat = async () => {
          try {
            const response = await userService.getUserById(chatId);
            if (response.success && response.data) {
              setActiveChatUser(userToChatUser(response.data));
              setCurrentUser(response.data);
              await loadMessages(chatId);
            }
          } catch (error) {
            console.error('Failed to fetch user:', error);
          }
        };

        fetchUserAndSetChat();
      }
    }
  }, [chatId, user?.id, users, currentUser?.id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={cn("hidden md:block shrink-0")}>
          <Sidebar
            userType={user?.role as UserType}
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

export default function GlobalChatPage() {
  return <GlobalChatComponent />;
}
