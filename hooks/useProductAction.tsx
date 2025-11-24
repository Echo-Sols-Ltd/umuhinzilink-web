import { toast } from '@/hooks/use-toast';
import { useProduct } from '@/contexts/ProductContext';
import { productService } from '@/services/products';
import { FarmerProductRequest, SupplierProductRequest } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function useProductAction() {
  const router = useRouter();
  const { addFarmerProduct, addSupplierProduct, updateFarmerProduct, updateSupplierProduct } =
    useProduct();
  const [loading, setLoading] = useState(false);

  const createFarmerProduct = async (payload: FarmerProductRequest) => {
    try {
      setLoading(true);

      const res = await productService.createFarmerProduct(payload);

      if (!res) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      const newProduct = res.data;
      if (!newProduct) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      addFarmerProduct(newProduct);
      router.push('/');
      toast({
        title: 'Product created',
        description: 'Product created successfully',
      });
    } catch {
      toast({
        title: 'Failed to Create product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createSupplierProduct = async (payload: SupplierProductRequest) => {
    try {
      setLoading(true);

      const res = await productService.createSupplierProduct(payload);

      if (!res) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      const newProduct = res.data;
      if (!newProduct) {
        toast({
          title: 'Failed to Create product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      addSupplierProduct(newProduct);
      router.push('/');

      toast({
        title: 'Product created',
        description: 'Product created successfully',
      });
    } catch {
      toast({
        title: 'Failed to Create product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const editFarmerProduct = async (id: string, payload: FarmerProductRequest) => {
    try {
      setLoading(true);

      const res = await productService.updateFarmerProduct(id, payload);

      if (!res) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      const updatedProduct = res.data;
      if (!updatedProduct) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      updateFarmerProduct(updatedProduct.id, updatedProduct);

      toast({
        title: 'Product edited',
        description: 'The product was updated successfully',
      });
      router.back();
    } catch {
      toast({
        title: 'Failed to Edit product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const editSupplierProduct = async (id: string, payload: SupplierProductRequest) => {
    try {
      setLoading(true);

      const res = await productService.updateSupplierProduct(id, payload);

      if (!res) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      const updatedProduct = res.data;
      if (!updatedProduct) {
        toast({
          title: 'Failed to Edit product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }
      updateSupplierProduct(updatedProduct.id, updatedProduct);

      router.back();

      toast({
        title: 'Product edited',
      });
    } catch {
      toast({
        title: 'Failed to Edit product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFarmerProduct = async (id: string) => {
    try {
      setLoading(true);

      const res = await productService.deleteFarmerProduct(id);

      if (!res) {
        toast({
          title: 'Failed to delete product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to delete product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }
      router.back();
    } catch {
      toast({
        title: 'Failed to delete product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplierProduct = async (id: string) => {
    try {
      setLoading(true);

      const res = await productService.deleteSupplierProduct(id);

      if (!res) {
        toast({
          title: 'Failed to delete product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      if (!res.success) {
        toast({
          title: 'Failed to delete product',
          description: 'Try again later',
          variant: 'destructive',
        });
        return;
      }

      router.back();
    } catch {
      toast({
        title: 'Failed to delete product',
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createFarmerProduct,
    createSupplierProduct,
    editFarmerProduct,
    editSupplierProduct,
    deleteFarmerProduct,
    deleteSupplierProduct,
    loading,
  };
}
