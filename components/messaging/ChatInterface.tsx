import React, { useState, useEffect, useRef, useMemo, act, useCallback } from 'react';
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
import { cn, imageUrl } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { ProductReference } from './ProductReference';
import { messageService } from '@/services/messages';
import { toast } from '@/components/ui/use-toast';
import { MessageActionsModal } from './MessageActionsModal';
import { MessageReactions, processReactions } from './MessageReactions';
import MessageComponent from './MessageComponent';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const { user: currentUser } = useAuth();
  const {
    messages,
    activeChatUser,
    setActiveChatUser,
    onlineUsers,
    isTyping: isCurrentUserTyping,
    typingUsers
  } = useMessages();
  const { handleSendMessage: sendMessage,
    handleEditMessage: editMessage,
    handleDeleteMessage: deleteMessage,
    handleTyping: setIsTyping,
    handleReplyMessage: replyMessage,
    handleCancelReply: cancelReply,
    replyTo
  } = useChat()

  const [messageText, setMessageText] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);

  // New state for enhanced messaging
  const [messageActionsModal, setMessageActionsModal] = useState<{
    isOpen: boolean;
    message: Message | null;
    position: { x: number; y: number };
  }>({ isOpen: false, message: null, position: { x: 0, y: 0 } });

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
    console.log(typingUsers)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages, typingUsers]);

  const handleTyping = useCallback(() => {
    if (!activeChatUser?.id || !currentUser?.id) return;

    // Only send typing start if not already typing
    if (!isTypingActive) {
      setIsTyping(true);
      setIsTypingActive(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to send typing stop event
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setIsTypingActive(false);
    }, 2000);
  }, [activeChatUser, currentUser, isTypingActive, setIsTyping]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;

    let content = messageText.trim();
    let messageType = MessageType.TEXT;
    let fileName: string | undefined;

    // Handle file upload first
    if (selectedFile) {
      try {
        // Upload the file and get the URL
        const uploadResponse = await messageService.uploadFile(selectedFile);

        if (uploadResponse.success && uploadResponse.data) {
          messageType = selectedFile.type.startsWith('image/') ? MessageType.IMAGE : MessageType.FILE;
          fileName = uploadResponse.data;
        } else {
          toast.error("Failed to upload file", {
            title: "Upload Error"
          });
          return;
        }
      } catch (uploadError) {
        toast.error("Failed to upload file", {
          title: "Upload Error"
        });
        return;
      }
    }

    try {
      await sendMessage(
        content,
        messageType,
        fileName
      );

      setMessageText('');
      setSelectedFile(null);
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

  // Enhanced messaging handlers
  const handleMessageAction = (message: Message, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMessageActionsModal({
      isOpen: true,
      message,
      position: {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      }
    });
  };

  const handleCloseMessageActions = () => {
    setMessageActionsModal({
      isOpen: false,
      message: null,
      position: { x: 0, y: 0 }
    });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const handleReactToMessage = async (messageId: string, emoji: string) => {
    try {
      // This would call a service to add/remove reaction
      // For now, just show a toast
      toast.success(`Reacted ${emoji} to message`);
    } catch (error) {
      console.error('Failed to react to message:', error);
    }
  };

  const handleReportMessage = async (messageId: string) => {
    try {
      // This would call a service to report the message
      toast.success('Message reported to moderators');
      handleCloseMessageActions();
    } catch (error) {
      console.error('Failed to report message:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };


  useEffect(() => {
    setIsUserOnline(onlineUsers.has(activeChatUser?.id || ''));
  }, [onlineUsers.size, activeChatUser?.id]); // Use size and id to prevent unnecessary re-renders



  if (!activeChatUser) {
    return (
      <div className={cn('flex-1 flex items-center justify-center bg-card', className)}>
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-sm">Choose a user from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      <div className="flex items-center justify-between p-4 bg-card">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveChatUser(null)}
            className="p-2 -ml-2 hover:bg-muted rounded-full md:hidden transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-sm">
              {activeChatUser.avatar ? <img
                src={imageUrl(activeChatUser.avatar)}
                alt={activeChatUser.names}
                className="rounded-full object-cover w-10 h-10"
              /> : <div className='font-bold text-white text-lg'>
                {activeChatUser.names.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase()}
              </div>}
            </div>
            {isUserOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-card rounded-full shadow-sm"></div>}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{activeChatUser.names}</h3>
            <p className="text-sm text-muted-foreground">
              {typingUsers.has(activeChatUser.id) ? (
                <span className="text-success animate-pulse">typing...</span>
              ) : (
                isUserOnline ? 'Online' : 'Offline'
              )}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full"><MoreVertical className="w-5 h-5 text-muted-foreground" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-card/50">
        <div className="flex flex-col min-h-full">
          <div className="flex-1" /> {/* Spacer to push messages to bottom */}
          <div className="space-y-4">
            {filteredMessages.map((message, index) => <MessageComponent
              message={message}
              index={index}
              messages={filteredMessages}
              handleEditMessage={handleEditMessage}
              handleMessageAction={handleMessageAction}
              handleReactToMessage={handleReactToMessage}
              setEditingMessageId={setEditingMessageId}
              editingMessageId={editingMessageId}
              setEditingText={setEditingText}
              editingText={editingText}
              currentUser={currentUser}
            />)}
            {activeChatUser && typingUsers.has(activeChatUser.id) && (
              <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="bg-card border border-border rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-success rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-success rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-success rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>
        </div>
      </div>

      {replyTo && (
        <div className="px-4 py-2 bg-info/10 border-t border-info/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Reply className="w-4 h-4 text-info" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Replying to {replyTo.sender.names.split(' ')[0]}</span>
                <p className="text-info truncate max-w-xs">{replyTo.content}</p>
              </div>
            </div>
            <button onClick={() => cancelReply()} className="p-1 hover:bg-info/20 rounded"><X className="w-4 h-4 text-info" /></button>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="px-4 py-2 bg-card border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-muted-foreground" /> : <File className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm text-foreground">{selectedFile.name}</span>
            </div>
            <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
        </div>
      )}

      <div className="p-2 border-t border-border bg-card">
        <div className="flex items-end space-x-3 max-w-5xl mx-auto">
          <div className="flex items-center space-x-1 mb-1">
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-muted text-muted-foreground rounded-full transition-all active:scale-95" title="Attach file"><Paperclip className="w-5 h-5" /></button>
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2.5 hover:bg-muted text-muted-foreground rounded-full transition-all active:scale-95" title="Add emoji"><Smile className="w-5 h-5" /></button>
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
              className="w-full resize-none bg-card border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-success/20 focus:bg-card transition-all text-foreground placeholder:text-muted-foreground"
              style={{ minHeight: '46px', maxHeight: '150px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !selectedFile}
            className={cn(
              'p-3 rounded-lg transition-all active:scale-95 shadow-md shrink-0 mb-0.5',
              messageText.trim() || selectedFile
                ? 'bg-success text-primary-foreground hover:bg-success/90 shadow-success/20'
                : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />

      {/* Message Actions Modal */}
      {messageActionsModal.isOpen && messageActionsModal.message && (
        <MessageActionsModal
          message={messageActionsModal.message}
          isOpen={messageActionsModal.isOpen}
          onClose={handleCloseMessageActions}
          onEdit={(messageId) => {
            setEditingMessageId(messageId);
            setEditingText(messageActionsModal.message?.content || '');
            handleCloseMessageActions();
          }}
          onDelete={handleDeleteMessage}
          onReply={(message) => {
            replyMessage(message);
            handleCloseMessageActions();
          }}
          onCopy={handleCopyMessage}
          onReact={handleReactToMessage}
          onReport={handleReportMessage}
          position={messageActionsModal.position}
          isOwnMessage={messageActionsModal.message.sender.id === currentUser?.id}
        />
      )}
    </div>
  );
};

export default ChatInterface;