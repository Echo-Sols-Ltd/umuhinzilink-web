import React, { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react';
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
  fetchFarmerProducts: (page?: number, size?: number) => Promise<void>;
  fetchSupplierProducts: (page?: number, size?: number) => Promise<void>;
  fetchBuyerProducts: (page?: number, size?: number) => Promise<void>;
  fetchFarmerBuyerProducts: (page?: number, size?: number) => Promise<void>;
  fetchFarmerStats: () => Promise<void>;
  fetchSupplierStats: () => Promise<void>;
  fetchFarmerProductById: (id: string) => Promise<{ product: FarmerProduct | null; type: 'farmer' | null; error: string | null }>;
  fetchSupplierProductById: (id: string) => Promise<{ product: SupplierProduct | null; type: 'supplier' | null; error: string | null }>;
  fetchProductById: (id: string) => Promise<{ product: FarmerProduct | SupplierProduct | null; type: 'farmer' | 'supplier' | null; error: string | null }>;
  // Order modal management
  showOrderModal: (product: FarmerProduct | SupplierProduct, productType: 'farmer' | 'supplier') => void;
  hideOrderModal: () => void;
  isOrderModalOpen: boolean;
  orderModalProduct: FarmerProduct | SupplierProduct | null;
  orderModalProductType: 'farmer' | 'supplier' | null;
  farmerProductsTotalPages: number;
  farmerProductsTotalElements: number;
  supplierProductsTotalPages: number;
  supplierProductsTotalElements: number;
  buyerProductsTotalPages: number;
  buyerProductsTotalElements: number;
  farmerBuyerProductsTotalPages: number;
  farmerBuyerProductsTotalElements: number;
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
  const router = useRouter();
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [farmerProducts, setFarmerProducts] = useState<FarmerProduct[] | null>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[] | null>([]);
  const [buyerProducts, setBuyerProducts] = useState<FarmerProduct[] | null>([]);
  const [farmerBuyerProducts, setFarmerBuyerProducts] = useState<SupplierProduct[] | null>([]);

  const [farmerProductsTotalPages, setFarmerProductsTotalPages] = useState(0);
  const [farmerProductsTotalElements, setFarmerProductsTotalElements] = useState(0);
  const [supplierProductsTotalPages, setSupplierProductsTotalPages] = useState(0);
  const [supplierProductsTotalElements, setSupplierProductsTotalElements] = useState(0);
  const [buyerProductsTotalPages, setBuyerProductsTotalPages] = useState(0);
  const [buyerProductsTotalElements, setBuyerProductsTotalElements] = useState(0);
  const [farmerBuyerProductsTotalPages, setFarmerBuyerProductsTotalPages] = useState(0);
  const [farmerBuyerProductsTotalElements, setFarmerBuyerProductsTotalElements] = useState(0);

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

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<FarmerProduct | SupplierProduct | null>(null);
  const [orderModalProductType, setOrderModalProductType] = useState<'farmer' | 'supplier' | null>(null);

  const handleProductChange = (data: FarmerProduct | SupplierProduct) => {
    const productId = data.id
    const farmerData = data as FarmerProduct
    const supplierData = data as SupplierProduct

    setFarmerProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...farmerData } : p);
    });
    setBuyerProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...farmerData } : p);
    });
    setSupplierProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...supplierData } : p);
    });
    setFarmerBuyerProducts(prev => {
      if (!prev) return [];
      return prev.map(p => p.id === productId ? { ...p, ...supplierData } : p);
    });

    // Update current products if they match
    setCurrentFarmerProduct(prev => prev?.id === productId ? { ...prev, ...farmerData } : prev);
    setCurrentBuyerProduct(prev => prev?.id === productId ? { ...prev, ...farmerData } : prev);
    setEditFarmerProduct(prev => prev?.id === productId ? { ...prev, ...farmerData } : prev);
    setEditBuyerProduct(prev => prev?.id === productId ? { ...prev, ...farmerData } : prev);
    setCurrentSupplierProduct(prev => prev?.id === productId ? { ...prev, ...supplierData } : prev);
    setCurrentFarmerBuyerProduct(prev => prev?.id === productId ? { ...prev, ...supplierData } : prev);
    setEditSupplierProduct(prev => prev?.id === productId ? { ...prev, ...supplierData } : prev);
    setEditFarmerBuyerProduct(prev => prev?.id === productId ? { ...prev, ...supplierData } : prev);

  }

  // Socket event handlers for real-time product updates
  const handleProductUpdate = useCallback((productData: FarmerProduct | SupplierProduct) => {
    if (!productData) return;

    handleProductChange(productData);
  }, []);

  const handleProductStatusChange = useCallback((productData: FarmerProduct | SupplierProduct) => {
    if (!productData) return;

    handleProductChange(productData);
  }, []);

  const handleProductDeletion = useCallback((productData: FarmerProduct | SupplierProduct) => {
    if (!productData) return;
    const productId = productData.id


    setFarmerProducts(prev => {
      if (!prev) return [];
      return prev?.filter(p => p.id !== productData.id);
    });
    setBuyerProducts(prev => {
      if (!prev) return [];
      return prev?.filter(p => p.id !== productData.id);
    });
    setSupplierProducts(prev => {
      if (!prev) return [];
      return prev?.filter(p => p.id !== productId);
    });
    setFarmerBuyerProducts(prev => {
      if (!prev) return [];
      return prev?.filter(p => p.id !== productId);
    });

    // Clear current products if they match
    if (currentFarmerProduct?.id === productId) setCurrentFarmerProduct(null);
    if (currentBuyerProduct?.id === productId) setCurrentBuyerProduct(null);

    // Clear current products if they match
    if (currentSupplierProduct?.id === productId) setCurrentSupplierProduct(null);
    if (currentFarmerBuyerProduct?.id === productId) setCurrentFarmerBuyerProduct(null);

  }, [currentFarmerProduct, currentBuyerProduct, currentSupplierProduct, currentFarmerBuyerProduct]);

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



  const fetchFarmerProducts = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const res = await productService.getProductsByFarmer(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setFarmerProducts(Array.isArray(list) ? list : []);
        setFarmerProductsTotalPages((res as { totalPages?: number }).totalPages ?? 0);
        setFarmerProductsTotalElements((res as { totalElements?: number }).totalElements ?? 0);
        localStorage.setItem(STORAGE_KEYS.FARMER_PRODUCTS, JSON.stringify(Array.isArray(list) ? list : []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch farmer products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierProducts = async (page = 0, size = 10) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getProductsBySupplier(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setSupplierProducts(Array.isArray(list) ? list : []);
        setSupplierProductsTotalPages((res as { totalPages?: number }).totalPages ?? 0);
        setSupplierProductsTotalElements((res as { totalElements?: number }).totalElements ?? 0);
        localStorage.setItem(STORAGE_KEYS.SUPPLIER_PRODUCTS, JSON.stringify(Array.isArray(list) ? list : []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch supplier products');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyerProducts = async (page = 0, size = 10) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getBuyerProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setBuyerProducts(Array.isArray(list) ? list : []);
        setBuyerProductsTotalPages((res as { totalPages?: number }).totalPages ?? 0);
        setBuyerProductsTotalElements((res as { totalElements?: number }).totalElements ?? 0);
        localStorage.setItem(STORAGE_KEYS.BUYER_PRODUCTS, JSON.stringify(Array.isArray(list) ? list : []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch buyer products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerBuyerProducts = async (page = 0, size = 10) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await productService.getFarmerBuyerProducts(page, size);
      if (res.success) {
        const list = res.data ?? [];
        setFarmerBuyerProducts(Array.isArray(list) ? list : []);
        setFarmerBuyerProductsTotalPages((res as { totalPages?: number }).totalPages ?? 0);
        setFarmerBuyerProductsTotalElements((res as { totalElements?: number }).totalElements ?? 0);
        localStorage.setItem(
          STORAGE_KEYS.FARMER_BUYER_PRODUCTS,
          JSON.stringify(Array.isArray(list) ? list : [])
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

  const fetchFarmerProductById = async (id: string): Promise<{ product: FarmerProduct | null; type: 'farmer' | null; error: string | null }> => {
    try {
      setLoading(true);
      const res = await productService.getFarmerProduct(id);
      if (res.success && res.data) {
        return { product: res.data, type: 'farmer', error: null };
      }
      return { product: null, type: null, error: 'Product not found' };
    } catch (err) {
      return { product: null, type: null, error: err instanceof Error ? err.message : 'Failed to fetch product' };
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierProductById = async (id: string): Promise<{ product: SupplierProduct | null; type: 'supplier' | null; error: string | null }> => {
    try {
      setLoading(true);
      const res = await productService.getSupplierProduct(id);
      if (res.success && res.data) {
        return { product: res.data, type: 'supplier', error: null };
      }
      return { product: null, type: null, error: 'Product not found' };
    } catch (err) {
      return { product: null, type: null, error: err instanceof Error ? err.message : 'Failed to fetch product' };
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string): Promise<{ product: FarmerProduct | SupplierProduct | null; type: 'farmer' | 'supplier' | null; error: string | null }> => {
    // Try farmer product first
    const farmerResult = await fetchFarmerProductById(id);
    if (farmerResult.product) {
      return farmerResult;
    }

    // Try supplier product
    const supplierResult = await fetchSupplierProductById(id);
    if (supplierResult.product) {
      return supplierResult;
    }

    return { product: null, type: null, error: 'Product not found' };
  };

  // Order modal management methods
  const showOrderModal = (product: FarmerProduct | SupplierProduct, productType: 'farmer' | 'supplier') => {
    setOrderModalProduct(product);
    setOrderModalProductType(productType);
    setIsOrderModalOpen(true);
  };

  const hideOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderModalProduct(null);
    setOrderModalProductType(null);
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
        notify.error('Try again later', 'Failed to Create product');
        return;
      }
      addFarmerProduct(res.data);
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
      const res = await productService.createSupplierProduct(payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Create product');
        return;
      }
      addSupplierProduct(res.data);
      router.push('/');
      notify.success('Product created successfully', 'Product created');
    } catch {
      notify.error('Try again later', 'Failed to Create product');
    } finally {
      setMutationLoading(false);
    }
  };

  const saveFarmerProduct = async (id: string, payload: FarmerProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.updateFarmerProduct(id, payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Edit product');
        return;
      }
      updateFarmerProduct(res.data.id, res.data);
      notify.success('The product was updated successfully', 'Product edited');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to Edit product');
    } finally {
      setMutationLoading(false);
    }
  };

  const saveSupplierProduct = async (id: string, payload: SupplierProductRequest) => {
    try {
      setMutationLoading(true);
      const res = await productService.updateSupplierProduct(id, payload);
      if (!res?.success || !res.data) {
        notify.error('Try again later', 'Failed to Edit product');
        return;
      }
      updateSupplierProduct(res.data.id, res.data);
      notify.success('Product updated successfully', 'Product edited');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to Edit product');
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteFarmerProduct = async (id: string) => {
    try {
      setMutationLoading(true);
      const res = await productService.deleteFarmerProduct(id);
      if (!res?.success) {
        notify.error('Try again later', 'Failed to delete product');
        return;
      }
      removeFarmerProduct(id);
      notify.success('Product was deleted', 'Product Deleted Successfully');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to delete product');
    } finally {
      setMutationLoading(false);
    }
  };

  const deleteSupplierProduct = async (id: string) => {
    try {
      setMutationLoading(true);
      const res = await productService.deleteSupplierProduct(id);
      if (!res?.success) {
        notify.error('Try again later', 'Failed to delete product');
        return;
      }
      removeSupplierProduct(id);
      notify.success('Product was deleted', 'Product deleted successfully');
      router.back();
    } catch {
      notify.error('Try again later', 'Failed to delete product');
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
    fetchFarmerProductById,
    fetchSupplierProductById,
    fetchProductById,
    // Order modal management
    showOrderModal,
    hideOrderModal,
    isOrderModalOpen,
    orderModalProduct,
    orderModalProductType,
    farmerProductsTotalPages,
    farmerProductsTotalElements,
    supplierProductsTotalPages,
    supplierProductsTotalElements,
    buyerProductsTotalPages,
    buyerProductsTotalElements,
    farmerBuyerProductsTotalPages,
    farmerBuyerProductsTotalElements,
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