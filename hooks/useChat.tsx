import { useState, useMemo, useCallback } from "react"
import { User, Message, Reaction, MessageType } from '@/types'
import { useAuth } from "@/contexts/AuthContext"
import { useMessages } from "@/contexts/MessageContext"
import { useToast } from '@/components/ui/use-toast'

export const useChat = () => {
    const { user: currentUser } = useAuth()
    const {
        messages,
        activeChatUser,
        setActiveChatUser,
        sendMessageRequest,
        editMessageRequest,
        deleteMessageRequest,
        reactToMessageRequest,
        loadMessages,
        markAsRead,
        isTyping,
        sendTypingRequest,
        onlineUsers,
        typingUsers
    } = useMessages()
    const { toast } = useToast()

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [replyTo, setReplyTo] = useState<Message | null>(null)

    const handleSendMessage = useCallback(async (content: string, type: MessageType = MessageType.TEXT, fileName?: string) => {
        // Business logic validation
        if (!currentUser?.id || !activeChatUser) {
            toast({
                title: "Error",
                description: "Cannot send message - user or chat not selected",
                variant: "error"
            });
            return;
        }
        
        if (!content.trim() && !fileName) {
            toast({
                title: "Error",
                description: "Cannot send empty message",
                variant: "error"
            });
            return;
        }
        
        // Business logic: sanitization
        const sanitizedContent = content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        try {
            // Create the request object
            const messageRequest = {
                content: sanitizedContent,
                receiverId: activeChatUser.id,
                senderId: currentUser.id,
                type,
                fileName,
                replyToId: replyTo?.id
            };
            
            // Send through context
            sendMessageRequest(messageRequest);
            
            // Business logic: clear reply state after sending
            setReplyTo(null);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "error"
            });
        }
    }, [currentUser, activeChatUser, replyTo, sendMessageRequest, toast])

    const handleUserClick = useCallback(async (clickedUser: User) => {
        // Business logic: switch chat and clear reply state
        setActiveChatUser(clickedUser);
        setReplyTo(null);
        
        // Load messages for the new chat
        try {
            await loadMessages(clickedUser.id);
        } catch (error) {
            console.error('Failed to load messages:', error);
            toast({
                title: "Error",
                description: "Failed to load conversation",
                variant: "error"
            });
        }
    }, [setActiveChatUser, loadMessages, toast])

    const handleUserAvatarClick = useCallback((clickedUser: User) => {
        // Business logic: show user info
        setSelectedUser(clickedUser);
        setShowUserInfo(true);
    }, [])

    const handleCloseUserInfo = useCallback(() => {
        // Business logic: hide user info
        setShowUserInfo(false);
    }, [])

    const handleReplyMessage = useCallback((message: Message) => {
        // Business logic: set reply target
        setReplyTo(message);
    }, [])

    const handleCancelReply = useCallback(() => {
        // Business logic: clear reply state
        setReplyTo(null);
    }, [])

    const handleReactToMessage = useCallback((messageId: string, emoji: string) => {
        // Business logic validation
        if (!currentUser?.id) {
            toast({
                title: "Error",
                description: "Cannot react to message - not logged in",
                variant: "error"
            });
            return;
        }
        
        // Create reaction request
        const reactionRequest = {
            messageId,
            reactions: [{ userId: currentUser.id, emoji }]
        };
        
        // Send through context
        reactToMessageRequest(reactionRequest);
    }, [currentUser, reactToMessageRequest, toast])

    const handleEditMessage = useCallback(async (messageId: string, newContent: string) => {
        // Business logic validation
        if (!newContent.trim()) {
            toast({
                title: "Error",
                description: "Message cannot be empty",
                variant: "error"
            });
            return;
        }
        
        try {
            // Create edit request
            const editRequest = {
                id: messageId,
                newMessage: newContent.trim()
            };
            
            // Send through context
            editMessageRequest(editRequest);
        } catch (error) {
            console.error('Failed to edit message:', error);
            toast({
                title: "Error",
                description: "Failed to edit message",
                variant: "error"
            });
        }
    }, [editMessageRequest, toast])

    const handleDeleteMessage = useCallback(async (messageId: string) => {
        // Business logic: confirm before delete
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return;
        }
        
        try {
            // Send through context
            deleteMessageRequest(messageId);
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast({
                title: "Error",
                description: "Failed to delete message",
                variant: "error"
            });
        }
    }, [deleteMessageRequest, toast])

    const handleTyping = useCallback((isTyping: boolean) => {
        // Business logic validation
        if (!currentUser?.id || !activeChatUser?.id) return;
        
        // Create typing request
        const typingRequest = {
            userId: currentUser.id,
            receiverId: activeChatUser.id,
            isTyping
        };
        
        // Send through context
        sendTypingRequest(typingRequest);
    }, [currentUser, activeChatUser, sendTypingRequest])

    const filteredMessages = useMemo(() => {
        if (!activeChatUser || !currentUser) return []
        return messages.filter(message =>
            (message.sender.id === currentUser.id && message.receiver.id === activeChatUser.id) ||
            (message.sender.id === activeChatUser.id && message.receiver.id === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }, [messages, activeChatUser, currentUser])

    return {
        selectedUser,
        showUserInfo,
        activeChat: activeChatUser,
        replyTo,
        messages: filteredMessages,
        typingUsers,
        onlineUsers,
        // Business logic methods
        handleSendMessage,
        handleUserClick,
        handleUserAvatarClick,
        handleCloseUserInfo,
        handleReplyMessage,
        handleCancelReply,
        handleReactToMessage,
        handleEditMessage,
        handleDeleteMessage,
        handleTyping,
        // Direct context passthrough (read-only)
        setActiveChat: setActiveChatUser,
        markAsRead
    }
}