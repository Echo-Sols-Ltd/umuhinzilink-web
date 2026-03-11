'use client';

import React from 'react';
import {
  CheckCircle,
  Package,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Order } from '@/types';

interface SatisfactionConfirmationModalProps {
  order: FarmerOrder | SupplierOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

const SatisfactionConfirmationModal: React.FC<SatisfactionConfirmationModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error confirming satisfaction:', error);
    }
  };

  const isDelivered = order.delivery?.trackingSteps?.some(
    step => step.status === 'DELIVERED' && step.completed
  ) || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Confirm Safe Delivery
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isDelivered ? (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Order Not Yet Delivered
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  You can only confirm satisfaction after your order has been delivered.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Please confirm that you have received your order safely and are satisfied with the delivery.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Quantity: {order.quantity} • Order #{order.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Total: ${order.totalPrice.toFixed(2)}</p>
                    <p>Delivery Status: {order.delivery?.trackingSteps?.find(step => step.completed)?.status || 'In Progress'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Once you confirm satisfaction, the seller will be notified that the order was delivered safely.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-card/50 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          {isDelivered && (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Safe Delivery
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SatisfactionConfirmationModal;
