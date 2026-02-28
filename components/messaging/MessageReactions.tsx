'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
  currentUserReacted: boolean;
}

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onReactionClick?: (emoji: string) => void;
  isOwn?: boolean;
  className?: string;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onReactionClick,
  isOwn = false,
  className = ''
}) => {
  if (reactions.length === 0) return null;

  return (
    <div className={cn(
      'flex flex-wrap gap-1 mt-2',
      className
    )}>
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onReactionClick?.(reaction.emoji)}
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors',
            'hover:bg-muted cursor-pointer',
            reaction.currentUserReacted
              ? isOwn
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-card border border-border'
              : 'bg-muted/50 text-muted-foreground hover:text-foreground'
          )}
          title={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted ${reaction.emoji}`}
        >
          <span className="text-sm">{reaction.emoji}</span>
          <span className="font-medium">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
};

// Helper function to process reactions
export const processReactions = (
  reactions: { emoji: string; userId: string; userName: string }[],
  currentUserId?: string
): MessageReaction[] => {
  const grouped: Record<string, { users: string[]; userNames: string[] }> = {};
  
  reactions.forEach(({ emoji, userId, userName }) => {
    if (!grouped[emoji]) {
      grouped[emoji] = { users: [], userNames: [] };
    }
    grouped[emoji].users.push(userId);
    grouped[emoji].userNames.push(userName);
  });

  return Object.entries(grouped).map(([emoji, { users, userNames }]) => ({
    emoji,
    count: users.length,
    users,
    currentUserReacted: currentUserId ? users.includes(currentUserId) : false
  }));
};
