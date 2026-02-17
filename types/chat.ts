import { User } from './user';
import { Message, MessageType } from './message';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  online: boolean;
}
