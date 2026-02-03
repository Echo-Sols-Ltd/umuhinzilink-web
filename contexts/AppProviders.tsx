'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { UserProvider } from '@/contexts/UserContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { MessageProvider } from '@/contexts/MessageContext';
import { SocketProvider } from './SocketContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <SocketProvider>
        <UserProvider>
          <ProductProvider>
            <OrderProvider>
              <WalletProvider>
                <MessageProvider>
                  {children}
                </MessageProvider>
              </WalletProvider>
            </OrderProvider>
          </ProductProvider>
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
