'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Reply, 
  Check, 
  CheckCheck,
  Clock,
  X,
  Image as ImageIcon,
  File,
  Download
} from 'lucide-react';
import Image from 'next/image';
import { Message, MessageType } from '@/types/message';
import { User } from '@/types/user';
import { useMessages } from '@/contexts/MessageContext';
import { cn } from '@/lib/utils';

export interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const {
    activeConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    onlineUsers,
    isTyping,
    setIsTyping
  } = useMessages();

  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;
    
    try {
      let messageType = MessageType.TEXT;
      let fileName: string | undefined;
      
      if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
          messageType = MessageType.IMAGE;
        } else {
          messageType = MessageType.FILE;
        }
        fileName = selectedFile.name;
        // TODO: Upload file and get URL
      }
      
      await sendMessage(
        messageText.trim() || fileName || '',
        messageType,
        fileName,
        replyingTo?.id
      );
      
      setMessageText('');
      setSelectedFile(null);
      setReplyingTo(null);
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEditMessage = async (messageId: number) => {
    if (!editingText.trim()) return;
    
    try {
      await editMessage(messageId, editingText.trim());
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(parseInt(userId));
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwn = message.sender.id === activeConversation?.participant.id;
    const showDate = index === 0 || 
      new Date(message.timestamp).toDateString() !== 
      new Date(activeConversation?.messages[index - 1]?.timestamp || '').toDateString();
    
    return (
      <div key={message.id}>
        {showDate && (
          <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {formatDate(message.timestamp)}
            </span>
          </div>
        )}
        
        <div className={cn(
          'flex mb-4',
          isOwn ? 'justify-end' : 'justify-start'
        )}>
          <div className={cn(
            'max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group',
            isOwn 
              ? 'bg-green-600 text-white rounded-br-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
          )}>
            {/* Reply indicator */}
            {message.replyTo && (
              <div className={cn(
                'text-xs mb-2 p-2 rounded border-l-2',
                isOwn 
                  ? 'bg-green-700 border-green-400 text-green-100' 
                  : 'bg-gray-50 border-gray-300 text-gray-600'
              )}>
                <div className="font-medium">
                  {message.replyTo.sender.names}
                </div>
                <div className="truncate">{message.replyTo.content}</div>
              </div>
            )}
            
            {/* Message content */}
            {editingMessageId === message.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditMessage(message.id);
                    } else if (e.key === 'Escape') {
                      setEditingMessageId(null);
                      setEditingText('');
                    }
                  }}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMessage(message.id)}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessageId(null);
                      setEditingText('');
                    }}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {message.type === MessageType.IMAGE && (
                  <div className="mb-2">
                    <Image
                      src={message.content}
                      alt="Shared image"
                      width={200}
                      height={200}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
                
                {message.type === MessageType.FILE && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded">
                    <File className="w-4 h-4" />
                    <span className="text-sm">{message.fileName}</span>
                    <button className="ml-auto">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {message.type === MessageType.TEXT && (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                )}
                
                {message.edited && (
                  <div className={cn(
                    'text-xs mt-1',
                    isOwn ? 'text-green-200' : 'text-gray-500'
                  )}>
                    (edited)
                  </div>
                )}
              </>
            )}
            
            {/* Message actions */}
            {isOwn && editingMessageId !== message.id && (
              <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Reply"
                  >
                    <Reply className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessageId(message.id);
                      setEditingText(message.content);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit3 className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Timestamp and status */}
            <div className={cn(
              'text-xs mt-1 flex items-center justify-end space-x-1',
              isOwn ? 'text-green-200' : 'text-gray-500'
            )}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwn && (
                <div className="flex">
                  {/* Message status indicators */}
                  <Check className="w-3 h-3" />
                  {/* TODO: Add read status */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!activeConversation) {
    return (
      <div className={cn(
        'flex-1 flex items-center justify-center bg-gray-50',
        className
      )}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {activeConversation.participant.names.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            {isUserOnline(activeConversation.participant.id) && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {activeConversation.participant.names}
            </h3>
            <p className="text-sm text-gray-500">
              {isUserOnline(activeConversation.participant.id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {activeConversation.messages.map((message, index) => 
          renderMessage(message, index)
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className="w-4 h-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-medium text-blue-800">
                  Replying to {replyingTo.sender.names.split(' ')[0]}
                </span>
                <p className="text-blue-600 truncate max-w-xs">
                  {replyingTo.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-blue-100 rounded"
            >
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      )}

      {/* File preview */}
      {selectedFile && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedFile.type.startsWith('image/') ? (
                <ImageIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <File className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Add emoji"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedFile}
            className={cn(
              'p-2 rounded-full transition-colors',
              messageText.trim() || selectedFile
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default ChatInterface;