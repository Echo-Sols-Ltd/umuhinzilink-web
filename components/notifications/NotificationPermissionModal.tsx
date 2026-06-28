'use client';

import React, { useState } from 'react';
import { X, Bell, MessageCircle, Package, ShoppingBag, Settings } from '@/lib/icons';
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
        // Auto-close modal after successful permission grant
        setTimeout(() => {
          onClose();
        }, 1000);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="bg-success p-3 rounded-2xl mr-4 shadow-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Enable Notifications
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated with real-time alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-foreground mb-6 leading-relaxed">
            Get instant notifications for new messages, order updates, and product changes. 
            Stay connected and never miss important updates.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">New Messages</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone sends you a message
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Order Updates</p>
                <p className="text-sm text-muted-foreground">
                  Track your orders in real-time
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">New Products</p>
                <p className="text-sm text-muted-foreground">
                  Discover new items in the marketplace
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleEnableNotifications}
              disabled={isRequesting || !isSupported}
              className="w-full bg-success hover:bg-success/90 text-white shadow-lg"
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
          <div className="text-center mt-4">
            <button
              onClick={() => {
                // Navigate to settings or open browser settings
                window.open('chrome://settings/content/notifications', '_blank');
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center mx-auto"
            >
              <Settings className="w-3 h-3 mr-1" />
              Manage browser settings
            </button>
          </div>
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
        // Auto-dismiss prompt after successful permission grant
        setTimeout(() => {
          onDismiss();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className={`bg-card rounded-2xl shadow-2xl border border-success/20 p-4 ${className}`}>
      <div className="flex items-start">
        <div className="bg-success p-3 rounded-xl mr-4 shadow-md">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Enable Notifications?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get instant alerts for messages, orders, and updates
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleEnable}
              disabled={isRequesting || !isSupported}
              className="bg-success hover:bg-success/90 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200"
            >
              {isRequesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Requesting...
                </>
              ) : (
                'Enable Now'
              )}
            </button>
            
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-muted transition-colors duration-200"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
