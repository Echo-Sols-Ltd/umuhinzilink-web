import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'
import { Message, SendMessageRequest, SocketResponse, EditMessageRequest, ChatReaction, ChatTyping, Order } from '@/types'
import { API_CONFIG, SOCKET_EVENTS } from './constants';
import { OrderChangeResponse, OrderDeliveryChange } from './websocket';
import { NegotiationMessage, NegotiationStatusUpdate } from '@/types';

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
    private orderStatusChangeListeners: ((data: SocketResponse<Order>) => void)[] = []
    private orderDeliveryChangeListeners: ((data: SocketResponse<Order>) => void)[] = []
    private orderNewListeners: ((data: SocketResponse<Order>) => void)[] = []
    private orderSatisfactionListeners: ((data: SocketResponse<Order>) => void)[] = []
    private negotiationMessageListeners: ((negotiationId: string, message: NegotiationMessage) => void)[] = []
    private negotiationStatusListeners: ((negotiationId: string, status: NegotiationStatusUpdate) => void)[] = []
    private connectionAttempts: number = 0
    private maxConnectionAttempts: number = 3
    private negotiationSubscriptions: Map<string, any> = new Map()

    // Queue for messages sent while disconnected
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
                    this.subscribeToPublic()
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
        // Unsubscribe from all negotiations
        for (const [negotiationId] of this.negotiationSubscriptions) {
            this.unsubscribeFromNegotiation(negotiationId)
        }
        
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
            this.stompClient.subscribe('/user/queue/messages', (msg) => this.handleMessage(msg))
            this.stompClient.subscribe('/user/queue/messageDeletion', (msg) => this.handleMessageDeletion(msg))
            this.stompClient.subscribe('/user/queue/messageEdition', (msg) => this.handleMessageEdition(msg))
            this.stompClient.subscribe('/user/queue/messageReaction', (msg) => this.handleReaction(msg))
            this.stompClient.subscribe('/user/queue/typing', (msg) => this.handleTyping(msg))
            this.stompClient.subscribe('/user/queue/orderStatusChange', (msg) => this.handleOrderStatusChange(msg))
            this.stompClient.subscribe('/user/queue/orderDeliveryChange', (msg) => this.handleOrderDeliveryChange(msg))
            this.stompClient.subscribe('/user/queue/newOrder', (msg) => this.handleNewOrder(msg))
            this.stompClient.subscribe('/user/queue/orderSatisfaction', (msg) => this.handleOrderSatisfaction(msg))
        } catch (error) {
            console.error('❌ Error subscribing to topics:', error)
        }
    }

    private handleNewOrder(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Order>
            // Only call listeners if data exists
            if (body.data) {
                this.orderNewListeners.forEach(cb => cb(body))
            } else {
                console.warn('New order received but no data provided', body)
            }

        } catch (error) {
            console.error('error parsing new order', error)
        }
    }

    private handleOrderStatusChange(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Order>
            // Only call listeners if data exists
            if (body.data) {
                this.orderStatusChangeListeners.forEach(cb => cb(body))
            } else {
                console.warn('Order status change received but no data provided', body)
            }
        } catch (error) {
            console.error('error parsing order status change', error)
        }
    }

    private handleOrderDeliveryChange(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Order>
            // Only call listeners if data exists
            if (body.data) {
                this.orderDeliveryChangeListeners.forEach(cb => cb(body))
            } else {
                console.warn('Order delivery change received but no data provided', body)
            }
        } catch (error) {
            console.error('error parsing order delivery change', error)
        }
    }

    private handleOrderSatisfaction(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Order>
            // Only call listeners if data exists
            if (body.data) {
                this.orderSatisfactionListeners.forEach(cb => cb(body))
            } else {
                console.warn('Order satisfaction received but no data provided', body)
            }
        } catch (error) {
            console.error('error parsing order satisfaction', error)
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

    private enqueueOrPublish(destination: string, body: string) {
        if (!this.stompClient.connected) {
            this.messageQueue.push({ destination, body })
            // Automatically try to connect if we aren't already
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
    public onNewOrder(callback: (data: SocketResponse<Order>) => void) {
        this.orderNewListeners.push(callback)
    }
    public removeNewOrderListener(callback: (data: SocketResponse<Order>) => void) {
        this.orderNewListeners = this.orderNewListeners.filter(cb => cb !== callback)
    }
    public onOrderStatusChange(callback: (data: SocketResponse<Order>) => void) {
        this.orderStatusChangeListeners.push(callback)
    }
    public removeOrderStatusChangeListener(callback: (data: SocketResponse<Order>) => void) {
        this.orderStatusChangeListeners = this.orderStatusChangeListeners.filter(cb => cb !== callback)
    }
    public onOrderDeliveryChange(callback: (data: SocketResponse<Order>) => void) {
        this.orderDeliveryChangeListeners.push(callback)
    }
    public removeOrderDeliveryChangeListener(callback: (data: SocketResponse<Order>) => void) {
        this.orderDeliveryChangeListeners = this.orderDeliveryChangeListeners.filter(cb => cb !== callback)
    }
    public onOrderSatisfaction(callback: (data: SocketResponse<Order>) => void) {
        this.orderSatisfactionListeners.push(callback)
    }
    public removeOrderSatisfactionListener(callback: (data: SocketResponse<Order>) => void) {
        this.orderSatisfactionListeners = this.orderSatisfactionListeners.filter(cb => cb !== callback)
    }

    public sendMessage(data: SendMessageRequest) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.SEND_MESSAGE, JSON.stringify(data))
    }

    public messageReply(data: SendMessageRequest) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.REPLY_MESSAGE, JSON.stringify(data))
    }

    public messageEdition(data: EditMessageRequest) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.EDIT_MESSAGE, JSON.stringify(data))
    }

    public messageDeletion(id: string) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.DELETE_MESSAGE, JSON.stringify(id))
    }

    public messageReact(data: ChatReaction) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.REACT_MESSAGE, JSON.stringify(data))
    }

    public sendTyping(data: ChatTyping) {
        this.enqueueOrPublish(SOCKET_EVENTS.MESSAGE.TYPING, JSON.stringify(data))
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

    public onMessage(callback: (message: Message) => void) {
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

    // Negotiation methods
    public subscribeToNegotiation(negotiationId: string) {
        if (!this.stompClient.connected) {
            console.warn('Cannot subscribe to negotiation: WebSocket not connected')
            return
        }

        // Unsubscribe from existing negotiation if any
        this.unsubscribeFromNegotiation(negotiationId)

        try {
            // Subscribe to negotiation messages
            const messageSub = this.stompClient.subscribe(
                SOCKET_EVENTS.NEGOTIATION.SUBSCRIBE_MESSAGE.replace('{negotiationId}', negotiationId),
                (msg) => this.handleNegotiationMessage(negotiationId, msg)
            )

            // Subscribe to negotiation status updates
            const statusSub = this.stompClient.subscribe(
                SOCKET_EVENTS.NEGOTIATION.SUBSCRIBE_STATUS,
                (msg) => this.handleNegotiationStatus(negotiationId, msg)
            )

            this.negotiationSubscriptions.set(negotiationId, {
                message: messageSub,
                status: statusSub
            })

            console.log(`Subscribed to negotiation: ${negotiationId}`)
        } catch (error) {
            console.error('Failed to subscribe to negotiation:', error)
        }
    }

    public unsubscribeFromNegotiation(negotiationId: string) {
        const subscriptions = this.negotiationSubscriptions.get(negotiationId)
        if (subscriptions) {
            try {
                subscriptions.message?.unsubscribe()
                subscriptions.status?.unsubscribe()
                this.negotiationSubscriptions.delete(negotiationId)
                console.log(`Unsubscribed from negotiation: ${negotiationId}`)
            } catch (error) {
                console.error('Failed to unsubscribe from negotiation:', error)
            }
        }
    }

    public sendNegotiationMessage(negotiationId: string, message: NegotiationMessage) {
        const destination = SOCKET_EVENTS.NEGOTIATION.SEND_MESSAGE.replace('{negotiationId}', negotiationId)
        this.enqueueOrPublish(destination, JSON.stringify(message))
    }

    public sendNegotiationStatusUpdate(negotiationId: string, status: NegotiationStatusUpdate) {
        const destination = SOCKET_EVENTS.NEGOTIATION.STATUS_UPDATE.replace('{negotiationId}', negotiationId)
        this.enqueueOrPublish(destination, JSON.stringify(status))
    }

    public onNegotiationMessage(callback: (negotiationId: string, message: NegotiationMessage) => void) {
        this.negotiationMessageListeners.push(callback)
    }

    public removeNegotiationMessageListener(callback: (negotiationId: string, message: NegotiationMessage) => void) {
        this.negotiationMessageListeners = this.negotiationMessageListeners.filter(cb => cb !== callback)
    }

    public onNegotiationStatus(callback: (negotiationId: string, status: NegotiationStatusUpdate) => void) {
        this.negotiationStatusListeners.push(callback)
    }

    public removeNegotiationStatusListener(callback: (negotiationId: string, status: NegotiationStatusUpdate) => void) {
        this.negotiationStatusListeners = this.negotiationStatusListeners.filter(cb => cb !== callback)
    }

    private handleNegotiationMessage(negotiationId: string, message: IMessage) {
        try {
            const body = JSON.parse(message.body) as NegotiationMessage
            this.negotiationMessageListeners.forEach(cb => cb(negotiationId, body))
        } catch (error) {
            console.error('Failed to parse negotiation message:', error)
        }
    }

    private handleNegotiationStatus(negotiationId: string, message: IMessage) {
        try {
            const body = JSON.parse(message.body) as NegotiationStatusUpdate
            this.negotiationStatusListeners.forEach(cb => cb(negotiationId, body))
        } catch (error) {
            console.error('Failed to parse negotiation status:', error)
        }
    }
}

export const socketService = new SocketService()