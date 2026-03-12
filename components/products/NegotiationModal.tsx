'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import { useCart } from '@/contexts/CartContext';
import { X, DollarSign, MessageCircle, AlertCircle } from 'lucide-react';
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground">Negotiate Price</h2>
                        <p className="text-sm text-muted-foreground">Propose a fair price to the seller.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Product Summary */}
                    <div className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <img 
                            src={product.image || '/placeholder-product.png'} 
                            alt={product.name}
                            className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                            <h3 className="font-bold text-foreground">{product.name}</h3>
                            <p className="text-sm text-primary font-black">{product.unitPrice.toLocaleString()} RWF / unit</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Quantity</label>
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-full h-12 bg-muted/50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Your Proposal (Unit)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <input 
                                    type="number"
                                    value={proposedPrice}
                                    onChange={(e) => setProposedPrice(e.target.value)}
                                    className="w-full h-12 bg-muted/50 border-none rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-black text-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3 italic">
                        <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-xs text-primary/80">
                            A lower price might be rejected by the seller. Try to be fair to increase your chances of acceptance.
                        </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleNegotiate}
                            disabled={loading}
                            className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <MessageCircle className="w-5 h-5" />
                            )}
                            Send Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
