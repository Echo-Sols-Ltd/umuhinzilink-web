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

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <SocketProvider>
        <UserProvider>
          <NotificationProvider>
            <ProductProvider>
              <WalletProvider>
                <OrderProvider>
                  <MessageProvider>
                    <ProfileProvider>
                      {children}
                    </ProfileProvider>
                  </MessageProvider>
                </OrderProvider>
              </WalletProvider>
            </ProductProvider>
          </NotificationProvider>
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
