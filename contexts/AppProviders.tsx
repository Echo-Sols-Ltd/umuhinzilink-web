'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
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
import { CartProvider } from './CartContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
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
                            <CartProvider>
                              {children}
                            </CartProvider>
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
      </I18nProvider>
    </ThemeProvider>
  );
}
