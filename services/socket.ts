import SockJS from 'sockjs-client'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import { SocketResponse, ChatTyping, Order, NegotiationMessage, NegotiationMessageRequest, Notification } from '@/types'
import { API_CONFIG, SOCKET_EVENTS } from './constants'

class SocketService {
    public stompClient: Client
    private subscriptions: StompSubscription[] = []
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
    private maxConnectionAttempts: number = 5
    private messageQueue: { destination: string; body: string }[] = []

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => {
                const token = localStorage.getItem('auth_token')
                if (!token) {
                    throw new Error('Missing access token')
                }
                const wsUrl = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/ws?token=${encodeURIComponent(token)}`
                return new SockJS(wsUrl, null, {
                    transports: ['websocket', 'xhr-polling', 'eventsource'],
                    timeout: 10000,
                })
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
                    const message = frame.headers['message'] ?? ''
                    const body = frame.body ?? ''
                    if (
                        message.includes('Unauthorized') ||
                        body.includes('401') ||
                        message.toLowerCase().includes('token')
                    ) {
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(new Error(`STOMP error: ${message}`))
                    }
                } catch (error) {
                    console.error('Error handling STOMP error:', error)
                }
            },
            onWebSocketError: (error) => {
                try {
                    const detail = typeof error === 'string'
                        ? error
                        : error instanceof Error
                            ? error.message
                            : ''
                    if (detail.includes('401') || detail.includes('Unauthorized')) {
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(error instanceof Error ? error : new Error('WebSocket error'))
                    }
                } catch (err) {
                    console.error('Error handling WebSocket error:', err)
                }
            },
        })
    }

    private async handleUnauthorized() {
        try {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                this.notifySessionExpired()
                return
            }
            this.connectionAttempts++
            const refreshToken = localStorage.getItem('refresh_token')
            if (!refreshToken) {
                this.notifySessionExpired()
                return
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            })

            if (response.ok) {
                const payload = await response.json()
                const tokens = payload?.data
                if (tokens?.token) {
                    localStorage.setItem('auth_token', tokens.token)
                    if (tokens.refreshToken) {
                        localStorage.setItem('refresh_token', tokens.refreshToken)
                    }
                    if (tokens.user) {
                        localStorage.setItem('user', JSON.stringify(tokens.user))
                    }
                    this.unsubscribeAll()
                    await this.stompClient.deactivate()
                    this.stompClient.activate()
                    this.connectionAttempts = 0
                } else {
                    this.notifySessionExpired()
                }
            } else {
                this.notifySessionExpired()
            }
        } catch (error) {
            console.error('Failed to refresh token:', error)
            this.notifySessionExpired()
        }
    }

    private handleConnectionError(error: Error) {
        try {
            console.warn('WebSocket connection issue:', error.message)
            if (this.connectionAttempts < this.maxConnectionAttempts) {
                this.connectionAttempts++
            }
        } catch (err) {
            console.error('Error in connection error handler:', err)
        }
    }

    private notifySessionExpired() {
        this.logoutListeners.forEach((cb) => {
            try {
                cb()
            } catch (e) {
                console.error('Socket logout listener error:', e)
            }
        })
    }

    public async logout() {
        try {
            this.unsubscribeAll()
            this.messageQueue = []
            await this.stompClient.deactivate()
            this.onlineUsers = new Set()
            this.onlineUserListeners.forEach((cb) => cb(new Set()))
        } catch (error) {
            console.error('Error during socket disconnect:', error)
        }
    }

    public onLogout(callback: () => void) {
        this.logoutListeners.push(callback)
    }

    public removeLogoutListener(callback: () => void) {
        this.logoutListeners = this.logoutListeners.filter((cb) => cb !== callback)
    }

    public connect() {
        if (!localStorage.getItem('auth_token')) {
            return
        }
        if (!this.stompClient.active) {
            this.stompClient.activate()
        }
    }

    public async disconnect() {
        this.messageQueue = []
        this.unsubscribeAll()
        await this.stompClient.deactivate()
        this.onlineUsers = new Set()
        this.onlineUserListeners.forEach((cb) => cb(new Set()))
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false
    }

    private unsubscribeAll() {
        this.subscriptions.forEach((sub) => {
            try {
                sub.unsubscribe()
            } catch {
                // ignore stale subscription errors
            }
        })
        this.subscriptions = []
    }

    private subscribeToQueues() {
        try {
            this.unsubscribeAll()

            this.subscriptions.push(
                this.stompClient.subscribe('/topic/onlineUsers', (msg) => this.handleOnlineUsers(msg)),
                this.stompClient.subscribe('/user/queue/typing', (msg) => this.handleTyping(msg)),
                this.stompClient.subscribe('/user/queue/negotiation', (msg) => this.handleNegotiationMessage(msg)),
                this.stompClient.subscribe('/user/queue/notifications', (msg) => this.handleNotification(msg)),
                this.stompClient.subscribe('/user/queue/orders', (msg) => this.handleOrderUpdate(msg)),
                this.stompClient.subscribe('/user/queue/errors', (msg) => this.handleSocketError(msg)),
            )
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
            this.negotiationMessageListeners.forEach((cb) => cb(body.data!))
        }
    }

    private handleNotification(message: IMessage) {
        const body = this.parseBody<Notification>(message)
        if (body?.data) {
            const notification = { ...body.data, id: String(body.data.id) }
            this.notificationListeners.forEach((cb) => cb(notification, body.message || notification.title))
        }
    }

    private handleOrderUpdate(message: IMessage) {
        const body = this.parseBody<Order>(message)
        if (body) {
            this.orderListeners.forEach((cb) => cb(body))
        }
    }

    private handleSocketError(message: IMessage) {
        const body = this.parseBody<unknown>(message)
        const errorMessage = body?.message || 'Something went wrong'
        this.errorListeners.forEach((cb) => cb(errorMessage))
    }

    public sendNegotiationMessage(message: NegotiationMessageRequest) {
        this.enqueueOrPublish(SOCKET_EVENTS.NEGOTIATION_MESSAGE.SEND(message.negotiationId), JSON.stringify(message))
    }

    public sendTyping(negotiationId: string, typing: boolean) {
        this.enqueueOrPublish(
            `/app/negotiation/${negotiationId}/typing`,
            JSON.stringify({ isTyping: typing }),
        )
    }

    private handleOnlineUsers(message: IMessage) {
        try {
            const parsed = JSON.parse(message.body) as string[] | Record<string, string>
            const userIds = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {})
            const users = new Set<string>(userIds.filter(Boolean))
            this.onlineUsers = users
            this.onlineUserListeners.forEach((cb) => cb(users))
        } catch (error) {
            console.error('Failed to parse online users:', error)
        }
    }

    private handleTyping(message: IMessage) {
        const body = this.parseBody<ChatTyping>(message)
        if (body?.data) {
            this.typingListeners.forEach((cb) => cb(body.data!))
        }
    }

    private enqueueOrPublish(destination: string, body: string) {
        if (!this.stompClient.connected) {
            this.messageQueue.push({ destination, body })
            if (localStorage.getItem('auth_token')) {
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
        return () => { this.onlineUserListeners = this.onlineUserListeners.filter((cb) => cb !== callback) }
    }

    public onNegotiationMessage(callback: (message: NegotiationMessage) => void) {
        this.negotiationMessageListeners.push(callback)
        return () => { this.negotiationMessageListeners = this.negotiationMessageListeners.filter((cb) => cb !== callback) }
    }

    public onNotification(callback: (notification: Notification, message: string) => void) {
        this.notificationListeners.push(callback)
        return () => { this.notificationListeners = this.notificationListeners.filter((cb) => cb !== callback) }
    }

    public onOrderUpdate(callback: (response: SocketResponse<Order>) => void) {
        this.orderListeners.push(callback)
        return () => { this.orderListeners = this.orderListeners.filter((cb) => cb !== callback) }
    }

    public onSocketError(callback: (message: string) => void) {
        this.errorListeners.push(callback)
        return () => { this.errorListeners = this.errorListeners.filter((cb) => cb !== callback) }
    }

    public onMessageDeletion(callback: (id: string) => void) {
        this.messageDeletionListeners.push(callback)
        return () => { this.messageDeletionListeners = this.messageDeletionListeners.filter((cb) => cb !== callback) }
    }

    public onTyping(callback: (typing: ChatTyping) => void) {
        this.typingListeners.push(callback)
        return () => { this.typingListeners = this.typingListeners.filter((cb) => cb !== callback) }
    }

    /** @deprecated use unsubscribe return from on* methods */
    public removeNegotiationMessageListener(callback: (message: NegotiationMessage) => void) {
        this.negotiationMessageListeners = this.negotiationMessageListeners.filter((cb) => cb !== callback)
    }

    public removeOnlineUsersListener(callback: (users: Set<string>) => void) {
        this.onlineUserListeners = this.onlineUserListeners.filter((cb) => cb !== callback)
    }

    public removeTypingListener(callback: (typing: ChatTyping) => void) {
        this.typingListeners = this.typingListeners.filter((cb) => cb !== callback)
    }
}

export const socketService = new SocketService()
