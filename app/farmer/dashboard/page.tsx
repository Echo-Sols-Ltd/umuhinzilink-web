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
import useOrderAction from '@/hooks/useOrderAction';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';



type FarmerProfile = {
  id: string;
  names: string;
  email?: string;
  avatar?: string | null;
  phoneNumber?: string;
  farmSize?: string;
  crops?: string[];
  experienceLevel?: string;
  address?: {
    district?: string;
    province?: string;
  } | null;
};

type FarmerProduct = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  unitPrice?: number;
  measurementUnit?: string;
  quantity?: number;
  productStatus?: string;
  isNegotiable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  harvestDate?: string;
  location?: string;
  image?: string | null;
  farmer?: {
    id?: string;
    user?: {
      id?: string;
      names?: string;
    };
  };
  user?: {
    id?: string;
    names?: string;
  };
};



type FarmerRequest = {
  id: string;
  item?: string;
  quantity?: number;
  paymentType?: string;
  status?: string;
  requestDate?: string;
  createdAt?: string;
  updatedAt?: string;
};



const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const BackButton = ({ href = '/farmer/dashboard' }: { href?: string }) => (
  <Link
    href={href}
    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
  >
    <svg
      className="w-4 h-4 mr-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
    Back to Dashboard
  </Link>
);

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
  const { farmerOrders, farmerBuyerOrders, loading: ordersLoading, fetchFarmerBuyerOrders } = useOrder();
  const { acceptFarmerOrder, cancelFarmerOrder, updateFarmerOrderStatus, loading: actionLoading } = useOrderAction();
  const [logoutPending, setLogoutPending] = useState(false);

  // Use context data - all hooks must be called before any early returns
  const currentUser = user;
  const profile = farmer;
  const rawProducts = useMemo(() => farmerProducts || [], [farmerProducts]);
  const rawOrders = useMemo(() => farmerOrders || [], [farmerOrders]);
  const rawRequests = useMemo(() => [] as FarmerRequest[], []);

  const handleAcceptOrder = async (orderId: string) => {
    await acceptFarmerOrder(orderId);
  };
  const handleUpdateStatus = async (orderId: string, status: DeliveryStatus) => {
    await updateFarmerOrderStatus(orderId, status);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelFarmerOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setIsDetailsModalOpen(false);
      }
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<FarmerOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const profileLoading = authLoading;
  const profileError = null;

  const farmerId = profile?.id || currentUser?.id || null;

  const orders = useMemo(() => {
    if (!farmerId) return rawOrders;
    return rawOrders.filter(order => {
      const productFarmerId = order.product?.farmer?.user?.id || order.product?.farmer?.id;
      return productFarmerId ? productFarmerId === farmerId : true;
    });
  }, [rawOrders, farmerId]);

  const products = useMemo(() => {
    if (!farmerId) return rawProducts;
    return rawProducts.filter(product => {
      const ownerId = product.farmer?.user?.id || product.farmer?.id;
      return ownerId ? ownerId === farmerId : true;
    });
  }, [rawProducts, farmerId]);

  const requests = useMemo(() => farmerBuyerOrders || [], [farmerBuyerOrders]);
  const requestsLoading = ordersLoading;
  const requestsError = null;

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

  const paidOrdersCount = useMemo(() => orders.filter(order => order.isPaid).length, [orders]);

  const pendingOrdersCount = useMemo(
    () => orders.filter(order => (order.status || '').toLowerCase() === 'pending').length,
    [orders]
  );

  const completedOrdersCount = useMemo(
    () =>
      orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status === 'completed' || status === 'delivered';
      }).length,
    [orders]
  );

  const activeProductsCount = useMemo(
    () =>
      products.filter(product => (product.productStatus || '').toLowerCase() === 'in_stock').length,
    [products]
  );

  const totalOrders = orders.length;

  const uniqueBuyersCount = useMemo(() => {
    const ids = new Set<string>();
    orders.forEach(order => {
      const id = order.buyer?.id || order.buyer?.email || order.buyer?.phoneNumber;
      if (id) ids.add(id);
    });
    return ids.size;
  }, [orders]);

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const aDate = new Date(a.harvestDate || '').getTime();
        const bDate = new Date(b.harvestDate || '').getTime();
        return bDate - aDate;
      })
      .slice(0, 10);
  }, [products]);

  const regionStats = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach(order => {
      const district = order.buyer?.address?.district || 'Unknown region';
      counts.set(district, (counts.get(district) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [orders]);

  const revenueByMonth = useMemo(() => {
    if (!orders.length) {
      return MONTH_LABELS.map(name => ({ name, value: 0 }));
    }

    const totals = new Map<string, number>();

    orders.forEach(order => {
      const date = new Date(order.createdAt || order.updatedAt || '');
      if (Number.isNaN(date.getTime())) return;

      const month = MONTH_LABELS[date.getMonth()];
      const current = totals.get(month) ?? 0;
      totals.set(month, current + (Number(order.totalPrice) || 0));
    });

    return MONTH_LABELS.map(name => ({
      name,
      value: totals.get(name) ?? 0,
    }));
  }, [orders]);

  const todayLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        userType={UserType.FARMER}
        activeItem='Dashboard' />

      <main className="flex-1 overflow-auto relative bg-white ">
        <header className=" top-0 left-0 right-0 z-30 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                className="pl-10 pr-4 py-2 w-80 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Search here ..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span role="img" aria-label="Rwanda flag">
                🇷🇼
              </span>
              <span>English</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{initials || 'F'}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {profileLoading ? 'Loading...' : shortName}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 ">
          <div>
            <p className="text-sm text-gray-500 mb-1">{todayLabel}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Good {new Date().getHours() < 12 ? 'Morning' : 'Day'} 👋, {shortName}
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your farm today{profileLoading ? '...' : '.'}
            </p>
            {profileError && <p className="text-sm text-red-500 mt-2">{profileError}</p>}
          </div>

          {/* Enhanced Analytics Dashboard */}
          <EnhancedDashboard
            userRole="farmer"
            orders={orders}
            products={products}
            className="mb-6"
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <Link
                href="/farmer/products"
                className="text-sm text-green-600 hover:underline"
              >
                Manage products
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                      Updated
                    </th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : productsError ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-red-500">
                        {productsError}
                      </td>
                    </tr>
                  ) : recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        You haven&apos;t added any products yet.
                      </td>
                    </tr>
                  ) : (
                    recentProducts.map(product => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name || 'Unnamed product'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category || 'Uncategorized'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {formatDate(product.updatedAt || product.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {product.quantity != null
                            ? `${formatNumber(product.quantity)} ${product.measurementUnit || ''}`
                            : '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.unitPrice != null
                            ? `RWF ${formatNumber(product.unitPrice)}`
                            : '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {product.location ||
                            product.farmer?.user?.names ||
                            profile?.address?.district ||
                            '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(product.productStatus || '').toLowerCase() === 'in_stock'
                              ? 'bg-green-100 text-green-800'
                              : (product.productStatus || '').toLowerCase() === 'out_of_stock'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {product.productStatus || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href="/farmer/products"
                            className="text-green-600 hover:text-green-900"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                href="/farmer/orders"
                className="text-sm text-green-600 hover:underline"
              >
                View all orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Order ID</th>
                    <th scope="col" className="px-4 py-3">Buyer</th>
                    <th scope="col" className="px-4 py-3">Product</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                        No orders received yet.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map(order => {
                      const statusKey = (order.status || 'PENDING').toUpperCase();
                      const isPending = statusKey === 'PENDING';

                      return (
                        <tr key={order.id} className="border-b border-gray-200">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(0, 4)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.buyer?.names || 'Unknown Buyer'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.product?.name || '—'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            RWF {formatNumber(order.totalPrice || 0)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusKey === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              statusKey === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                                statusKey === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <OrderDetailsModal
            order={selectedOrder as any}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            onAccept={handleAcceptOrder}
            onCancel={handleCancelOrder}
            onUpdateStatus={handleUpdateStatus}
            loading={actionLoading}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Input Orders</h3>
                <p className="text-sm text-gray-500">Track your purchases from suppliers</p>
              </div>
              <Link
                href="/farmer/requests"
                className="text-sm text-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {requestsLoading ? (
                <p className="text-sm text-gray-500">Loading requests...</p>
              ) : requestsError ? (
                <p className="text-sm text-red-500">{requestsError}</p>
              ) : requests.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No input orders yet. Buy seeds or equipment from the marketplace.
                </p>
              ) : (
                requests.slice(0, 5).map(request => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {request.product?.name || 'Input Item'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.quantity}{' '}
                        {request.product?.measurementUnit || 'units'} •{' '}
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${(request.status || '').toLowerCase() === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : (request.status || '').toLowerCase() === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {request.status || 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
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
