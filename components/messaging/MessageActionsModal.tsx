'use client';

import React, { useState } from 'react';
import {
  Edit3,
  Trash2,
  Reply,
  Copy,
  Flag,
  X,
  Heart,
  ThumbsUp,
  Laugh,
  AlertCircle,
  Star
} from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageActionsModalProps {
  message: Message;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onReply: (message: Message) => void;
  onCopy: (content: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onReport?: (messageId: string) => void;
  position: { x: number; y: number };
  isOwnMessage: boolean;
}

const REACTIONS = [
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '😊', icon: Laugh, label: 'Happy' },
  { emoji: '😮', icon: AlertCircle, label: 'Wow' },
  { emoji: '⭐', icon: Star, label: 'Star' },
];

export const MessageActionsModal: React.FC<MessageActionsModalProps> = ({
  message,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onReply,
  onCopy,
  onReact,
  onReport,
  position,
  isOwnMessage
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(message.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleCopy = () => {
    onCopy(message.content);
    onClose();
  };

  const handleReply = () => {
    onReply(message);
    onClose();
  };

  const handleEdit = () => {
    onEdit(message.id);
    onClose();
  };

  const handleReact = (emoji: string) => {
    onReact(message.id, emoji);
    setShowReactions(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-50 bg-card border border-border rounded-lg shadow-lg p-1 min-w-[200px]",
          "animate-in fade-in slide-in-from-top-1 duration-200"
        )}
        style={{
          left: `${Math.min(position.x, window.innerWidth - 220)}px`,
          top: `${Math.min(position.y, window.innerHeight - 300)}px`,
        }}
      >
        {showDeleteConfirm ? (
          <div className="p-3">
            <div className="text-sm font-medium text-foreground mb-2">
              Delete this message?
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              This action cannot be undone.
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showReactions ? (
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-1">
              Add reaction
            </div>
            <div className="grid grid-cols-5 gap-1">
              {REACTIONS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="p-2 hover:bg-muted rounded transition-colors group"
                  title={label}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {emoji}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReactions(false)}
              className="w-full mt-2 px-2 py-1 text-xs text-muted-foreground hover:bg-muted rounded transition-colors"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="py-1">
            <button
              onClick={() => setShowReactions(true)}
              className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Add Reaction</span>
            </button>
            
            <button
              onClick={handleReply}
              className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Reply className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Reply</span>
            </button>
            
            <button
              onClick={handleCopy}
              className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Copy</span>
            </button>
            
            {/* Show edit/delete only for own messages */}
            {isOwnMessage && (
              <>
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Edit</span>
                </button>
                
                <div className="border-t border-border my-1"></div>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 transition-colors flex items-center gap-2 group"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                  <span className="text-foreground group-hover:text-destructive transition-colors">Delete</span>
                </button>
              </>
            )}

            {/* Show report option for other people's messages */}
            {!isOwnMessage && onReport && (
              <>
                <div className="border-t border-border my-1"></div>
                
                <button
                  onClick={() => onReport(message.id)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 transition-colors flex items-center gap-2 group"
                >
                  <Flag className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                  <span className="text-foreground group-hover:text-destructive transition-colors">Report</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
