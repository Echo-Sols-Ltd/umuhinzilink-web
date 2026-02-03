'use client';

import React from 'react';
import { Button } from './button';
import { toast } from './use-toast';

export const ToastDemo: React.FC = () => {
  const handleSuccessToast = () => {
    toast.success('Order placed successfully!', {
      title: 'Success',
      duration: 4000,
    });
  };

  const handleErrorToast = () => {
    toast.error('Failed to process payment. Please try again.', {
      title: 'Payment Error',
      duration: 6000,
    });
  };

  const handleWarningToast = () => {
    toast.warning('Your session will expire in 5 minutes.', {
      title: 'Session Warning',
      duration: 5000,
    });
  };

  const handleInfoToast = () => {
    toast.info('New features are now available in your dashboard.', {
      title: 'Information',
      duration: 4000,
    });
  };

  const handleLoadingToast = () => {
    const loadingId = toast.loading('Processing your order...', {
      title: 'Please Wait',
    });

    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingId);
      toast.success('Order processed successfully!', {
        title: 'Complete',
      });
    }, 3000);
  };

  const handleActionToast = () => {
    toast.info('Your product has been added to favorites.', {
      title: 'Product Saved',
      action: {
        label: 'View Favorites',
        onClick: () => {
          console.log('Navigate to favorites');
        },
      },
    });
  };

  const handleLongMessageToast = () => {
    toast.success(
      'Your order for Fresh Organic Tomatoes (5kg), Premium Carrots (3kg), and Leafy Green Vegetables (2kg) has been successfully placed and will be delivered to your address within 2-3 business days. You will receive a confirmation email shortly.',
      {
        title: 'Order Confirmation',
        action: {
          label: 'Track Order',
          onClick: () => {
            console.log('Navigate to order tracking');
          },
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Modal Toast Demo</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Button onClick={handleSuccessToast} variant="default" className="bg-green-600 hover:bg-green-700">
          Success Toast
        </Button>

        <Button onClick={handleErrorToast} variant="destructive">
          Error Toast
        </Button>

        <Button onClick={handleWarningToast} className="bg-yellow-600 hover:bg-yellow-700">
          Warning Toast
        </Button>

        <Button onClick={handleInfoToast} className="bg-blue-600 hover:bg-blue-700">
          Info Toast
        </Button>

        <Button onClick={handleLoadingToast} variant="outline">
          Loading Toast
        </Button>

        <Button onClick={handleActionToast} className="bg-purple-600 hover:bg-purple-700">
          Action Toast
        </Button>

        <Button onClick={handleLongMessageToast} variant="outline" className="col-span-2">
          Long Message Toast
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Centered modal-style notifications</li>
          <li>• Backdrop blur effect</li>
          <li>• Smooth animations</li>
          <li>• Action buttons support</li>
          <li>• Auto-dismiss with custom duration</li>
          <li>• Click outside to dismiss</li>
          <li>• Loading state support</li>
          <li>• Responsive design</li>
        </ul>
      </div>
    </div>
  );
};