'use client';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

type GoogleLoginProps = {
  size?: 'large' | 'medium' | 'small';
  mode?: 'signin' | 'signup';
  className?: string;
};

const GSI_SCRIPT_ID = 'google-gsi-client';
let gsiInitialized = false;

function loadGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => {
      if (window.google?.accounts?.id) resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.id = GSI_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

function getButtonWidth(container: HTMLElement) {
  const measured = container.getBoundingClientRect().width;
  if (measured < 48) {
    return 400;
  }
  return Math.min(Math.max(Math.floor(measured), 220), 400);
}

export default function GoogleLogin({
  size = 'large',
  mode = 'signin',
  className,
}: GoogleLoginProps) {
  const { setGoogleToken } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedWidthRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const renderButton = () => {
      const container = containerRef.current;
      if (cancelled || !container || !window.google?.accounts?.id) return;

      const width = getButtonWidth(container);
      if (width === renderedWidthRef.current && container.childElementCount > 0) {
        return;
      }

      renderedWidthRef.current = width;
      container.innerHTML = '';

      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size,
        shape: 'rectangular',
        text: mode === 'signup' ? 'signup_with' : 'continue_with',
        width,
        logo_alignment: 'left',
      });
    };

    const scheduleRender = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(renderButton);
      });
    };

    loadGsiScript().then(() => {
      if (cancelled || !containerRef.current) return;

      if (!gsiInitialized) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: { credential: string }) => {
            setGoogleToken(response.credential);
          },
        });
        gsiInitialized = true;
      }

      scheduleRender();
    });

    const container = containerRef.current;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && container
        ? new ResizeObserver(scheduleRender)
        : null;

    if (container) {
      resizeObserver?.observe(container);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      renderedWidthRef.current = 0;
    };
  }, [mode, setGoogleToken, size]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full min-h-10 items-center justify-center overflow-hidden rounded-xl',
        '[&>div]:!w-full [&>div]:!max-w-full [&>div]:!flex [&>div]:!justify-center',
        className,
      )}
    />
  );
}
