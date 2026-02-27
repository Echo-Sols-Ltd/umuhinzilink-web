import { Message } from './message';





export interface ChatUser {
  id: string;
  names: string;
  email: string;
  avatar: string;
  unreadMessage: number;
  totalMessage: number;
  lastMessage: Message;
}
