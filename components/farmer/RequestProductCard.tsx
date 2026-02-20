'use client';

import ProductCard from '@/components/products/Product';
import { FarmerProduct, SupplierProduct } from '@/types';

interface RequestProductCardProps {
  product: FarmerProduct | SupplierProduct;
  onBuyNow?: (productId: string) => void;
}

export function RequestProductCard({ product, onBuyNow }: RequestProductCardProps) {
  return (
    <ProductCard
      product={product}
      onSelect={() => {}}
      onPurchase={() => onBuyNow?.(product.id)}
      onContact={() => {}}
    />
  );
}
