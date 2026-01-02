'use client';

import React, { useMemo, useState } from 'react';
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
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';

import { toast } from '@/components/ui/use-toast';
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
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { useProduct } from '@/contexts/ProductContext';

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
  { label: 'Dashboard', href: '/buyer/dashboard', icon: CheckCircle },
  { label: 'My Purchase', href: '/buyerpurchases', icon: LayoutGrid },
  { label: 'Browse Product', href: '/buyerproduct', icon: FilePlus },
  { label: 'Saved Items', href: '/buyersaved', icon: Heart },
  { label: 'Message', href: '/buyermessage', icon: Mail },
  { label: 'Profile', href: '/buyerprofile', icon: User },
  { label: 'Contact', href: '/buyercontact', icon: Phone },
  { label: 'Settings', href: '/buyersettings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const { buyerOrders, loading: ordersLoading, error: ordersError } = useOrder();
  const { buyerProducts, loading: productsLoading, error: productsError } = useProduct();
  const [logoutPending, setLogoutPending] = useState(false);

  // Use context data
  const buyerName = user?.names?.split(' ')[0] || user?.names || 'Buyer';
  const orders = useMemo(() => buyerOrders || [], [buyerOrders]);
  const recommendedProducts = useMemo(() => buyerProducts || [], [buyerProducts]);

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
        subtitle: 'Completed Orders',
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

  const handleLogout = async () => {

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
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                          ${isActive
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
              {productsLoading && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  Loading produce...
                </div>
              )}
              {!productsLoading && productsError && (
                <div className="col-span-full text-center text-gray-600 bg-gray-100 border border-gray-200 rounded-lg py-6">
                  {productsError}
                </div>
              )}
              {!productsLoading && !productsError && recommendedProducts.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  No produce available at the moment.
                </div>
              )}
              {!productsLoading &&
                !productsError &&
                recommendedProducts.map(product => {
                  const priceText = `${Number(product.unitPrice || 0).toLocaleString()} RWF/${product.measurementUnit || ''
                    }`;
                  const farmerName = product.farmer?.user?.names || 'Unknown farmer';
                  const quantityText =
                    product.quantity !== undefined
                      ? `${product.quantity?.toLocaleString?.() || product.quantity} ${product.measurementUnit || ''
                      } available`
                      : '';

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden"
                    >
                      <div className="h-32 w-full bg-gray-100 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1 line-clamp-1">by {farmerName}</p>
                        <div className="mt-2">
                          <p className="text-green-600 font-bold text-sm">{priceText}</p>
                          {quantityText && <p className="text-xs text-gray-500">{quantityText}</p>}
                        </div>
                        <button className="mt-3 w-full bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700">
                          Contact
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                      const farmerAddress = order.product?.farmer?.user?.address ||
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
                          <td className="py-4 text-gray-900">{totalPrice.toLocaleString()} RWF</td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${order.status?.toLowerCase() === 'pending'
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
            <span className="float-right"> 2024 UmuhinziLink, All rights reserved.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
