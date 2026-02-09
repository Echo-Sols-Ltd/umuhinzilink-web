import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Message, SendMessageRequest, EditMessageRequest, MessageType, ChatReaction, ChatTyping } from '@/types/message';
import { User } from '@/types/user';
import { messageService } from '@/services/messages';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface MessageContextValue {
  messages: Message[];
  activeChatUser: User | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Set<number>;

  // Actions
  setActiveChatUser: (user: User | null) => void;
  sendMessage: (content: string, type?: MessageType, fileName?: string, replyToId?: number) => Promise<void>;
  editMessage: (messageId: number, newContent: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  reactToMessage: (messageId: number, emoji: string) => Promise<void>;
  loadMessages: (userId: string) => Promise<void>;
  markAsRead: (messageIds: number[]) => void;

  // Typing indicators
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  typingUsers: Set<number>;
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const socket = useSocket();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // Handle incoming messages
  const handleIncomingMessage = useCallback((message: Message) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === message.id)) return prev;
      return [...prev, message];
    });

    // Notify if not active chat
    if (activeChatUser?.id !== message.sender.id.toString() && message.sender.id.toString() !== user?.id) {
      // Optional: Notification logic could go here or in a separate hook
    }
  }, [activeChatUser, user?.id]);

  // Handle message editing
  const handleMessageEdited = useCallback((editedMessage: Message) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === editedMessage.id ? { ...msg, ...editedMessage, isEdited: true } : msg))
    );
  }, []);

  // Handle message deletion
  const handleMessageDeleted = useCallback((messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Handle reactions
  const handleReaction = useCallback((reactionData: ChatReaction) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === reactionData.messageId ? { ...msg, reactions: reactionData.reactions } : msg
      )
    );
  }, []);

  // Handle online users updates
  const handleOnlineUsersUpdate = useCallback((users: Set<number>) => {
    setOnlineUsers(users);
  }, []);

  // Handle typing updates
  const handleTypingUpdate = useCallback((typingData: ChatTyping) => {
    setTypingUsers(prev => {
      const next = new Set(prev);
      if (typingData.isTyping) {
        next.add(typingData.userId);
      } else {
        next.delete(typingData.userId);
      }
      return next;
    });
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.onMessage(handleIncomingMessage);
    socket.onMessageEdition(handleMessageEdited);
    socket.onMessageDeletion(handleMessageDeleted);
    socket.onOnlineUsersChange(handleOnlineUsersUpdate);
    socket.onReaction(handleReaction);
    socket.onTyping(handleTypingUpdate);

    return () => {
      socket.removeMessageListener(handleIncomingMessage);
      socket.removeMessageEditionListener(handleMessageEdited);
      socket.removeMessageDeletionListener(handleMessageDeleted);
      socket.removeOnlineUsersListener(handleOnlineUsersUpdate);
      socket.removeReactionListener(handleReaction);
      socket.removeTypingListener(handleTypingUpdate);
    };
  }, [socket, handleIncomingMessage, handleMessageEdited, handleMessageDeleted, handleOnlineUsersUpdate, handleReaction]);

  // Load messages history
  const loadMessages = async (userId: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await messageService.getConversation(user.id, userId);

      if (response.success && response.data) {
        // Map ChatMessage to Message
        const history: Message[] = response.data.map(m => ({
          id: parseInt(m.id),
          sender: {
            id: m.senderId,
            names: `User ${m.senderId}`,
            email: '', role: 'FARMER' as any, phoneNumber: '', avatar: '', createdAt: '', updatedAt: '', lastLogin: '', verified: true, address: {} as any, password: '', language: 'ENGLISH' as any
          },
          receiver: {
            id: m.receiverId,
            names: `User ${m.receiverId}`,
            email: '', role: 'BUYER' as any, phoneNumber: '', avatar: '', createdAt: '', updatedAt: '', lastLogin: '', verified: true, address: {} as any, password: '', language: 'ENGLISH' as any
          },
          content: m.content,
          timestamp: m.createdAt,
          type: m.messageType as MessageType,
          isRead: m.isRead,
          isEdited: false
        }));

        setMessages(prev => {
          const others = prev.filter(m =>
            !((m.sender.id === user.id && m.receiver.id === userId) || (m.sender.id === userId && m.receiver.id === user.id))
          );
          return [...others, ...history];
        });
      } else {
        setError(response.message || 'Failed to load messages');
      }
    } catch (err) {
      setError('An error occurred while loading messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: MessageType = MessageType.TEXT, fileName?: string, replyToId?: number) => {
    if (!user?.id || !activeChatUser || !socket) return;

    const messageRequest: SendMessageRequest = {
      content,
      receiverId: parseInt(activeChatUser.id),
      senderId: parseInt(user.id),
      type,
      fileName,
      replyToId
    };

    socket.sendMessage(messageRequest);
  };

  const editMessage = async (messageId: number, newContent: string) => {
    if (!socket) return;
    socket.messageEdition({ id: messageId, newMessage: newContent });
  };

  const deleteMessage = async (messageId: number) => {
    if (!socket) return;
    socket.messageDeletion(messageId);
  };

  const reactToMessage = async (messageId: number, emoji: string) => {
    if (!socket || !user) return;
    // Local optimistic update could go here
    socket.messageReact({ messageId, reactions: [{ userId: parseInt(user.id), emoji }] });
  };

  const markAsRead = (messageIds: number[]) => {
    setMessages(prev =>
      prev.map(msg => (messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg))
    );
  };

  const value: MessageContextValue = {
    messages,
    activeChatUser,
    setActiveChatUser,
    loading,
    error,
    onlineUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    loadMessages,
    markAsRead,
    isTyping,
    setIsTyping: (typing: boolean) => {
      setIsTyping(typing);
      if (socket && user && activeChatUser) {
        socket.sendTyping({
          userId: parseInt(user.id),
          receiverId: parseInt(activeChatUser.id),
          isTyping: typing
        });
      }
    },
    typingUsers,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessages(): MessageContextValue {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessages must be used within a MessageProvider');
  return context;
}