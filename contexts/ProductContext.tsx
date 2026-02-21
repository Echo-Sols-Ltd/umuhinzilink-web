import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { productService } from '@/services/products';
import {
  FarmerProductionStat,
  FarmerProduct,
  SupplierProduct,
  ProductStatus,
  SupplierProductionStat,
} from '@/types';
import type { FarmerProductRequest, SupplierProductRequest } from '@/types/request';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const STORAGE_KEYS = {
  FARMER_PRODUCTS: 'farmerProducts',
  BUYER_PRODUCTS: 'buyerProducts',
  SUPPLIER_PRODUCTS: 'supplierProducts',
  FARMER_STATS: 'farmerStats',
  SUPPLIER_STATS: 'supplierStats',
  FARMER_BUYER_PRODUCTS: 'farmerBuyerProducts',
};

type ProductContextValue = {
  addFarmerProduct: (data: FarmerProduct) => void;
  addSupplierProduct: (data: SupplierProduct) => void;
  updateFarmerProduct: (id: string, data: FarmerProduct) => void;
  updateBuyerProduct: (id: string, data: FarmerProduct) => void;
  updateSupplierProduct: (id: string, data: SupplierProduct) => void;
  removeFarmerProduct: (id: string) => void;
  removeSupplierProduct: (id: string) => void;
  createFarmerProduct: (payload: FarmerProductRequest, image: File) => Promise<void>;
  createSupplierProduct: (payload: SupplierProductRequest) => Promise<void>;
  saveFarmerProduct: (id: string, payload: FarmerProductRequest) => Promise<void>;
  saveSupplierProduct: (id: string, payload: SupplierProductRequest) => Promise<void>;
  deleteFarmerProduct: (id: string) => Promise<void>;
  deleteSupplierProduct: (id: string) => Promise<void>;
  mutationLoading: boolean;
  fetchFarmerProducts: () => Promise<void>;
  fetchSupplierProducts: () => Promise<void>;
  fetchBuyerProducts: () => Promise<void>;
  fetchFarmerBuyerProducts: () => Promise<void>;
  fetchFarmerStats: () => Promise<void>;
  fetchSupplierStats: () => Promise<void>;
  loading: boolean;
  error: string | null;
  farmerProducts: FarmerProduct[] | null;
  supplierProducts: SupplierProduct[] | null;
  farmerStats: FarmerProductionStat[] | null;
  supplierStats: SupplierProductionStat[] | null;
  currentFarmerProduct: FarmerProduct | null;
  currentSupplierProduct: SupplierProduct | null;
  currentFarmerBuyerProduct: SupplierProduct | null;
  currentBuyerProduct: FarmerProduct | null;
  editFarmerProduct: FarmerProduct | null;
  editSupplierProduct: SupplierProduct | null;
  editBuyerProduct: FarmerProduct | null;
  editFarmerBuyerProduct: SupplierProduct | null;
  buyerProducts: FarmerProduct[] | null;
  farmerBuyerProducts: SupplierProduct[] | null;
  setCurrentFarmerProduct: (product: FarmerProduct | null) => void;
  setEditFarmerProduct: (product: FarmerProduct | null) => void;
  setCurrentSupplierProduct: (product: SupplierProduct | null) => void;
  setEditSupplierProduct: (product: SupplierProduct | null) => void;
  setCurrentFarmerBuyerProduct: (product: SupplierProduct | null) => void;
  setCurrentBuyerProduct: (product: FarmerProduct | null) => void;
  setEditBuyerProduct: (product: FarmerProduct | null) => void;
  setEditFarmerBuyerProduct: (product: SupplierProduct | null) => void;
  instockFarmerProducts: FarmerProduct[] | null;
  outOfStockFarmerProducts: FarmerProduct[] | null;
  lowInStockFarmerProducts: FarmerProduct[] | null;
  instockSupplierProducts: SupplierProduct[] | null;
  outOfStockSupplierProducts: SupplierProduct[] | null;
  lowInStockSupplierProducts: SupplierProduct[] | null;
  inStockFarmerBuyerProducts: SupplierProduct[] | null;
  outOfStockFarmerBuyerProducts: SupplierProduct[] | null;
  lowInStockFarmerBuyerProducts: SupplierProduct[] | null;
  inStockBuyerProducts: FarmerProduct[] | null;
  outOfStockBuyerProducts: FarmerProduct[] | null;
  lowInStockBuyerProducts: FarmerProduct[] | null;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[] | null>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[] | null>([]);
  const [buyerProducts, setBuyerProducts] = useState<FarmerProduct[] | null>([]);
  const [farmerBuyerProducts, setFarmerBuyerProducts] = useState<SupplierProduct[] | null>([]);

  const [farmerStats, setFarmerStats] = useState<FarmerProductionStat[] | null>([]);
  const [supplierStats, setSupplierStats] = useState<SupplierProductionStat[] | null>([]);

  const [currentFarmerProduct, setCurrentFarmerProduct] = useState<FarmerProduct | null>(null);
  const [currentSupplierProduct, setCurrentSupplierProduct] = useState<SupplierProduct | null>(
    null
  );
  const [currentFarmerBuyerProduct, setCurrentFarmerBuyerProduct] =
    useState<SupplierProduct | null>(null);
  const [currentBuyerProduct, setCurrentBuyerProduct] = useState<FarmerProduct | null>(null);
  const [editFarmerProduct, setEditFarmerProduct] = useState<FarmerProduct | null>(null);
  const [editSupplierProduct, setEditSupplierProduct] = useState<SupplierProduct | null>(null);
  const [editFarmerBuyerProduct, setEditFarmerBuyerProduct] = useState<SupplierProduct | null>(
    null
  );
  const [editBuyerProduct, setEditBuyerProduct] = useState<FarmerProduct | null>(null);

  // // 🔹 Load cached data
  // useEffect(() => {
  //   const loadCachedData = () => {
  //     try {
  //       const farmerProducts = localStorage.getItem(STORAGE_KEYS.FARMER_PRODUCTS);
  //       const supplierProducts = localStorage.getItem(STORAGE_KEYS.SUPPLIER_PRODUCTS);
  //       const buyerProducts = localStorage.getItem(STORAGE_KEYS.BUYER_PRODUCTS);
  //       const farmerBuyerProducts = localStorage.getItem(STORAGE_KEYS.FARMER_BUYER_PRODUCTS);
  //       const farmerStats = localStorage.getItem(STORAGE_KEYS.FARMER_STATS);
  //       const supplierStats = localStorage.getItem(STORAGE_KEYS.SUPPLIER_STATS);

  //       if (farmerProducts) setFarmerProducts(JSON.parse(farmerProducts));
  //       if (supplierProducts) setSupplierProducts(JSON.parse(supplierProducts));
  //       if (buyerProducts) setBuyerProducts(JSON.parse(buyerProducts));
  //       if (farmerBuyerProducts) setFarmerBuyerProducts(JSON.parse(farmerBuyerProducts));
  //       if (farmerStats) setFarmerStats(JSON.parse(farmerStats));
  //       if (supplierStats) setSupplierStats(JSON.parse(supplierStats));
  //     } catch (e) {
  //       console.warn('Failed to load cached product data', e);
  //     }
  //   };
  //   loadCachedData();
  // }, []);

  const fetchFarmerProducts = async () => {
  
    try {
      setLoading(true);
      const res = await productService.getProductsByFarmer();
      console.log('farmer response', res.data)
      if (res.success) {
        setFarmerProducts(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmer products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierProducts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getProductsBySupplier();
      if (res.success) {
        setSupplierProducts(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.SUPPLIER_PRODUCTS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch supplier products');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyerProducts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getBuyerProducts();
      if (res.success) {
        setBuyerProducts(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch buyer products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerBuyerProducts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getFarmerBuyerProducts();
      if (res.success) {
        setFarmerBuyerProducts(res.data ?? []);
        localStorage.setItem(
          STORAGE_KEYS.FARMER_BUYER_PRODUCTS,
          JSON.stringify(res.data ?? [])
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmer buyer products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerStats = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getFarmerStats();
      if (res.success) {
        setFarmerStats(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.FARMER_STATS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmer stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierStats = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getSupplierStats();
      if (res.success) {
        setSupplierStats(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.SUPPLIER_STATS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch supplier stats');
    } finally {
      setLoading(false);
    }
  };



  const addFarmerProduct = (data: FarmerProduct) => {
    setFarmerProducts(prev => {
      const updated = prev ? [...prev, data] : [data];
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const addSupplierProduct = (data: SupplierProduct) => {
    setSupplierProducts(prev => {
      const updated = prev ? [...prev, data] : [data];
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateBuyerProduct = (id: string, data: FarmerProduct) => {
    setBuyerProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? data : p)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateFarmerProduct = (id: string, data: FarmerProduct) => {
    setFarmerProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? data : p)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSupplierProduct = (id: string, data: SupplierProduct) => {
    setSupplierProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? data : p)) ?? [data];
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFarmerProduct = (id: string) => {
    setFarmerProducts(prev => {
      const updated = prev?.filter(p => p.id !== id) ?? [];
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const removeSupplierProduct = (id: string) => {
    setSupplierProducts(prev => {
      const updated = prev?.filter(p => p.id !== id) ?? [];
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  };

  const createFarmerProduct = async (payload: FarmerProductRequest, image: File) => {
    try {
      setMutationLoading(true);
      const imgRes = await productService.uploadProductPhoto(image);
      if (!imgRes?.data) return;
      payload.image = imgRes.data;
      const res = await productService.createFarmerProduct(payload);
      if (!res?.success || !res.data) {
        toast({ title: 'Failed to Create product', description: 'Try again later', variant: 'error' });
        return;
      }
      addFarmerProduct(res.data);
      router.push('/');
      toast({ title: 'Product created', description: 'Product created successfully', variant: 'success' });
    } catch {
      toast({ title: 'Failed to Create product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const createSupplierProduct = async (payload: SupplierProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.createSupplierProduct(payload);
      if (!res?.success || !res.data) {
        toast({ title: 'Failed to Create product', description: 'Try again later', variant: 'error' });
        return;
      }
      addSupplierProduct(res.data);
      router.push('/');
      toast({ title: 'Product created', description: 'Product created successfully', variant: 'success' });
    } catch {
      toast({ title: 'Failed to Create product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const saveFarmerProduct = async (id: string, payload: FarmerProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.updateFarmerProduct(id, payload);
      if (!res?.success || !res.data) {
        toast({ title: 'Failed to Edit product', description: 'Try again later', variant: 'error' });
        return;
      }
      updateFarmerProduct(res.data.id, res.data);
      toast({ title: 'Product edited', description: 'The product was updated successfully', variant: 'success' });
      router.back();
    } catch {
      toast({ title: 'Failed to Edit product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const saveSupplierProduct = async (id: string, payload: SupplierProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.updateSupplierProduct(id, payload);
      if (!res?.success || !res.data) {
        toast({ title: 'Failed to Edit product', description: 'Try again later', variant: 'error' });
        return;
      }
      updateSupplierProduct(res.data.id, res.data);
      toast({ title: 'Product edited', description: 'Product updated successfully', variant: 'success' });
      router.back();
    } catch {
      toast({ title: 'Failed to Edit product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteFarmerProduct = async (id: string) => {
    try {
      setMutationLoading(true);
      const res = await productService.deleteFarmerProduct(id);
      if (!res?.success) {
        toast({ title: 'Failed to delete product', description: 'Try again later', variant: 'error' });
        return;
      }
      removeFarmerProduct(id);
      toast({ title: 'Product Deleted Successfully', description: 'Product was deleted', variant: 'success' });
      router.back();
    } catch {
      toast({ title: 'Failed to delete product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteSupplierProduct = async (id: string) => {
    try {
      setMutationLoading(true);
      const res = await productService.deleteSupplierProduct(id);
      if (!res?.success) {
        toast({ title: 'Failed to delete product', description: 'Try again later', variant: 'error' });
        return;
      }
      removeSupplierProduct(id);
      toast({ title: 'Product deleted successfully', variant: 'success' });
      router.back();
    } catch {
      toast({ title: 'Failed to delete product', description: 'Try again later', variant: 'error' });
    } finally {
      setMutationLoading(false);
    }
  };

  // 🔹 Filters
  const instockFarmerProducts = useMemo(
    () => farmerProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [farmerProducts]
  );
  const outOfStockFarmerProducts = useMemo(
    () => farmerProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [farmerProducts]
  );
  const lowInStockFarmerProducts = useMemo(
    () => farmerProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [farmerProducts]
  );

  const instockSupplierProducts = useMemo(
    () => supplierProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [supplierProducts]
  );
  const outOfStockSupplierProducts = useMemo(
    () => supplierProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [supplierProducts]
  );
  const lowInStockSupplierProducts = useMemo(
    () => supplierProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [supplierProducts]
  );

  const inStockBuyerProducts = useMemo(
    () => buyerProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [buyerProducts]
  );
  const outOfStockBuyerProducts = useMemo(
    () => buyerProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [buyerProducts]
  );
  const lowInStockBuyerProducts = useMemo(
    () => buyerProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [buyerProducts]
  );

  const inStockFarmerBuyerProducts = useMemo(
    () => farmerBuyerProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [farmerBuyerProducts]
  );
  const outOfStockFarmerBuyerProducts = useMemo(
    () => farmerBuyerProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [farmerBuyerProducts]
  );
  const lowInStockFarmerBuyerProducts = useMemo(
    () => farmerBuyerProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [farmerBuyerProducts]
  );

  const value: ProductContextValue = {
    addFarmerProduct,
    addSupplierProduct,
    updateFarmerProduct,
    updateBuyerProduct,
    updateSupplierProduct,
    removeFarmerProduct,
    removeSupplierProduct,
    createFarmerProduct,
    createSupplierProduct,
    saveFarmerProduct,
    saveSupplierProduct,
    deleteFarmerProduct,
    deleteSupplierProduct,
    mutationLoading,
    fetchFarmerProducts,
    fetchSupplierProducts,
    fetchBuyerProducts,
    fetchFarmerBuyerProducts,
    fetchFarmerStats,
    fetchSupplierStats,
    loading,
    error,
    farmerProducts,
    supplierProducts,
    buyerProducts,
    farmerBuyerProducts,
    farmerStats,
    supplierStats,
    currentFarmerProduct,
    currentSupplierProduct,
    currentFarmerBuyerProduct,
    currentBuyerProduct,
    editFarmerProduct,
    editSupplierProduct,
    editBuyerProduct,
    editFarmerBuyerProduct,
    setCurrentFarmerProduct,
    setEditFarmerProduct,
    setCurrentSupplierProduct,
    setEditSupplierProduct,
    setCurrentFarmerBuyerProduct,
    setEditFarmerBuyerProduct,
    setCurrentBuyerProduct,
    setEditBuyerProduct,
    instockFarmerProducts,
    outOfStockFarmerProducts,
    lowInStockFarmerProducts,
    instockSupplierProducts,
    outOfStockSupplierProducts,
    lowInStockSupplierProducts,
    inStockFarmerBuyerProducts,
    outOfStockFarmerBuyerProducts,
    lowInStockFarmerBuyerProducts,
    inStockBuyerProducts,
    outOfStockBuyerProducts,
    lowInStockBuyerProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return ctx;
}