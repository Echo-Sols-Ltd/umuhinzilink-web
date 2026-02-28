'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';
import useOrderAction from '@/hooks/useOrderAction';
import {
  LayoutGrid,
  FilePlus,
  BarChart2,
  MessageSquare,
  LogOut,
  ShoppingCart,
  User as UserIcon,
  Settings,
  CloudSun,
  Mail,
  Leaf,
  Package,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  Users as UsersIcon,
  Clock,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserType, FarmerOrder, DeliveryStatus } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';
import { EnhancedDashboard } from '@/components/analytics/EnhancedDashboard';
import Sidebar from '@/components/shared/Sidebar';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils';

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0, ...options });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function Dashboard() {
  const router = useRouter();
  const { user, farmer, loading: authLoading, logout } = useAuth();
  const { farmerProducts, loading: productsLoading, error: productsError } = useProduct();
  const {
    farmerOrders,
    farmerBuyerOrders,
    loading: ordersLoading,
    fetchFarmerBuyerOrders,
  } = useOrder();
  const {
    acceptFarmerOrder,
    cancelFarmerOrder,
    updateFarmerOrderStatus,
    loading: actionLoading,
  } = useOrderAction();
  const [logoutPending, setLogoutPending] = useState(false);

  // Use context data - all hooks must be called before any early returns
  const currentUser = user;
  const profile = farmer;
  const rawProducts = useMemo(() => farmerProducts || [], [farmerProducts]);
  const rawOrders = useMemo(() => farmerOrders || [], [farmerOrders]);
  const rawRequests = useMemo(() => [] as any[], []);

  const farmerId = profile?.id || currentUser?.id || null;

  const orders = useMemo(() => {
    if (!farmerId) return rawOrders;
    return rawOrders.filter(order => {
      const productFarmerId = order.product?.owner?.id || order.product?.owner?.id;
      return productFarmerId ? productFarmerId === farmerId : true;
    });
  }, [rawOrders, farmerId]);

  const products = useMemo(() => {
    if (!farmerId) return rawProducts;
    return rawProducts.filter(product => {
      const ownerId = product.owner?.id || product.owner?.id;
      return ownerId ? ownerId === farmerId : true;
    });
  }, [rawProducts, farmerId]);

  const requests = useMemo(() => farmerBuyerOrders || [], [farmerBuyerOrders]);

  useEffect(() => {
    fetchFarmerBuyerOrders();
  }, []);

  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum, order) => {
        const value = Number(order.totalPrice) || 0;
        return sum + value;
      }, 0),
    [orders]
  );

  const totalOrders = orders.length;
  const displayName = profile?.names || currentUser?.names || 'Farmer';
  const shortName = displayName.split(' ')[0] || displayName;
  const initials = getInitials(displayName || 'F');


  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Dashboard' />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-card border-b flex items-center justify-between p-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Farmer Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your farm products and connect with buyers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Search products or orders..."
              />
            </div>
            <button className="bg-primary text-primary-foreground px-4 cursor-pointer py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
              onClick={() => router.push('/farmer/add_produce')}
            >
              <FilePlus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </header>

        <main className="flex-1 bg-card p-6 space-y-6">    

          {/* Enhanced Analytics Dashboard */}
          <EnhancedDashboard
            userRole="farmer"
            orders={orders}
            products={products}
            className="mb-6"
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/farmer/products"
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                </div>
              </div>
            </Link>

            <Link
              href="/farmer/orders"
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View Orders</h3>
                  <p className="text-sm text-muted-foreground">Track and manage orders</p>
                </div>
              </div>
            </Link>

            <Link
              href="/farmer/supplier-orders"
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Supplier Orders</h3>
                  <p className="text-sm text-muted-foreground">Manage input requests</p>
                </div>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <FarmerGuard>
      <Dashboard />
    </FarmerGuard>
  );
}
