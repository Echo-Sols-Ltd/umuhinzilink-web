import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'
import { SocketResponse, ChatTyping, Order, NegotiationMessage, NegotiationMessageRequest, Notification } from '@/types'
import { API_CONFIG, SOCKET_EVENTS } from './constants'

class SocketService {
    public stompClient: Client
    private onlineUsers: Set<string> = new Set()
    private onlineUserListeners: ((users: Set<string>) => void)[] = []
    private messageDeletionListeners: ((id: string) => void)[] = []
    private negotiationMessageListeners: ((message: NegotiationMessage) => void)[] = []
    private notificationListeners: ((notification: Notification, message: string) => void)[] = []
    private orderListeners: ((response: SocketResponse<Order>) => void)[] = []
    private errorListeners: ((message: string) => void)[] = []
    private typingListeners: ((typing: ChatTyping) => void)[] = []
    private logoutListeners: (() => void)[] = []
    private connectionAttempts: number = 0
    private maxConnectionAttempts: number = 3
    private messageQueue: { destination: string; body: string }[] = []

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
                    this.subscribeToQueues()
                    this.flushMessageQueue()
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
                const payload = await response.json()
                const tokens = payload?.data
                if (tokens?.token) {
                    localStorage.setItem("auth_token", tokens.token)
                    if (tokens.refreshToken) {
                        localStorage.setItem("refresh_token", tokens.refreshToken)
                    }
                    if (tokens.user) {
                        localStorage.setItem("user", JSON.stringify(tokens.user))
                    }
                    await this.stompClient.deactivate()
                    this.stompClient.activate()
                    this.connectionAttempts = 0
                } else {
                    throw new Error('Refresh token invalid or expired')
                }
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
        if (!this.stompClient.active) {
            this.stompClient.activate()
        }
    }

    public async disconnect() {
        await this.stompClient.deactivate()
        this.onlineUsers = new Set()
        this.onlineUserListeners.forEach(cb => cb(new Set()))
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false
    }

    private subscribeToQueues() {
        try {
            this.stompClient.subscribe('/topic/onlineUsers', (msg) => this.handleOnlineUsers(msg))
            this.stompClient.subscribe('/user/queue/typing', (msg) => this.handleTyping(msg))
            this.stompClient.subscribe('/user/queue/negotiation', (msg) => this.handleNegotiationMessage(msg))
            this.stompClient.subscribe('/user/queue/notifications', (msg) => this.handleNotification(msg))
            this.stompClient.subscribe('/user/queue/orders', (msg) => this.handleOrderUpdate(msg))
            this.stompClient.subscribe('/user/queue/errors', (msg) => this.handleSocketError(msg))
        } catch (error) {
            console.error('Error subscribing to queues:', error)
        }
    }

    private parseBody<T>(message: IMessage): SocketResponse<T> | null {
        try {
            return JSON.parse(message.body) as SocketResponse<T>
        } catch (error) {
            console.error('Failed to parse socket message:', error)
            return null
        }
    }

    private handleNegotiationMessage(message: IMessage) {
        const body = this.parseBody<NegotiationMessage>(message)
        if (body?.data) {
            this.negotiationMessageListeners.forEach(cb => cb(body.data!))
        }
    }

    private handleNotification(message: IMessage) {
        const body = this.parseBody<Notification>(message)
        if (body?.data) {
            const notification = { ...body.data, id: String(body.data.id) }
            this.notificationListeners.forEach(cb => cb(notification, body.message || notification.title))
        }
    }

    private handleOrderUpdate(message: IMessage) {
        const body = this.parseBody<Order>(message)
        if (body) {
            this.orderListeners.forEach(cb => cb(body))
        }
    }

    private handleSocketError(message: IMessage) {
        const body = this.parseBody<unknown>(message)
        const errorMessage = body?.message || 'Something went wrong'
        this.errorListeners.forEach(cb => cb(errorMessage))
    }

    public sendNegotiationMessage(message: NegotiationMessageRequest) {
        this.enqueueOrPublish(SOCKET_EVENTS.NEGOTIATION_MESSAGE.SEND(message.negotiationId), JSON.stringify(message))
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
        const body = this.parseBody<ChatTyping>(message)
        if (body?.data) {
            this.typingListeners.forEach(cb => cb(body.data!))
        }
    }

    private enqueueOrPublish(destination: string, body: string) {
        if (!this.stompClient.connected) {
            this.messageQueue.push({ destination, body })
            if (localStorage.getItem("auth_token")) {
                this.connect()
            }
            return
        }
        this.stompClient.publish({ destination, body })
    }

    private flushMessageQueue() {
        if (!this.stompClient.connected) return
        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift()
            if (msg) {
                this.stompClient.publish(msg)
            }
        }
    }

    public getOnlineUsers() {
        return this.onlineUsers
    }

    public onOnlineUsersChange(callback: (users: Set<string>) => void) {
        this.onlineUserListeners.push(callback)
        return () => { this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback) }
    }

    public onNegotiationMessage(callback: (message: NegotiationMessage) => void) {
        this.negotiationMessageListeners.push(callback)
        return () => { this.negotiationMessageListeners = this.negotiationMessageListeners.filter(cb => cb !== callback) }
    }

    public onNotification(callback: (notification: Notification, message: string) => void) {
        this.notificationListeners.push(callback)
        return () => { this.notificationListeners = this.notificationListeners.filter(cb => cb !== callback) }
    }

    public onOrderUpdate(callback: (response: SocketResponse<Order>) => void) {
        this.orderListeners.push(callback)
        return () => { this.orderListeners = this.orderListeners.filter(cb => cb !== callback) }
    }

    public onSocketError(callback: (message: string) => void) {
        this.errorListeners.push(callback)
        return () => { this.errorListeners = this.errorListeners.filter(cb => cb !== callback) }
    }

    public onMessageDeletion(callback: (id: string) => void) {
        this.messageDeletionListeners.push(callback)
        return () => { this.messageDeletionListeners = this.messageDeletionListeners.filter(cb => cb !== callback) }
    }

    public onTyping(callback: (typing: ChatTyping) => void) {
        this.typingListeners.push(callback)
        return () => { this.typingListeners = this.typingListeners.filter(cb => cb !== callback) }
    }

    /** @deprecated use unsubscribe return from on* methods */
    public removeNegotiationMessageListener(callback: (message: NegotiationMessage) => void) {
        this.negotiationMessageListeners = this.negotiationMessageListeners.filter(cb => cb !== callback)
    }

    public removeOnlineUsersListener(callback: (users: Set<string>) => void) {
        this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback)
    }

    public removeTypingListener(callback: (typing: ChatTyping) => void) {
        this.typingListeners = this.typingListeners.filter(cb => cb !== callback)
    }
}

export const socketService = new SocketService()
