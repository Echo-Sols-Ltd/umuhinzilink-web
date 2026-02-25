'use client';

import React, { useState } from 'react';
import { Bell, BellOff, Settings, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';
import { useBrowserNotificationContext } from '@/contexts/BrowserNotificationContext';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const { permission, requestPermission, isEnabled, isSupported } = useBrowserNotification();
  const { showPermissionModal } = useBrowserNotificationContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    if (!isSupported) return;
    
    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (!granted) {
        // If denied, show modal for better UX
        showPermissionModal();
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionStatus = () => {
    if (!isSupported) return { status: 'unsupported', text: 'Not supported', color: 'text-gray-500' };
    if (permission === 'granted') return { status: 'granted', text: 'Enabled', color: 'text-green-600' };
    if (permission === 'denied') return { status: 'denied', text: 'Blocked', color: 'text-red-600' };
    return { status: 'default', text: 'Not enabled', color: 'text-yellow-600' };
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${
            permissionStatus.status === 'granted' ? 'bg-green-100' : 
            permissionStatus.status === 'denied' ? 'bg-red-100' : 
            'bg-gray-100'
          }`}>
            {permissionStatus.status === 'granted' ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : permissionStatus.status === 'denied' ? (
              <BellOff className="w-5 h-5 text-red-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Browser Notifications</h3>
            <p className={`text-sm ${permissionStatus.color}`}>
              {permissionStatus.text}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('chrome://settings/content/notifications', '_blank')}
          className="text-gray-600"
        >
          <Settings className="w-4 h-4 mr-1" />
          Browser Settings
        </Button>
      </div>

      {/* Status Description */}
      <div className={`mb-6 p-4 rounded-lg ${
        permissionStatus.status === 'granted' ? 'bg-green-50 border border-green-200' :
        permissionStatus.status === 'denied' ? 'bg-red-50 border border-red-200' :
        'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-start">
          <Info className={`w-4 h-4 mr-2 mt-0.5 ${
            permissionStatus.status === 'granted' ? 'text-green-600' :
            permissionStatus.status === 'denied' ? 'text-red-600' :
            'text-gray-600'
          }`} />
          <div className="text-sm">
            {permissionStatus.status === 'granted' && (
              <p className="text-green-800">
                You'll receive notifications for new messages, order updates, and product changes.
              </p>
            )}
            {permissionStatus.status === 'denied' && (
              <div>
                <p className="text-red-800 font-medium mb-2">
                  Notifications are blocked in your browser settings.
                </p>
                <p className="text-red-700">
                  To enable notifications, click the "Browser Settings" button above and allow this site to show notifications.
                </p>
              </div>
            )}
            {permissionStatus.status === 'default' && (
              <p className="text-gray-800">
                Enable notifications to stay updated with real-time alerts for messages, orders, and products.
              </p>
            )}
            {!isSupported && (
              <p className="text-gray-800">
                Your browser doesn't support desktop notifications. Try using a modern browser like Chrome, Firefox, or Safari.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isSupported && permissionStatus.status !== 'granted' && (
        <div className="flex gap-3">
          {permissionStatus.status === 'default' && (
            <Button
              onClick={handleEnableNotifications}
              disabled={isRequesting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
          )}
          
          {permissionStatus.status === 'denied' && (
            <Button
              onClick={showPermissionModal}
              variant="outline"
              className="text-blue-600 border-blue-300"
            >
              Learn How to Enable
            </Button>
          )}
        </div>
      )}

      {/* Notification Types Info */}
      {isEnabled && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900 mb-3">You'll receive notifications for:</h4>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">New messages from other users</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">New order placements</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">Order status changes</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">Delivery status updates</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-3" />
              <span className="text-gray-700">New product listings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick toggle component for settings panels
export const NotificationToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isEnabled, permission } = useBrowserNotification();
  const { showPermissionModal } = useBrowserNotificationContext();

  if (!isEnabled && permission === 'denied') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={showPermissionModal}
        className={`text-red-600 border-red-300 ${className}`}
      >
        <BellOff className="w-4 h-4 mr-1" />
        Enable Notifications
      </Button>
    );
  }

  if (!isEnabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={showPermissionModal}
        className={`text-blue-600 border-blue-300 ${className}`}
      >
        <Bell className="w-4 h-4 mr-1" />
        Enable Notifications
      </Button>
    );
  }

  return (
    <div className={`flex items-center text-green-600 ${className}`}>
      <Bell className="w-4 h-4 mr-1" />
      <span className="text-sm">Notifications enabled</span>
    </div>
  );
};
