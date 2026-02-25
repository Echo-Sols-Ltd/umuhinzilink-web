import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Message, SendMessageRequest, EditMessageRequest, MessageType, ChatReaction, ChatTyping } from '@/types/message';
import { User } from '@/types/user';
import { messageService } from '@/services/messages';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { ChatUser } from '@/types/chat';

export interface MessageContextValue {
  messages: Message[];
  activeChatUser: ChatUser | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Set<string>;
  typingUsers: Set<string>;
  isTyping: boolean;

  // Data operations only
  setActiveChatUser: (user: ChatUser | null) => void;
  sendMessageRequest: (request: SendMessageRequest) => void;
  editMessageRequest: (request: EditMessageRequest) => void;
  deleteMessageRequest: (messageId: string) => void;
  reactToMessageRequest: (request: ChatReaction) => void;
  loadMessages: (userId: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => void;
  sendTypingRequest: (request: ChatTyping) => void;
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Handle incoming messages
  const handleIncomingMessage = useCallback((message: Message) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === message.id)) return prev;

      // Find an optimistic message that hasn't been replaced yet
      const optimisticIndex = prev.findIndex(m =>
        (m as any).isOptimistic &&
        m.content === message.content &&
        (m.receiver.id === message.receiver.id || m.receiver.id === message.sender.id)
      );

      if (optimisticIndex >= 0) {
        // Replace optimistic message
        const newMessages = [...prev];
        newMessages[optimisticIndex] = message;
        return newMessages;
      }

      return [...prev, message];
    });

    // Notify if not active chat
    if (activeChatUser?.id !== message.sender.id && message.sender.id !== user?.id) {
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
  const handleMessageDeleted = useCallback((messageId: string) => {
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
  const handleOnlineUsersUpdate = useCallback((users: Set<string>) => {
    console.log(users)
    setOnlineUsers(users);
  }, []);

  // Handle typing updates
  const handleTypingUpdate = useCallback((typingData: ChatTyping) => {
    console.log(typingData)
    setTypingUsers(prev => {
      const next = new Set(prev);
      if (typingData.typing) {
        next.add(typingData.userId);
      } else {
        next.delete(typingData.userId);
      }
      console.log(next)
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
  }, [socket, handleIncomingMessage, handleMessageEdited, handleMessageDeleted, handleOnlineUsersUpdate, handleReaction, handleTypingUpdate]);

  // Load messages history
  const loadMessages = async (userId: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await messageService.getConversation(user.id, userId);

      if (response.success && response.data) {

        const history: Message[] = response.data || []

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

  // Raw data operations only
  const sendMessageRequest = (request: SendMessageRequest) => {
    if (socket) {
      console.log('Sending message:', request)

      // --- Optimistic UI logic ---
      if (user && activeChatUser) {
        const temporaryId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const optimisticMessage: Message = {
          id: temporaryId,
          content: request.content,
          type: request.type || MessageType.TEXT,
          fileName: request.fileName,
          productRef: request.productRef,
          replyTo: request.replyToId as any,
          sender: {
            id: user.id,
            names: user.names,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            verified: user.verified
          } as any,
          receiver: {
            id: request.receiverId,
            names: activeChatUser.names,
            email: activeChatUser.email,
            avatar: activeChatUser.avatar
          } as any,
          timestamp: new Date().toISOString(),
          isRead: true,
        };

        (optimisticMessage as any).isOptimistic = true;
        setMessages(prev => [...prev, optimisticMessage]);
      }
      // --- End Optimistic ---

      if (request.replyToId) {
        socket.messageReply(request);
      } else {
        socket.sendMessage(request);
      }
    }
  };

  const editMessageRequest = (request: EditMessageRequest) => {
    if (socket) {
      socket.messageEdition(request);
    }
  };

  const deleteMessageRequest = (messageId: string) => {
    if (socket) {
      socket.messageDeletion(messageId);
    }
  };

  const reactToMessageRequest = (request: ChatReaction) => {
    if (socket) {
      socket.messageReact(request);
    }
  };

  const sendTypingRequest = (request: ChatTyping) => {
    if (socket) {
      socket.sendTyping(request);
    }
  };

  const markAsRead = (messageIds: string[]) => {
    setMessages(prev =>
      prev.map(msg => (messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg))
    );
  };

  const markMessagesAsRead = (userId: string) => {
   
  };


  const value: MessageContextValue = {
    messages,
    activeChatUser,
    setActiveChatUser,
    loading,
    error,
    onlineUsers,
    typingUsers,
    isTyping,
    sendMessageRequest,
    editMessageRequest,
    deleteMessageRequest,
    reactToMessageRequest,
    loadMessages,
    markAsRead,
    sendTypingRequest,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessages(): MessageContextValue {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessages must be used within a MessageProvider');
  return context;
}