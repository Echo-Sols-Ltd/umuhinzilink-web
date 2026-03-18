import { Message } from './message';

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string
  email: string;
  avatar: string;
  unreadMessage: number;
  totalMessage: number;
  lastMessage: Message;
}
