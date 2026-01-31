import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { productService } from '@/services/products';
import {
  FarmerProductionStat,
  FarmerProduct,
  SupplierProduct,
  ProductStatus,
  SupplierProductionStat,
} from '@/types';
import { useAuth } from './AuthContext';

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
  const [loading, setLoading] = useState(false);
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
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getProductsByFarmer();
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
        setBuyerProducts(res.data?.content ?? []);
        localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(res.data?.content ?? []));
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
        setFarmerBuyerProducts(res.data?.content ?? []);
        localStorage.setItem(
          STORAGE_KEYS.FARMER_BUYER_PRODUCTS,
          JSON.stringify(res.data?.content ?? [])
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
