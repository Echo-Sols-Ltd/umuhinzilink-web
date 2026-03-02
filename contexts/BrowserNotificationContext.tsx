'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationPermissionModal, NotificationPrompt } from '@/components/notifications/NotificationPermissionModal';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';
import { useAuth } from './AuthContext';

interface BrowserNotificationContextType {
  showPermissionModal: () => void;
  showPrompt: () => void;
  hideModal: () => void;
  hasAskedBefore: boolean;
  setHasAskedBefore: (asked: boolean) => void;
}

const BrowserNotificationContext = createContext<BrowserNotificationContextType | undefined>(undefined);

export function BrowserNotificationProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasAskedBefore, setHasAskedBefore] = useState(false);
  const { permission, requestPermission, isEnabled } = useBrowserNotification();
  const { user } = useAuth()

  // Check if user has been asked before
  useEffect(() => {
    const asked = localStorage.getItem('notification_permission_asked');
    if (asked === 'true') {
      setHasAskedBefore(true);
    }
  }, [isEnabled]);

  // Show prompt on first visit if permission is default
  useEffect(() => {
    if (!hasAskedBefore && permission === 'default' && !isModalOpen && user) {
      // Show prompt after 3 seconds of user being on the site
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAskedBefore, permission, isModalOpen, user]);

  const showPermissionModal = () => {
    setIsModalOpen(true);
    setShowPrompt(false);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setShowPrompt(false);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      localStorage.setItem('notification_permission_asked', 'true');
      setHasAskedBefore(true);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('notification_permission_asked', 'true');
    setHasAskedBefore(true);
  };

  const handleDismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('notification_permission_asked', 'true');
    setHasAskedBefore(true);
  };

  return (
    <BrowserNotificationContext.Provider
      value={{
        showPermissionModal,
        showPrompt: () => setShowPrompt(true),
        hideModal,
        hasAskedBefore,
        setHasAskedBefore,
      }}
    >
      {children}

      {/* Permission Modal */}
      <NotificationPermissionModal
        isOpen={isModalOpen}
        onClose={hideModal}
        onEnable={handleEnableNotifications}
        onSkip={handleSkip}
      />

      {/* Small Prompt */}
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-96">
          <NotificationPrompt
            onEnable={handleEnableNotifications}
            onDismiss={handleDismissPrompt}
          />
        </div>
      )}
    </BrowserNotificationContext.Provider>
  );
}

function useBrowserNotificationContext() {
  const context = useContext(BrowserNotificationContext);
  if (context === undefined) {
    throw new Error('useBrowserNotificationContext must be used within a BrowserNotificationProvider');
  }
  return context;
}
