import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Message, SendMessageRequest, EditMessageRequest, MessageType } from '@/types/message';
import { User } from '@/types/user';
import { messageService } from '@/services/messages';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
  isLoading: boolean;
}

export interface MessageContextValue {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Set<number>;
  
  // Actions
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, type?: MessageType, fileName?: string, replyToId?: number) => Promise<void>;
  editMessage: (messageId: number, newContent: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  loadConversation: (userId: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  startNewConversation: (user: User) => void;
  
  // Typing indicators
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  typingUsers: Set<number>;
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const socket = useSocket();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // Handle incoming messages
  const handleIncomingMessage = useCallback((message: Message) => {
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(conv => 
        conv.participant.id === message.sender.id.toString() || conv.participant.id === message.receiver.id.toString()
      );
      
      if (conversationIndex >= 0) {
        // Update existing conversation
        updated[conversationIndex] = {
          ...updated[conversationIndex],
          messages: [...updated[conversationIndex].messages, message],
          lastMessage: message,
          unreadCount: message.sender.id.toString() !== user?.id 
            ? updated[conversationIndex].unreadCount + 1 
            : updated[conversationIndex].unreadCount
        };
      } else {
        // Create new conversation
        const participant = message.sender.id.toString() === user?.id ? message.receiver : message.sender;
        updated.push({
          id: `${Math.min(parseInt(message.sender.id.toString()), parseInt(message.receiver.id.toString()))}-${Math.max(parseInt(message.sender.id.toString()), parseInt(message.receiver.id.toString()))}`,
          participant,
          lastMessage: message,
          unreadCount: message.sender.id.toString() !== user?.id ? 1 : 0,
          messages: [message],
          isLoading: false
        });
      }
      
      return updated;
    });

    // Update active conversation if it matches
    if (activeConversation) {
      const isActiveConversation = 
        activeConversation.participant.id === message.sender.id.toString() || 
        activeConversation.participant.id === message.receiver.id.toString();
      
      if (isActiveConversation) {
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: message
        } : null);
      }
    }
  }, [activeConversation, user?.id]);

  // Handle message editing
  const handleMessageEdited = useCallback((editedMessage: Message) => {
    setConversations(prev => 
      prev.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg => 
          msg.id === editedMessage.id ? editedMessage : msg
        ),
        lastMessage: conv.lastMessage?.id === editedMessage.id ? editedMessage : conv.lastMessage
      }))
    );

    if (activeConversation) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === editedMessage.id ? editedMessage : msg
        )
      } : null);
    }
  }, [activeConversation]);

  // Handle message deletion
  const handleMessageDeleted = useCallback((messageId: number) => {
    setConversations(prev => 
      prev.map(conv => ({
        ...conv,
        messages: conv.messages.filter(msg => msg.id !== messageId),
        lastMessage: conv.lastMessage?.id === messageId 
          ? conv.messages[conv.messages.length - 2] || undefined 
          : conv.lastMessage
      }))
    );

    if (activeConversation) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== messageId)
      } : null);
    }
  }, [activeConversation]);

  // Handle online users updates
  const handleOnlineUsersUpdate = useCallback((users: Set<number>) => {
    setOnlineUsers(users);
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.onMessage(handleIncomingMessage);
    socket.onMessageEdition(handleMessageEdited);
    socket.onMessageDeletion(handleMessageDeleted);
    socket.onOnlineUsersChange(handleOnlineUsersUpdate);

    return () => {
      socket.removeMessageListener(handleIncomingMessage);
      socket.removeMessageEditionListener(handleMessageEdited);
      socket.removeMessageDeletionListener(handleMessageDeleted);
      socket.removeOnlineUsersListener(handleOnlineUsersUpdate);
    };
  }, [socket, handleIncomingMessage, handleMessageEdited, handleMessageDeleted, handleOnlineUsersUpdate]);

  // Load conversation messages
  const loadConversation = async (userId: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await messageService.getConversation(user.id, userId);
      
      if (response.success && response.data) {
        const chatMessages = response.data;
        
        // Convert ChatMessage[] to Message[] (mock conversion for now)
        const messages: Message[] = chatMessages.map(chatMsg => ({
          id: parseInt(chatMsg.id),
          sender: {
            id: chatMsg.senderId,
            names: `User ${chatMsg.senderId}`,
            email: `user${chatMsg.senderId}@example.com`,
            role: 'FARMER' as any,
            phoneNumber: '',
            avatar: '',
            createdAt: chatMsg.createdAt,
            updatedAt: chatMsg.updatedAt,
            lastLogin: '',
            verified: true,
            address: { province: 'KIGALI_CITY' as any, district: 'GASABO' as any },
            password: '',
            language: 'ENGLISH' as any
          },
          receiver: {
            id: chatMsg.receiverId,
            names: `User ${chatMsg.receiverId}`,
            email: `user${chatMsg.receiverId}@example.com`,
            role: 'BUYER' as any,
            phoneNumber: '',
            avatar: '',
            createdAt: chatMsg.createdAt,
            updatedAt: chatMsg.updatedAt,
            lastLogin: '',
            verified: true,
            address: { province: 'KIGALI_CITY' as any, district: 'GASABO' as any },
            password: '',
            language: 'ENGLISH' as any
          },
          content: chatMsg.content,
          timestamp: chatMsg.createdAt,
          type: chatMsg.messageType as MessageType,
          edited: false
        }));
        
        const participant = messages.length > 0 
          ? (messages[0].sender.id === userId ? messages[0].sender : messages[0].receiver)
          : {
              id: userId,
              names: `User ${userId}`,
              email: `user${userId}@example.com`,
              role: 'FARMER' as any,
              phoneNumber: '',
              avatar: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLogin: '',
              verified: true,
              address: { province: 'KIGALI_CITY' as any, district: 'GASABO' as any },
              password: '',
              language: 'ENGLISH' as any
            };
        
        if (participant) {
          const conversation: Conversation = {
            id: `${Math.min(parseInt(user.id), parseInt(userId))}-${Math.max(parseInt(user.id), parseInt(userId))}`,
            participant,
            lastMessage: messages[messages.length - 1],
            unreadCount: 0,
            messages,
            isLoading: false
          };
          
          setActiveConversation(conversation);
          
          // Update conversations list
          setConversations(prev => {
            const existing = prev.find(c => c.participant.id === userId);
            if (existing) {
              return prev.map(c => c.participant.id === userId ? conversation : c);
            } else {
              return [...prev, conversation];
            }
          });
        }
      } else {
        setError(response.message || 'Failed to load conversation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (
    content: string, 
    type: MessageType = MessageType.TEXT, 
    fileName?: string, 
    replyToId?: number
  ) => {
    if (!user?.id || !activeConversation || !socket) return;
    
    try {
      const messageRequest: SendMessageRequest = {
        content,
        receiverId: parseInt(activeConversation.participant.id),
        senderId: parseInt(user.id),
        type,
        fileName,
        replyToId
      };
      
      socket.sendMessage(messageRequest);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  // Edit message
  const editMessage = async (messageId: number, newContent: string) => {
    if (!socket) return;
    
    try {
      const editRequest: EditMessageRequest = {
        id: messageId,
        newMessage: newContent
      };
      
      socket.messageEdition(editRequest);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  // Delete message
  const deleteMessage = async (messageId: number) => {
    if (!socket) return;
    
    try {
      socket.messageDeletion(messageId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });
    }
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  // Start new conversation
  const startNewConversation = (participant: User) => {
    if (!user?.id) return;
    
    const conversationId = `${Math.min(parseInt(user.id), parseInt(participant.id))}-${Math.max(parseInt(user.id), parseInt(participant.id))}`;
    const existingConversation = conversations.find(c => c.id === conversationId);
    
    if (existingConversation) {
      setActiveConversation(existingConversation);
    } else {
      const newConversation: Conversation = {
        id: conversationId,
        participant,
        unreadCount: 0,
        messages: [],
        isLoading: false
      };
      
      setConversations(prev => [...prev, newConversation]);
      setActiveConversation(newConversation);
    }
  };

  const value: MessageContextValue = {
    conversations,
    activeConversation,
    loading,
    error,
    onlineUsers,
    setActiveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    loadConversation,
    markAsRead,
    startNewConversation,
    isTyping,
    setIsTyping,
    typingUsers,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages(): MessageContextValue {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}