import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'
import { Message, SendMessageRequest, SocketResponse, EditMessageRequest } from '@/types'
import { API_CONFIG, SOCKET_EVENTS } from './constants';

class SocketService {
    public stompClient: Client
    private onlineUsers: Set<number> = new Set()
    private onlineUserListeners: ((users: Set<number>) => void)[] = []
    private messageListeners: ((message: Message) => void)[] = []
    private reactionListeners: ((message: Message) => void)[] = []
    private messageDeletionListeners: ((id: number) => void)[] = []
    private messageEditionListeners: ((message: Message) => void)[] = []
    private logoutListeners: (() => void)[] = []
    private connectionAttempts: number = 0
    private maxConnectionAttempts: number = 3

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => {
                try {
                    const token = localStorage.getItem("access_token")
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
                    throw error // Prevent client activation
                }
            },
            reconnectDelay: 3000,
            onConnect: () => {
                try {
                    this.connectionAttempts = 0 // Reset attempts
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
                        console.warn('Unauthorized error detected, attempting token refresh')
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
                        console.warn('WebSocket 401 error, attempting token refresh')
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
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem("access_token", data.accessToken)
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
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Set())
                } catch (error) {
                    console.error('Error in online users callback:', error)
                }
            })
            this.logoutListeners.forEach((callback) => {
                try {
                    callback()
                } catch (error) {
                    console.error('Error in logout callback:', error)
                }
            })
        } catch (error) {
            console.error('Error during logout:', error)
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback()
                } catch (error) {
                    console.error('Error in final logout callback:', error)
                }
            })
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback)
        } catch (error) {
            console.error('Error adding logout listener:', error)
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing logout listener:', error)
        }
    }

    public connect() {
        try {
            const token = localStorage.getItem("access_token")
            if (!token) {
                this.logout()
                return
            }
            this.stompClient.activate()
        } catch (error) {
            console.error('Error connecting to WebSocket:', error)
            this.handleConnectionError(error as Error)
        }
    }

    public async disconnect() {
        try {
            await this.stompClient.deactivate()
            this.onlineUsers = new Set()
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Set())
                } catch (error) {
                    console.error('Error in online users callback:', error)
                }
            })
        } catch (error) {
            console.error('Error disconnecting WebSocket:', error)
        }
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false
    }

    private subscribeToPublic() {
        try {
            this.stompClient.subscribe('/topic/onlineUsers', (message) => this.handleOnlineUsers(message))
            this.stompClient.subscribe('/topic/messages', (message) => this.handleMessage(message))
            this.stompClient.subscribe('/topic/messageDeletion', (message) => this.handleMessageDeletion(message))
            this.stompClient.subscribe('/topic/messageEdition', (message) => this.handleMessageEdition(message))
        } catch (error) {
            console.error('❌ Error subscribing to public topics:', error)
        }
    }

    private handleMessageDeletion(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<number>

            this.messageDeletionListeners.forEach((callback) => {
                callback(body.data!)
            })
        } catch (error) {
            console.error('error receiving deleted message', error)
        }
    }

    private handleMessageEdition(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageEditionListeners.forEach((callback) => {
                callback(body.data!)
            })
        } catch (error) {
            console.error('error receiving edited message', error)
        }
    }

    private handleMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageListeners.forEach((callback) => {
                try {
                    callback(body.data!)
                } catch (error) {
                    console.error('Error in message callback:', error)
                }
            })
        } catch (error) {
            console.error('Failed to parse message:', error)
        }
    }

    private handleOnlineUsers(message: IMessage) {
        try {
            const userIds = JSON.parse(message.body) as number[]
            const users = new Set<number>(userIds)
            this.onlineUsers = users
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(users)
                } catch (error) {
                    console.error('Error in online users callback:', error)
                }
            })
        } catch (error) {
            console.error('Failed to parse online user IDs:', error)
        }
    }

    public sendMessage(data: SendMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.SEND_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    public messageReply(data: SendMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.REPLY_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending message:', error)

        }
    }

    public messageEdition(data: EditMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot edit message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.EDIT_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error editing message: ', error)
        }
    }

    public messageDeletion(data: number) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot edit message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.DELETE_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error editing message: ', error)
        }
    }

    public getOnlineUsers() {
        try {
            return this.onlineUsers
        } catch (error) {
            console.error('Error getting online users:', error)
            return new Set()
        }
    }

    public onOnlineUsersChange(callback: (users: Set<number>) => void) {
        try {
            this.onlineUserListeners.push(callback)
        } catch (error) {
            console.error('Error adding online users listener:', error)
        }
    }

    public removeOnlineUsersListener(callback: (users: Set<number>) => void) {
        try {
            this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing online users listener:', error)
        }
    }

    public onMessage(callback: (message: Message) => void) {
        try {
            this.messageListeners.push(callback)
        } catch (error) {
            console.error('Error adding message listener:', error)
        }
    }

    public removeMessageListener(callback: (message: Message) => void) {
        try {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing message listener:', error)
        }
    }

    public onReaction(callback: (message: Message) => void) {
        try {
            this.reactionListeners.push(callback)
        } catch (error) {
            console.error('Error adding reaction listener:', error)
        }
    }

    public removeReactionListener(callback: (message: Message) => void) {
        try {
            this.reactionListeners = this.reactionListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing reaction listener:', error)
        }
    }

    public onMessageDeletion(callBack: (id: number) => void) {
        try {
            this.messageDeletionListeners.push(callBack)
        } catch (error) {
            console.error('Error adding message deletion: ', error)
        }
    }

    public removeMessageDeletionListener(callBack: (id: number) => void) {
        try {
            this.messageDeletionListeners = this.messageDeletionListeners.filter(cb => cb !== callBack)
        } catch (error) {
            console.error('Error removing message deletion listener:', error)
        }
    }


    public onMessageEdition(callBack: (message: Message) => void) {
        try {
            this.messageEditionListeners.push(callBack)
        } catch (error) {
            console.error('Error adding message edition: ', error)
        }
    }

    public removeMessageEditionListener(callBack: (message: Message) => void) {
        try {
            this.messageEditionListeners = this.messageEditionListeners.filter(cb => cb !== callBack)
        } catch (error) {
            console.error('Error removing message edition listener:', error)
        }
    }


}

export const socketService = new SocketService()