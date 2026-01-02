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
import { Toaster } from '@/components/ui/toaster';
import { GovernmentProvider } from './GovernmentContext';

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
                  <AdminProvider>
                    <GovernmentProvider>
                      {children}
                      <Toaster />
                    </GovernmentProvider>
                  </AdminProvider>
                </SupplierProvider>
              </FarmerProvider>
            </BuyerProvider>
          </OrderProvider>
        </ProductProvider>
      </UserProvider>
    </AuthProvider>
  );
}
