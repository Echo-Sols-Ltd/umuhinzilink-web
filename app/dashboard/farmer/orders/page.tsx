'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';

import {
  LayoutGrid,
  FilePlus,
  MessageSquare,
  BarChart2,
  ShoppingCart,
  User,
  Settings,
  Mail,
  Bell,
  Package,
  Leaf,
  Download,
  Loader2,
  LogOut,
} from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/farmer', icon: LayoutGrid },
  { label: 'Products', href: '/dashboard/farmer/products', icon: Package },
  { label: 'Input Request', href: '/dashboard/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/dashboard/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/dashboard/farmer/market_analysis', icon: BarChart2 },
  { label: 'Messages', href: '/dashboard/farmer/message', icon: Mail },
  { label: 'Notifications', href: '/dashboard/farmer/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/farmer/profile', icon: User },
  { label: 'Orders', href: '/dashboard/farmer/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/dashboard/farmer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

const ORDER_STATUS_META: Record<string, { label: string; badge: string }> = {
  pending: { label: 'Pending', badge: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Processing', badge: 'bg-purple-100 text-purple-700' },
  shipped: { label: 'Shipped', badge: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', badge: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', badge: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', badge: 'bg-red-100 text-red-700' },
};

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

export default function FarmerOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { farmerOrders, loading } = useOrder();
  const [logoutPending, setLogoutPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Use context data instead of manual state
  const currentUser = user;
  const orders = useMemo(() => farmerOrders || [], [farmerOrders]);
  const error = null;

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => (order.status || '').toLowerCase() === statusFilter);
  }, [orders, statusFilter]);

  const metrics = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
    const paid = orders.filter(order => order.isPaid).length;
    const pending = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
    return { total, totalRevenue, paid, pending };
  }, [orders]);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);

    try {
      await logout();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLogoutPending(false);
    }
  };

  const displayName = currentUser?.names || 'Farmer';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-[#00A63E] flex flex-col fixed left-0 top-0 h-screen overflow-y-auto">
        <div className="flex items-center px-6 py-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-bold text-xl text-white">UmuhinziLink</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
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

      <main className="flex-1 ml-64 bg-gray-50">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
            <p className="text-xs text-gray-500">Order overview for {displayName.split(' ')[0]}</p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              title="Total orders"
              value={formatNumber(metrics.total)}
              caption="All time"
            />
            <SummaryCard
              title="Revenue"
              value={`RWF ${formatNumber(metrics.totalRevenue)}`}
              caption="Gross value"
            />
            <SummaryCard
              title="Paid"
              value={formatNumber(metrics.paid)}
              caption="Orders fully paid"
              accent="text-green-600"
            />
            <SummaryCard
              title="Pending"
              value={formatNumber(metrics.pending)}
              caption="Awaiting fulfilment"
              accent="text-yellow-600"
            />
          </section>

          <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span>Clear filter</span>
                </button>
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Buyer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-6 px-4 text-center text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading orders...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={9} className="py-6 px-4 text-center text-red-600">
                        {error}
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 px-4 text-center text-gray-500">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const statusKey = (order.status || 'pending').toLowerCase();
                      const statusMeta = ORDER_STATUS_META[statusKey] || ORDER_STATUS_META.pending;
                      const buyerAddress = order.buyer?.address
                        ? `${order.buyer.address.district || ''}${order.buyer.address.province ? `, ${order.buyer.address.province}` : ''}`.trim()
                        : '—';
                      const quantity =
                        Number(order.quantity) || Number(order.product?.quantity) || 0;
                      const amount =
                        Number(order.totalPrice) ||
                        (Number(order.product?.unitPrice) || 0) * quantity;

                      return (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {order.buyer?.names || order.buyer?.email || 'Unknown buyer'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{buyerAddress || '—'}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {order.product?.name || '—'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {quantity
                              ? `${formatNumber(quantity)} ${order.product?.measurementUnit || ''}`
                              : '—'}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            RWF {formatNumber(amount)}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${statusMeta.badge}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              View details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  caption: string;
  accent?: string;
};

function SummaryCard({ title, value, caption, accent }: SummaryCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 flex flex-col gap-1">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className={`text-xs ${accent ?? 'text-gray-400'}`}>{caption}</p>
    </div>
  );
}
