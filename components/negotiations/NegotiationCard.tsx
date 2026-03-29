'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Negotiation, NegotiationStatus, CounterOfferRequest } from '@/types';
import useNegotiationAction from '@/hooks/useNegotiationAction';
import { formatCurrency } from '@/lib/negotiation-utils';
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Send,
  X,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { notify } from '@/lib/notify';

interface NegotiationCardProps {
  negotiation: Negotiation;
  userType?: 'buyer' | 'seller';
  onChatOpen?: (negotiationId: string) => void;
}

export default function NegotiationCard({ 
  negotiation, 
  userType = 'buyer', 
  onChatOpen 
}: NegotiationCardProps) {
  const { acceptNegotiation, rejectNegotiation, counterOffer } = useNegotiationAction();
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Get status styling
  const getStatusInfo = () => {
    // Priority: If the backend says EXPIRED status but isExpired is false and there's time remaining,
    // we treat it as PENDING for the user's sake.
    const effectiveStatus = (negotiation.status === NegotiationStatus.EXPIRED && !negotiation.isExpired) 
      ? NegotiationStatus.PENDING 
      : negotiation.status;

    switch (effectiveStatus) {
      case NegotiationStatus.PENDING:
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: Clock,
          text: 'Pending'
        };
      case NegotiationStatus.COUNTERED:
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: TrendingUp,
          text: 'Countered'
        };
      case NegotiationStatus.ACCEPTED:
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          text: 'Accepted'
        };
      case NegotiationStatus.REJECTED:
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: XCircle,
          text: 'Rejected'
        };
      case NegotiationStatus.EXPIRED:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Clock,
          text: 'Expired'
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: Clock,
          text: 'Unknown'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Check if user can take action
  const canTakeAction = () => {
    if (negotiation.isExpired) return false;
    
    if (userType === 'seller') {
      return negotiation.canSellerRespond && 
        (negotiation.status === NegotiationStatus.PENDING || 
         negotiation.status === NegotiationStatus.COUNTERED);
    } else {
      return negotiation.canBuyerRespond && 
        negotiation.status === NegotiationStatus.COUNTERED;
    }
  };

  // Handle accept action
  const handleAccept = async () => {
    if (!canTakeAction()) return;
    
    setLoading(true);
    try {
      await acceptNegotiation(negotiation.order.id);
    } catch (error) {
      console.error('Failed to accept negotiation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!canTakeAction()) return;
    
    setLoading(true);
    try {
      await rejectNegotiation(negotiation.order.id, 'Offer rejected');
    } catch (error) {
      console.error('Failed to reject negotiation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle counter offer
  const handleCounterOffer = async () => {
    const price = parseFloat(counterPrice);
    const originalPrice = negotiation.order.product.unitPrice;
    const minPrice = originalPrice * 0.5;
    const maxPrice = originalPrice * 1.5;

    if (price < minPrice || price > maxPrice) {
      notify.error(
        `Offer must be between ${formatCurrency(minPrice)} and ${formatCurrency(maxPrice)} (50%-150% of original price)`, 
        'Invalid Counter Offer'
      );
      return;
    }

    setLoading(true);
    try {
      const request: CounterOfferRequest = {
        counterPrice: price,
        message: counterMessage
      };
      await counterOffer(negotiation.order.id, request);
      setShowCounterOffer(false);
      setCounterPrice('');
      setCounterMessage('');
    } catch (error) {
      console.error('Failed to send counter offer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate price difference
  const priceDifference = negotiation.sellerResponsePrice 
    ? negotiation.sellerResponsePrice - negotiation.buyerProposedPrice
    : 0;

  const priceDifferencePercent = negotiation.buyerProposedPrice > 0
    ? (Math.abs(priceDifference) / negotiation.buyerProposedPrice) * 100
    : 0;

  const { product, buyer, quantity } = negotiation.order;

  return (
    <div className={`bg-white rounded-xl border ${statusInfo.border} p-6 space-y-4 hover:shadow-lg transition-all`}>
      {/* Header with Product Image */}
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-xs">
              {product.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-6 h-6 ${statusInfo.bg} rounded-full flex items-center justify-center`}>
              <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
            {negotiation.isExpired && (
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none bg-gray-50 px-1.5 py-0.5 rounded-md">Expired</span>
            )}
          </div>
          
          <h3 className="font-extrabold text-lg text-gray-900 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            {quantity} {product.measurementUnit}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Expires In</p>
          <p className="text-xs font-black text-gray-900 tabular-nums">
            {negotiation.timeRemaining}
          </p>
        </div>
      </div>

      {/* Price Information */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Starting Offer</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-gray-900">
              {formatCurrency(negotiation.buyerProposedPrice)}
            </span>
          </div>
        </div>
        
        {negotiation.sellerResponsePrice && (
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Last Move</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-gray-900">
                {formatCurrency(negotiation.sellerResponsePrice)}
              </span>
              {priceDifference !== 0 && (
                <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {priceDifference > 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 text-red-500" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 text-green-500" />
                  )}
                  <span className={`text-[9px] font-black tabular-nums ${
                    priceDifference > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {priceDifferencePercent.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Last Message Information */}
      {negotiation.lastMessage && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
          <p className="text-xs text-blue-900/70 font-medium italic">
            "{negotiation.lastMessage}"
          </p>
        </div>
      )}

      {/* Counter Offer Form */}
      {showCounterOffer && (
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900">Make Counter Offer</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Price (per unit)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder="Enter your price"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              value={counterMessage}
              onChange={(e) => setCounterMessage(e.target.value)}
              placeholder="Add a message with your offer..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCounterOffer(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCounterOffer}
              disabled={loading || !counterPrice}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Offer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {canTakeAction() && !showCounterOffer && (
        <div className="flex gap-2">
          {userType === 'seller' && negotiation.status === NegotiationStatus.PENDING && (
            <>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </>
                )}
              </button>
              
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowCounterOffer(true)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Counter
              </button>
            </>
          )}

          {userType === 'buyer' && negotiation.status === NegotiationStatus.COUNTERED && (
            <>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Accept Offer
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowCounterOffer(true)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Counter Offer
              </button>
            </>
          )}
        </div>
      )}

      {/* View Thread Button */}
          <Link 
            href={`/negotiations/${negotiation.id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all active:scale-[0.98] group"
          >
            View Negotiation Thread
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
    </div>
  );
}
