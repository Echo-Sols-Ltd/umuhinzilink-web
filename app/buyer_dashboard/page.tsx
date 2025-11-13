'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  Heart,
  Mail,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  FilePlus,
  TrendingUp,
  Users,
  Star,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import { BuyerGuard } from '@/components/auth/AuthGuard';
import { getAuthToken, getCurrentUser, logout } from '@/lib/auth';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const menuItems = [
  { label: 'Dashboard', href: '/buyer_dashboard', icon: CheckCircle },
  { label: 'My Purchase', href: '/buyer_dashboard/purchases', icon: LayoutGrid },
  { label: 'Browse Product', href: '/buyer_dashboard/product', icon: FilePlus },
  { label: 'Saved Items', href: '/buyer_dashboard/saved', icon: Heart },
  { label: 'Message', href: '/buyer_dashboard/message', icon: Mail },
  { label: 'Profile', href: '/buyer_dashboard/profile', icon: User },
  { label: 'Contact', href: '/buyer_dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/buyer_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];


const produce = [
  {
    name: 'Premium Maize',
    price: '500 RWF/kg',
    available: '50kg available',
    farmer: 'Jean Baptiste',
    image: '/maize.png',
    rating: '4.8',
    reviews: '24',
  },
  {
    name: 'Premium Maize',
    price: '500 RWF/kg',
    available: '50kg available',
    farmer: 'Jean Baptiste',
    image: '/maize.png',
    rating: '4.8',
    reviews: '24',
  },
  {
    name: 'Premium Maize',
    price: '500 RWF/kg',
    available: '50kg available',
    farmer: 'Jean Baptiste',
    image: '/maize.png',
    rating: '4.8',
    reviews: '24',
  },
  {
    name: 'Premium Maize',
    price: '500 RWF/kg',
    available: '50kg available',
    farmer: 'Jean Baptiste',
    image: '/maize.png',
    rating: '4.8',
    reviews: '24',
  },
  {
    name: 'Premium Maize',
    price: '500 RWF/kg',
    available: '50kg available',
    farmer: 'Jean Baptiste',
    image: '/maize.png',
    rating: '4.8',
    reviews: '24',
  },
];

type Order = {
  id: string;
  buyer: {
    names: string;
    email: string;
    phoneNumber: string;
    address: {
      district: string;
      province: string;
    } | null;
  };
  product: {
    name: string;
    category: string;
    unitPrice: number;
    measurementUnit: string;
    farmer: {
      user: {
        names: string;
        address: {
          district: string;
          province: string;
        } | null;
      };
    };
  };
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  status: string;
  delivery?: {
    deliveryAddress?: string;
    status?: string;
    estimatedDelivery?: string;
  };
  paymentMethod?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
};

type OrdersResponse = {
  success: boolean;
  data: Order[];
  message?: string;
};

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function BuyerDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string>('Buyer');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.names) {
      setBuyerName(currentUser.names.split(' ')[0] || currentUser.names);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getAuthToken();

      if (!token) {
        setOrdersError('You need to sign in to view orders.');
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        const response = await fetch('/api/orders/buyer', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const body: OrdersResponse | null = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            body?.message || body?.data
              ? Array.isArray(body?.data)
                ? 'Failed to load orders'
                : JSON.stringify(body?.data)
              : 'Failed to load orders';
          throw new Error(message);
        }

        const ordersData = body?.data ?? [];
        setOrders(ordersData);
        setOrdersError(null);
      } catch (error: unknown) {
        console.error('Error fetching buyer orders:', error);
        const message =
          error instanceof Error ? error.message : 'Unable to load orders. Please try again.';
        setOrdersError(message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: 'Total Orders',
        value: String(orders.length),
        subtitle: 'All time',
        icon: ShoppingCart,
        color: 'bg-green-500',
        textColor: 'text-white',
      },
      {
        title: 'Paid Orders',
        value: String(orders.filter(order => order.isPaid).length),
        subtitle: 'Completed payments',
        icon: Users,
        color: 'bg-blue-500',
        textColor: 'text-white',
      },
      {
        title: 'Pending Delivery',
        value: String(orders.filter(order => order.status?.toLowerCase() === 'pending').length),
        subtitle: 'Awaiting delivery',
        icon: Star,
        color: 'bg-green-500',
        textColor: 'text-white',
      },
      {
        title: 'Total Value',
        value: `${orders
          .reduce((total, order) => total + (Number(order.totalPrice) || 0), 0)
          .toLocaleString()} RWF`,
        subtitle: 'Gross order value',
        icon: TrendingUp,
        color: 'bg-green-500',
        textColor: 'text-white',
      },
    ],
    [orders]
  );

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    logout(router);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Market Trends',
        data: [65, 59, 80, 81, 56, 55, 70, 85, 90, 95, 88, 92],
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header above everything */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-green-600 flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = item.label === 'Dashboard';
              const Icon = item.icon;
              const showDivider = index === 4 || index === 8;
              return (
                <div key={item.label}>
                  {item.isLogout ? (
                    <div
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium text-white hover:bg-green-700`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link href={item.href} className="block">
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                          ${
                            isActive
                              ? 'bg-white text-green-600 shadow-sm'
                              : 'text-white hover:bg-green-700'
                          }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                  {showDivider && <div className="border-t border-green-500 my-2 mx-4"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Green Welcome Bar */}
          <div className="bg-green-600 rounded-2xl mt-0 text-white px-6 py-8 shadow-sm mb-4">
            <h1 className="text-lg font-semibold mb-2">Welcome back, {buyerName}!</h1>
            <p className="text-sm opacity-90">
              Manage your agricultural purchases and connect with farmers across Rwanda
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`${stat.color} p-6 rounded-lg shadow-sm flex items-center gap-4 ${stat.textColor}`}
                >
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs opacity-75">{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-semibold text-gray-600">Market Trends Prices</h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">390,548.03</p>
                  <p className="text-sm text-gray-500">RWF</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-gray-600">Expensive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-gray-600">Profit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-gray-600">Cheap</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-600 mb-4">Regional Overview</h3>
              <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Rwanda Map</p>
                  <p className="text-xs text-gray-500 mt-1">Active regions: 5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Produce */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-600">Recommended Produce</h2>
              <a href="#" className="text-green-600 text-sm">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {produce.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <img src={item.image} alt={item.name} className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">by {item.farmer}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviews})</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-green-600 font-bold text-sm">{item.price}</p>
                      <p className="text-xs text-gray-500">{item.available}</p>
                    </div>
                    <button className="mt-2 w-full bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-600">Recent Orders</h2>
              <a href="#" className="text-green-600 text-sm hover:underline">
                View All
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-gray-500 font-medium">ID</th>
                    <th className="py-3 text-left text-gray-500 font-medium">FARMER</th>
                    <th className="py-3 text-left text-gray-500 font-medium">LOCATION</th>
                    <th className="py-3 text-left text-gray-500 font-medium">ORDERED</th>
                    <th className="py-3 text-left text-gray-500 font-medium">PRODUCT</th>
                    <th className="py-3 text-left text-gray-500 font-medium">QTY</th>
                    <th className="py-3 text-left text-gray-500 font-medium">TOTAL</th>
                    <th className="py-3 text-left text-gray-500 font-medium">STATUS</th>
                    <th className="py-3 text-left text-gray-500 font-medium">DELIVERY</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && ordersError && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-red-500">
                        {ordersError}
                      </td>
                    </tr>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500">
                        You have no orders yet.
                      </td>
                    </tr>
                  )}
                  {!ordersLoading &&
                    !ordersError &&
                    orders.map(order => {
                      const farmerName =
                        order.product?.farmer?.user?.names || order.buyer?.names || '—';
                      const farmerAddress =
                        order.product?.farmer?.user?.address ||
                        order.buyer?.address || {
                          district: '—',
                          province: '',
                        };
                      const productName = order.product?.name || '—';
                      const quantity = Number(order.quantity) || 0;
                      const unitPrice = Number(order.product?.unitPrice) || 0;
                      const totalPrice =
                        Number.isFinite(Number(order.totalPrice)) && Number(order.totalPrice) > 0
                          ? Number(order.totalPrice)
                          : quantity * unitPrice;

                      return (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 text-gray-900">{order.id}</td>
                          <td className="py-4 text-gray-900">{farmerName}</td>
                          <td className="py-4 text-gray-600">
                            {farmerAddress?.district
                              ? `${farmerAddress.district}, ${farmerAddress?.province ?? ''}`
                              : '—'}
                          </td>
                          <td className="py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                          <td className="py-4 text-gray-900">{productName}</td>
                          <td className="py-4 text-gray-600">
                            {quantity} {order.product?.measurementUnit || ''}
                          </td>
                          <td className="py-4 text-gray-900">
                            {totalPrice.toLocaleString()} RWF
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status?.toLowerCase() === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : order.status?.toLowerCase() === 'completed' ||
                                      order.status?.toLowerCase() === 'delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status?.toLowerCase() === 'cancelled'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-gray-600">
                            {order.delivery?.status
                              ? `${order.delivery.status} · ${formatDate(order.delivery.estimatedDelivery)}`
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-xs text-gray-500 mt-6">
            Contact Support: SMS Habla - +250 123 456 789
            <span className="float-right">© 2024 UmuhinziLink, All rights reserved.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <BuyerGuard>
      <BuyerDashboard />
    </BuyerGuard>
  );
}
