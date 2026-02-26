'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Calculator, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { FarmerProduct, SupplierProduct, PaymentMethod } from '@/types';
import { cn, imageUrl } from '@/lib/utils';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';

interface OrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: FarmerProduct | SupplierProduct | null;
  productType?: 'farmer' | 'supplier';
  orderType?: 'buyer' | 'supplier';
}

const OrderCreationModal: React.FC<OrderCreationModalProps> = ({
  isOpen,
  onClose,
  product,
  productType,
  orderType = 'buyer',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);

  const { createFarmerOrder, createSupplierOrder, loading } = useOrderAction();

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

  // For supplier order type (farmer requesting from supplier), no product is required
  if (orderType !== 'supplier' && !product) return null;

  const totalPrice = unitPrice * quantity;
  const maxQuantity = product?.quantity || 1000; // Default high limit for custom orders

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (orderType === 'supplier') {
      if (!productName.trim()) {
        newErrors.productName = 'Product name is required';
      }
      if (unitPrice <= 0) {
        newErrors.unitPrice = 'Unit price must be greater than 0';
      }
    }

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

    const orderData = {
      productId: product?.id,
      quantity,
      totalPrice,
      paymentMethod,
      notes: notes.trim() || undefined,
      // For supplier orders, include product details
      ...(orderType === 'supplier' && {
        productName: productName.trim(),
        unitPrice,
      }),
    };

    try {
      if (orderType === 'supplier') {
        await createSupplierOrder(orderData);
      } else if (productType === 'farmer') {
        await createFarmerOrder(orderData);
      } else {
        await createSupplierOrder(orderData);
      }
      onClose();
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create Order</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b bg-white">
          {orderType === 'supplier' ? (
            // Custom product input for supplier orders
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Request Agricultural Input</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Fertilizer, Seeds, Pesticides"
                  className={cn(
                    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                    errors.productName && 'border-red-500'
                  )}
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.productName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Unit Price (RWF) *
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className={cn(
                    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                    errors.unitPrice && 'border-red-500'
                  )}
                />
                {errors.unitPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.unitPrice}
                  </p>
                )}
              </div>
            </div>
          ) : (
            // Existing product display
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={imageUrl(product?.image) || '/placeholder.png'}
                  alt={product?.name || ''}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{product?.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product?.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-green-600">
                      {product?.unitPrice?.toLocaleString()} RWF
                    </span>
                    <span className="text-sm text-gray-500">per {product?.measurementUnit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {isOutOfStock ? 'Out of Stock' : `${maxQuantity} available`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleQuantityChange((quantity - 1).toString())}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                  errors.quantity && 'border-red-500',
                  isOutOfStock && 'bg-gray-100 cursor-not-allowed'
                )}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange((quantity + 1).toString())}
                disabled={quantity >= maxQuantity || isOutOfStock}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-sm text-gray-500">
                {orderType === 'supplier' ? 'units' : product?.measurementUnit}
              </span>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.values(PaymentMethod).map((method) => (
                <label
                  key={method}
                  className={cn(
                    'flex items-center p-3 border rounded-lg cursor-pointer transition-colors',
                    paymentMethod === method
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:bg-white'
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
                    <CreditCard size={16} className="text-gray-500" />
                    <span className="text-sm font-medium">
                      {method.replace('_', ' ')}
                    </span>
                  </div>
                  {paymentMethod === method && (
                    <CheckCircle size={16} className="ml-auto text-green-600" />
                  )}
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Calculator size={16} className="mr-2" />
              Order Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-medium">{unitPrice.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{quantity} {orderType === 'supplier' ? 'units' : product?.measurementUnit}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-semibold text-lg text-green-600">
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (orderType !== 'supplier' && isOutOfStock)}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                (orderType !== 'supplier' && isOutOfStock)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading ? 'Creating Order...' : (orderType === 'supplier' ? 'Send Request' : (isOutOfStock ? 'Out of Stock' : 'Create Order'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreationModal;