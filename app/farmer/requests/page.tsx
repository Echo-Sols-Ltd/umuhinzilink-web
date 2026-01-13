'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
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
  ChevronDown,
  X,
  Loader2,
  LogOut,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import FarmerSidebar from '@/components/farmer/Navbar';
import { FarmerPages } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

type FarmerRequest = {
  id: string;
  item?: string;
  quantity?: number;
  paymentType?: string;
  status?: string;
  requestDate?: string;
  createdAt?: string;
  updatedAt?: string;
  farmerId?: string;
};

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  pending: { label: 'Pending', badge: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', badge: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', badge: 'bg-red-100 text-red-700' },
  completed: { label: 'Completed', badge: 'bg-green-100 text-green-700' },
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

function FarmerRequestsComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { farmerProducts, loading: productsLoading, error: productsError } = useProduct();
  const [logoutPending, setLogoutPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentUser = user;
  const requests = useMemo(() => [] as FarmerRequest[], []);
  const products = useMemo(() => farmerProducts || [], [farmerProducts]);
  const requestsLoading = false;

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter(request => (request.status || '').toLowerCase() === statusFilter);
  }, [requests, statusFilter]);

  const requestsSummary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(req => (req.status || '').toLowerCase() === 'pending').length;
    const approved = requests.filter(req => (req.status || '').toLowerCase() === 'approved').length;
    const rejected = requests.filter(req => (req.status || '').toLowerCase() === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [requests]);

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);

    try {
      await logout();
      router.replace('/auth/signin');
      toast({
        title: 'Signed out',
        description: 'You have been logged out successfully.',
      });
    } catch (err) {
      console.error('Error during logout:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to log out. Clearing local session.';
      toast({
        title: 'Logout Issue',
        description: message,
        variant: 'error',
      });
    } finally {
      setLogoutPending(false);
    }
  };

  const displayName = currentUser?.names || 'Farmer';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FarmerSidebar
        activePage={FarmerPages.INPUT_REQUEST}
        logoutPending={logoutPending}
        handleLogout={handleLogout} />

      <main className="flex-1 ml-64 bg-gray-50">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Input Requests</h1>
            <p className="text-xs text-gray-500">
              Manage your farm inputs, {displayName.split(' ')[0]}
            </p>
          </div>
          <Link
            href="/farmer/add_produce"
            className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
          >
            + Add New Product
          </Link>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total requests"
              value={formatNumber(requestsSummary.total)}
              caption="All time"
            />
            <SummaryCard
              title="Pending"
              value={formatNumber(requestsSummary.pending)}
              caption="Awaiting approval"
              accent="text-yellow-600"
            />
            <SummaryCard
              title="Approved"
              value={formatNumber(requestsSummary.approved)}
              caption="Ready to fulfil"
              accent="text-green-600"
            />
            <SummaryCard
              title="Rejected"
              value={formatNumber(requestsSummary.rejected)}
              caption="Needs revision"
              accent="text-red-600"
            />
          </section>

          <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Filter by status</span>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={event => setStatusFilter(event.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </label>
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear filter
                  </button>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Inputs</h2>
            {productsLoading ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-10 flex items-center justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading inputs...
              </div>
            ) : productsError ? (
              <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6 text-red-600">
                {productsError}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center text-gray-500">
                No products available in your catalogue yet. Add one to request supplies.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.slice(0, 8).map(product => (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900">
                        {product.name || 'Unnamed input'}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {product.unitPrice != null
                            ? `RWF ${formatNumber(product.unitPrice)}`
                            : 'Price N/A'}
                        </span>
                        <span>
                          {product.quantity != null
                            ? `${formatNumber(product.quantity)} ${product.measurementUnit || ''}`
                            : 'Qty N/A'}
                        </span>
                      </div>
                      <button className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition">
                        Add to request
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                <p className="text-sm text-gray-500">Track your latest submissions</p>
              </div>
              <Link
                href="/farmer/requests"
                className="text-sm text-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requestsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                        Loading requests...
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                        No requests match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(request => {
                      const statusKey = (request.status || 'pending').toLowerCase();
                      const statusMeta = STATUS_LABELS[statusKey] || STATUS_LABELS.pending;

                      return (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{request.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{request.item || '—'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {request.quantity != null ? formatNumber(request.quantity) : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {request.paymentType || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(request.requestDate || request.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusMeta.badge}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
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

export default function FarmerRequestsPage() {
  return (
    <FarmerGuard>
      <FarmerRequestsComponent />
    </FarmerGuard>
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
