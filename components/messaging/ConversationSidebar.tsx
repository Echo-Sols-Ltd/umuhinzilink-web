'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MessageCircle,
  Users,
  Clock,
  Check,
  CheckCheck,
  X
} from 'lucide-react';
import { User } from '@/types/user';
import { UserType } from '@/types/enums';
import { useMessages } from '@/contexts/MessageContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export interface ConversationSidebarProps {
  className?: string;
  onNewConversation?: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  className,
  onNewConversation
}) => {
  const {
    messages,
    activeChatUser,
    setActiveChatUser,
    onlineUsers,
    markAsRead,
    loadMessages
  } = useMessages();

  const { users } = useUser();
  const { user: currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.names
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) &&
    user.id !== currentUser?.id
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const onUserClick = async (user: User) => {
    setActiveChatUser(user);
    await loadMessages(user.id);

    // Mark messages from this user as read
    const unreadFromUser = messages.filter(m => m.sender.id === user.id && !m.isRead);
    if (unreadFromUser.length > 0) {
      markAsRead(unreadFromUser.map(m => m.id));
    }
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(parseInt(userId));
  };

  const getUserData = (userId: string) => {
    const userMessages = messages.filter(m =>
      (m.sender.id === userId && m.receiver.id === currentUser?.id) ||
      (m.sender.id === currentUser?.id && m.receiver.id === userId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const lastMessage = userMessages[userMessages.length - 1];
    const unreadCount = userMessages.filter(m => m.sender.id === userId && !m.isRead).length;

    return { lastMessage, unreadCount };
  };

  const totalUnreadCount = users.reduce((acc, user) => acc + getUserData(user.id).unreadCount, 0);

  return (
    <>
      <div className={cn('flex flex-col h-full bg-white border-r border-gray-200', className)}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Messages</h2>
              {totalUnreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-sm text-center">
                Try searching for someone else
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const { lastMessage, unreadCount } = getUserData(user.id);
                const isActive = activeChatUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    onClick={() => onUserClick(user)}
                    className={cn(
                      'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                      isActive && 'bg-blue-50 border-r-2 border-blue-500'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.names.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        {isUserOnline(user.id) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={cn(
                            'text-sm font-medium truncate',
                            unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                          )}>
                            {user.names}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className={cn(
                            'text-sm truncate',
                            unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                          )}>
                            {lastMessage?.content || user.role}
                          </p>

                          {/* Message status for own messages */}
                          {lastMessage && lastMessage.sender.id === currentUser?.id && (
                            <div className="flex items-center ml-2">
                              {lastMessage.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-gray-400" />}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center mt-1">
                          {isUserOnline(user.id) && (
                            <span className="text-xs text-green-600">Online</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Online Users Count */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{onlineUsers.size} users online</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationSidebar;