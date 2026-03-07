'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current page/tab is visible to the user
 * Uses the Page Visibility API to track when user switches tabs or minimizes browser
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Initialize with current visibility state
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true; // Default to visible for SSR
  });

  const [wasHidden, setWasHidden] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const currentState = document.visibilityState === 'visible';
      const wasPreviouslyHidden = !currentState;
      
      setIsVisible(currentState);
      setWasHidden(wasPreviouslyHidden);
      
    };

    // Initial check
    handleVisibilityChange();

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isVisible,
    isHidden: !isVisible,
    wasHidden, // True if page was hidden before becoming visible
    visibilityState: typeof document !== 'undefined' ? document.visibilityState : 'visible'
  };
};

/**
 * Higher-order hook that combines page visibility with notification logic
 * Returns whether to show in-app notifications or browser notifications
 */
export const useNotificationStrategy = () => {
  const { isVisible, isHidden, wasHidden } = usePageVisibility();

  return {
    // Use in-app notifications when page is visible
    shouldUseInAppNotifications: isVisible,
    
    // Use browser notifications when page is hidden
    shouldUseBrowserNotifications: isHidden,
    
    // Show browser notification if user just returned to page (missed notifications)
    shouldShowMissedNotifications: wasHidden && isVisible,
    
    // Current visibility state for debugging
    pageVisibility: isVisible ? 'visible' : 'hidden'
  };
};
