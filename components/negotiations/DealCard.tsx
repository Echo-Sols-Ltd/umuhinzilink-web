'use client';

import React from 'react';
import Image from 'next/image';
import { Negotiation, NegotiationStatus } from '@/types';
import { formatCurrency, getPriceProximity } from '@/lib/negotiation-utils';
import { Clock, User, CheckCircle2, MapPin, Package, BadgeCheck } from 'lucide-react';

interface DealCardProps {
  negotiation: Negotiation;
}

export const DealCard: React.FC<DealCardProps> = ({ negotiation }) => {
  const { order, buyerProposedPrice, expiresAt, timeRemaining } = negotiation;
  const { product } = order;
  const originalPrice = product.unitPrice;
  const proximity = getPriceProximity(originalPrice, buyerProposedPrice);
  
  // Progress bar color based on proximity
  const barColor = proximity > 80 ? 'bg-green-500' : proximity > 50 ? 'bg-yellow-500' : 'bg-red-500';

  // Expiry styling
  const isUrgent = timeRemaining.includes('h') || timeRemaining.includes('m');
  const isExpiringSoon = timeRemaining.includes('h') && parseInt(timeRemaining) < 1;
  const expiryColor = isExpiringSoon ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-gray-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      {/* Product Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image 
          src={product.image || '/placeholder-product.jpg'} 
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{product.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>District Location</span> {/* Assuming location would be on product or seller */}
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Listed Price</p>
              <p className="text-lg text-gray-400 line-through decoration-1">{formatCurrency(originalPrice)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-green-600 uppercase tracking-widest mb-1">Proposed Price</p>
              <p className="text-3xl font-black text-green-600">{formatCurrency(buyerProposedPrice)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${barColor}`} 
                style={{ width: `${proximity}%` }}
              />
            </div>
            <p className="text-[10px] text-center text-gray-400 font-medium">
                {proximity > 90 ? 'Offer is very close to target' : proximity > 50 ? 'Negotiation in progress' : 'Offer is far from target'}
            </p>
          </div>
        </div>

        <hr className="border-gray-50" />

        {/* Seller Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden relative border border-primary/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">Amina Uwase</span>
              <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />
              </div>
              <p className="text-xs text-gray-500">Premium Farmer</p>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1 justify-end">
                <Clock className={`w-3.5 h-3.5 ${expiryColor}`} />
                <span className={`text-xs font-bold ${expiryColor}`}>Details</span>
             </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Quantity</p>
            <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-100">
               <Package className="w-3 h-3 text-primary" />
               <span className="text-sm font-bold text-gray-700">{order.quantity} {product.measurementUnit}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Certification</p>
            <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-100">
               <CheckCircle2 className="w-3 h-3 text-green-500" />
               <span className="text-sm font-bold text-gray-700">RICA Cert</span>
            </div>
          </div>
        </div>

        {/* Expiry Countdown */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${isExpiringSoon ? 'bg-red-50 border-red-100' : isUrgent ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex justify-between items-center w-full">
            <p className="text-xs font-bold text-gray-500">Negotiation expires in</p>
            <p className={`text-sm font-black ${expiryColor}`}>{timeRemaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
