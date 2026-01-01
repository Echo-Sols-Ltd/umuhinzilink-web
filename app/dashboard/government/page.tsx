'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutGrid,
  BarChart2,
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  Search,
  ChevronDown,
  TrendingUp,
  Package,
  ShoppingCart,
  Tractor,
  DollarSign,
  Loader2,
  Edit,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserType } from '@/types/enums';
import { toast } from '@/components/ui/use-toast';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/government', icon: LayoutGrid },
  { label: 'Farmers Produce', href: '/dashboard/government/farmers-produce', icon: Tractor },
  { label: 'Suppliers Produce', href: '/dashboard/government/suppliers-produce', icon: Package },
  { label: 'Market analytics', href: '/dashboard/government/market-analytics', icon: BarChart2 },
  { label: 'Notifications', href: '/dashboard/government/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/government/profile', icon: UserIcon },
  { label: 'Settings', href: '/dashboard/government/settings', icon: Settings },
];

// Chart data for Market Trends Prices
const marketTrendsData = [
  { name: '5k', value: 20 },
  { name: '10k', value: 40 },
  { name: '15k', value: 60 },
  { name: '20k', value: 80 },
  { name: '25k', value: 100 },
  { name: '30k', value: 85 },
  { name: '35k', value: 90 },
  { name: '40k', value: 95 },
  { name: '45k', value: 100 },
  { name: '50k', value: 100 },
];

// Orders overview data
const ordersOverview = [
  {
    id: 'RDO00001',
    product: 'Amaru (Beans 50kg)',
    location: 'Gisenyi, Rwanda',
    time: '20 DEC 9:28 PM',
  },
  {
    id: 'RDO00002',
    product: 'Ibirayi (Potatoes 100kg)',
    location: 'Kigali, Rwanda',
    time: '20 DEC 8:15 PM',
  },
  {
    id: 'RDO00003',
    product: 'Inyama (Tomatoes 25kg)',
    location: 'Musanze, Rwanda',
    time: '20 DEC 7:45 PM',
  },
  {
    id: 'RDO00004',
    product: 'Cabbage 30kg',
    location: 'Rubavu, Rwanda',
    time: '20 DEC 6:30 PM',
  },
];

// Recent items data
const recentItems = [
  {
    id: '1',
    status: 'completed',
    itemName: 'Turnip',
    dateSubmitted: '2024-12-15',
    dateRemoved: '2024-12-20',
    itemId: 'ITM001',
    amount: '50kg',
    itemType: 'Farmers produce',
    price: '2,000 Frw/kg',
  },
  {
    id: '2',
    status: 'pending',
    itemName: 'Npk Fertilizer',
    dateSubmitted: '2024-12-18',
    dateRemoved: null,
    itemId: 'ITM002',
    amount: '100kg',
    itemType: 'Farmers produce',
    price: '0',
  },
  {
    id: '3',
    status: 'pending',
    itemName: 'Potatoes',
    dateSubmitted: '2024-12-19',
    dateRemoved: null,
    itemId: 'ITM003',
    amount: '75kg',
    itemType: 'Suppliers produce',
    price: '0',
  },
  {
    id: '4',
    status: 'pending',
    itemName: 'Coconut',
    dateSubmitted: '2024-12-19',
    dateRemoved: null,
    itemId: 'ITM004',
    amount: '30kg',
    itemType: 'Farmers produce',
    price: '0',
  },
  {
    id: '5',
    status: 'pending',
    itemName: 'Npk Fertilizer',
    dateSubmitted: '2024-12-20',
    dateRemoved: null,
    itemId: 'ITM005',
    amount: '50kg',
    itemType: 'Suppliers produce',
    price: '0',
  },
  {
    id: '6',
    status: 'pending',
    itemName: 'Cabbage',
    dateSubmitted: '2024-12-20',
    dateRemoved: null,
    itemId: 'ITM006',
    amount: '40kg',
    itemType: 'Suppliers produce',
    price: '0',
  },
];

