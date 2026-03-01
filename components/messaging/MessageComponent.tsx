import { cn, imageUrl } from "@/lib/utils";
import { Message, MessageType, User } from "@/types";
import { Check, CheckCheck, Download, File, MoreVertical } from "lucide-react";
import Image from "next/image";
import { ProductReference } from "./ProductReference";
import { MessageReactions, processReactions } from "./MessageReactions";

interface MessageProps {
    messages: Message[]
    message: Message
    index: number
    currentUser: User | null
    editingMessageId: string | null
    setEditingMessageId: (data: string | null) => void
    editingText: string
    setEditingText: (data: string) => void
    handleEditMessage: (data: string) => void
    handleMessageAction: (message: Message, e: any) => void
    handleReactToMessage: (id: string, emoji: string) => void
}


export default function MessageComponent({ messages,
    message,
    index,
    currentUser,
    editingMessageId,
    editingText,
    setEditingText,
    setEditingMessageId,
    handleEditMessage,
    handleMessageAction,
    handleReactToMessage
}: MessageProps) {

    const isOwn = message.sender.id === currentUser?.id;
    const showDate = index === 0 ||
        new Date(message.timestamp).toDateString() !==
        new Date(messages[index - 1]?.timestamp || '').toDateString();

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        else if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        else return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    };
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div key={message.id}>
            {showDate && (
                <div className="flex justify-center my-4">
                    <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">{formatDate(message.timestamp)}</span>
                </div>
            )}

            <div className={cn('flex mb-4 group', isOwn ? 'justify-end' : 'justify-start')}>
                <div
                    className={cn(
                        'max-w-[85%] lg:max-w-md px-4 py-2.5 rounded-lg relative transition-all',
                        isOwn
                            ? 'bg-primary text-primary-foreground rounded-tr-none ring-1 ring-inset ring-success'
                            : 'bg-card border border-border text-foreground rounded-tl-none'
                    )}
                >
                    {message.replyTo && (
                        <div className={cn('text-xs mb-2 p-2 rounded border-l-2', isOwn ? 'bg-success/90 border-success/50 text-primary-foreground' : 'bg-muted border-border text-muted-foreground')}>
                            <div className="font-medium">{message.replyTo.sender?.names ?? 'Unknown'}</div>
                            <div className="truncate">{message.replyTo.content}</div>
                        </div>
                    )}

                    {editingMessageId === message.id ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full bg-transparent border-b border-border focus:outline-none focus:border-foreground"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleEditMessage(message.id);
                                    else if (e.key === 'Escape') { setEditingMessageId(null); setEditingText(''); }
                                }}
                                autoFocus
                            />
                            <div className="flex space-x-2">
                                <button onClick={() => handleEditMessage(message.id)} className="text-xs bg-success text-primary-foreground px-2 py-1 rounded hover:bg-success/90">Save</button>
                                <button onClick={() => { setEditingMessageId(null); setEditingText(''); }} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded hover:bg-muted/80">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {message.type === MessageType.IMAGE && (
                                <div className="mb-2">
                                    <Image src={imageUrl(message.fileName || '')} alt="Shared image" width={200} height={200} className="rounded-lg max-w-full h-auto" />
                                </div>
                            )}

                            {message.type === MessageType.FILE && (
                                <div className="flex items-center space-x-2 mb-2 p-2 bg-muted rounded">
                                    <File className="w-4 h-4" />
                                    <span className="text-sm">{message.fileName}</span>
                                    <button className="ml-auto"><Download className="w-4 h-4" /></button>
                                </div>
                            )}

                            {message.type === MessageType.PRODUCT && message.productRef && (
                                <div className="mb-2">
                                    <ProductReference
                                        productId={message.productRef}
                                        messageContent={message.content}
                                        compact={false}
                                        isMessageOwner={isOwn}
                                    />
                                </div>
                            )}

                            {message.type === MessageType.TEXT && (
                                <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">{message.content}</div>
                            )}

                            {message.isEdited && (
                                <div className={cn('text-xs mt-1', isOwn ? 'text-success/70' : 'text-muted-foreground')}> (edited)</div>
                            )}

                            {/* Message Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                                <MessageReactions
                                    reactions={processReactions(
                                        message.reactions.map(r => ({
                                            emoji: r.emoji,
                                            userId: r.userId,
                                            userName: r.userId // Would need to fetch user name
                                        })),
                                        currentUser?.id
                                    )}
                                    onReactionClick={(emoji) => handleReactToMessage(message.id, emoji)}
                                    isOwn={isOwn}
                                />
                            )}
                        </>
                    )}

                    {/* Three dots menu - positioned based on sender/receiver */}
                    {editingMessageId !== message.id && (
                        <div className={cn(
                            "absolute top-0 transition-all duration-200 z-10 opacity-0 group-hover:opacity-100",
                            isOwn ? "-left-10 -top-1" : "-right-10 -top-1"
                        )}>
                            <button
                                onClick={(e) => handleMessageAction(message, e)}
                                className="p-1.5 bg-card border border-border rounded-full shadow-md hover:bg-muted transition-colors"
                                title="Message options"
                            >
                                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                        </div>
                    )}

                    <div className={cn('text-xs mt-1 flex items-center justify-end space-x-1', isOwn ? 'text-background' : 'text-muted-foreground')}>
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
