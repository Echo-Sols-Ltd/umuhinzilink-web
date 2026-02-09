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
  id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  isEdited?: boolean;
  isRead?: boolean;
  type: MessageType;
  replyTo?: Message;
  fileName?: string;
  reactions?: Reaction[];
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface ChatReaction {
  messageId: string;
  reactions: Reaction[];
}

/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
  content: string;
  receiverId:string;
  senderId: string;
  type: MessageType;
  fileName?: string;
  replyToId?: string;
}

export interface EditMessageRequest {
  newMessage: string;
  id: string;
}
export interface ChatTyping {
  userId: string;
  receiverId: string;
  isTyping: boolean;
}
