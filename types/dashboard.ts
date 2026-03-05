// Base chart types
export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  fill?: boolean;
  yAxisID?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'horizontalBar' | 'dualAxisLine' | 'area' | 'gauge' | 'map' | 'realtime' | 'heatmap' | 'radar' | 'multiline' | 'choropleth';
  title: string;
  labels?: string[] | string;
  datasets?: ChartDataset[];
  value?: number;
  max?: number;
  thresholds?: Array<{ value: number; color: string }>;
  metrics?: Array<{ name: string; value: string; status: string; color: string }>;
  data?: {
    regions?: Array<{ name: string; value: number; coordinates: [number, number] }>;
    districts?: Array<{ name: string; production: number; farmers: number; value: number }>;
    year?: number;
    months?: string[];
    values?: Record<string, number>;
  };
}

// Notification types
export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}

export interface BuyerRecentOrder {
  id: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | string;
  amount: number;
  date: string;
}

// Buyer Dashboard Types
export interface BuyerDashboardData {
  totalOrders: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  walletBalance: number;
  savedProducts: number;
  unreadMessages: number;
  unreadNotifications: number;
  lastOrderDate: string;
  recentOrders?: BuyerRecentOrder[];
  [key: string]: any;
}

export interface BuyerDashboardResponse {
  success: boolean;
  data: BuyerDashboardData;
  message: string;
}

// Farmer Dashboard Types
export interface FarmerRecentOrder {
  id: string;
  buyer: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'Processing';
  amount: number;
  date: string;
}

export interface FarmerDashboardData {
  totalEarnings: number;
  pendingOrders: number;
  totalOrders: number;
  lowStockProducts: number;
  recentOrders: FarmerRecentOrder[];
}

export interface FarmerDashboardResponse {
  success: boolean;
  data: FarmerDashboardData;
  message: string;
}

// Supplier Dashboard Types
export interface SupplierRecentOrder {
  id: string;
  farmer: string;
  product: string;
  quantity: string;
  status: 'Pending' | 'Delivered' | 'In Transit' | 'Cancelled' | string;
  deliveryDate: string;
}

export interface SupplierLowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
}

export interface SupplierDashboardData {
  totalRevenue: number;
  activeOrders: number;
  lowStockProducts: number;
  onTimeDeliveryRate: number;
  recentOrders?: SupplierRecentOrder[];
  lowStockItems?: SupplierLowStockProduct[];
  revenueTrend?: ChartConfig;
  [key: string]: any;
}

export interface SupplierDashboardResponse {
  success: boolean;
  data: SupplierDashboardData;
  message: string;
}

// Admin Dashboard Types
export interface AdminDashboardData {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalSuppliers: number;
  totalOrders: number;
  transactionVolume: number;
  platformRevenue: number;
  newRegistrationsLast30Days: number;
  activeUsersLast7Days: number;
  openSupportTickets: number;
  userGrowthTrend: ChartConfig;
  revenueTrend: ChartConfig;
  [key: string]: any;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
  message: string;
}

// Government Dashboard Types
export interface GovernmentDashboardData {
  registeredFarmers: number;
  totalProduction: number;
  marketValue: number;
  exportVolume: number;
  foodSecurityIndex: number;
  sustainabilityScore: number;
  complianceRate: number;
  subsidyDistributed: number;
  productionTrends: ChartConfig;
  regionalProduction: ChartConfig;
  foodSecurity: ChartConfig;
  economicImpact: ChartConfig;
  complianceMetrics: ChartConfig;
}

export interface GovernmentDashboardResponse {
  success: boolean;
  data: GovernmentDashboardData;
  message: string;
}

// Union type for all dashboard responses
export type DashboardResponse =
  | BuyerDashboardResponse
  | FarmerDashboardResponse
  | SupplierDashboardResponse
  | AdminDashboardResponse
  | GovernmentDashboardResponse;

// Union type for all dashboard data
export type DashboardData =
  | BuyerDashboardData
  | FarmerDashboardData
  | SupplierDashboardData
  | AdminDashboardData
  | GovernmentDashboardData;

// Dashboard component props
export interface DashboardProps {
  userType: 'BUYER' | 'FARMER' | 'SUPPLIER' | 'ADMIN' | 'GOVERNMENT';
}

// Metric card component props
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  trend?: boolean;
  format?: 'number' | 'currency' | 'percentage';
}

// Chart component props
export interface ChartComponentProps {
  config: ChartConfig;
  className?: string;
  height?: number;
}
