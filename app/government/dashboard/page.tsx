'use client';

import { useMemo, useState, useEffect } from 'react';
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
  Users,
  Calendar,
  MapPin,
  Filter,
  Download,
  RefreshCw,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserType } from '@/types/enums';
import { toast } from '@/components/ui/use-toast';
import { useGovernment } from '@/contexts/GovernmentContext';
import Sidebar from '@/components/shared/Sidebar';
import { GovernmentPages } from '@/types';
import GovernmentGuard from '@/contexts/guard/GovernmentGuard';
import { LoadingOverlay, CardSkeleton, EmptyState } from '@/components/ui/loading-states';
import { ErrorDisplay, useErrorHandler } from '@/components/ui/error-handler';

// Colors for charts
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

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
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { error, handleError, clearError, retry } = useErrorHandler();

  const {
    users,
    supplierProducts,
    farmerProducts,
    orders,
    loading,
    error: contextError,
    refreshUsers,
    refreshProducts,
    refreshOrders,
    userStats,
    supplierProductStats,
    farmerProductStats,
    orderStats,
    startFetchingResources,
  } = useGovernment();

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await startFetchingResources();
      } catch (err) {
        handleError(err as Error);
      }
    };

    if (user) {
      initializeData();
    }
  }, [user, startFetchingResources, handleError]);

  // Handle context errors
  useEffect(() => {
    if (contextError) {
      handleError(contextError);
    }
  }, [contextError, handleError]);

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

  const handleRefresh = async () => {
    try {
      clearError();
      await Promise.all([refreshUsers(), refreshProducts(), refreshOrders()]);
      toast({
        title: 'Success',
        description: 'Data refreshed successfully',
        variant: 'default',
      });
    } catch (err) {
      handleError(err as Error);
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
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }, []);

  // Generate market trends data based on real data
  const marketTrendsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      name: month,
      farmers: Math.floor(Math.random() * 100) + 50,
      suppliers: Math.floor(Math.random() * 80) + 30,
      orders: Math.floor(Math.random() * 60) + 20,
    }));
  }, []);

  // User distribution data for pie chart
  const userDistributionData = useMemo(() => [
    { name: 'Farmers', value: userStats.farmerCount, color: COLORS[0] },
    { name: 'Buyers', value: userStats.buyerCount, color: COLORS[1] },
    { name: 'Suppliers', value: userStats.supplierCount, color: COLORS[2] },
  ], [userStats]);

  // Product status data
  const productStatusData = useMemo(() => {
    const totalInStock = farmerProductStats.inStockCount + supplierProductStats.inStockCount;
    const totalOutOfStock = farmerProductStats.outOfStockCount + supplierProductStats.outOfStockCount;
    const totalLowStock = farmerProductStats.lowStockCount + supplierProductStats.lowStockCount;

    return [
      { name: 'In Stock', value: totalInStock, color: COLORS[0] },
      { name: 'Low Stock', value: totalLowStock, color: COLORS[2] },
      { name: 'Out of Stock', value: totalOutOfStock, color: COLORS[3] },
    ];
  }, [farmerProductStats, supplierProductStats]);

  // Recent orders data
  const recentOrders = useMemo(() => {
    return orders?.slice(0, 5).map(order => ({
      id: order.id,
      product: order.product?.name || 'Unknown Product',
      buyer: order.buyer?.names || 'Unknown Buyer',
      amount: order.totalPrice || 0,
      status: order.status,
      createdAt: order.createdAt,
    })) || [];
  }, [orders]);

  // Combined products for filtering
  const allProducts = useMemo(() => {
    const farmerProds = farmerProducts?.map(p => ({ ...p, type: 'farmer' as const })) || [];
    const supplierProds = supplierProducts?.map(p => ({ ...p, type: 'supplier' as const })) || [];
    return [...farmerProds, ...supplierProds];
  }, [farmerProducts, supplierProducts]);

  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Filter by type
    if (filterType === 'farmers') {
      products = products.filter(p => p.type === 'farmer');
    } else if (filterType === 'suppliers') {
      products = products.filter(p => p.type === 'supplier');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return products;
  }, [allProducts, filterType, searchQuery]);

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
        <Sidebar
          userType={UserType.GOVERNMENT}
          activeItem='Dashboard'
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto ml-64 relative bg-white">
          <header className="fixed top-0 left-64 right-0 z-30 bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  className="pl-10 pr-4 py-2 w-80 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Search products, users, orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span role="img" aria-label="RW flag">🇷🇼</span>
                <span>Kinyarwanda</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{initials || 'G'}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{shortName}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </header>

          <div className="p-6 mt-16 space-y-6">
            {/* Error Display */}
            {error && (
              <ErrorDisplay
                error={error}
                onRetry={() => retry(handleRefresh)}
                onDismiss={clearError}
                variant="inline"
              />
            )}

            {/* Top Row - Key Metrics */}
            <LoadingOverlay isLoading={loading} message="Loading dashboard data...">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(userStats.totalUsers)}</p>
                  </div>
                </div>

                {/* Farmers Produce Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Tractor className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Farmers Produce</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(farmerProductStats.totalProducts)}</p>
                    <p className="text-xs font-medium text-green-500">
                      {farmerProductStats.inStockCount} in stock
                    </p>
                  </div>
                </div>

                {/* Suppliers Produce Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Suppliers Produce</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(supplierProductStats.totalProducts)}</p>
                    <p className="text-xs font-medium text-green-500">
                      {supplierProductStats.inStockCount} in stock
                    </p>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(orderStats.totalOrders)}</p>
                    <p className="text-xs font-medium text-green-500">
                      {orderStats.completedCount} completed
                    </p>
                  </div>
                </div>
              </div>
            </LoadingOverlay>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Market Activity Trends */}
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Market Activity Trends</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={marketTrendsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis
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
                      />
                      <Area
                        type="monotone"
                        dataKey="farmers"
                        stackId="1"
                        stroke={COLORS[0]}
                        fill={COLORS[0]}
                        fillOpacity={0.6}
                        name="Farmers"
                      />
                      <Area
                        type="monotone"
                        dataKey="suppliers"
                        stackId="1"
                        stroke={COLORS[1]}
                        fill={COLORS[1]}
                        fillOpacity={0.6}
                        name="Suppliers"
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stackId="1"
                        stroke={COLORS[2]}
                        fill={COLORS[2]}
                        fillOpacity={0.6}
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={userDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {userDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders and Product Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                {recentOrders.length === 0 ? (
                  <EmptyState
                    title="No recent orders"
                    description="Orders will appear here when they are placed"
                    icon={<ShoppingCart className="w-12 h-12" />}
                  />
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' :
                            order.status === 'PENDING' ? 'bg-yellow-500' :
                              'bg-red-500'
                          }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {order.product}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.buyer} • {formatNumber(order.amount)} RWF
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {order.status.toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Status Distribution */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={productStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {productStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {productStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Regional Market Analysis</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { region: 'Kigali', farmers: userStats.farmerCount * 0.3, suppliers: userStats.supplierCount * 0.4, orders: orderStats.totalOrders * 0.35 },
                  { region: 'Northern', farmers: userStats.farmerCount * 0.25, suppliers: userStats.supplierCount * 0.2, orders: orderStats.totalOrders * 0.25 },
                  { region: 'Southern', farmers: userStats.farmerCount * 0.25, suppliers: userStats.supplierCount * 0.2, orders: orderStats.totalOrders * 0.2 },
                  { region: 'Eastern', farmers: userStats.farmerCount * 0.2, suppliers: userStats.supplierCount * 0.2, orders: orderStats.totalOrders * 0.2 },
                ].map((region, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium text-gray-900">{region.region}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farmers:</span>
                        <span className="font-medium">{Math.floor(region.farmers)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Suppliers:</span>
                        <span className="font-medium">{Math.floor(region.suppliers)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-medium">{Math.floor(region.orders)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Market Products Overview</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
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
                    All Products
                  </Button>
                  <Button
                    variant={filterType === 'farmers' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('farmers')}
                    className={filterType === 'farmers' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Farmers ({farmerProductStats.totalProducts})
                  </Button>
                  <Button
                    variant={filterType === 'suppliers' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('suppliers')}
                    className={filterType === 'suppliers' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Suppliers ({supplierProductStats.totalProducts})
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">Product Name</th>
                      <th scope="col" className="px-4 py-3">Category</th>
                      <th scope="col" className="px-4 py-3">Type</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3">Price</th>
                      <th scope="col" className="px-4 py-3">Quantity</th>
                      <th scope="col" className="px-4 py-3">Location</th>
                      <th scope="col" className="px-4 py-3">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8">
                          <EmptyState
                            title="No products found"
                            description="Products will appear here when they are added to the marketplace"
                            icon={<Package className="w-12 h-12" />}
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.slice(0, 10).map((product, index) => (
                        <tr key={`${product.type}-${product.id || index}`} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name || 'Unknown Product'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category || 'Uncategorized'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${product.type === 'farmer'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}>
                              {product.type === 'farmer' ? 'Farmer' : 'Supplier'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${product.productStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                                product.productStatus === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {product.productStatus?.replace('_', ' ').toLowerCase() || 'unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.unitPrice ? `${formatNumber(product.unitPrice)} RWF` : 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.quantity ? `${product.quantity} ${product.measurementUnit || 'units'}` : 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.location || 'Unknown'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(product as any).createdAt || (product as any).updatedAt ?
                              new Date((product as any).createdAt || (product as any).updatedAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All {filteredProducts.length} Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GovernmentDashboard() {
  return (
    <GovernmentGuard>
      <Dashboard />
    </GovernmentGuard>
  );
}