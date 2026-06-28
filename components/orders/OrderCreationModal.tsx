'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Calculator, CreditCard, AlertCircle, CheckCircle } from '@/lib/icons';
import Image from 'next/image';
import { Product, PaymentMethod, OrderRequest } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';

interface OrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const OrderCreationModal: React.FC<OrderCreationModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.WALLET);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);

  const { createOrder, loading } = useOrderAction();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setPaymentMethod(PaymentMethod.MOBILE_MONEY);
      setNotes('');
      setErrors({});
      setProductName(product?.name || '');
      setUnitPrice(product?.unitPrice || 0);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;


  const totalPrice = unitPrice * quantity;
  const maxQuantity = product?.stockQuantity || 1000; // Default high limit for custom orders

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (quantity > maxQuantity) {
      newErrors.quantity = `Quantity cannot exceed available stock (${maxQuantity})`;
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const orderData: OrderRequest = {
      productId: product?.id || '',
      quantity,
      paymentMethod,
    };

    try {
      const result = await createOrder(orderData, { payImmediately: true });
      if (result) onClose();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 0;
    setQuantity(Math.max(0, Math.min(num, maxQuantity)));

    // Clear quantity error when user starts typing
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: '' }));
    }
  };

  const isOutOfStock = maxQuantity === 0;
  const isLowStock = maxQuantity > 0 && maxQuantity <= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Create Order</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b bg-card">
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
              <Image
                src={imageUrl(product?.image) || '/placeholder.png'}
                alt={product?.name || ''}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{product?.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product?.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-primary">
                    {product?.unitPrice?.toLocaleString()} RWF
                  </span>
                  <span className="text-sm text-muted-foreground">per {product?.measurementUnit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    isOutOfStock ? 'bg-destructive' : isLowStock ? 'bg-warning' : 'bg-success'
                  )} />
                  <span className={cn(
                    'text-sm font-medium',
                    isOutOfStock ? 'text-destructive' : isLowStock ? 'text-warning' : 'text-success'
                  )}>
                    {isOutOfStock ? 'Out of Stock' : `${maxQuantity} available`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleQuantityChange((quantity - 1).toString())}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
                max={maxQuantity}
                disabled={isOutOfStock}
                className={cn(
                  'w-20 text-center border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent',
                  errors.quantity && 'border-destructive',
                  isOutOfStock && 'bg-muted cursor-not-allowed'
                )}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange((quantity + 1).toString())}
                disabled={quantity >= maxQuantity || isOutOfStock}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-sm text-muted-foreground">
                {product?.measurementUnit}
              </span>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-sm text-destructive flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(PaymentMethod).map((method) => (
                <label
                  key={method}
                  className={cn(
                    'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
                    paymentMethod === method
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-background'
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCard size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {method.replace('_', ' ')}
                    </span>
                  </div>
                  {paymentMethod === method && (
                    <CheckCircle size={16} className="ml-auto text-success" />
                  )}
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-destructive flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Calculator size={16} className="mr-2" />
              Order Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price:</span>
                <span className="font-medium">{unitPrice.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{quantity} {product?.measurementUnit}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="font-semibold text-lg text-primary">
                  {totalPrice.toLocaleString()} RWF
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isOutOfStock}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                (isOutOfStock)
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading ? 'Processing payment…' : (isOutOfStock ? 'Out of Stock' : 'Create & pay')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreationModal;