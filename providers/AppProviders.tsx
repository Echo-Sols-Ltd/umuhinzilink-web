'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { UserProvider } from '@/contexts/UserContext';
import { BuyerProvider } from '@/contexts/BuyerContext';
import { FarmerProvider } from '@/contexts/FarmerContext';
import { SupplierProvider } from '@/contexts/SupplierContext';
import { Toaster } from '@/components/ui/toaster';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <ProductProvider>
          <OrderProvider>
            <BuyerProvider>
              <FarmerProvider>
                <SupplierProvider>
                  {children}
                  <Toaster />
                </SupplierProvider>
              </FarmerProvider>
            </BuyerProvider>
          </OrderProvider>
        </ProductProvider>
      </UserProvider>
    </AuthProvider>
  );
}
