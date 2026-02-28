'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { UserProvider } from '@/contexts/UserContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { MessageProvider } from '@/contexts/MessageContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { SocketProvider } from './SocketContext';
import { NotificationProvider } from './NotificationContext';
import { BrowserNotificationProvider } from './BrowserNotificationContext';
import { ThemeProvider } from './ThemeContext';
import GlobalOrderModal from '@/components/orders/GlobalOrderModal';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserNotificationProvider>
          <SocketProvider>
            <UserProvider>
              <NotificationProvider>
                <ProductProvider>
                  <WalletProvider>
                    <OrderProvider>
                      <MessageProvider>
                        <ProfileProvider>
                          {children}
                          <GlobalOrderModal />
                        </ProfileProvider>
                      </MessageProvider>
                    </OrderProvider>
                  </WalletProvider>
                </ProductProvider>
              </NotificationProvider>
            </UserProvider>
          </SocketProvider>
        </BrowserNotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
