'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NegotiationActionConfirmProps {
  type: 'ACCEPT' | 'REJECT' | 'COUNTER' | 'MESSAGE';
  onConfirm: (data?: { price?: number; message?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  negotiationData?: {
    buyerProposedPrice?: number;
    sellerResponsePrice?: number;
    productName?: string;
    quantity?: number;
  };
  className?: string;
}

export const NegotiationActionConfirm: React.FC<NegotiationActionConfirmProps> = ({
  type,
  onConfirm,
  onCancel,
  loading = false,
  negotiationData,
  className
}) => {
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    const data: { price?: number; message?: string } = {};
    
    if (type === 'COUNTER' && price) {
      const priceNum = parseFloat(price);
      if (priceNum > 0) {
        data.price = priceNum;
      }
    }
    
    if (message.trim()) {
      data.message = message.trim();
    }
    
    onConfirm(data);
  };

  const isValid = () => {
    if (type === 'COUNTER') {
      const priceNum = parseFloat(price);
      return priceNum > 0 && priceNum !== negotiationData?.buyerProposedPrice;
    }
    return true;
  };

  const getConfig = () => {
    switch (type) {
      case 'ACCEPT':
        return {
          title: 'Accept Negotiation',
          description: 'Agree to the proposed price and proceed to checkout',
          icon: CheckCircle,
          color: 'green',
          confirmText: 'Accept Price',
          requiresMessage: false,
          requiresPrice: false
        };
      case 'REJECT':
        return {
          title: 'Decline Negotiation',
          description: 'Decline this price proposal',
          icon: XCircle,
          color: 'red',
          confirmText: 'Decline',
          requiresMessage: true,
          requiresPrice: false
        };
      case 'COUNTER':
        return {
          title: 'Make Counter Offer',
          description: 'Propose a different price',
          icon: DollarSign,
          color: 'blue',
          confirmText: 'Send Counter Offer',
          requiresMessage: false,
          requiresPrice: true
        };
      case 'MESSAGE':
        return {
          title: 'Send Message',
          description: 'Send a message about this negotiation',
          icon: MessageSquare,
          color: 'gray',
          confirmText: 'Send Message',
          requiresMessage: true,
          requiresPrice: false
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Please confirm this action',
          icon: AlertTriangle,
          color: 'amber',
          confirmText: 'Confirm',
          requiresMessage: false,
          requiresPrice: false
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const colorClasses = {
    green: 'border-green-200 bg-green-50 text-green-800',
    red: 'border-red-200 bg-red-50 text-red-800',
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    gray: 'border-gray-200 bg-gray-50 text-gray-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-800'
  };

  const buttonClasses = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white'
  };

  return (
    <div className={cn(
      'rounded-xl border p-4 space-y-4',
      colorClasses[config.color as keyof typeof colorClasses],
      className
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Icon className={cn(
          'w-5 h-5 shrink-0',
          config.color === 'green' && 'text-green-600',
          config.color === 'red' && 'text-red-600',
          config.color === 'blue' && 'text-blue-600',
          config.color === 'gray' && 'text-gray-600',
          config.color === 'amber' && 'text-amber-600'
        )} />
        <div className="flex-1">
          <h4 className="font-semibold">{config.title}</h4>
          <p className="text-sm opacity-80 mt-1">{config.description}</p>
        </div>
      </div>

      {/* Price Display for Accept/Counter */}
      {(type === 'ACCEPT' || type === 'COUNTER') && negotiationData && (
        <div className="bg-white/50 rounded-lg p-3 space-y-2">
          <div className="text-sm font-medium">Price Details</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Buyer proposed:</span>
              <span className="font-medium">
                RWF {negotiationData.buyerProposedPrice?.toLocaleString()}
              </span>
            </div>
            {negotiationData.sellerResponsePrice && (
              <div className="flex justify-between text-sm">
                <span>Your counter:</span>
                <span className="font-medium">
                  RWF {negotiationData.sellerResponsePrice.toLocaleString()}
                </span>
              </div>
            )}
            {negotiationData.quantity && negotiationData.productName && (
              <div className="flex justify-between text-sm pt-1 border-t border-white/30">
                <span>Total ({negotiationData.quantity} units):</span>
                <span className="font-bold">
                  RWF {((negotiationData.buyerProposedPrice || 0) * negotiationData.quantity).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price Input for Counter */}
      {config.requiresPrice && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Counter Price (per unit)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter your price..."
              className="pl-9"
            />
          </div>
          {price && parseFloat(price) > 0 && negotiationData?.buyerProposedPrice && (
            <div className="text-xs text-muted-foreground">
              Difference: RWF {Math.abs(parseFloat(price) - negotiationData.buyerProposedPrice).toLocaleString()} 
              {parseFloat(price) > negotiationData.buyerProposedPrice ? ' higher' : ' lower'} than proposal
            </div>
          )}
        </div>
      )}

      {/* Message Input */}
      {config.requiresMessage && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {type === 'REJECT' ? 'Reason for declining (optional)' : 'Message'}
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={type === 'REJECT' 
              ? 'Optional: Let the buyer know why you\'re declining...' 
              : 'Type your message...'
            }
            rows={3}
            className="resize-none"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || !isValid()}
          className={cn('flex-1', buttonClasses[config.color as keyof typeof buttonClasses])}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            config.confirmText
          )}
        </Button>
      </div>
    </div>
  );
};
