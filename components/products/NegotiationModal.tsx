'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { X, DollarSign, MessageCircle, AlertCircle, TrendingDown, Clock } from 'lucide-react';
import { notify } from '@/lib/notify';

interface NegotiationModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function NegotiationModal({ product, isOpen, onClose }: NegotiationModalProps) {
    const { t } = useI18n();
    const { addItemForNegotiation } = useCart();
    const [proposedPrice, setProposedPrice] = useState(product.unitPrice.toString());
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    // Calculate savings
    const currentPrice = product.unitPrice;
    const proposed = parseFloat(proposedPrice) || 0;
    const savings = currentPrice - proposed;
    const savingsPercentage = currentPrice > 0 ? (savings / currentPrice) * 100 : 0;
    const totalSavings = savings * quantity;

    if (!isOpen) return null;

    const handleNegotiate = async () => {
        const price = parseFloat(proposedPrice);
        if (isNaN(price) || price <= 0) {
            notify.error('Please enter a valid price', 'Invalid Price');
            return;
        }

        if (price >= product.unitPrice) {
            notify.error('Your proposed price should be lower than the current price', 'Invalid Proposal');
            return;
        }

        setLoading(true);
        try {
            await addItemForNegotiation({
                productId: product.id,
                quantity: quantity,
                proposedPrice: price,
                type: 1 // CartItemType.NEGOTIATION
            });
            notify.success('Item added for negotiation', 'Success');
            onClose();
        } catch (error) {
            console.error('Negotiation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-white to-gray-50 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground">Negotiate Price</h2>
                            <p className="text-sm text-muted-foreground">Make a fair offer to the seller</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Product Summary */}
                    <div className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50">
                        <img 
                            src={product.image || '/placeholder-product.png'} 
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-black text-primary">{currentPrice.toLocaleString()} RWF</span>
                                <span className="text-sm text-gray-500">/ unit</span>
                            </div>
                            {product.isNegotiable && (
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingDown className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600 font-semibold">Negotiable</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Comparison */}
                    {proposed > 0 && proposed < currentPrice && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-green-800">Your Savings</span>
                                <TrendingDown className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Per unit:</span>
                                    <span className="font-bold text-green-800">{savings.toLocaleString()} RWF</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Total ({quantity} units):</span>
                                    <span className="font-bold text-green-800">{totalSavings.toLocaleString()} RWF</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Discount:</span>
                                    <span className="font-bold text-green-800">{savingsPercentage.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Quantity</label>
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Your Offer (Unit)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <input 
                                    type="number"
                                    value={proposedPrice}
                                    onChange={(e) => setProposedPrice(e.target.value)}
                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-primary shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Suggestions */}
                    <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 15].map((discount) => {
                            const suggestedPrice = currentPrice * (1 - discount / 100);
                            return (
                                <button
                                    key={discount}
                                    onClick={() => setProposedPrice(suggestedPrice.toString())}
                                    className="p-2 bg-gray-50 hover:bg-primary/10 border border-gray-200 hover:border-primary/30 rounded-lg transition-all text-xs font-semibold"
                                >
                                    -{discount}% ({suggestedPrice.toLocaleString()} RWF)
                                </button>
                            );
                        })}
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div className="text-xs text-amber-800 space-y-1">
                            <p className="font-semibold">Negotiation Tips:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Be reasonable with your offer</li>
                                <li>Consider market prices and quality</li>
                                <li>Sellers may counter-offer</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleNegotiate}
                            disabled={loading || proposed <= 0 || proposed >= currentPrice}
                            className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <MessageCircle className="w-5 h-5" />
                                    Send Proposal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
