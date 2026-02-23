'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MessageCircle,
  Users,
  Check,
  CheckCheck,
  X,
} from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn, imageUrl } from '@/lib/utils';
import { ChatUser } from '@/types/chat';

export interface ConversationSidebarProps {
  className?: string;
  onNewConversation?: () => void;
}

// ─── Time formatter ───────────────────────────────────────────────────────────
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffH = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffH < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (diffH < 168) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ─── Initials helper ──────────────────────────────────────────────────────────
const getInitials = (name: string): string =>
  name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();

// ─── Avatar colour from name (deterministic) ─────────────────────────────────
const AVATAR_PALETTES = [
  'from-violet-500 to-purple-700',
  'from-sky-500 to-blue-700',
  'from-emerald-500 to-green-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-700',
  'from-teal-500 to-cyan-700',
];
const avatarGradient = (name: string) =>
  AVATAR_PALETTES[Math.abs(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_PALETTES.length];

// ─── Component ────────────────────────────────────────────────────────────────
export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  className,
  onNewConversation,
}) => {
  const {
    activeChatUser,
    setActiveChatUser,
    loadMessages,
    typingUsers,
    onlineUsers,
  } = useMessages();

  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { chatUsers } = useUser();

  const [searchTerm, setSearchTerm] = useState('');

  // ── Derived data ─────────────────────────────────────────────────────────
  const totalUnread = chatUsers.reduce((acc, u) => acc + u.unreadMessage, 0);
  const onlineCount = onlineUsers.size;

  const sorted = useMemo(() =>
    [...chatUsers]
      .filter(u => !searchTerm || u.names.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const tA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const tB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return tB - tA;
      }),
    [chatUsers, searchTerm]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onUserClick = async (user: ChatUser) => {
    router.push(`/chat/${user.id}`);
    setActiveChatUser(user);
    await loadMessages(user.id);
  };

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 ">Messages</h2>
            {totalUnread > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-sm shadow-green-200">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-white border border-transparent focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── List ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
              <Users className="w-7 h-7 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {searchTerm ? 'No results found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {searchTerm ? 'Try a different name' : 'Start chatting with someone'}
              </p>
            </div>
          </div>
        ) : (
          <ul>
            {sorted.map((user) => {
              const isActive = activeChatUser?.id === user.id;
              const isOnline = onlineUsers.has(user.id);
              const isTyping = typingUsers.has(user.id);
              const hasUnread = user.unreadMessage > 0;
              const initials = getInitials(user.names);
              const gradient = avatarGradient(user.names);
              const ownLast = user.lastMessage?.sender.id === currentUser?.id;

              return (
                <li key={user.id}>
                  <button
                    onClick={() => onUserClick(user)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-150',
                      'border-l-2',
                      isActive
                        ? 'bg-green-50 border-green-500'
                        : 'border-transparent hover:bg-white/80'
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center',
                        'shadow-sm text-white font-semibold bg-green-500',
                        gradient
                      )}>
                       {user.avatar? <img
                          src={imageUrl(user.avatar)}
                          alt={user.names}
                          className="rounded-full object-cover w-11 h-11"
                        />:<div className='font-bold text-lg'>
                          {initials}
                        </div>}
                      </div>
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: name + time */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          'text-sm truncate',
                          hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        )}>
                          {user.names}
                        </span>
                        {user.lastMessage && (
                          <span className={cn(
                            'text-[11px] shrink-0',
                            hasUnread ? 'text-green-600 font-semibold' : 'text-gray-400'
                          )}>
                            {formatTime(user.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>

                      {/* Row 2: preview + badges */}
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={cn(
                          'text-[12px] truncate flex items-center gap-1',
                          isTyping ? 'text-green-500 font-medium italic' :
                            hasUnread ? 'text-gray-700 font-medium' : 'text-gray-400'
                        )}>
                          {/* Read receipt for own last message */}
                          {!isTyping && ownLast && (
                            <span className="shrink-0">
                              {user.lastMessage?.isRead
                                ? <CheckCheck className="w-3 h-3 text-blue-500" />
                                : <Check className="w-3 h-3 text-gray-400" />
                              }
                            </span>
                          )}
                          {isTyping
                            ? 'typing…'
                            : (user.lastMessage?.content || 'Say Hey 👋')
                          }
                        </p>

                        {/* Unread badge */}
                        {hasUnread && (
                          <span className="shrink-0 min-w-[18px] h-[18px] px-1 bg-green-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm">
                            {user.unreadMessage > 99 ? '99+' : user.unreadMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;