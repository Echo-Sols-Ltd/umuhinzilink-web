'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { UserProvider } from '@/contexts/UserContext';
import { BuyerProvider } from '@/contexts/BuyerContext';
import { FarmerProvider } from '@/contexts/FarmerContext';
import { SupplierProvider } from '@/contexts/SupplierContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { MessageProvider } from '@/contexts/MessageContext';
import { Toaster } from '@/components/ui/toaster';
import { GovernmentProvider } from './GovernmentContext';
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
                  <Toaster />
                </MessageProvider>
              </WalletProvider>
            </OrderProvider>
          </ProductProvider>
        </UserProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
