import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { orderService } from '@/services/orders';
import { FarmerOrder, SupplierOrder, OrderStatus, FarmerProduct } from '@/types';
import { useAuth } from './AuthContext';
import { useProduct } from './ProductContext';

const STORAGE_KEYS = {
    BUYER: 'buyerOrders',
    FARMER: 'farmerOrders',
    SUPPLIER: 'supplierOrders',
    FARMER_BUYER: 'farmerBuyerOrders',
};

export type OrderContextValue = {
    loading: boolean;
    error: string | null;
    buyerOrders: FarmerOrder[] | null;
    farmerOrders: FarmerOrder[] | null;
    supplierOrders: SupplierOrder[] | null;
    farmerBuyerOrders: SupplierOrder[] | null;

    currentFarmerOrder: FarmerOrder | null;
    currentBuyerOrder: FarmerOrder | null
    currentSupplierOrder: SupplierOrder | null;
    currentFarmerBuyerOrder: SupplierOrder | null;
    currentProduct: FarmerProduct | null;

    setCurrentFarmerOrder: (order: FarmerOrder | null) => void;
    setCurrentSupplierOrder: (order: SupplierOrder | null) => void;
    setCurrentFarmerBuyerOrder: (order: SupplierOrder | null) => void;
    setCurrentBuyerOrder: (order: FarmerOrder | null) => void;

    setCurrentProduct: (product: FarmerProduct | null) => void;

    addFarmerOrder: (data: FarmerOrder) => void;
    addFarmerBuyerOrder: (data: SupplierOrder) => void;

    editFarmerOrder: (data: FarmerOrder) => void;
    editFarmerBuyerOrder: (data: SupplierOrder) => void;
    editSupplierOrder: (data: SupplierOrder) => void;

    fetchBuyerOrders: () => Promise<FarmerOrder[] | null>;
    fetchFarmerOrders: () => Promise<FarmerOrder[] | null>;

    // Derived order states
    pendingBuyerOrders: FarmerOrder[];
    completedBuyerOrders: FarmerOrder[];
    cancelledBuyerOrders: FarmerOrder[];
    activeBuyerOrders: FarmerOrder[];

    pendingFarmerOrders: FarmerOrder[];
    completedFarmerOrders: FarmerOrder[];
    cancelledFarmerOrders: FarmerOrder[];
    activeFarmerOrders: FarmerOrder[];

    pendingSupplierOrders: SupplierOrder[];
    completedSupplierOrders: SupplierOrder[];
    cancelledSupplierOrders: SupplierOrder[];
    activeSupplierOrders: SupplierOrder[];

    pendingFarmerBuyerOrders: SupplierOrder[];
    completedFarmerBuyerOrders: SupplierOrder[];
    cancelledFarmerBuyerOrders: SupplierOrder[];
    activeFarmerBuyerOrders: SupplierOrder[];
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { updateBuyerProduct } = useProduct()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const [buyerOrders, setBuyerOrders] = useState<FarmerOrder[] | null>(null);
    const [farmerOrders, setFarmerOrders] = useState<FarmerOrder[] | null>(null);
    const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[] | null>(null);
    const [farmerBuyerOrders, setFarmerBuyerOrders] = useState<SupplierOrder[] | null>(null);

    const [currentFarmerOrder, setCurrentFarmerOrder] = useState<FarmerOrder | null>(null);
    const [currentSupplierOrder, setCurrentSupplierOrder] = useState<SupplierOrder | null>(null);
    const [currentFarmerBuyerOrder, setCurrentFarmerBuyerOrder] = useState<SupplierOrder | null>(null);
    const [currentBuyerOrder, setCurrentBuyerOrder] = useState<FarmerOrder | null>(null)
    const [currentProduct, setCurrentProduct] = useState<FarmerProduct | null>(null);

    // 🔹 Load cached orders on mount
    useEffect(() => {
        const loadCachedOrders = async () => {
            try {
                const cachedBuyer = await localStorage.getItemAsync(STORAGE_KEYS.BUYER);
                const cachedFarmer = await localStorage.getItemAsync(STORAGE_KEYS.FARMER);
                const cachedSupplier = await localStorage.getItemAsync(STORAGE_KEYS.SUPPLIER);
                const cachedFarmerBuyer = await localStorage.getItemAsync(STORAGE_KEYS.FARMER_BUYER);

                if (cachedBuyer) setBuyerOrders(JSON.parse(cachedBuyer));
                if (cachedFarmer) setFarmerOrders(JSON.parse(cachedFarmer));
                if (cachedSupplier) setSupplierOrders(JSON.parse(cachedSupplier));
                if (cachedFarmerBuyer) setFarmerBuyerOrders(JSON.parse(cachedFarmerBuyer));
            } catch (e) {
                console.warn('Failed to load cached orders', e);
            }
        };

        loadCachedOrders();
    }, []);

    // 🔹 Fetch Buyer Orders
    const fetchBuyerOrders = async (): Promise<FarmerOrder[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const res = await orderService.getBuyerOrders();
            if (!res.success) {
                setError(res.message || 'Failed to fetch orders');
                return null;
            }
            setBuyerOrders(res.data ?? null);
            await localStorage.setItemAsync(STORAGE_KEYS.BUYER, JSON.stringify(res.data ?? []));
            return res.data ?? null;
        } catch (err) {
            setError(err?.message || 'Failed to fetch orders');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch Farmer Orders
    const fetchFarmerOrders = async (): Promise<FarmerOrder[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const res = await orderService.getFarmerOrders();
            if (!res.success) {
                setError(res.message || 'Failed to fetch orders');
                return null;
            }
            setFarmerOrders(res.data ?? null);
            await localStorage.setItemAsync(STORAGE_KEYS.FARMER, JSON.stringify(res.data ?? []));
            return res.data ?? null;
        } catch (err) {
            setError(err?.message || 'Failed to fetch orders');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch Supplier Orders
    const fetchSupplierOrders = async (): Promise<SupplierOrder[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const res = await orderService.getSupplierOrders();
            if (!res.success) {
                setError(res.message || 'Failed to fetch orders');
                return null;
            }
            setSupplierOrders(res.data ?? null);
            await localStorage.setItemAsync(STORAGE_KEYS.SUPPLIER, JSON.stringify(res.data ?? []));
            return res.data ?? null;
        } catch (err) {
            setError(err?.message || 'Failed to fetch orders');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Fetch Farmer Buyer Orders
    const fetchFarmerBuyerOrders = async (): Promise<SupplierOrder[] | null> => {
        try {
            setLoading(true);
            setError(null);
            const res = await orderService.getFarmerBuyerOrders();
            if (!res.success) {
                setError(res.message || 'Failed to fetch orders');
                return null;
            }
            setFarmerBuyerOrders(res.data ?? null);
            await localStorage.setItemAsync(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(res.data ?? []));
            return res.data ?? null;
        } catch (err) {
            setError(err?.message || 'Failed to fetch orders');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addFarmerOrder = (data: FarmerOrder) => {
        setBuyerOrders((prev) => {
            const updated = prev ? [data, ...prev] : [data];
            localStorage.setItemAsync(STORAGE_KEYS.FARMER, JSON.stringify(updated));
            return updated;
        });
        updateBuyerProduct(data.product.id, data.product)
        setCurrentBuyerOrder(data);
    };

    const addFarmerBuyerOrder = (data: SupplierOrder) => {
        setFarmerBuyerOrders((prev) => {
            const updated = prev ? [data, ...prev] : [data];
            localStorage.setItemAsync(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
            return updated;
        });
        setCurrentFarmerBuyerOrder(data);
    };

    const editFarmerOrder = (data: FarmerOrder) => {
        setFarmerOrders((prev) => {
            const updated = prev?.map((order) => (order.id === data.id ? data : order)) ?? [data];
            localStorage.setItemAsync(STORAGE_KEYS.FARMER, JSON.stringify(updated));
            return updated;
        });
        setCurrentFarmerOrder(data);
    };

    const editSupplierOrder = (data: SupplierOrder) => {
        setSupplierOrders((prev) => {
            const updated = prev?.map((order) => (order.id === data.id ? data : order)) ?? [data];
            localStorage.setItemAsync(STORAGE_KEYS.SUPPLIER, JSON.stringify(updated));
            return updated;
        });
        setCurrentSupplierOrder(data);
    };

    const editFarmerBuyerOrder = (data: SupplierOrder) => {
        setFarmerBuyerOrders((prev) => {
            const updated = prev?.map((order) => (order.id === data.id ? data : order)) ?? [data];
            localStorage.setItemAsync(STORAGE_KEYS.FARMER_BUYER, JSON.stringify(updated));
            return updated;
        });
        setCurrentFarmerBuyerOrder(data);
    };

    // 🔹 Auto-fetch when user logs in
    useEffect(() => {
        if (!user?.id) return;
        fetchFarmerOrders();
        fetchBuyerOrders();
        fetchFarmerBuyerOrders()
        fetchSupplierOrders()
    }, [user?.id]);

    // 🔹 Derived Orders
    const pendingBuyerOrders = useMemo(() => buyerOrders?.filter((o) => o.status === OrderStatus.PENDING) || [], [buyerOrders]);
    const completedBuyerOrders = useMemo(() => buyerOrders?.filter((o) => o.status === OrderStatus.COMPLETED) || [], [buyerOrders]);
    const cancelledBuyerOrders = useMemo(() => buyerOrders?.filter((o) => o.status === OrderStatus.CANCELLED) || [], [buyerOrders]);
    const activeBuyerOrders = useMemo(() => buyerOrders?.filter((o) => o.status === OrderStatus.ACTIVE) || [], [buyerOrders]);

    const pendingFarmerOrders = useMemo(() => farmerOrders?.filter((o) => o.status === OrderStatus.PENDING) || [], [farmerOrders]);
    const completedFarmerOrders = useMemo(() => farmerOrders?.filter((o) => o.status === OrderStatus.COMPLETED) || [], [farmerOrders]);
    const cancelledFarmerOrders = useMemo(() => farmerOrders?.filter((o) => o.status === OrderStatus.CANCELLED) || [], [farmerOrders]);
    const activeFarmerOrders = useMemo(() => farmerOrders?.filter((o) => o.status === OrderStatus.ACTIVE) || [], [farmerOrders]);

    const pendingSupplierOrders = useMemo(() => supplierOrders?.filter((o) => o.status === OrderStatus.PENDING) || [], [supplierOrders]);
    const completedSupplierOrders = useMemo(() => supplierOrders?.filter((o) => o.status === OrderStatus.COMPLETED) || [], [supplierOrders]);
    const cancelledSupplierOrders = useMemo(() => supplierOrders?.filter((o) => o.status === OrderStatus.CANCELLED) || [], [supplierOrders]);
    const activeSupplierOrders = useMemo(() => supplierOrders?.filter((o) => o.status === OrderStatus.ACTIVE) || [], [supplierOrders]);

    const pendingFarmerBuyerOrders = useMemo(() => farmerBuyerOrders?.filter((o) => o.status === OrderStatus.PENDING) || [], [farmerBuyerOrders]);
    const completedFarmerBuyerOrders = useMemo(() => farmerBuyerOrders?.filter((o) => o.status === OrderStatus.COMPLETED) || [], [farmerBuyerOrders]);
    const cancelledFarmerBuyerOrders = useMemo(() => farmerBuyerOrders?.filter((o) => o.status === OrderStatus.CANCELLED) || [], [farmerBuyerOrders]);
    const activeFarmerBuyerOrders = useMemo(() => farmerBuyerOrders?.filter((o) => o.status === OrderStatus.ACTIVE) || [], [farmerBuyerOrders]);

    const value: OrderContextValue = {
        loading,
        error,
        buyerOrders,
        farmerOrders,
        supplierOrders,
        farmerBuyerOrders,
        currentFarmerOrder,
        currentBuyerOrder,
        currentSupplierOrder,
        currentFarmerBuyerOrder,
        currentProduct,
        setCurrentFarmerOrder,
        setCurrentSupplierOrder,
        setCurrentBuyerOrder,
        setCurrentFarmerBuyerOrder,
        setCurrentProduct,
        addFarmerOrder,
        addFarmerBuyerOrder,
        editFarmerOrder,
        editSupplierOrder,
        editFarmerBuyerOrder,
        fetchBuyerOrders,
        fetchFarmerOrders,
        pendingBuyerOrders,
        completedBuyerOrders,
        cancelledBuyerOrders,
        activeBuyerOrders,
        pendingFarmerOrders,
        completedFarmerOrders,
        cancelledFarmerOrders,
        activeFarmerOrders,
        pendingSupplierOrders,
        completedSupplierOrders,
        cancelledSupplierOrders,
        activeSupplierOrders,
        pendingFarmerBuyerOrders,
        completedFarmerBuyerOrders,
        cancelledFarmerBuyerOrders,
        activeFarmerBuyerOrders,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
    const ctx = useContext(OrderContext);
    if (!ctx) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return ctx;
}
