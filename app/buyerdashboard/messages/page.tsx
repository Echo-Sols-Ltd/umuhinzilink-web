'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Search, Send, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isMe: boolean;
}

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample conversations data
  const [conversations, setConversations] = useState<Message[]>([
    {
      id: '1',
      sender: 'Jean de Dieu',
      avatar: '/avatars/jean.png',
      lastMessage: 'Hello, how can I help you today?',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: '2',
      sender: 'Marie Claire',
      avatar: '/avatars/marie.png',
      lastMessage: 'I received the order, thank you!',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: '3',
      sender: 'Alexis',
      avatar: '/avatars/alexis.png',
      lastMessage: 'When will the next harvest be ready?',
      time: '2 days ago',
      unread: false,
    },
  ]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      // Simulate loading messages for the active chat
      const chatMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'Jean de Dieu',
          avatar: '/avatars/jean.png',
          message: 'Hello, how can I help you today?',
          time: '10:30 AM',
          isMe: false,
        },
        {
          id: '2',
          sender: 'You',
          avatar: '',
          message: 'Hi! I have a question about my order',
          time: '10:31 AM',
          isMe: true,
        },
        {
          id: '3',
          sender: 'Jean de Dieu',
          avatar: '/avatars/jean.png',
          message: 'Sure, what would you like to know?',
          time: '10:32 AM',
          isMe: false,
        },
      ];
      setMessages(chatMessages);
    }
  }, [activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeChat) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        avatar: '',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(
    conv =>
      conv.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Messages</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Conversations list */}
          <div className="w-80 border-r">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  activeChat === conv.id ? 'bg-muted/30' : ''
                }`}
                onClick={() => setActiveChat(conv.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conv.avatar} />
                    <AvatarFallback>{conv.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conv.sender}</p>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <span className="h-2 w-2 rounded-full bg-green-600"></span>}
                </div>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={conversations.find(c => c.id === activeChat)?.avatar} />
                      <AvatarFallback>
                        {conversations.find(c => c.id === activeChat)?.sender.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {conversations.find(c => c.id === activeChat)?.sender}
                      </p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!msg.isMe && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.isMe
                            ? 'bg-green-600 text-white rounded-tr-none'
                            : 'bg-muted rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isMe ? 'text-green-100' : 'text-muted-foreground'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                      {msg.isMe && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select a conversation from the list or start a new one to begin messaging.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
