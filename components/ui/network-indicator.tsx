'use client';

import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NetworkStatusIndicator } from './loading-states';

interface NetworkIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
}

export function NetworkIndicator({ className = '', showWhenOnline = false }: NetworkIndicatorProps) {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  // Only show when offline or slow connection (unless showWhenOnline is true)
  if (isOnline && !isSlowConnection && !showWhenOnline) {
    return null;
  }

  return (
    <NetworkStatusIndicator
      isOnline={isOnline}
      isSlowConnection={isSlowConnection}
      className={className}
    />
  );
}

// Global network indicator that can be placed in the layout
export function GlobalNetworkIndicator() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <NetworkIndicator className="mx-4 mt-4" />
    </div>
  );
}