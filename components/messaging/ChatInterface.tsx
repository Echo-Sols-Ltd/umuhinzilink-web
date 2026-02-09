import React, { useState, useEffect, useRef, useMemo, act } from 'react';
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
  X,
  Image as ImageIcon,
  File,
  Download,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { Message, MessageType } from '@/types/message';
import { useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { user: currentUser } = useAuth();
  const {
    messages,
    activeChatUser,
    setActiveChatUser,
    sendMessage,
    editMessage,
    deleteMessage,
    onlineUsers,
    isTyping: isCurrentUserTyping,
    setIsTyping,
    typingUsers
  } = useMessages();

  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUserOnline, setIsUserOnline] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredMessages = useMemo(() => {
    if (!activeChatUser || !currentUser) return [];
    return messages.filter(m =>
      (m.sender.id === activeChatUser.id && m.receiver.id === currentUser.id) ||
      (m.sender.id === currentUser.id && m.receiver.id === activeChatUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, activeChatUser, currentUser]);

  // Auto-scroll to bottom when new messages arrive or other user starts typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages, typingUsers]);

  const handleTyping = () => {
    if (!isCurrentUserTyping) setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;

    try {
      let messageType = MessageType.TEXT;
      let fileName: string | undefined;

      if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) messageType = MessageType.IMAGE;
        else messageType = MessageType.FILE;
        fileName = selectedFile.name;
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

  const handleEditMessage = async (messageId: string) => {
    if (!editingText.trim()) return;
    try {
      await editMessage(messageId, editingText.trim());
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
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
    if (file) setSelectedFile(file);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    else if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    else return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  };

  useEffect(() => {
    setIsUserOnline(onlineUsers.has(activeChatUser?.id || ''));
  }, [onlineUsers, activeChatUser]);
  const renderMessage = (message: Message, index: number) => {
    const isOwn = message.sender.id === currentUser?.id;
    const showDate = index === 0 ||
      new Date(message.timestamp).toDateString() !==
      new Date(filteredMessages[index - 1]?.timestamp || '').toDateString();

    return (
      <div key={message.id}>
        {showDate && (
          <div className="flex justify-center my-4">
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{formatDate(message.timestamp)}</span>
          </div>
        )}

        <div className={cn('flex mb-4 group', isOwn ? 'justify-end' : 'justify-start')}>
          <div className={cn(
            'max-w-[85%] lg:max-w-md px-4 py-2.5 rounded-2xl relative shadow-sm transition-all',
            isOwn
              ? 'bg-green-600 text-white rounded-tr-none ring-1 ring-inset ring-green-500'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
          )}>
            {message.replyTo && (
              <div className={cn('text-xs mb-2 p-2 rounded border-l-2', isOwn ? 'bg-green-700 border-green-400 text-green-100' : 'bg-gray-50 border-gray-300 text-gray-600')}>
                <div className="font-medium">{message.replyTo.sender.names}</div>
                <div className="truncate">{message.replyTo.content}</div>
              </div>
            )}

            {editingMessageId === message.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleEditMessage(message.id);
                    else if (e.key === 'Escape') { setEditingMessageId(null); setEditingText(''); }
                  }}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button onClick={() => handleEditMessage(message.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>
                  <button onClick={() => { setEditingMessageId(null); setEditingText(''); }} className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {message.type === MessageType.IMAGE && (
                  <div className="mb-2">
                    <Image src={message.content} alt="Shared image" width={200} height={200} className="rounded-lg max-w-full h-auto" />
                  </div>
                )}

                {message.type === MessageType.FILE && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded">
                    <File className="w-4 h-4" />
                    <span className="text-sm">{message.fileName}</span>
                    <button className="ml-auto"><Download className="w-4 h-4" /></button>
                  </div>
                )}

                {message.type === MessageType.TEXT && (
                  <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">{message.content}</div>
                )}

                {message.isEdited && (
                  <div className={cn('text-xs mt-1', isOwn ? 'text-green-200' : 'text-gray-500')}>(edited)</div>
                )}
              </>
            )}

            {isOwn && editingMessageId !== message.id && (
              <div className={cn(
                "absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10",
                isOwn ? "-left-24" : "-right-24"
              )}>
                <div className="flex items-center space-x-1 bg-white border border-gray-100 rounded-full shadow-md p-1.5 translate-y-1">
                  <button onClick={() => setReplyingTo(message)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Reply"><Reply className="w-3.5 h-3.5 text-gray-500" /></button>
                  <button onClick={() => { setEditingMessageId(message.id); setEditingText(message.content); }} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5 text-gray-500" /></button>
                  <button onClick={() => handleDeleteMessage(message.id)} className="p-1.5 hover:bg-red-50 rounded-full transition-colors group/del" title="Delete"><Trash2 className="w-3.5 h-3.5 text-gray-500 group-hover/del:text-red-500" /></button>
                </div>
              </div>
            )}

            <div className={cn('text-xs mt-1 flex items-center justify-end space-x-1', isOwn ? 'text-green-200' : 'text-gray-500')}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwn && (
                <div className="flex">
                  {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!activeChatUser) {
    return (
      <div className={cn('flex-1 flex items-center justify-center bg-gray-50', className)}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-gray-400" /></div>
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-sm">Choose a user from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveChatUser(null)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full md:hidden transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-gray-600">
                {activeChatUser.names.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>
            {isUserOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{activeChatUser.names}</h3>
            <p className="text-sm text-gray-500">
              {typingUsers.has(activeChatUser.id) ? (
                <span className="text-green-600 animate-pulse">typing...</span>
              ) : (
                isUserOnline ? 'Online' : 'Offline'
              )}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
        <div className="flex flex-col min-h-full">
          <div className="flex-1" /> {/* Spacer to push messages to bottom */}
          <div className="space-y-4">
            {filteredMessages.map((message, index) => renderMessage(message, index))}
            {activeChatUser && typingUsers.has(activeChatUser.id) && (
              <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className="w-4 h-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-medium text-blue-800">Replying to {replyingTo.sender.names.split(' ')[0]}</span>
                <p className="text-blue-600 truncate max-w-xs">{replyingTo.content}</p>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-blue-100 rounded"><X className="w-4 h-4 text-blue-600" /></button>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-gray-600" /> : <File className="w-4 h-4 text-gray-600" />}
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-600" /></button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-end space-x-3 max-w-5xl mx-auto">
          <div className="flex items-center space-x-1 mb-1">
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-full transition-all active:scale-95" title="Attach file"><Paperclip className="w-5 h-5" /></button>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-full transition-all active:scale-95" title="Add emoji"><Smile className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => { setMessageText(e.target.value); handleTyping(); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
              style={{ minHeight: '46px', maxHeight: '150px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedFile}
            className={cn(
              'p-3 rounded-2xl transition-all active:scale-95 shadow-md shrink-0 mb-0.5',
              messageText.trim() || selectedFile
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
    </div>
  );
};

export default ChatInterface;