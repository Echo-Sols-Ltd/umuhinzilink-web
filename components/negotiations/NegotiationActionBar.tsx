'use client';

import React, { useState } from 'react';
import { Negotiation, NegotiationStatus } from '@/types';
import { formatCurrency } from '@/lib/negotiation-utils';
import { Send, CheckCircle, XCircle, Trash2, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
}

export const NegotiationActionBar: React.FC<NegotiationActionBarProps> = ({ 
  negotiation, 
  currentUserType,
  onAction
}) => {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(negotiation.sellerResponsePrice || negotiation.buyerProposedPrice);
  const [showConfirm, setShowConfirm] = useState(false);

  const isAccepted = negotiation.status === NegotiationStatus.ACCEPTED;
  const isRejected = negotiation.status === NegotiationStatus.REJECTED;
  const isExpired = negotiation.status === NegotiationStatus.EXPIRED;
  const isEnded = isAccepted || isRejected || isExpired;

  // Turn logic
  const isMyTurn = (currentUserType === 'buyer' && negotiation.canBuyerRespond) || 
                   (currentUserType === 'seller' && negotiation.canSellerRespond);

  if (isAccepted) {
    return (
      <div className="p-6 bg-green-50 border-t border-green-100 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-widest leading-none">Price agreed at {formatCurrency(negotiation.buyerProposedPrice)}</span>
        </div>
        <button 
          onClick={() => onAction('GO_TO_CART')}
          className="w-full max-w-md bg-green-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2 group"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  if (isEnded) {
    return (
      <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">This negotiation has ended</p>
        <button 
           onClick={() => onAction('START_NEW')}
           className="text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4"
        >
          Start new negotiation
        </button>
      </div>
    );
  }

  if (!isMyTurn) {
    return (
      <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-center gap-3">
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce" />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Waiting for response...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-t border-gray-100 space-y-4">
      <div className="flex gap-4 items-center">
        {/* Price Input Wrapper */}
        <div className="flex-[0.4] group">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Price Move</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">RWF</span>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0,000"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Message Input Wrapper */}
        <div className="flex-[0.6]">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Add a message (optional)</label>
           <div className="relative">
             <input 
               type="text" 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Say something..."
               className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
               onKeyPress={(e) => e.key === 'Enter' && onAction('COUNTER', { price, message })}
             />
           </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <ActionButton 
          label={currentUserType === 'buyer' ? "Accept Price" : "Accept Offer"} 
          onClick={() => setShowConfirm(true)} 
          variant="primary" 
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <ActionButton 
          label="Counter Offer" 
          onClick={() => onAction('COUNTER', { price, message })} 
          variant="outline" 
          icon={<Send className="w-4 h-4" />}
          disabled={price === (negotiation.sellerResponsePrice || negotiation.buyerProposedPrice)}
        />
        <ActionButton 
          label={currentUserType === 'buyer' ? "Reject" : "Decline"} 
          onClick={() => onAction('REJECT')} 
          variant="red" 
          icon={<XCircle className="w-4 h-4" />}
        />
      </div>

      {/* Confirmation Popover Mock */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Accept Offer?</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
              Accept <span className="text-gray-900 font-bold">{formatCurrency(price)}</span> for <span className="text-gray-900 font-bold">{negotiation.order.quantity} {negotiation.order.product.unitPrice}</span> of {negotiation.order.product.name}?
            </p>
            <div className="flex flex-col gap-2">
               <button 
                 onClick={() => { onAction('ACCEPT'); setShowConfirm(false); }}
                 className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200"
               >
                 Confirm
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
