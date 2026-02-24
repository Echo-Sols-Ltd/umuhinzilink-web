'use client'

import { useEffect } from "react";

export function usePolling(
  callback: () => Promise<void>,
  interval: number,
  dependencies: any[] = []
) {
  useEffect(() => {
    let isActive = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      try {
        await callback();
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        if (isActive) {
          timeoutId = setTimeout(poll, interval);
        }
      }
    };

    poll();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [callback, interval, dependencies]);
}