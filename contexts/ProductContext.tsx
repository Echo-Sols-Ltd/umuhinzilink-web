import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react';
import { productService } from '@/services/products';
import {
  Product,
  ProductStatus,
} from '@/types';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

type ProductContextValue = {
  // Mutation methods
  addMyProduct: (data: Product) => void;
  updateProductState: (id: string, data: Partial<Product>) => void;
  removeMyProduct: (id: string) => void;

  // Fetching methods
  fetchMyProducts: (page?: number, size?: number) => Promise<void>;
  fetchMarketplaceProducts: (page?: number, size?: number) => Promise<void>;
  fetchMyStats: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;

  // Order modal management
  showOrderModal: (product: Product, productType: 'farmer' | 'supplier') => void;
  hideOrderModal: () => void;
  isOrderModalOpen: boolean;
  orderModalProduct: Product | null;
  orderModalProductType: 'farmer' | 'supplier' | null;

  // States
  myProductsTotalPages: number;
  myProductsTotalElements: number;
  productsTotalPages: number;
  productsTotalElements: number;

  loading: boolean;
  error: string | null;

  myProducts: Product[];
  products:Product[]
  myStats: any[] | null;

  currentProduct: Product | null;
  editProduct: Product | null;

  setCurrentProduct: (product: Product | null) => void;
  setEditProduct: (product: Product | null) => void;

  // Filtered views
  inStockMyProducts: Product[] | null;
  outOfStockMyProducts: Product[] | null;
  lowStockMyProducts: Product[] | null;

  inStockProducts: Product[] | null;
  outOfStockProducts: Product[] | null;
  lowStockProducts: Product[] | null;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [myStats, setMyStats] = useState<any[] | null>([]);

  const [myProductsTotalPages, setMyProductsTotalPages] = useState(0);
  const [myProductsTotalElements, setMyProductsTotalElements] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(0);
  const [productsTotalElements, setProductsTotalElements] = useState(0);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [orderModalProductType, setOrderModalProductType] = useState<'farmer' | 'supplier' | null>(null);

  const handleProductChange = useCallback((data: Product) => {
    const productId = data.id;

    setMyProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...data } : p);
    });
    setProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...data } : p);
    });

    // Update current/edit products if they match
    setCurrentProduct(prev => prev?.id === productId ? { ...prev, ...data } : prev);
    setEditProduct(prev => prev?.id === productId ? { ...prev, ...data } : prev);
  }, []);

  // Socket event handlers for real-time product updates
  const handleProductUpdate = useCallback((productData: Product) => {
    if (!productData) return;
    handleProductChange(productData);
  }, [handleProductChange]);

  const handleProductStatusChange = useCallback((productData: Product) => {
    if (!productData) return;
    handleProductChange(productData);
  }, [handleProductChange]);

  const handleProductDeletion = useCallback((productData: Product) => {
    if (!productData) return;
    const productId = productData.id;

    setMyProducts(prev => prev?.filter(p => p.id !== productId) ?? []);
    setProducts(prev => prev?.filter(p => p.id !== productId) ?? []);

    if (currentProduct?.id === productId) setCurrentProduct(null);
    if (editProduct?.id === productId) setEditProduct(null);
  }, [currentProduct, editProduct]);

  const fetchMyProducts = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const res = await productService.getSellerProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setMyProducts(Array.isArray(list) ? list : []);
        setMyProductsTotalPages(res.totalPages ?? 0);
        setMyProductsTotalElements(res.totalElements ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch my products');
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchMarketplaceProducts = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const res = await productService.getProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setProducts(Array.isArray(list) ? list : []);
        setProductsTotalPages(res.totalPages ?? 0);
        setProductsTotalElements(res.totalElements ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marketplace products');
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchMyStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Fetch both for now or based on role if needed, but unify into myStats
      const res = await productService.getSellerStats()
      if (res.success) {
        setMyStats(res.data ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchProductById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      if (res.success && res.data) return res.data
      return null
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Order modal management methods
  const showOrderModal = (product: Product, productType: 'farmer' | 'supplier') => {
    setOrderModalProduct(product);
    setOrderModalProductType(productType);
    setIsOrderModalOpen(true);
  };

  const hideOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderModalProduct(null);
    setOrderModalProductType(null);
  };



  const addMyProduct = useCallback((data: Product) => {
    setMyProducts(prev => {
      const updated = prev ? [...prev, data] : [data];
      return updated;
    });
  }, []);

  const updateProductState = useCallback((id: string, data: Partial<Product>) => {
    setMyProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? { ...p, ...data } : p)) ?? [];
      return updated;
    });
    setProducts(prev => {
      const updated  = prev?.map(p => (p.id === id ? { ...p, ...data } : p)) ?? [];
      return updated;
    });
    // Update current/edit products if they match
    setCurrentProduct(prev => prev?.id === id ? { ...prev, ...data } : prev);
    setEditProduct(prev => prev?.id === id ? { ...prev, ...data } : prev);
  }, []);

  const removeMyProduct = useCallback((id: string) => {
    setMyProducts(prev => {
      const updated = prev?.filter(p => p.id !== id) ?? [];
      return updated;
    });
  }, []);

  // 🔹 Filters
  const inStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.status === ProductStatus.IN_STOCK) ?? [],
    [myProducts]
  );
  const outOfStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.status === ProductStatus.OUT_OF_STOCK) ?? [],
    [myProducts]
  );
  const lowStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.status === ProductStatus.LOW_STOCK) ?? [],
    [myProducts]
  );

  const inStockMarketplaceProducts = useMemo(
    () => products?.filter(p => p.status === ProductStatus.IN_STOCK) ?? [],
    [products]
  );
  const outOfStockMarketplaceProducts = useMemo(
    () => products?.filter(p => p.status === ProductStatus.OUT_OF_STOCK) ?? [],
    [products]
  );
  const lowStockMarketplaceProducts = useMemo(
    () => products?.filter(p => p.status === ProductStatus.LOW_STOCK) ?? [],
    [products]
  );

  const value: ProductContextValue = {
    addMyProduct,
    updateProductState,
    removeMyProduct,
    fetchMyProducts,
    fetchMarketplaceProducts,
    fetchMyStats,
    fetchProductById,
    showOrderModal,
    hideOrderModal,
    isOrderModalOpen,
    orderModalProduct,
    orderModalProductType,
    myProductsTotalPages,
    myProductsTotalElements,
    productsTotalPages,
    productsTotalElements,
    loading,
    error,
    myProducts,
    products,
    myStats,
    currentProduct,
    editProduct,
    setCurrentProduct,
    setEditProduct,
    inStockMyProducts,
    outOfStockMyProducts,
    lowStockMyProducts,
    inStockProducts: inStockMarketplaceProducts,
    outOfStockProducts: outOfStockMarketplaceProducts,
    lowStockProducts: lowStockMarketplaceProducts,
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