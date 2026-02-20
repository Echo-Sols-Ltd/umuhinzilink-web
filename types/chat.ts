import { Message } from './message';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}



export interface ChatUser {
  id: string;
  names: string;
  email: string;
  avatar: string;
  unreadMessage: number;
  totalMessage: number;
  lastMessage: Message;
}
