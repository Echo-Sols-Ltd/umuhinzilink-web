'use client';

import React, { useState } from 'react';
import { X, Bell, BellOff, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable?: () => void;
  onSkip?: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  onClose,
  onEnable,
  onSkip,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { requestPermission, isSupported } = useBrowserNotification();

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      return;
    }

    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        onEnable?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onClose();
  };

  const handleLater = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon and title */}
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Enable Notifications
            </h2>
            <p className="text-sm text-gray-600">
              Stay updated with real-time alerts
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">New Messages</p>
              <p className="text-xs text-gray-600">
                Get notified when someone sends you a message
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Order Updates</p>
              <p className="text-xs text-gray-600">
                Track your orders in real-time
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">New Products</p>
              <p className="text-xs text-gray-600">
                Be the first to know about new products
              </p>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              You can change notification preferences anytime in your settings. 
              We'll only send notifications for important updates.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleEnableNotifications}
            disabled={isRequesting || !isSupported}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRequesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Requesting Permission...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              variant="ghost"
              onClick={handleLater}
              className="flex-1"
            >
              Ask Later
            </Button>
          </div>
        </div>

        {/* Settings link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Navigate to settings or open browser settings
              window.open('chrome://settings/content/notifications', '_blank');
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto"
          >
            <Settings className="w-3 h-3 mr-1" />
            Manage browser settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Small notification prompt for less intrusive approach
export const NotificationPrompt: React.FC<{
  onEnable: () => void;
  onDismiss: () => void;
  className?: string;
}> = ({ onEnable, onDismiss, className = '' }) => {
  const { requestPermission, isSupported } = useBrowserNotification();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnable = async () => {
    if (!isSupported) return;
    
    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        onEnable();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Enable notifications for real-time updates
            </p>
            <p className="text-xs text-blue-700">
              Get alerts for messages, orders, and new products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onDismiss}
            className="text-blue-700 border-blue-300"
          >
            <BellOff className="w-4 h-4 mr-1" />
            No thanks
          </Button>
          <Button
            size="sm"
            onClick={handleEnable}
            disabled={isRequesting || !isSupported}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRequesting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Enable'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
