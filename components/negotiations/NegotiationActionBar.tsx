'use client';

import React, { useState } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { formatCurrency } from '@/lib/negotiation-utils';
import { Send, CheckCircle, XCircle, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'red';
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, variant = 'primary', icon, disabled }) => {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50",
    red: "bg-transparent text-red-500 hover:text-red-700 hover:bg-red-50",
  };

  return (
    <button 
      onClick={label === 'Confirm' || !disabled ? onClick : undefined}
      disabled={disabled}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant]
      )}
    >
      {icon}
      {label}
    </button>
  );
};

interface NegotiationActionBarProps {
  negotiation: Negotiation;
  currentUserType: 'buyer' | 'seller';
  onAction: (action: string, data?: any) => void;
  isMyTurn: boolean;
}

export const NegotiationActionBar: React.FC<NegotiationActionBarProps> = ({ 
  negotiation, 
  currentUserType,
  onAction,
  isMyTurn
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [price, setPrice] = useState(negotiation.sellerResponsePrice || negotiation.buyerProposedPrice);
  const [showConfirm, setShowConfirm] = useState(false);

  const isAccepted = negotiation.status === NegotiationStatus.ACCEPTED;
  const isRejected = negotiation.status === NegotiationStatus.REJECTED;
  const isExpired = negotiation.isExpired;
  const isEnded = isAccepted || isRejected || isExpired;

  const counterLimitReached = false; 

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    onAction('CHAT', { message: chatMessage });
    setChatMessage('');
  };

  return (
    <div className="bg-white border-t border-gray-100 flex flex-col">
      {/* 1. Status / Action Panel (Only if turn or special state) */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {isAccepted ? (
           <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-green-700">
               <CheckCircle className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">Price agreed at {formatCurrency(negotiation.buyerProposedPrice)}</span>
             </div>
             <button 
               onClick={() => onAction('GO_TO_CART')}
               className="bg-green-600 text-white font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl shadow-md hover:bg-green-700 flex items-center gap-2 group transition-all"
             >
               Checkout
               <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
             </button>
           </div>
        ) : isRejected || isExpired ? (
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-center gap-4">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">This negotiation has ended</p>
             <button 
               onClick={() => onAction('START_NEW')}
               className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
             >
               Start New
             </button>
          </div>
        ) : !isMyTurn ? (
          <div className="p-4 bg-white border-b border-gray-50 flex items-center justify-center gap-3">
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-gray-200 rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Waiting for {currentUserType === 'buyer' ? 'Seller' : 'Buyer'}...</span>
          </div>
        ) : (
          <div className="p-6 space-y-4 border-b border-gray-50">
            <div className="flex gap-4 items-end">
              <div className="flex-[0.4]">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Your Price Move</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">RWF</span>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-black text-gray-900 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
              <div className="flex-[0.6] flex gap-2">
                <ActionButton 
                  label="Counter" 
                  onClick={() => onAction('COUNTER', { price, message: chatMessage })} 
                  variant="primary" 
                  disabled={price === (negotiation.sellerResponsePrice || negotiation.buyerProposedPrice) || counterLimitReached}
                />
                <ActionButton 
                  label="Accept" 
                  onClick={() => setShowConfirm(true)} 
                  variant="outline"
                  icon={<CheckCircle className="w-4 h-4" />}
                />
                <button 
                  onClick={() => onAction('REJECT')}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Chat Input Bar (Always available unless ended) */}
      <div className="p-4 flex gap-3 items-center bg-white">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
            placeholder={isEnded ? "Chat disabled" : "Type a message..."}
            disabled={isEnded}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSendChat}
            disabled={isEnded || !chatMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-all disabled:text-gray-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. Confirmation Popover */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Accept Offer?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
              Agree to <span className="text-gray-900 font-bold">{formatCurrency(price)}</span> for this item?
            </p>
            <div className="flex flex-col gap-2">
               <button 
                 onClick={() => { onAction('ACCEPT'); setShowConfirm(false); }}
                 className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200"
               >
                 Yes, Confirm
               </button>
               <button 
                 onClick={() => setShowConfirm(false)}
                 className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-gray-600"
               >
                 Cancel
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
