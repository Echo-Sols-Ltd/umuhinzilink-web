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
    conversations,
    activeConversation,
    setActiveConversation,
    onlineUsers,
    startNewConversation,
    markAsRead
  } = useMessages();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  // Mock users for new conversation (in real app, this would come from API)
  const [availableUsers] = useState<User[]>([
    {
      id: '1',
      names: 'John Farmer',
      email: 'john@example.com',
      role: 'FARMER' as UserType,
      phoneNumber: '+250788123456',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      verified: true,
      address: { province: 'KIGALI_CITY' as any, district: 'GASABO' as any },
      password: '',
      language: 'ENGLISH' as any
    },
    {
      id: '2',
      names: 'Jane Supplier',
      email: 'jane@example.com',
      role: 'SUPPLIER' as UserType,
      phoneNumber: '+250788123457',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      verified: true,
      address: { province: 'KIGALI_CITY' as any, district: 'GASABO' as any },
      password: '',
      language: 'ENGLISH' as any
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.names
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredUsers = availableUsers.filter(user =>
    user.names
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) &&
    !conversations.some(conv => conv.participant.id === user.id)
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

  const handleConversationClick = (conversation: typeof conversations[0]) => {
    setActiveConversation(conversation);
    if (conversation.unreadCount > 0) {
      markAsRead(conversation.id);
    }
  };

  const handleStartNewConversation = (user: User) => {
    startNewConversation(user);
    setShowNewConversationModal(false);
    setSearchTerm('');
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(parseInt(userId));
  };

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  return (
    <>
      <div className={cn('flex flex-col h-full bg-white border-r border-gray-200', className)}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Messages</h2>
              {getTotalUnreadCount() > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {getTotalUnreadCount()}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setShowNewConversationModal(true);
                onNewConversation?.();
              }}
              className="p-2 hover:bg-green-700 rounded-full transition-colors"
              title="Start new conversation"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && searchTerm === '' ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
              <p className="text-sm text-center mb-4">
                Start a new conversation to begin messaging
              </p>
              <button
                onClick={() => setShowNewConversationModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Conversation
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm text-center">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                    activeConversation?.id === conversation.id && 'bg-blue-50 border-r-2 border-blue-500'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {conversation.participant.names.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      {isUserOnline(conversation.participant.id) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          'text-sm font-medium truncate',
                          conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        )}>
                          {conversation.participant.names}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={cn(
                          'text-sm truncate',
                          conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                        )}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        
                        {/* Message status for own messages */}
                        {conversation.lastMessage && (
                          <div className="flex items-center ml-2">
                            {/* TODO: Add message status indicators */}
                            <Check className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {conversation.participant.role}
                        </span>
                        {isUserOnline(conversation.participant.id) && (
                          <span className="ml-2 text-xs text-green-600">Online</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
                <button
                  onClick={() => {
                    setShowNewConversationModal(false);
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStartNewConversation(user)}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.names.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        {isUserOnline(user.id) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {user.names}
                        </h4>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                      {isUserOnline(user.id) && (
                        <span className="text-xs text-green-600">Online</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationSidebar;