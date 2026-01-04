// Import dependencies
import type { User } from "./user"

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  FILE = "FILE",
  VIDEO = "VIDEO"
}

/**
 * Represents a direct message between users.
 */
export interface Message {
  id: number
  sender: User
  receiver: User
  content: string
  timestamp: string
  edited?: boolean
  type: MessageType
  replyTo?: Message
  fileName?: string
}

/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
  content: string
  receiverId: number
  senderId: number
  type: MessageType
  fileName?: string
  replyToId?: number
}

export interface EditMessageRequest{
  newMessage:string
  id:number
}

