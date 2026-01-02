'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProduct } from '@/contexts/ProductContext';
import Link from 'next/link';
import {
  LayoutGrid,
  MessageSquare,
  Settings,
  FilePlus,
  BarChart2,
  ShoppingCart,
  User,
  Mail,
  Bell,
  Package,
  ChevronDown,
  Leaf,
  Loader2,
  LogOut,
  Plus,
} from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: LayoutGrid },
  { label: 'Products', href: '/farmer/products', icon: Package },
  { label: 'Input Request', href: '/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/farmer/market_analysis', icon: BarChart2 },
  { label: 'Messages', href: '/farmer/message', icon: Mail },
  { label: 'Notifications', href: '/farmer/notifications', icon: Bell },
  { label: 'Profile', href: '/farmer/profile', icon: User },
  { label: 'Orders', href: '/farmer/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/farmer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0, ...options });
}

export default function FarmerProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { farmerProducts, loading } = useProduct();
  const [logoutPending, setLogoutPending] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = user;
  const products = useMemo(() => farmerProducts || [], [farmerProducts]);
  const error = null;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        product => (product.productStatus || '').toLowerCase() === statusFilter
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        [product.name, product.category, product.description]
          .filter(Boolean)
          .some(value => value!.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [products, statusFilter, searchTerm]);

  const totalProducts = products.length;
  const activeProducts = products.filter(
    product => (product.productStatus || '').toLowerCase() === 'in_stock'
  ).length;
  const outOfStockProducts = products.filter(
    product => (product.productStatus || '').toLowerCase() === 'out_of_stock'
  ).length;

  const totalInventory = useMemo(
    () =>
      products.reduce((total, product) => {
        const qty = Number(product.quantity) || 0;
        return total + qty;
      }, 0),
    [products]
  );

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);

    try {
      await logout();
      router.push('/auth/auth/signin');
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
            <h1 className="text-xl font-semibold text-gray-900">My Products</h1>
            <p className="text-xs text-gray-500">Welcome back, {displayName.split(' ')[0]}</p>
          </div>
          <Link
            href="/farmeradd_produce"
            className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </header>

        <div className="p-6 space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Products"
              value={formatNumber(totalProducts)}
              caption="Listings overall"
            />
            <SummaryCard
              title="Active"
              value={formatNumber(activeProducts)}
              caption="In stock"
              accent="text-green-600"
            />
            <SummaryCard
              title="Out of stock"
              value={formatNumber(outOfStockProducts)}
              caption="Marked unavailable"
              accent="text-red-600"
            />
            <SummaryCard
              title="Inventory"
              value={formatNumber(totalInventory)}
              caption="Total available units"
            />
          </section>

          <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={event => setStatusFilter(event.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="all">All</option>
                      <option value="in_stock">In stock</option>
                      <option value="out_of_stock">Out of stock</option>
                      <option value="pending">Pending</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Search</span>
                  <input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Product name, category..."
                    className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                {(statusFilter !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchTerm('');
                    }}
                    className="text-sm text-red-500"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </section>

          <section>
            {loading ? (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Loading products...
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6 text-red-600">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-500">
                No products match your filters yet. Try adjusting the filters or add a new listing.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <article
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="aspect-4/3 bg-gray-50 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image provided</div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <header>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {product.name || 'Unnamed product'}
                        </h3>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          {product.category || 'Uncategorized'}
                        </p>
                      </header>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span className="text-gray-900 font-medium">
                            {product.unitPrice != null
                              ? `RWF ${formatNumber(product.unitPrice)}`
                              : 'Price N/A'}
                          </span>
                        </div>
                        <div>
                          {product.quantity != null
                            ? `${formatNumber(product.quantity)} ${product.measurementUnit || ''}`
                            : 'Qty N/A'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{product.location || 'Location unknown'}</span>
                        <span>{product.isNegotiable ? 'Negotiable' : 'Fixed price'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${(product.productStatus || '').toLowerCase() === 'in_stock'
                            ? 'bg-green-100 text-green-700'
                            : (product.productStatus || '').toLowerCase() === 'out_of_stock'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {product.productStatus || 'Pending approval'}
                        </span>
                        <Link
                          href={`/farmer/products`}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Manage
                        </Link>
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
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
