import { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { productService } from '@/services/products';
import {
  Product,
  ProductStatus,
  UserRole,
} from '@/types';
import { useAuth } from './AuthContext';

type ProductContextValue = {
  addMyProduct: (data: Product) => void;
  updateProductState: (id: string, data: Partial<Product>) => void;
  removeMyProduct: (id: string) => void;

  fetchProductById: (id: string) => Promise<Product | null>;
  fetchMarketplaceProducts: (page?: number, size?: number) => Promise<void>;
  fetchMyProducts: (page?: number, size?: number) => Promise<void>;

  showOrderModal: (product: Product, productType: 'farmer' | 'supplier') => void;
  hideOrderModal: () => void;
  isOrderModalOpen: boolean;
  orderModalProduct: Product | null;
  orderModalProductType: 'farmer' | 'supplier' | null;

  productsTotalPages: number;
  productsTotalElements: number;

  loading: boolean;
  error: string | null;

  products: Product[];
  myProducts: Product[];
  myStats: any[] | null;

  currentProduct: Product | null;
  editProduct: Product | null;

  setCurrentProduct: (product: Product | null) => void;
  setEditProduct: (product: Product | null) => void;

  inStockMyProducts: Product[];
  outOfStockMyProducts: Product[];
  lowStockMyProducts: Product[];

  inStockProducts: Product[];
  outOfStockProducts: Product[];
  lowStockProducts: Product[];
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const userRole = user?.role;
  const prevUserIdRef = useRef<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myStats, setMyStats] = useState<any[] | null>([]);

  const [productsTotalPages, setProductsTotalPages] = useState(0);
  const [productsTotalElements, setProductsTotalElements] = useState(0);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [orderModalProductType, setOrderModalProductType] = useState<'farmer' | 'supplier' | null>(null);

  const handleProductChange = useCallback((data: Product) => {
    const productId = data.id;

    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...data } : p)));
    setMyProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...data } : p)));

    setCurrentProduct((prev) => (prev?.id === productId ? { ...prev, ...data } : prev));
    setEditProduct((prev) => (prev?.id === productId ? { ...prev, ...data } : prev));
  }, []);

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

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setMyProducts((prev) => prev.filter((p) => p.id !== productId));

    if (currentProduct?.id === productId) setCurrentProduct(null);
    if (editProduct?.id === productId) setEditProduct(null);
  }, [currentProduct, editProduct]);

  const fetchMarketplaceProducts = useCallback(async (page = 0, size = 50) => {
    const res = await productService.getProducts(page, size);
    if (res.success) {
      const list = res.data ?? [];
      setProducts(Array.isArray(list) ? list : []);
      setProductsTotalPages(res.totalPages ?? 0);
      setProductsTotalElements(res.totalElements ?? 0);
    }
  }, []);

  const fetchMyProducts = useCallback(async (page = 0, size = 50) => {
    const res = await productService.getSellerProducts(page, size);
    if (res.success) {
      const list = res.data ?? [];
      setMyProducts(Array.isArray(list) ? list : []);
    }
  }, []);

  useEffect(() => {
    const previousUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchMarketplaceProducts();
        if (!cancelled && userId && userRole === UserRole.SELLER) {
          await fetchMyProducts();
        }
        if (!cancelled && !userId && previousUserId) {
          setMyProducts([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [userId, userRole, fetchMarketplaceProducts, fetchMyProducts]);

  const fetchProductById = useCallback(async (id: string) => {
    try {
      const res = await productService.getProductById(id);
      if (res.success && res.data) return res.data;
      return null;
    } catch {
      return null;
    }
  }, []);

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
    setMyProducts((prev) => [...prev, data]);
    setProducts((prev) => [...prev, data]);
  }, []);

  const updateProductState = useCallback((id: string, data: Partial<Product>) => {
    setMyProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setCurrentProduct((prev) => (prev?.id === id ? { ...prev, ...data } : prev));
    setEditProduct((prev) => (prev?.id === id ? { ...prev, ...data } : prev));
  }, []);

  const removeMyProduct = useCallback((id: string) => {
    setMyProducts((prev) => prev.filter((p) => p.id !== id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const inStockMyProducts = useMemo(
    () => myProducts.filter((p) => p.status === ProductStatus.IN_STOCK),
    [myProducts],
  );
  const outOfStockMyProducts = useMemo(
    () => myProducts.filter((p) => p.status === ProductStatus.OUT_OF_STOCK),
    [myProducts],
  );
  const lowStockMyProducts = useMemo(
    () => myProducts.filter((p) => p.status === ProductStatus.LOW_STOCK),
    [myProducts],
  );

  const inStockMarketplaceProducts = useMemo(
    () => products.filter((p) => p.status === ProductStatus.IN_STOCK),
    [products],
  );
  const outOfStockMarketplaceProducts = useMemo(
    () => products.filter((p) => p.status === ProductStatus.OUT_OF_STOCK),
    [products],
  );
  const lowStockMarketplaceProducts = useMemo(
    () => products.filter((p) => p.status === ProductStatus.LOW_STOCK),
    [products],
  );

  const value: ProductContextValue = {
    addMyProduct,
    updateProductState,
    removeMyProduct,
    fetchProductById,
    fetchMarketplaceProducts,
    fetchMyProducts,
    showOrderModal,
    hideOrderModal,
    isOrderModalOpen,
    orderModalProduct,
    orderModalProductType,
    productsTotalPages,
    productsTotalElements,
    loading,
    error,
    products,
    myProducts,
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
