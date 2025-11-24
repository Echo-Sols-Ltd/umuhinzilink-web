export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  read: boolean;
}

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
