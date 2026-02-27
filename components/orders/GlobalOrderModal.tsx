'use client';

import React from 'react';
import { useProduct } from '@/contexts/ProductContext';
import OrderCreationModal from './OrderCreationModal';

/**
 * Global Order Modal Component
 * 
 * This component manages the order creation modal globally through the ProductContext.
 * It can be triggered from anywhere in the app using the showOrderModal method.
 */
export default function GlobalOrderModal() {
  const {
    isOrderModalOpen,
    orderModalProduct,
    orderModalProductType,
    hideOrderModal
  } = useProduct();

  return (
    <OrderCreationModal
      isOpen={isOrderModalOpen}
      onClose={hideOrderModal}
      product={orderModalProduct}
      productType={orderModalProductType || 'farmer'}
      orderType="buyer"
    />
  );
}