function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'farmers' | 'suppliers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    if (logoutPending) return;
    setLogoutPending(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);

    } finally {
      setLogoutPending(false);
    }
  };

  const shortName = useMemo(() => {
    if (!user?.names) return 'Admin';
    const parts = user.names.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  }, [user?.names]);

  const initials = useMemo(() => getInitials(user?.names || 'Admin'), [user?.names]);

  const todayLabel = useMemo(() => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }, []);

  const filteredItems = useMemo(() => {
    let items = recentItems;

    // Filter by type
    if (filterType === 'farmers') {
      items = items.filter(item => item.itemType === 'Farmers produce');
    } else if (filterType === 'suppliers') {
      items = items.filter(item => item.itemType === 'Suppliers produce');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.itemName.toLowerCase().includes(query) ||
          item.itemId.toLowerCase().includes(query)
      );
    }

    return items;
  }, [filterType, searchQuery]);

  // Show loading state
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
        {/* Sidebar */}
        <aside
          className="w-64 bg-[#00A63E] border-r flex flex-col fixed left-0 top-0 h-screen overflow-y-auto"
          aria-label="Sidebar"
        >
          <div className="flex items-center px-6 py-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-bold text-xl text-white">FarmLink</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {MENU_ITEMS.map((item, index) => {
              const isActive = item.label === 'Dashboard';
              const Icon = item.icon;
              const showDivider = index === 4;

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

        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64 relative bg-white">
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
                <span role="img" aria-label="UK flag">
                  🇬🇧
                </span>
                <span>English</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{initials || 'A'}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{shortName}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </header>

          <div className="p-6 mt-16 space-y-6">
            {/* Top Row - Three Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Farmers Produce Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tractor className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Farmers Produce</p>
                  <p className="text-2xl font-bold text-gray-900">150.000</p>
                </div>
              </div>

              {/* Suppliers Produce Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Suppliers Produce</p>
                  <p className="text-2xl font-bold text-gray-900">95.000</p>
                  <p className="text-xs font-medium text-green-500">+60%</p>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">15.000</p>
                  <p className="text-xs font-medium text-green-500">+95%</p>
                </div>
              </div>
            </div>

            {/* Middle Section - Market Trends and Right Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Market Trends Prices Chart */}
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Market Trends Prices in 2024</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="text-xs">
                      More info
                    </Button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">220,342,123 Mcy</p>
                </div>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={marketTrendsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis
                        tickFormatter={value => `${value}%`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={value => [`${value}%`, 'Income']}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        name="Income"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="space-y-4">
                {/* Perpetual Circular Progress */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Perpetual</h3>
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
                        strokeDasharray={`${2.51 * 75} ${2.51 * 25}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">75%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">5,824,213</p>
                    <p className="text-sm text-gray-500">All Now</p>
                  </div>
                </div>

                {/* Involves Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Involves</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-700">Farmers produce</p>
                      <p className="text-lg font-bold text-gray-900">123456+</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Suppliers produce</p>
                      <p className="text-lg font-bold text-gray-900">123-4567+</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Orders</p>
                      <p className="text-lg font-bold text-gray-900">945+</p>
                    </div>
                  </div>
                </div>

                {/* Active Percentage */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Percentage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-700">Farmers produce</span>
                        <span className="text-sm font-medium text-gray-900">179 users</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-700">Suppliers produce</span>
                        <span className="text-sm font-medium text-gray-900">394 users</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">594</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders overview (this month)</h3>
              <div className="space-y-3">
                {ordersOverview.map(order => (
                  <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {order.id} - {order.product}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.location}. {order.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
                <Button className="bg-green-600 hover:bg-green-700 text-white">New</Button>
              </div>

              {/* Filters and Search */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className={filterType === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === 'farmers' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('farmers')}
                    className={filterType === 'farmers' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Farmers produce
                  </Button>
                  <Button
                    variant={filterType === 'suppliers' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('suppliers')}
                    className={filterType === 'suppliers' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Suppliers produce
                  </Button>
                </div>
                <div className="flex-1 max-w-xs">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Item Name
                      </th>
                      <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                        Date Submited
                      </th>
                      <th scope="col" className="px-4 py-3 hidden md:table-cell">
                        Date Removed
                      </th>
                      <th scope="col" className="px-4 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Item Type
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Edit
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Delete
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-6 text-center text-gray-500">
                          No items found
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map(item => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="px-4 py-4 whitespace-nowrap">
                            {item.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.itemName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                            {item.dateSubmitted}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {item.dateRemoved || '—'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.itemId}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            {item.amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {item.itemType}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.price}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GovernmentDashboard() {
  return (

    <Dashboard />

  );
}
