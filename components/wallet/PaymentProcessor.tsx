'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Shield,
  Info
} from 'lucide-react';
import { PaymentRequest, PaymentResponseDTO } from '@/types/wallet';
import { FarmerOrder, SupplierOrder, PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';

export interface PaymentProcessorProps {
  order: FarmerOrder | SupplierOrder;
  walletBalance?: number;
  onPaymentComplete?: (payment: PaymentResponseDTO) => void;
  onCancel?: () => void;
  onProcessPayment?: (request: PaymentRequest) => Promise<PaymentResponseDTO>;
  className?: string;
}

type PaymentStep = 'method' | 'details' | 'processing' | 'result';

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  order,
  walletBalance = 0,
  onPaymentComplete,
  onCancel,
  onProcessPayment,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
    notes: '',
  });
  const [paymentResult, setPaymentResult] = useState<PaymentResponseDTO | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderAmount = order.totalPrice;
  const hasInsufficientFunds = walletBalance < orderAmount;

  const paymentMethods = [
    {
      id: PaymentMethod.MOBILE_MONEY,
      name: 'Mobile Money',
      description: 'Pay using MTN Mobile Money or Airtel Money',
      icon: Smartphone,
      available: true,
      processingTime: 'Instant',
    },
    {
      id: PaymentMethod.BANK_TRANSFER,
      name: 'Bank Transfer',
      description: 'Transfer from your bank account',
      icon: Building,
      available: true,
      processingTime: '1-2 business days',
    },
    {
      id: PaymentMethod.WALLET,
      name: 'Wallet Balance',
      description: `Available: $${walletBalance.toFixed(2)}`,
      icon: Wallet,
      available: !hasInsufficientFunds,
      processingTime: 'Instant',
    },
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setError(null);
    
    if (method === PaymentMethod.WALLET) {
      setCurrentStep('processing');
      processPayment(method);
    } else {
      setCurrentStep('details');
    }
  };

  const handleDetailsSubmit = () => {
    if (!selectedMethod) return;
    
    // Validate required fields based on payment method
    if (selectedMethod === PaymentMethod.MOBILE_MONEY && !paymentDetails.phoneNumber) {
      setError('Phone number is required for mobile money payments');
      return;
    }
    
    if (selectedMethod === PaymentMethod.BANK_TRANSFER && (!paymentDetails.accountNumber || !paymentDetails.bankName)) {
      setError('Account number and bank name are required for bank transfers');
      return;
    }

    setCurrentStep('processing');
    processPayment(selectedMethod);
  };

  const processPayment = async (method: PaymentMethod) => {
    if (!onProcessPayment) return;
    
    setProcessing(true);
    setError(null);

    try {
      const request: PaymentRequest = {
        orderId: order.id,
        paymentMethod: method,
        phoneNumber: method === PaymentMethod.MOBILE_MONEY ? paymentDetails.phoneNumber : undefined,
        accountNumber: method === PaymentMethod.BANK_TRANSFER ? paymentDetails.accountNumber : undefined,
        bankName: method === PaymentMethod.BANK_TRANSFER ? paymentDetails.bankName : undefined,
        notes: paymentDetails.notes || undefined,
      };

      const result = await onProcessPayment(request);
      setPaymentResult(result);
      setCurrentStep('result');
      
      if (result.status === 'COMPLETED' && onPaymentComplete) {
        onPaymentComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      setCurrentStep('method');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Payment Method</h2>
        <p className="text-gray-600">Select how you'd like to pay for your order</p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              disabled={!method.available}
              className={cn(
                'w-full p-4 border rounded-lg text-left transition-colors',
                method.available
                  ? 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  method.available ? 'bg-green-100' : 'bg-gray-100'
                )}>
                  <Icon className={cn(
                    'w-5 h-5',
                    method.available ? 'text-green-600' : 'text-gray-400'
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Processing: {method.processingTime}</p>
                </div>
                {method.id === PaymentMethod.WALLET && hasInsufficientFunds && (
                  <div className="text-right">
                    <span className="text-xs text-red-600 font-medium">Insufficient funds</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {hasInsufficientFunds && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Insufficient wallet balance</p>
              <p className="mt-1">
                You need {formatCurrency(orderAmount - walletBalance)} more to pay with your wallet.
                Consider adding money to your wallet or choose another payment method.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setCurrentStep('method')}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
      </div>

      {selectedMethod === PaymentMethod.MOBILE_MONEY && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={paymentDetails.phoneNumber}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+250 788 123 456"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your MTN Mobile Money or Airtel Money number
          </p>
        </div>
      )}

      {selectedMethod === PaymentMethod.BANK_TRANSFER && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <select
              value={paymentDetails.bankName}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select your bank</option>
              <option value="Bank of Kigali">Bank of Kigali</option>
              <option value="Equity Bank">Equity Bank</option>
              <option value="Cogebanque">Cogebanque</option>
              <option value="GT Bank">GT Bank</option>
              <option value="Access Bank">Access Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={paymentDetails.accountNumber}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Enter your account number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={paymentDetails.notes}
          onChange={(e) => setPaymentDetails(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any additional notes for this payment"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Secure Payment</p>
            <p className="mt-1">
              Your payment information is encrypted and secure. We never store your banking details.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={() => setCurrentStep('method')}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleDetailsSubmit}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Payment
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
      <p className="text-gray-600">Please wait while we process your payment...</p>
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            Do not close this window or navigate away during payment processing.
          </p>
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!paymentResult) return null;

    const isSuccess = paymentResult.status === 'COMPLETED';
    const isPending = paymentResult.status === 'PENDING' || paymentResult.status === 'PROCESSING';
    const isFailed = paymentResult.status === 'FAILED' || paymentResult.status === 'CANCELLED';

    return (
      <div className="text-center py-8">
        <div className="mb-4">
          {isSuccess && <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />}
          {isPending && <Clock className="w-16 h-16 text-yellow-600 mx-auto" />}
          {isFailed && <XCircle className="w-16 h-16 text-red-600 mx-auto" />}
        </div>

        <h2 className={cn(
          'text-xl font-semibold mb-2',
          isSuccess && 'text-green-900',
          isPending && 'text-yellow-900',
          isFailed && 'text-red-900'
        )}>
          {isSuccess && 'Payment Successful!'}
          {isPending && 'Payment Processing'}
          {isFailed && 'Payment Failed'}
        </h2>

        <p className="text-gray-600 mb-4">
          {isSuccess && 'Your payment has been processed successfully.'}
          {isPending && 'Your payment is being processed. You will receive a confirmation shortly.'}
          {isFailed && 'There was an issue processing your payment. Please try again.'}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Transaction ID:</span>
              <span className="ml-2 font-medium">{paymentResult.transactionId}</span>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium">{formatCurrency(paymentResult.amount)}</span>
            </div>
            <div>
              <span className="text-gray-600">Method:</span>
              <span className="ml-2 font-medium">{paymentResult.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Reference:</span>
              <span className="ml-2 font-medium">{paymentResult.reference}</span>
            </div>
          </div>
        </div>

        {paymentResult.message && (
          <div className={cn(
            'border rounded-lg p-3 mb-4',
            isSuccess && 'bg-green-50 border-green-200',
            isPending && 'bg-yellow-50 border-yellow-200',
            isFailed && 'bg-red-50 border-red-200'
          )}>
            <p className={cn(
              'text-sm',
              isSuccess && 'text-green-800',
              isPending && 'text-yellow-800',
              isFailed && 'text-red-800'
            )}>
              {paymentResult.message}
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          {isFailed && (
            <button
              onClick={() => setCurrentStep('method')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isSuccess || isPending ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-lg', className)}>
      {/* Order Summary */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
            <p className="font-medium text-gray-900">{order.product.name}</p>
            <p className="text-sm text-gray-600">Quantity: {order.quantity} {order.product.measurementUnit}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(orderAmount)}</p>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="p-6">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'details' && renderPaymentDetails()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'result' && renderResult()}
      </div>
    </div>
  );
};

export default PaymentProcessor;