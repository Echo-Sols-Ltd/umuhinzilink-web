'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useEffect } from 'react';

declare global { interface Window { google: any } }

export default function GoogleLogin() {
  const { setGoogleToken } = useAuth();
  const { locale, t } = useI18n();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        locale,
        callback: async (response: { credential: string }) => {
          setGoogleToken(response.credential);
        },
      });

      const container = document.getElementById('googleBtn');
      if (container) {
        container.innerHTML = '';
        window.google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
        });
      }
    };

    return () => {
      script.remove();
    };
  }, [locale, setGoogleToken]);

  return (
    <div
      id="googleBtn"
      className="w-full"
      aria-label={t('googleLogin.ariaLabel')}
    />
  );
}
