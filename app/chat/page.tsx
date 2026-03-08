'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import ConversationSidebar from '@/components/messaging/ConversationSidebar';
import ChatInterface from '@/components/messaging/ChatInterface';
import { useMessages } from '@/contexts/MessageContext';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-foreground">Link</span>
  </span>
);

function GlobalChatListComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { activeChatUser } = useMessages();
  const { t } = useI18n();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">{t('chat.loginRequired')}</p>
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
          <ConversationSidebar className="w-full md:w-80 shrink-0" />

          {/* Chat Interface - Show placeholder when no chat selected */}
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
  return <GlobalChatListComponent />;
}
