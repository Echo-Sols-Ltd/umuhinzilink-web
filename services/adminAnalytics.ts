import {
  AdminAnalyticsMonthlyRow,
  AdminAnalyticsTopFarmer,
  AdminAnalyticsTopProduct,
  AdminAnalyticsViewModel,
  MetricWithGrowth,
} from '@/types/adminAnalytics';
import { AdminDashboardData, ChartConfig, Order, PaginatedResponse, Product } from '@/types';
import { adminService } from './admin';
import { dashboardService } from './dashboardService';
import { analyticsService } from './analytics';
import { apiClient } from './client';
import { API_ENDPOINTS } from './constants';
import { ApiResponse } from '@/types';

function num(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toList<T>(response?: PaginatedResponse<T[]> | null): T[] {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  return [];
}

function metricFromBlock(block: Record<string, unknown>): MetricWithGrowth {
  const current = num(block.current ?? block.value ?? block.total ?? block.count);
  const previous = num(block.previous ?? block.prior ?? block.lastPeriod ?? block.previousPeriod);
  let growth = num(block.growth ?? block.change ?? block.changePercent ?? block.percentChange);
  if (!growth && previous > 0) {
    growth = ((current - previous) / previous) * 100;
  }
  return {
    current,
    previous,
    growth: Math.round(growth * 10) / 10,
  };
}

function pickMetric(
  raw: Record<string, unknown>,
  blockKey: string,
  flatKeys: string[],
  fallback = 0,
): MetricWithGrowth {
  const block = raw[blockKey];
  if (block && typeof block === 'object') {
    return metricFromBlock(block as Record<string, unknown>);
  }

  for (const key of flatKeys) {
    if (raw[key] !== undefined && raw[key] !== null) {
      return { current: num(raw[key]), previous: 0, growth: 0 };
    }
  }

  return { current: fallback, previous: 0, growth: 0 };
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    : [];
}

function normalizeTopProducts(raw: Record<string, unknown>, orders: Order[]): AdminAnalyticsTopProduct[] {
  const fromApi = asRecordArray(raw.topProducts ?? raw.topProductsByRevenue ?? raw.bestProducts);
  if (fromApi.length > 0) {
    return fromApi.map((item) => ({
      name: String(item.name ?? item.productName ?? 'Product'),
      revenue: num(item.revenue ?? item.totalRevenue ?? item.amount),
      orders: num(item.orders ?? item.orderCount ?? item.sales),
    }));
  }

  return analyticsService
    .processProductPerformance([], orders)
    .map((item) => ({
      name: item.name,
      revenue: item.revenue,
      orders: item.sales,
    }))
    .slice(0, 10);
}

function normalizeTopFarmers(
  raw: Record<string, unknown>,
  orders: Order[],
  products: Product[],
): AdminAnalyticsTopFarmer[] {
  const fromApi = asRecordArray(raw.topFarmers ?? raw.topSellers ?? raw.topFarmersByRevenue);
  if (fromApi.length > 0) {
    return fromApi.map((item) => ({
      name: String(item.name ?? item.farmerName ?? item.sellerName ?? 'Seller'),
      revenue: num(item.revenue ?? item.totalRevenue ?? item.amount),
      orders: num(item.orders ?? item.orderCount),
      products: num(item.products ?? item.productCount ?? item.listings),
    }));
  }

  const productCountBySeller = new Map<string, number>();
  products.forEach((product) => {
    const sellerId = product.owner?.id;
    if (!sellerId) return;
    productCountBySeller.set(sellerId, (productCountBySeller.get(sellerId) ?? 0) + 1);
  });

  const stats = new Map<string, AdminAnalyticsTopFarmer>();
  orders.forEach((order) => {
    const owner = order.product?.owner;
    if (!owner?.id) return;
    const name = `${owner.firstName ?? ''} ${owner.lastName ?? ''}`.trim() || 'Seller';
    const current = stats.get(owner.id) ?? {
      name,
      revenue: 0,
      orders: 0,
      products: productCountBySeller.get(owner.id) ?? 0,
    };
    current.revenue += num(order.totalPrice);
    current.orders += 1;
    stats.set(owner.id, current);
  });

  return Array.from(stats.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}

function normalizeMonthlyData(
  raw: Record<string, unknown>,
  orders: Order[],
): AdminAnalyticsMonthlyRow[] {
  const fromApi = asRecordArray(raw.monthlyData ?? raw.monthlyPerformance ?? raw.monthlyStats);
  if (fromApi.length > 0) {
    return fromApi.map((item) => ({
      month: String(item.month ?? item.label ?? item.period ?? ''),
      revenue: num(item.revenue ?? item.totalRevenue),
      orders: num(item.orders ?? item.orderCount),
      users: num(item.users ?? item.newUsers ?? item.userCount),
    }));
  }

  const buckets = new Map<string, AdminAnalyticsMonthlyRow>();
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toLocaleDateString('en-RW', { month: 'short', year: '2-digit' });
    const current = buckets.get(key) ?? { month: key, revenue: 0, orders: 0, users: 0 };
    current.revenue += num(order.totalPrice);
    current.orders += 1;
    buckets.set(key, current);
  });

  return Array.from(buckets.values())
    .sort((a, b) => {
      const parse = (label: string) => new Date(`1 ${label.replace('/', ' 20')}`).getTime();
      return parse(a.month) - parse(b.month);
    })
    .slice(-6);
}

