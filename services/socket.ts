import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'
import { Message, SendMessageRequest, SocketResponse, EditMessageRequest, ChatReaction, ChatTyping } from '@/types'
import { API_CONFIG, SOCKET_EVENTS } from './constants';

class SocketService {
    public stompClient: Client
    private onlineUsers: Set<string> = new Set()
    private onlineUserListeners: ((users: Set<string>) => void)[] = []
    private messageListeners: ((message: Message) => void)[] = []
    private reactionListeners: ((reaction: ChatReaction) => void)[] = []
    private messageDeletionListeners: ((id: string) => void)[] = []
    private messageEditionListeners: ((message: Message) => void)[] = []
    private typingListeners: ((typing: ChatTyping) => void)[] = []
    private logoutListeners: (() => void)[] = []
    private connectionAttempts: number = 0
    private maxConnectionAttempts: number = 3

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => {
                try {
                    const token = localStorage.getItem("auth_token")
                    if (!token) {
                        this.logout()
                        throw new Error('Missing access token')
                    }
                    const wsUrl = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/ws?token=${encodeURIComponent(token)}`
                    return new SockJS(wsUrl, null, {
                        transports: ['websocket', 'xhr-polling', 'eventsource'],
                        timeout: 10000,
                    })
                } catch (error) {
                    console.error('Failed to initialize WebSocket factory:', error)
                    this.logout()
                    throw error
                }
            },
            reconnectDelay: 3000,
            onConnect: () => {
                try {
                    this.connectionAttempts = 0
                    this.subscribeToPublic()
                } catch (error) {
                    console.error('Error in onConnect handler:', error)
                }
            },
            onStompError: (frame) => {
                try {
                    if (
                        frame.headers['message']?.includes('Unauthorized') ||
                        frame.body?.includes('401') ||
                        frame.headers['message']?.includes('token')
                    ) {
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(new Error(`STOMP error: ${frame.headers['message']}`))
                    }
                } catch (error) {
                    console.error('Error handling STOMP error:', error)
                }
            },
            onWebSocketError: (error) => {
                try {
                    if (error?.includes('401') || error?.includes('Unauthorized')) {
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(error)
                    }
                } catch (err) {
                    console.error('Error handling WebSocket error:', err)
                }
            }
        })
    }

    private async handleUnauthorized() {
        try {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                this.logout()
                return
            }
            this.connectionAttempts++
            const refreshToken = localStorage.getItem("refresh_token")
            if (!refreshToken) throw new Error('No refresh token available')

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem("auth_token", data.accessToken)
                await this.stompClient.deactivate()
                this.stompClient.activate()
                this.connectionAttempts = 0
            } else {
                throw new Error('Refresh token invalid or expired')
            }
        } catch (error) {
            console.error('Failed to refresh token:', error)
            this.logout()
        }
    }

    private handleConnectionError(error: Error) {
        try {
            if (this.connectionAttempts < this.maxConnectionAttempts) {
                this.connectionAttempts++
                setTimeout(() => {
                    this.stompClient.activate()
                }, 2000 * this.connectionAttempts)
            } else {
                this.logout()
            }
        } catch (err) {
            console.error('Error in connection error handler:', err)
            this.logout()
        }
    }

    public async logout() {
        try {
            localStorage.clear()
            await this.stompClient.deactivate()
            this.onlineUsers = new Set()
            this.onlineUserListeners.forEach(cb => cb(new Set()))
            this.logoutListeners.forEach(cb => cb())
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    public onLogout(callback: () => void) {
        this.logoutListeners.push(callback)
    }

    public removeLogoutListener(callback: () => void) {
        this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback)
    }

    public connect() {
        if (!localStorage.getItem("auth_token")) {
            this.logout()
            return
        }
        this.stompClient.activate()
    }

    public async disconnect() {
        await this.stompClient.deactivate()
        this.onlineUsers = new Set()
        this.onlineUserListeners.forEach(cb => cb(new Set()))
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false
    }

    private subscribeToPublic() {
        try {
            this.stompClient.subscribe('/topic/onlineUsers', (msg) => this.handleOnlineUsers(msg))
            this.stompClient.subscribe('/topic/messages', (msg) => this.handleMessage(msg))
            this.stompClient.subscribe('/topic/messageDeletion', (msg) => this.handleMessageDeletion(msg))
            this.stompClient.subscribe('/topic/messageEdition', (msg) => this.handleMessageEdition(msg))
            this.stompClient.subscribe('/topic/messageReaction', (msg) => this.handleReaction(msg))
            this.stompClient.subscribe('/topic/typing', (msg) => this.handleTyping(msg))
        } catch (error) {
            console.error('❌ Error subscribing to topics:', error)
        }
    }

    private handleMessageDeletion(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<string>
            this.messageDeletionListeners.forEach(cb => cb(body.data!))
        } catch (error) {
            console.error('error parsing deleted message', error)
        }
    }

    private handleMessageEdition(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageEditionListeners.forEach(cb => cb(body.data!))
        } catch (error) {
            console.error('error parsing edited message', error)
        }
    }

    private handleMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageListeners.forEach(cb => cb(body.data!))
        } catch (error) {
            console.error('Failed to parse message:', error)
        }
    }

    private handleReaction(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<ChatReaction>
            this.reactionListeners.forEach(cb => cb(body.data!))
        } catch (error) {
            console.error('Failed to parse reaction:', error)
        }
    }

    private handleOnlineUsers(message: IMessage) {
        try {
            const userIds = JSON.parse(message.body) as string[]
            const users = new Set<string>(userIds)
            this.onlineUsers = users
            this.onlineUserListeners.forEach(cb => cb(users))
        } catch (error) {
            console.error('Failed to parse online users:', error)
        }
    }

    private handleTyping(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<ChatTyping>
            this.typingListeners.forEach(cb => cb(body.data!))
        } catch (error) {
            console.error('Failed to parse typing:', error)
        }
    }

    public sendMessage(data: SendMessageRequest) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.SEND_MESSAGE,
            body: JSON.stringify(data),
        })
    }

    public messageReply(data: SendMessageRequest) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.REPLY_MESSAGE,
            body: JSON.stringify(data),
        })
    }

    public messageEdition(data: EditMessageRequest) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.EDIT_MESSAGE,
            body: JSON.stringify(data)
        })
    }

    public messageDeletion(id: string) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.DELETE_MESSAGE,
            body: JSON.stringify(id)
        })
    }

    public messageReact(data: ChatReaction) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.REACT_MESSAGE,
            body: JSON.stringify(data)
        })
    }

    public sendTyping(data: ChatTyping) {
        if (!this.stompClient.connected) return
        this.stompClient.publish({
            destination: SOCKET_EVENTS.MESSAGE.TYPING,
            body: JSON.stringify(data)
        })
    }

    public getOnlineUsers() {
        return this.onlineUsers
    }

    public onOnlineUsersChange(callback: (users: Set<string>) => void) {
        this.onlineUserListeners.push(callback)
    }

    public removeOnlineUsersListener(callback: (users: Set<string>) => void) {
        this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback)
    }

    public onMessage(callback: (message: Message) => void)   {
        this.messageListeners.push(callback)
    }

    public removeMessageListener(callback: (message: Message) => void) {
        this.messageListeners = this.messageListeners.filter(cb => cb !== callback)
    }

    public onReaction(callback: (reaction: ChatReaction) => void) {
        this.reactionListeners.push(callback)
    }

    public removeReactionListener(callback: (reaction: ChatReaction) => void) {
        this.reactionListeners = this.reactionListeners.filter(cb => cb !== callback)
    }

    public onMessageDeletion(callback: (id: string) => void) {
        this.messageDeletionListeners.push(callback)
    }

    public removeMessageDeletionListener(callback: (id: string) => void) {
        this.messageDeletionListeners = this.messageDeletionListeners.filter(cb => cb !== callback)
    }

    public onMessageEdition(callback: (message: Message) => void) {
        this.messageEditionListeners.push(callback)
    }

    public removeMessageEditionListener(callback: (message: Message) => void) {
        this.messageEditionListeners = this.messageEditionListeners.filter(cb => cb !== callback)
    }

    public onTyping(callback: (typing: ChatTyping) => void) {
        this.typingListeners.push(callback)
    }

    public removeTypingListener(callback: (typing: ChatTyping) => void) {
        this.typingListeners = this.typingListeners.filter(cb => cb !== callback)
    }
}

export const socketService = new SocketService()