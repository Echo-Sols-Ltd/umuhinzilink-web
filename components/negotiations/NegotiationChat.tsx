'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Negotiation, Message, MessageType } from '@/types';
import { useNegotiation } from '@/contexts/NegotiationContext';
import {
  Send,
  X,
  MessageCircle,
  User,
  Store,
  Clock,
  DollarSign
} from 'lucide-react';
import { notify } from '@/lib/notify';

interface NegotiationChatProps {
  negotiation: Negotiation;
  isOpen: boolean;
  onClose: () => void;
  userType?: 'buyer' | 'seller';
}

export default function NegotiationChat({
  negotiation,
  isOpen,
  onClose,
  userType = 'buyer'
}: NegotiationChatProps) {
  const { messages, isConnected, sendNegotiationMessage } = useNegotiation();
  const [newMessage, setNewMessage] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if chat should be disabled (final state)
  const isFinalState = negotiation.status === 'ACCEPTED' || negotiation.status === 'REJECTED';

  // Determine if seller has set final price (buyer can't chat)
  const hasSellerSetFinalPrice = negotiation.status === 'COUNTERED' &&
    negotiation.sellerResponsePrice > 0 &&
    negotiation.agreedPrice > 0 &&
    userType === 'buyer';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !proposedPrice.trim()) || loading || !isConnected) return;

    setLoading(true);
    try {
      const isOffer = !!proposedPrice;
      const content = isOffer
        ? `Proposed Price: RWF ${parseFloat(proposedPrice).toLocaleString()}\n\n${newMessage.trim()}`
        : newMessage.trim();

      // Send message via socket service
      sendNegotiationMessage(
        negotiation.id,
        content
      );

      // Clear inputs
      setNewMessage('');
      setProposedPrice('');

      notify.success('Message sent', 'Success');
    } catch (error) {
      console.error('Failed to send message:', error);
      notify.error('Failed to send message', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {negotiation.order.product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {userType === 'buyer' ? 'Seller' : 'Buyer'} • {negotiation.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Negotiation Info */}
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Current Negotiation</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-900">
                    {negotiation.buyerProposedPrice.toLocaleString()} RWF
                  </span>
                </div>
                {negotiation.sellerResponsePrice && (
                  <>
                    <span className="text-blue-600">→</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-900">
                        {negotiation.sellerResponsePrice.toLocaleString()} RWF
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600">Time Remaining</p>
              <p className="font-semibold text-blue-900">{negotiation.timeRemaining}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isConnected ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Connecting to chat...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isCurrentUser = userType === 'buyer' ?
                  message.sender?.role === 'BUYER' :
                  message.sender?.role !== 'BUYER';

                const priceMatch = message.content?.match(/Proposed Price: RWF ([\d,.]+)/);
                const proposedPriceMatch = priceMatch ? priceMatch[1] : null;
                const cleanContent = proposedPriceMatch ? message.content.replace(/Proposed Price: RWF [\d,.]+\s*\n*/, '') : message.content;

                return (
                  <div key={index} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCurrentUser ? 'bg-primary/20' : 'bg-gray-200'
                      }`}>
                      {isCurrentUser ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Store className="w-4 h-4 text-gray-600" />
                      )}
                    </div>

                    <div className={`flex-1 space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'
                      }`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl ${isCurrentUser
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-gray-100 text-gray-900'
                        }`}>
                        {cleanContent && (
                          <p className="text-sm leading-relaxed">{cleanContent}</p>
                        )}

                        {proposedPriceMatch && (
                          <div className={`mt-2 p-2 rounded-lg ${isCurrentUser ? 'bg-primary-foreground/10' : 'bg-blue-50'
                            }`}>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-bold">
                                {proposedPriceMatch} RWF
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 text-xs text-gray-500 ${isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {/* Show disabled message when chat is not allowed */}
          {(isFinalState || hasSellerSetFinalPrice) && (
            <div className="text-center py-4 text-sm text-gray-500">
              {isFinalState ? (
                <div>
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">
                    {negotiation.status === 'ACCEPTED' ? 'Negotiation Accepted' : 'Negotiation Rejected'}
                  </p>
                  <p className="text-xs mt-1">
                    {negotiation.status === 'ACCEPTED'
                      ? 'Proceed to checkout to complete your order'
                      : 'This negotiation has ended'}
                  </p>
                </div>
              ) : (
                <div>
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Final Price Set</p>
                  <p className="text-xs mt-1">
                    Seller has set the final price of RWF {negotiation.agreedPrice.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1">Use the action buttons below to accept or reject</p>
                </div>
              )}
            </div>
          )}

          {/* Normal chat input - only show when chat is allowed */}
          {!isFinalState && !hasSellerSetFinalPrice && (
            <>
              {proposedPrice && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Proposed Price: {parseFloat(proposedPrice).toLocaleString()} RWF
                      </span>
                    </div>
                    <button
                      onClick={() => setProposedPrice('')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setProposedPrice(negotiation.buyerProposedPrice.toString())}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Add Price
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  disabled={loading}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={loading || (!newMessage.trim() && !proposedPrice.trim()) || !isConnected}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isConnected ? 'Send' : 'Connecting...'}
                    </>
                  )}
                </button>
              </div>
            </>)}
        </div>
      </div>
    </div >
  );
}
