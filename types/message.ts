// Import dependencies
import { Negotiation } from ".";
import type { User } from "./user"

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  FILE = "FILE",
  VIDEO = "VIDEO",
  PRODUCT = "PRODUCT"
}

/**
 * Represents a direct message between users.
 */
export interface NegotiationMessage {
  id: string;
  negotiation: Negotiation;
  sender: User;
  content: string;
  type: MessageType; // TEXT, IMAGE, OFFER
  fileName: string;
  replyTo: NegotiationMessage;
  isRead: boolean;
  createdAt: string;
}

/**
 * Request payload for sending a direct message.
 */
export interface NegotiationMessageRequest {
  negotiationId: string;
  content: string;
  type: MessageType;
}

export interface ChatTyping {
  negotiationId?: string;
  userId: string;
  receiverId: string;
  typing: boolean;
}
