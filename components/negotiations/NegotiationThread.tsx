'use client';

import React, { useEffect, useRef } from 'react';
import { Negotiation, Message, NegotiationStatus } from '@/types';
import { formatCurrency } from '@/lib/negotiation-utils';
import { User, Store, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isBuyer: boolean;
  currentUserType: 'buyer' | 'seller';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isBuyer, currentUserType }) => {
  const isMe = (currentUserType === 'buyer' && isBuyer) || (currentUserType === 'seller' && !isBuyer);
  
  // Extract proposed price if injected in content
  const priceMatch = message.content?.match(/Proposed Price: RWF ([\d,.]+)/);
  const proposedPrice = priceMatch ? priceMatch[1] : null;
  const isOffer = !!proposedPrice;
  const cleanContent = isOffer ? message.content.replace(/Proposed Price: RWF [\d,.]+\s*\n*/, '') : message.content;
  
  if (message.type === ('SYSTEM' as any)) {
    return (
      <div className="flex items-center justify-center my-6 w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {cleanContent}
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col mb-4 max-w-[85%]",
      isMe ? "ml-auto items-end" : "mr-auto items-start"
    )}>
      <div className={cn(
        "relative p-4 rounded-2xl shadow-sm border",
        isMe 
          ? "bg-green-600 border-green-700 text-white rounded-tr-none" 
          : "bg-white border-gray-100 text-gray-900 rounded-tl-none"
      )}>
        {isOffer && (
          <div className={cn(
            "mb-2 p-3 rounded-xl border flex flex-col items-center justify-center",
            isMe ? "bg-white/10 border-white/20" : "bg-gray-50 border-gray-100"
          )}>
            <span className={cn(
               "text-[10px] uppercase font-black tracking-tighter mb-1",
               isMe ? "text-white/70" : "text-gray-400"
            )}>
                {isBuyer ? 'Buyer Offer' : 'Seller Counter'}
            </span>
            <span className="text-xl font-black">
              RWF {proposedPrice}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{cleanContent}</p>
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 px-1">
        <span className="text-[10px] font-medium text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isMe && <CheckCircle2 className="w-3 h-3 text-green-500" />}
      </div>
    </div>
  );
};

interface NegotiationThreadProps {
  negotiation: Negotiation;
  messages: Message[];
  currentUserType: 'buyer' | 'seller';
}

export const NegotiationThread: React.FC<NegotiationThreadProps> = ({ 
  negotiation, 
  messages,
  currentUserType
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const seller = negotiation.order.product.owner;
  const buyer = negotiation.order.buyer;
  const otherPartyName = currentUserType === 'buyer' 
    ? (seller?.firstName + ' ' + seller?.lastName) 
    : (buyer?.firstName + ' ' + buyer?.lastName);

  const statusColors = {
    [NegotiationStatus.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [NegotiationStatus.COUNTERED]: 'bg-blue-100 text-blue-700 border-blue-200',
    [NegotiationStatus.ACCEPTED]: 'bg-green-100 text-green-700 border-green-200',
    [NegotiationStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
    [NegotiationStatus.EXPIRED]: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const effectiveStatus = (negotiation.status === NegotiationStatus.EXPIRED && !negotiation.isExpired) 
    ? NegotiationStatus.PENDING 
    : negotiation.status;

  const statusText = effectiveStatus === NegotiationStatus.PENDING && negotiation.status === NegotiationStatus.EXPIRED 
    ? 'ACTIVE' 
    : effectiveStatus;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Status Bar */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            statusColors[effectiveStatus]
          )}>
            {statusText}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                 <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-gray-600">
              Negotiating with <span className="text-gray-900">{otherPartyName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[radial-gradient(#f1f1f1_1px,transparent_1px)] bg-size-[20px_20px]"
      >
        <div className="space-y-2">
          {messages.map((msg, idx) => (
            <MessageBubble 
              key={idx} 
              message={msg} 
              isBuyer={msg.sender?.role === 'BUYER' || ((msg as any).isBuyer ?? false)} 
              currentUserType={currentUserType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
