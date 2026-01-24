'use client';

import React from 'react';
import { NotificationProvider } from '@/components/ui/enhanced-notification-system';
import { NotificationStackProvider } from '@/components/ui/notification-stack';
import { EnhancedFeedbackDemo } from '@/components/ui/enhanced-feedback-demo';

export default function EnhancedFeedbackDemoPage() {
  return (
    <NotificationProvider>
      <NotificationStackProvider maxVisible={5} position="top-right">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <EnhancedFeedbackDemo />
        </div>
      </NotificationStackProvider>
    </NotificationProvider>
  );
}