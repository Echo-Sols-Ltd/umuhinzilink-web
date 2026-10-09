'use client';

import React, { useState } from 'react';
import { X, Bell, MessageCircle, Package, ShoppingBag, Settings } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { useBrowserNotification } from '@/hooks/useBrowserNotification';
import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();
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
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="bg-success p-3 rounded-2xl mr-4 shadow-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t('notificationPermission.modal.title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('notificationPermission.modal.subtitle')}
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

        <div className="p-6">
          <p className="text-foreground mb-6 leading-relaxed">
            {t('notificationPermission.modal.description')}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {t('notificationPermission.modal.benefits.messages.title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('notificationPermission.modal.benefits.messages.description')}
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {t('notificationPermission.modal.benefits.orders.title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('notificationPermission.modal.benefits.orders.description')}
                </p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-success/10 rounded-2xl border border-success/20">
              <div className="bg-success p-2 rounded-xl mr-4 shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {t('notificationPermission.modal.benefits.products.title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('notificationPermission.modal.benefits.products.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleEnableNotifications}
              disabled={isRequesting || !isSupported}
              className="w-full bg-success hover:bg-success/90 text-white shadow-lg"
            >
              {isRequesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('notificationPermission.modal.requesting')}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {t('notificationPermission.modal.enable')}
                </>
              )}
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                {t('notificationPermission.modal.skip')}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLater}
                className="flex-1"
              >
                {t('notificationPermission.modal.askLater')}
              </Button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                window.open('chrome://settings/content/notifications', '_blank');
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center mx-auto"
            >
              <Settings className="w-3 h-3 mr-1" />
              {t('notificationPermission.modal.manageBrowserSettings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationPrompt: React.FC<{
  onEnable: () => void;
  onDismiss: () => void;
  className?: string;
}> = ({ onEnable, onDismiss, className = '' }) => {
  const { t } = useI18n();
  const { requestPermission, isSupported } = useBrowserNotification();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnable = async () => {
    if (!isSupported) return;
    
    setIsRequesting(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        onEnable();
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
            {t('notificationPermission.prompt.title')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('notificationPermission.prompt.description')}
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
                  {t('notificationPermission.prompt.requesting')}
                </>
              ) : (
                t('notificationPermission.prompt.enableNow')
              )}
            </button>
            
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-muted transition-colors duration-200"
            >
              {t('notificationPermission.prompt.notNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
