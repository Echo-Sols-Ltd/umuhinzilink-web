'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import { useOrder } from '@/contexts/OrderContext';
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
    acceptFarmerOrder,
    cancelFarmerOrder,
    updateFarmerOrderStatus,
    mutationLoading: actionLoading,
  } = useOrder();
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

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);

    try {
      await logout();
      router.push('/auth/signin');
    } finally {
      setLogoutPending(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Dashboard' />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Farmer Dashboard</h1>
            <p className="text-xs text-gray-500">Manage your farm products and connect with buyers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Search products or orders..."
              />
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-colors">
              <FilePlus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Welcome back, {shortName}!</h2>
                <p className="text-sm text-gray-600 mt-1">Here's an overview of your farm activity</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">RWF {formatNumber(totalRevenue)}</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

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
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </div>
            </Link>

            <Link
              href="/farmer/orders"
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Orders</h3>
                  <p className="text-sm text-gray-600">Track and manage orders</p>
                </div>
              </div>
            </Link>

            <Link
              href="/farmer/supplier-orders"
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Supplier Orders</h3>
                  <p className="text-sm text-gray-600">Manage input requests</p>
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