function growthFromOrders(orders: Order[], pickValue: (order: Order) => number): MetricWithGrowth {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const currentStart = now - 30 * day;
  const previousStart = now - 60 * day;

  let current = 0;
  let previous = 0;

  orders.forEach((order) => {
    if (!order.createdAt) return;
    const created = new Date(order.createdAt).getTime();
    if (Number.isNaN(created)) return;
    const value = pickValue(order);
    if (created >= currentStart) current += value;
    else if (created >= previousStart && created < currentStart) previous += value;
  });

  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  return {
    current,
    previous,
    growth: Math.round(growth * 10) / 10,
  };
}

function chartFromMonthly(
  monthly: AdminAnalyticsMonthlyRow[],
  title: string,
  field: 'revenue' | 'orders',
  color: string,
): ChartConfig {
  return {
    type: 'bar',
    title,
    labels: monthly.map((row) => row.month),
    datasets: [
      {
        label: title,
        data: monthly.map((row) => row[field]),
        backgroundColor: color,
        borderColor: color,
      },
    ],
  };
}

function mergeDashboardMetrics(
  analyticsRaw: Record<string, unknown>,
  dashboard?: AdminDashboardData | null,
  orders: Order[] = [],
  products: Product[] = [],
  usersTotal = 0,
): AdminAnalyticsViewModel {
  const dash = (dashboard ?? {}) as Record<string, unknown>;

  const revenue = pickMetric(analyticsRaw, 'revenue', ['totalRevenue', 'platformRevenue'], num(dash.platformRevenue ?? dash.transactionVolume));
  const ordersMetric = pickMetric(analyticsRaw, 'orders', ['totalOrders', 'orderCount'], num(dash.totalOrders));
  const users = pickMetric(analyticsRaw, 'users', ['totalUsers', 'activeUsers', 'activeUsersLast7Days'], num(dash.totalUsers));
  const productsMetric = pickMetric(analyticsRaw, 'products', ['totalProducts', 'productsListed', 'productCount'], products.length);

  const resolvedRevenue =
    revenue.current > 0 ? revenue : growthFromOrders(orders, (order) => num(order.totalPrice));
  const resolvedOrders =
    ordersMetric.current > 0 ? ordersMetric : growthFromOrders(orders, () => 1);

  const monthlyData = normalizeMonthlyData(analyticsRaw, orders);
  const topProducts = normalizeTopProducts(analyticsRaw, orders);
  const topFarmers = normalizeTopFarmers(analyticsRaw, orders, products);

  const revenueTrend =
    (analyticsRaw.revenueTrend as ChartConfig | undefined) ??
    (dash.revenueTrend as ChartConfig | undefined) ??
    (monthlyData.length > 0 ? chartFromMonthly(monthlyData, 'Revenue trend', 'revenue', '#188A04') : undefined);

  const ordersTrend =
    (analyticsRaw.ordersTrend as ChartConfig | undefined) ??
    (analyticsRaw.orderTrend as ChartConfig | undefined) ??
    (monthlyData.length > 0 ? chartFromMonthly(monthlyData, 'Orders trend', 'orders', '#2563eb') : undefined);

  if (users.current === 0 && usersTotal > 0) {
    users.current = usersTotal;
  }

  if (productsMetric.current === 0 && products.length > 0) {
    productsMetric.current = products.length;
  }

  return {
    revenue: resolvedRevenue,
    orders: resolvedOrders,
    users,
    products: productsMetric,
    topProducts,
    topFarmers,
    monthlyData,
    revenueTrend,
    ordersTrend,
  };
}

export async function fetchAdminAnalytics(): Promise<AdminAnalyticsViewModel> {
  const [analyticsResult, dashboardResult, ordersResult, productsResult, usersResult] =
    await Promise.allSettled([
      apiClient.get<ApiResponse<Record<string, unknown>>>(API_ENDPOINTS.ADMIN.ANALYTICS),
      dashboardService.getAdminDashboard(),
      adminService.getAllOrders(0, 200),
      adminService.getAllProducts(0, 200),
      adminService.getAllUsers(0, 1),
    ]);

  const analyticsRaw =
    analyticsResult.status === 'fulfilled' && analyticsResult.value.success
      ? (analyticsResult.value.data ?? {})
      : {};

  const dashboard =
    dashboardResult.status === 'fulfilled' && dashboardResult.value.success
      ? dashboardResult.value.data
      : null;

  const orders = ordersResult.status === 'fulfilled' ? toList(ordersResult.value) : [];
  const products = productsResult.status === 'fulfilled' ? toList(productsResult.value) : [];
  const usersTotal =
    usersResult.status === 'fulfilled'
      ? num(usersResult.value.totalElements)
      : 0;

  return mergeDashboardMetrics(analyticsRaw, dashboard, orders, products, usersTotal);
}

export function formatRwf(amount: number): string {
  return `${new Intl.NumberFormat('rw-RW').format(amount)} RWF`;
}
