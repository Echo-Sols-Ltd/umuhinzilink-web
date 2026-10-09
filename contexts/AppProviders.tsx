'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { UserProvider } from '@/contexts/UserContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { SocketProvider } from './SocketContext';
import { NotificationProvider } from './NotificationContext';
import { BrowserNotificationProvider } from './BrowserNotificationContext';
import { ThemeProvider } from './ThemeContext';
import { NegotiationProvider } from './NegotiationContext';
import AssistantWidget from '@/components/ai/AssistantWidget';
import LocaleSync from '@/components/LocaleSync';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <LocaleSync />
          <BrowserNotificationProvider>
            <SocketProvider>
              <UserProvider>
                <NotificationProvider>
                  <ProductProvider>
                    <WalletProvider>
                      <OrderProvider>
                        <NegotiationProvider>
                          {children}
                          <AssistantWidget />
                        </NegotiationProvider>
                      </OrderProvider>
                    </WalletProvider>
                  </ProductProvider>
                </NotificationProvider>
              </UserProvider>
            </SocketProvider>
          </BrowserNotificationProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
