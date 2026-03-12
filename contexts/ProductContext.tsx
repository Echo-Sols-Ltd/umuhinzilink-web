import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react';
import { productService } from '@/services/products';
import {
  Product,
  ProductStatus,
} from '@/types';
import type { FarmerProductRequest, SupplierProductRequest } from '@/types';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { notify } from '@/lib/notify';
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
  // Mutation methods
  addMyProduct: (data: Product) => void;
  updateProductState: (id: string, data: Partial<Product>) => void;
  removeMyProduct: (id: string) => void;
  
  createFarmerProduct: (payload: FarmerProductRequest, image: File) => Promise<void>;
  createSupplierProduct: (payload: SupplierProductRequest) => Promise<void>;
  saveProduct: (id: string, payload: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  mutationLoading: boolean;
  
  // Fetching methods
  fetchMyProducts: (page?: number, size?: number) => Promise<void>;
  fetchMarketplaceProducts: (page?: number, size?: number) => Promise<void>;
  fetchMyStats: () => Promise<void>;
  fetchProductById: (id: string) => Promise<{ product: Product | null; type: 'farmer' | 'supplier' | null; error: string | null }>;
  
  // Order modal management
  showOrderModal: (product: Product, productType: 'farmer' | 'supplier') => void;
  hideOrderModal: () => void;
  isOrderModalOpen: boolean;
  orderModalProduct: Product | null;
  orderModalProductType: 'farmer' | 'supplier' | null;
  
  // States
  myProductsTotalPages: number;
  myProductsTotalElements: number;
  marketplaceProductsTotalPages: number;
  marketplaceProductsTotalElements: number;
  
  loading: boolean;
  error: string | null;
  
  myProducts: Product[] | null;
  marketplaceProducts: Product[] | null;
  myStats: any[] | null;
  
  currentProduct: Product | null;
  editProduct: Product | null;
  
  setCurrentProduct: (product: Product | null) => void;
  setEditProduct: (product: Product | null) => void;
  
  // Filtered views
  inStockMyProducts: Product[] | null;
  outOfStockMyProducts: Product[] | null;
  lowStockMyProducts: Product[] | null;
  
  inStockMarketplaceProducts: Product[] | null;
  outOfStockMarketplaceProducts: Product[] | null;
  lowStockMarketplaceProducts: Product[] | null;

  // Legacy aliases for compatibility during transition (to be removed after audit)
  farmerProducts: Product[] | null;
  supplierProducts: Product[] | null;
  buyerProducts: Product[] | null;
  fetchFarmerProducts: (page?: number, size?: number) => Promise<void>;
  fetchSupplierProducts: (page?: number, size?: number) => Promise<void>;
  fetchBuyerProducts: (page?: number, size?: number) => Promise<void>;
  buyerProductsTotalPages?: number;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [myProducts, setMyProducts] = useState<Product[] | null>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<Product[] | null>([]);
  const [myStats, setMyStats] = useState<any[] | null>([]);

  const [myProductsTotalPages, setMyProductsTotalPages] = useState(0);
  const [myProductsTotalElements, setMyProductsTotalElements] = useState(0);
  const [marketplaceProductsTotalPages, setMarketplaceProductsTotalPages] = useState(0);
  const [marketplaceProductsTotalElements, setMarketplaceProductsTotalElements] = useState(0);

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
    setMarketplaceProducts(prev => {
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
    setMarketplaceProducts(prev => prev?.filter(p => p.id !== productId) ?? []);

    if (currentProduct?.id === productId) setCurrentProduct(null);
    if (editProduct?.id === productId) setEditProduct(null);
  }, [currentProduct, editProduct]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    // Note: These would need to be implemented in the backend socket service
    // For now, we'll add the structure for future implementation
    // socket.onProductUpdate?.(handleProductUpdate);
    // socket.onProductStatusChange?.(handleProductStatusChange);
    // socket.onProductDeletion?.(handleProductDeletion);

    return () => {
      // Cleanup listeners
      // socket.removeProductUpdateListener?.(handleProductUpdate);
      // socket.removeProductStatusChangeListener?.(handleProductStatusChange);
      // socket.removeProductDeletionListener?.(handleProductDeletion);
    };
  }, [socket, handleProductUpdate, handleProductStatusChange, handleProductDeletion]);

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



  const fetchMyProducts = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const res = await productService.getPrivateProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setMyProducts(Array.isArray(list) ? list : []);
        setMyProductsTotalPages(res.totalPages ?? 0);
        setMyProductsTotalElements(res.totalElements ?? 0);
        localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(Array.isArray(list) ? list : []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch my products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Legacy fetchers kept for compatibility
  const fetchFarmerProducts = fetchMyProducts;
  const fetchSupplierProducts = fetchMyProducts;

  const fetchMarketplaceProducts = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const res = await productService.getPublicProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setMarketplaceProducts(Array.isArray(list) ? list : []);
        setMarketplaceProductsTotalPages(res.totalPages ?? 0);
        setMarketplaceProductsTotalElements(res.totalElements ?? 0);
        localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(Array.isArray(list) ? list : []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marketplace products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Legacy fetchers kept for compatibility
  const fetchBuyerProducts = fetchMarketplaceProducts;
  const fetchFarmerBuyerProducts = fetchMarketplaceProducts;

  const fetchMyStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Fetch both for now or based on role if needed, but unify into myStats
      const res = await (user.role === 'FARMER' ? productService.getFarmerStats() : productService.getSupplierStats());
      if (res.success) {
        setMyStats(res.data ?? []);
        localStorage.setItem(STORAGE_KEYS.FARMER_STATS, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchProductById = useCallback(async (id: string): Promise<{ product: Product | null; type: 'farmer' | 'supplier' | null; error: string | null }> => {
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      if (res.success && res.data) {
        const type = res.data.productType === 'FARMER_PRODUCT' ? 'farmer' : 'supplier';
        return { product: res.data, type, error: null };
      }
      return { product: null, type: null, error: 'Product not found' };
    } catch (err) {
      return { product: null, type: null, error: err instanceof Error ? err.message : 'Failed to fetch product' };
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
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProductState = useCallback((id: string, data: Partial<Product>) => {
    setMyProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? { ...p, ...data } : p)) ?? [];
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    setMarketplaceProducts(prev => {
      const updated = prev?.map(p => (p.id === id ? { ...p, ...data } : p)) ?? [];
      localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    // Update current/edit products if they match
    setCurrentProduct(prev => prev?.id === id ? { ...prev, ...data } : prev);
    setEditProduct(prev => prev?.id === id ? { ...prev, ...data } : prev);
  }, []);

  const removeMyProduct = useCallback((id: string) => {
    setMyProducts(prev => {
      const updated = prev?.filter(p => p.id !== id) ?? [];
      localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Creation/Updating/Deletion methods (Server-side)
  const createFarmerProduct = async (payload: FarmerProductRequest, image: File) => {
    try {
      setMutationLoading(true);
      const imgRes = await productService.uploadProductPhoto(image);
      if (!imgRes?.data) return;
      payload.image = imgRes.data;
      const res = await productService.createProduct(payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Create product');
        return;
      }
      addMyProduct(res.data);
      router.push('/');
      notify.success('Product created successfully', 'Product created');
    } catch {
      notify.error('Try again later', 'Failed to Create product');
    } finally {
      setMutationLoading(false);
    }
  };

  const createSupplierProduct = async (payload: SupplierProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.createProduct(payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Create product');
        return;
      }
      addMyProduct(res.data);
      router.push('/');
      notify.success('Product created successfully', 'Product created');
    } catch {
      notify.error('Try again later', 'Failed to Create product');
    } finally {
      setMutationLoading(false);
    }
  };

  const saveProduct = async (id: string, payload: any) => {
    try {
      setMutationLoading(true);
      const res = await productService.updateProduct(id, payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Edit product');
        return;
      }
      updateProductState(res.data.id, res.data);
      notify.success('The product was updated successfully', 'Product edited');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to Edit product');
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setMutationLoading(true);
      const res = await productService.deleteProduct(id);
      if (!res?.success) {
        notify.error('Try again later', 'Failed to delete product');
        return;
      }
      removeMyProduct(id);
      notify.success('Product was deleted', 'Product Deleted Successfully');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to delete product');
    } finally {
      setMutationLoading(false);
    }
  };

  // Legacy aliases for server actions
  const addFarmerProduct = addMyProduct;
  const addSupplierProduct = addMyProduct;
  const updateFarmerProduct = updateProductState;
  const updateSupplierProduct = updateProductState;
  const updateBuyerProduct = updateProductState;
  const removeFarmerProduct = removeMyProduct;
  const removeSupplierProduct = removeMyProduct;
  const saveFarmerProduct = saveProduct;
  const saveSupplierProduct = saveProduct;
  const deleteFarmerProduct = deleteProduct;
  const deleteSupplierProduct = deleteProduct;

  // 🔹 Filters
  const inStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [myProducts]
  );
  const outOfStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [myProducts]
  );
  const lowStockMyProducts = useMemo(
    () => myProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [myProducts]
  );

  const inStockMarketplaceProducts = useMemo(
    () => marketplaceProducts?.filter(p => p.productStatus === ProductStatus.IN_STOCK) ?? [],
    [marketplaceProducts]
  );
  const outOfStockMarketplaceProducts = useMemo(
    () => marketplaceProducts?.filter(p => p.productStatus === ProductStatus.OUT_OF_STOCK) ?? [],
    [marketplaceProducts]
  );
  const lowStockMarketplaceProducts = useMemo(
    () => marketplaceProducts?.filter(p => p.productStatus === ProductStatus.LOW_STOCK) ?? [],
    [marketplaceProducts]
  );

  // Legacy filter aliases
  const instockFarmerProducts = inStockMyProducts;
  const outOfStockFarmerProducts = outOfStockMyProducts;
  const lowInStockFarmerProducts = lowStockMyProducts;
  const instockSupplierProducts = inStockMyProducts;
  const outOfStockSupplierProducts = outOfStockMyProducts;
  const lowInStockSupplierProducts = lowStockMyProducts;
  const inStockBuyerProducts = inStockMarketplaceProducts;
  const outOfStockBuyerProducts = outOfStockMarketplaceProducts;
  const lowInStockBuyerProducts = lowStockMarketplaceProducts;
  const inStockFarmerBuyerProducts = inStockMarketplaceProducts;
  const outOfStockFarmerBuyerProducts = outOfStockMarketplaceProducts;
  const lowInStockFarmerBuyerProducts = lowStockMarketplaceProducts;

  const value: ProductContextValue = {
    addMyProduct,
    updateProductState,
    removeMyProduct,
    createFarmerProduct,
    createSupplierProduct,
    saveProduct,
    deleteProduct,
    mutationLoading,
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
    marketplaceProductsTotalPages,
    marketplaceProductsTotalElements,
    loading,
    error,
    myProducts,
    marketplaceProducts,
    myStats,
    currentProduct,
    editProduct,
    setCurrentProduct,
    setEditProduct,
    inStockMyProducts,
    outOfStockMyProducts,
    lowStockMyProducts,
    inStockMarketplaceProducts,
    outOfStockMarketplaceProducts,
    lowStockMarketplaceProducts,

    // Legacy aliases
    farmerProducts: myProducts,
    supplierProducts: myProducts,
    buyerProducts: marketplaceProducts,
    fetchFarmerProducts,
    fetchSupplierProducts,
    fetchBuyerProducts,
    buyerProductsTotalPages: marketplaceProductsTotalPages,
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