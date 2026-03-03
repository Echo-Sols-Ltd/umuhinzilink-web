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

// Buyer Dashboard Types
export interface BuyerDashboardData {
  totalOrders: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  savedProducts: number;
  totalSpent: number;
  averageOrderValue: number;
  walletBalance: number;
  lastOrderDate: string;
  unreadMessages: number;
  unreadNotifications: number;
  spendingTrend: ChartConfig;
  categoryDistribution: ChartConfig;
  orderStatusChart: ChartConfig;
  monthlyActivity: ChartConfig;
}

export interface BuyerDashboardResponse {
  success: boolean;
  data: BuyerDashboardData;
  message: string;
}

// Farmer Dashboard Types
export interface FarmerDashboardData {
  totalOrders: number;
  orderIncreaseRate: number;
  totalProducts: number;
  productIncreaseRate: number;
  activeOrders: number;
  totalIncome: number;
  incomeIncreaseRate: number;
  newMessages: number;
  totalSuppliers: number;
  totalBuyers: number;
  averageOrderValue: number;
  lowStockProducts: number;
  customerRating: number;
  lastOrderDate: string;
  revenueOrdersTrend: ChartConfig;
  productPerformance: ChartConfig;
  orderDistribution: ChartConfig;
  monthlyGrowth: ChartConfig;
}

export interface FarmerDashboardResponse {
  success: boolean;
  data: FarmerDashboardData;
  message: string;
}

// Supplier Dashboard Types
export interface SupplierDashboardData {
  totalOrders: number;
  orderIncreaseRate: number;
  totalProducts: number;
  productIncreaseRate: number;
  activeOrders: number;
  totalIncome: number;
  incomeIncreaseRate: number;
  newMessages: number;
  totalFarmers: number;
  totalBuyers: number;
  onTimeDeliveryRate: number;
  averageOrderValue: number;
  qualityScore: number;
  deliveryPerformance: ChartConfig;
  farmerGrowth: ChartConfig;
  regionalDistribution: ChartConfig;
  revenueByRegion: ChartConfig;
}

export interface SupplierDashboardResponse {
  success: boolean;
  data: SupplierDashboardData;
  message: string;
}

// Admin Dashboard Types
export interface AdminDashboardData {
  totalUsers: number;
  activeSessions: number;
  platformRevenue: number;
  monthlyGrowth: number;
  systemHealth: number;
  openSupportTickets: number;
  newRegistrations: number;
  transactionVolume: number;
  userGrowth: ChartConfig;
  revenueByUserType: ChartConfig;
  systemHealthMetrics: ChartConfig;
  userActivity: ChartConfig;
  orderStatusDistribution: ChartConfig;
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
