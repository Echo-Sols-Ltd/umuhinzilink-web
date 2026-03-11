import { ProductCategory } from '../product';

// Product category options for UI components
export const productCategoryOptions = Object.values(ProductCategory).map(c => ({
  label: c
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, ch => ch.toUpperCase()),
  value: c,
}));
