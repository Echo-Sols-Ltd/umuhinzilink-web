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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Input } from '@/components/ui/input';


type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

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

type FarmerOrder = {
  id: string;
  buyer?: {
    id?: string;
    names?: string;
    email?: string;
    phoneNumber?: string;
    address?: {
      district?: string;
      province?: string;
    } | null;
  };
  product?: FarmerProduct;
  quantity?: number;
  totalPrice?: number;
  isPaid?: boolean;
  status?: string;
  paymentMethod?: string;
  delivery?: {
    status?: string;
    estimatedDelivery?: string;
    deliveryAddress?: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/farmer', icon: LayoutGrid },
  { label: 'Products', href: '/dashboard/farmer/products', icon: Package },
  { label: 'Input Request', href: '/dashboard/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/dashboard/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/dashboard/farmer/market_analysis', icon: BarChart2 },
  { label: 'Messages', href: '/dashboard/farmer/message', icon: Mail },
  { label: 'Notifications', href: '/dashboard/farmer/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/farmer/profile', icon: UserIcon },
  { label: 'Orders', href: '/dashboard/farmer/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/dashboard/farmer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

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

const BackButton = ({ href = '/dashboard/farmer' }: { href?: string }) => (
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
  const { farmerOrders, loading: ordersLoading } = useOrder();
  const [logoutPending, setLogoutPending] = useState(false);

  // Use context data - all hooks must be called before any early returns
  const currentUser = user;
  const profile = farmer;
  const rawProducts = useMemo(() => farmerProducts || [], [farmerProducts]);
  const rawOrders = useMemo(() => farmerOrders || [], [farmerOrders]);
  const rawRequests = useMemo(() => [] as FarmerRequest[], []);

  const profileLoading = authLoading;
  const profileError = null;
  const requestsLoading = false;
  const requestsError = null;

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

  const requests = useMemo(() => {
    if (!farmerId) return rawRequests;
    return rawRequests.filter(request => {
      const requestFarmerId = (request as unknown as { farmerId?: string })?.farmerId;
      return requestFarmerId ? requestFarmerId === farmerId : true;
    });
  }, [rawRequests, farmerId]);

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
      router.push('/auth/auth/signin');
    } finally {
      setLogoutPending(false);
    }
  };

  const statsCards = useMemo(
    () => [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: `RWF ${formatNumber(totalRevenue)}`,
        subline: paidOrdersCount ? `${paidOrdersCount} paid orders` : 'Awaiting first payment',
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
        iconBg: 'bg-green-100',
        accent: paidOrdersCount ? 'text-green-600' : 'text-gray-400',
      },
      {
        id: 'total-orders',
        title: 'Total Orders',
        value: formatNumber(totalOrders),
        subline: pendingOrdersCount ? `${pendingOrdersCount} pending` : 'All orders fulfilled',
        icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
        iconBg: 'bg-blue-100',
        accent: pendingOrdersCount ? 'text-yellow-600' : 'text-green-600',
      },
      {
        id: 'active-products',
        title: 'Active Products',
        value: formatNumber(activeProductsCount),
        subline: `${products.length} total listings`,
        icon: <Package className="w-6 h-6 text-purple-600" />,
        iconBg: 'bg-purple-100',
        accent: 'text-purple-600',
      },
      {
        id: 'pending-orders',
        title: 'Pending Orders',
        value: formatNumber(pendingOrdersCount),
        subline: `${completedOrdersCount} fulfilled`,
        icon: <Clock className="w-6 h-6 text-yellow-600" />,
        iconBg: 'bg-yellow-100',
        accent: pendingOrdersCount ? 'text-yellow-600' : 'text-green-600',
      },
      {
        id: 'input-requests',
        title: 'Input Requests',
        value: formatNumber(requests.length),
        subline: requests.length
          ? `${requests.filter(req => (req.status || '').toLowerCase() === 'pending').length} pending`
          : 'No requests yet',
        icon: <FilePlus className="w-6 h-6 text-teal-600" />,
        iconBg: 'bg-teal-100',
        accent: requests.length ? 'text-teal-600' : 'text-gray-400',
      },
    ],
    [
      totalRevenue,
      paidOrdersCount,
      totalOrders,
      pendingOrdersCount,
      activeProductsCount,
      products.length,
      completedOrdersCount,
      requests,
    ]
  );

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 min-h-0">
        <aside
          className="w-64 bg-[#00A63E] border-r flex flex-col fixed left-0 top-0 h-screen overflow-y-auto"
          aria-label="Sidebar"
        >
          <div className="flex items-center px-6 py-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-bold text-xl text-white">UmuhinziLink</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {MENU_ITEMS.map((item, index) => {
              const isActive = item.label === 'Dashboard';
              const Icon = item.icon;
              const showDivider = index === 4 || index === 9;

              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutPending}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-white ${logoutPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                        }`}
                    >
                      {logoutPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <Icon className="w-5 h-5 text-white" />
                          <span>{item.label}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${isActive
                          ? 'bg-white text-green-600 shadow-sm'
                          : 'text-white hover:bg-green-700'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4" />}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto ml-64 relative bg-white ">
          <header className="fixed top-0 left-64 right-0 z-30 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
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

          <div className="p-6 mt-16 space-y-6 ">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statsCards.map(card => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className={`text-xs font-medium ${card.accent}`}>{card.subline}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-green-500 text-sm font-medium">
                    {products.length ? `${formatNumber(products.length)} listings` : '—'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatNumber(activeProductsCount)}
                </h3>
                <p className="text-sm text-gray-500">Active product listings</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-green-500 text-sm font-medium">
                    {uniqueBuyersCount ? '+ customers' : '—'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatNumber(uniqueBuyersCount)}
                </h3>
                <p className="text-sm text-gray-500">Unique buyers engaged</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                  <span className="text-xs text-gray-500">{orders.length ? 'All time' : '—'}</span>
                </div>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2.51 * Math.min(100, paidOrdersCount ? 60 + paidOrdersCount * 5 : 20)} ${2.51 * 100}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">
                      {orders.length ? `${Math.min(100, paidOrdersCount * 10)}%` : '--'}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    RWF {formatNumber(totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {paidOrdersCount ? `${paidOrdersCount} paid orders` : 'No paid orders yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl p-6 text-white shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Today&apos;s Weather</h3>
                  <CloudSun className="w-8 h-8 opacity-90" />
                </div>
                <div className="mb-6">
                  <p className="text-4xl font-bold mb-1">24°C</p>
                  <p className="text-sm opacity-90 mb-1">Partly Cloudy</p>
                  <p className="text-xs opacity-80">Kigali, Rwanda</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="opacity-80">Wed</p>
                    <p className="font-semibold">26°C</p>
                  </div>
                  <div>
                    <p className="opacity-80">Thu</p>
                    <p className="font-semibold">23°C</p>
                  </div>
                  <div>
                    <p className="opacity-80">Fri</p>
                    <p className="font-semibold">25°C</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">AI Farming Tips</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">🌱 Planting Season</p>
                    <p className="text-sm text-gray-600">
                      It&apos;s the perfect time to plant seeds. Prepare early for the best harvest
                      results.
                    </p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">🌧️ Weather Alert</p>
                    <p className="text-sm text-gray-600">
                      Rain expected in the next 3 days. Prepare protection for your crops.
                    </p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <p className="font-medium text-gray-900 mb-1">💰 Market Price</p>
                    <p className="text-sm text-gray-600">
                      Tomato prices increased by 15% this month. Great time to sell if you have
                      stock.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Market Revenue Trend</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Year to date</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    RWF {formatNumber(totalRevenue)}
                  </p>
                </div>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={revenueByMonth}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis
                        tickFormatter={value => `RWF ${formatNumber(value as number)}`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip
                        formatter={value => [`RWF ${formatNumber(value as number)}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#revenueColor)"
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current regions to work with
                </h3>
                <div className="space-y-4">
                  {regionStats.length ? (
                    regionStats.map(region => (
                      <div key={region.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-700">{region.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{region.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No regional activity yet. Orders will appear here once you start selling.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <Link
                  href="/dashboard/farmer/products"
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
                              href="/dashboard/farmer/products"
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Input requests</h3>
                  <p className="text-sm text-gray-500">Track your farm input needs</p>
                </div>
                <Link
                  href="/dashboard/farmer/requests"
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
                    No input requests yet. Create one to request seeds, fertilizer or equipment.
                  </p>
                ) : (
                  requests.slice(0, 5).map(request => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.item || 'Requested item'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.quantity != null
                            ? `${request.quantity} units`
                            : 'No quantity specified'}{' '}
                          • {formatDate(request.requestDate || request.createdAt)}
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
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <Dashboard />
  );
}
