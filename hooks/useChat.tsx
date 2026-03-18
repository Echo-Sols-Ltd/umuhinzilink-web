import { useState, useMemo, useCallback, useEffect } from "react"
import { User, Message, Reaction, MessageType, ProductRef } from '@/types'
import { ChatUser } from '@/types'
import { useAuth } from "@/contexts/AuthContext"
import { useMessages } from "@/contexts/MessageContext"
import { notify } from '@/lib/notify';
import { messageService } from "@/services/messages"

// Helper function to convert User to ChatUser
export const userToChatUser = (user: User): ChatUser => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    unreadMessage: 0, // Default values, will be updated by context
    totalMessage: 0,
    lastMessage: {} as Message, // Will be populated by context
})

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

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [replyTo, setReplyTo] = useState<Message | null>(null)


    const handleSendMessage = useCallback(async (
        content: string,
        type: MessageType = MessageType.TEXT,
        fileName?: string,
        productRef?: ProductRef,
        overrideReceiver?: { id: string } // allows bypassing stale activeChatUser closure
    ) => {
        // Use overrideReceiver (fresh value from caller) or fall back to context state
        const receiver = overrideReceiver ?? activeChatUser;

        // Business logic validation
        if (!currentUser?.id || !receiver) {
            notify.error("Cannot send message - user or chat not selected", "Error");
            return;
        }

        if (!content.trim() && !fileName) {
            notify.error("Cannot send empty message", "Error");
            return;
        }

        // Business logic: sanitization
        const sanitizedContent = content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        try {
            // Create the request object
            const messageRequest = {
                content: sanitizedContent,
                receiverId: receiver.id,
                senderId: currentUser.id,
                type,
                fileName,
                replyToId: replyTo?.id,
                productRef
            };

            // Send through context
            sendMessageRequest(messageRequest);

            // Business logic: clear reply state after sending
            setReplyTo(null);
        } catch (error) {
            console.error('Failed to send message:', error);
            notify.error("Failed to send message", "Error");
        }
    }, [currentUser, activeChatUser, replyTo, sendMessageRequest])

    const handleUserClick = useCallback(async (clickedUser: ChatUser) => {
        setActiveChatUser(clickedUser);
        setReplyTo(null);

        // Load messages for new chat
        try {
            await loadMessages(clickedUser.id);
        } catch (error) {
            console.error('Failed to load messages:', error);
            notify.error("Failed to load conversation", "Error");
        }
    }, [setActiveChatUser, loadMessages])

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
            notify.error("Cannot react to message - not logged in", "Error");
            return;
        }

        // Create reaction request
        const reactionRequest = {
            messageId,
            reactions: [{ userId: currentUser.id, emoji }]
        };

        // Send through context
        reactToMessageRequest(reactionRequest);
    }, [currentUser, reactToMessageRequest])

    const handleEditMessage = useCallback(async (messageId: string, newContent: string) => {
        // Business logic validation
        if (!newContent.trim()) {
            notify.error("Message cannot be empty", "Error");
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
            notify.error("Failed to edit message", "Error");
        }
    }, [editMessageRequest])

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
            notify.error("Failed to delete message", "Error");
        }
    }, [deleteMessageRequest])

    const handleTyping = useCallback((typing: boolean) => {
        // Business logic validation
        if (!currentUser?.id || !activeChatUser?.id) return;

        // Create typing request
        const typingRequest = {
            userId: currentUser.id,
            receiverId: activeChatUser.id,
            typing
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

    const markMessagesAsRead = useCallback(async (id: string) => {
        if (!id) return;
        await messageService.markMessagesAsRead(id);

    }, [])

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
        markAsRead,
        markMessagesAsRead
    }
}