import { useState, useMemo } from "react"
import { User, Message, Reaction, MessageType } from '@/types'
import { useAuth } from "@/contexts/AuthContext"
import { useMessages } from "@/contexts/MessageContext"

export const useChat = () => {
    const { user: currentUser } = useAuth()
    const {
        messages,
        activeChatUser,
        setActiveChatUser,
        sendMessage,
        editMessage,
        deleteMessage,
        reactToMessage,
        loadMessages,
        markAsRead,
        isTyping,
        setIsTyping,
        onlineUsers
    } = useMessages()

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [replyTo, setReplyTo] = useState<Message | null>(null)

    const handleSendMessage = async (content: string, type: MessageType = MessageType.TEXT, fileName?: string) => {
        await sendMessage(content, type, fileName, replyTo?.id)
        setReplyTo(null)
    }

    const handleUserClick = async (clickedUser: User) => {
        setActiveChatUser(clickedUser)
        await loadMessages(clickedUser.id)
        setReplyTo(null)
    }

    const handleUserAvatarClick = (clickedUser: User) => {
        setSelectedUser(clickedUser)
        setShowUserInfo(true)
    }

    const handleCloseUserInfo = () => {
        setShowUserInfo(false)
    }

    const handleReplyMessage = (message: Message) => {
        setReplyTo(message)
    }

    const handleCancelReply = () => {
        setReplyTo(null)
    }

    const handleReactToMessage = (messageId: string, emoji: string) => {
        reactToMessage(messageId, emoji)
    }

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
        messages: filteredMessages, // Expose only relevant messages
        allMessages: messages,
        isLoadingMessages: false, // Could be pulled from context
        filteredMessages,
        handleSendMessage,
        handleUserClick,
        handleUserAvatarClick,
        handleCloseUserInfo,
        handleReplyMessage,
        handleCancelReply,
        handleReactToMessage,
        isTyping,
        setIsTyping,
        onlineUsers,
        setActiveChat: setActiveChatUser
    }
}