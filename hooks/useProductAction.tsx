import { useProduct } from '@/contexts/ProductContext';

/**
 * Product actions (create, edit, delete) are provided by ProductContext.
 * This hook re-exports them for backward compatibility.
 */
export default function useProductAction() {
  const product = useProduct();
  return {
    createFarmerProduct: product.createFarmerProduct,
    createSupplierProduct: product.createSupplierProduct,
    editFarmerProduct: product.saveFarmerProduct,
    editSupplierProduct: product.saveSupplierProduct,
    deleteFarmerProduct: product.deleteFarmerProduct,
    deleteSupplierProduct: product.deleteSupplierProduct,
    loading: product.mutationLoading,
  };
}
