import {
  BuyerDashboardResponse,
  FarmerDashboardResponse,
  SupplierDashboardResponse,
  AdminDashboardResponse,
  GovernmentDashboardResponse,
  NotificationResponse,
  ChartConfig
} from '@/types/dashboard';

// Mock data generators
export const generateBuyerDashboardData = (): BuyerDashboardResponse => ({
  success: true,
  data: {
    totalOrders: 156,
    activeOrders: 8,
    pendingOrders: 12,
    completedOrders: 136,
    savedProducts: 23,
    totalSpent: 2450000.50,
    averageOrderValue: 15705.13,
    walletBalance: 125000.00,
    lastOrderDate: "2024-03-15T14:30:00",
    unreadMessages: 5,
    unreadNotifications: 3,
    spendingTrend: {
      type: "line",
      title: "Monthly Spending Trend",
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [{
        label: "Amount Spent (RWF)",
        data: [180000, 220000, 195000, 280000, 310000, 245000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true
      }]
    },
    categoryDistribution: {
      type: "donut",
      title: "Spending by Category",
      labels: ["Vegetables", "Fruits", "Grains", "Legumes", "Other"],
      datasets: [{
        label: "Orders",
        data: [45, 52, 38, 65, 48, 72],
        backgroundColor: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"]
      }]
    },
    orderStatusChart: {
      type: "horizontalBar",
      title: "Order Status Distribution",
      labels: ["Completed", "Active", "Pending", "Processing"],
      datasets: [{
        label: "Orders",
        data: [136, 8, 12, 16],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"]
      }]
    },
    monthlyActivity: {
      type: "bar",
      title: "Monthly Order Activity",
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [{
        label: "Number of Orders",
        data: [8, 12, 15, 18, 14, 20, 16, 22, 18, 24, 19, 21],
        backgroundColor: "rgba(59, 130, 246, 0.8)"
      }]
    }
  },
  message: "Buyer dashboard retrieved successfully"
});

export const generateFarmerDashboardData = (): FarmerDashboardResponse => ({
  success: true,
  data: {
    totalOrders: 234,
    orderIncreaseRate: 18.5,
    totalProducts: 45,
    productIncreaseRate: 12,
    activeOrders: 23,
    totalIncome: 4250000.75,
    incomeIncreaseRate: 22.3,
    newMessages: 8,
    totalSuppliers: 156,
    totalBuyers: 89,
    averageOrderValue: 18162.39,
    lowStockProducts: 3,
    customerRating: 4.6,
    lastOrderDate: "2024-03-15T16:45:00",
    revenueOrdersTrend: {
      type: "dualAxisLine",
      title: "Revenue vs Orders Trend",
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [
        {
          label: "Revenue (RWF)",
          data: [450000, 520000, 480000, 680000, 750000, 820000],
          yAxisID: "y",
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        },
        {
          label: "Orders",
          data: [28, 32, 30, 42, 48, 52],
          yAxisID: "y1",
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)"
        }
      ]
    },
    productPerformance: {
      type: "bar",
      title: "Top Performing Products",
      labels: ["Tomatoes", "Bananas", "Rice", "Beans", "Maize"],
      datasets: [
        {
          label: "Quantity Sold (kg)",
          data: [450, 320, 280, 190, 150],
          backgroundColor: "#10B981"
        },
        {
          label: "Revenue (RWF)",
          data: [450000, 320000, 280000, 190000, 150000],
          backgroundColor: "#3B82F6"
        }
      ]
    },
    orderDistribution: {
      type: "pie",
      title: "Order Status Distribution",
      labels: ["Completed", "Active", "Pending", "Processing", "Cancelled"],
      datasets: [{
        label: "Orders",
        data: [156, 23, 12, 8, 3],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"]
      }]
    },
    monthlyGrowth: {
      type: "area",
      title: "Monthly Growth Trend",
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [{
        label: "New Orders",
        data: [28, 32, 30, 42, 48, 52],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "#10B981",
        fill: true
      }]
    }
  },
  message: "Farmer dashboard retrieved successfully"
});

export const generateSupplierDashboardData = (): SupplierDashboardResponse => ({
  success: true,
  data: {
    totalOrders: 342,
    orderIncreaseRate: 15.8,
    totalProducts: 68,
    productIncreaseRate: 8,
    activeOrders: 45,
    totalIncome: 8750000.00,
    incomeIncreaseRate: 19.2,
    newMessages: 12,
    totalFarmers: 89,
    totalBuyers: 234,
    onTimeDeliveryRate: 94.5,
    averageOrderValue: 25584.80,
    qualityScore: 4.8,
    deliveryPerformance: {
      type: "gauge",
      title: "On-Time Delivery Rate",
      value: 94.5,
      max: 100,
      thresholds: [
        { value: 80, color: "#EF4444" },
        { value: 90, color: "#F59E0B" },
        { value: 100, color: "#10B981" }
      ]
    },
    farmerGrowth: {
      type: "area",
      title: "Active Farmer Growth",
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [{
        label: "Active Farmers",
        data: [45, 52, 58, 67, 78, 89],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3B82F6",
        fill: true
      }]
    },
    regionalDistribution: {
      type: "map",
      title: "Orders by Province",
      data: {
        regions: [
          { name: "Kigali", value: 145, coordinates: [-1.9441, 30.0619] },
          { name: "Northern", value: 89, coordinates: [-1.5, 29.9] },
          { name: "Southern", value: 67, coordinates: [-2.2, 29.6] },
          { name: "Eastern", value: 78, coordinates: [-1.6, 30.4] },
          { name: "Western", value: 92, coordinates: [-2.0, 29.1] }
        ]
      }
    },
    revenueByRegion: {
      type: "bar",
      title: "Revenue by Region",
      labels: ["Kigali", "Northern", "Southern", "Eastern", "Western"],
      datasets: [{
        label: "Revenue (RWF)",
        data: [2850000, 1450000, 1250000, 1650000, 1550000],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"]
      }]
    }
  },
  message: "Supplier dashboard retrieved successfully"
});

export const generateAdminDashboardData = (): AdminDashboardResponse => ({
  success: true,
  data: {
    totalUsers: 12456,
    activeSessions: 3247,
    platformRevenue: 45250000.00,
    monthlyGrowth: 24.3,
    systemHealth: 99.8,
    openSupportTickets: 47,
    newRegistrations: 234,
    transactionVolume: 156000000.00,
    userGrowth: {
      type: "line",
      title: "User Growth Trend",
      labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [{
        label: "Total Users",
        data: [8500, 9200, 9800, 10500, 11200, 12456],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true
      }]
    },
    revenueByUserType: {
      type: "bar",
      title: "Revenue by User Type",
      labels: ["Farmers", "Buyers", "Suppliers"],
      datasets: [{
        label: "Revenue (RWF)",
        data: [15000000, 22000000, 8250000],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"]
      }]
    },
    systemHealthMetrics: {
      type: "realtime",
      title: "System Health Metrics",
      metrics: [
        { name: "API Response Time", value: "125ms", status: "healthy", color: "#10B981" },
        { name: "Database Load", value: "45%", status: "healthy", color: "#10B981" },
        { name: "Error Rate", value: "0.2%", status: "healthy", color: "#10B981" },
        { name: "Active Connections", value: "1247", status: "healthy", color: "#10B981" }
      ]
    },
    userActivity: {
      type: "heatmap",
      title: "User Activity Heatmap",
      data: {
        year: 2024,
        months: ["Jan", "Feb", "Mar"],
        values: {
          "2024-01-01": 245, "2024-01-02": 189, "2024-01-03": 267,
          "2024-02-01": 334, "2024-02-02": 412, "2024-02-03": 389,
          "2024-03-01": 456, "2024-03-02": 423, "2024-03-03": 489
        }
      }
    },
    orderStatusDistribution: {
      type: "pie",
      title: "Platform Order Status",
      labels: ["Completed", "Active", "Pending", "Processing", "Cancelled"],
      datasets: [{
        label: "Orders",
        data: [1256, 234, 189, 145, 67],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"]
      }]
    }
  },
  message: "Admin dashboard retrieved successfully"
});

export const generateGovernmentDashboardData = (): GovernmentDashboardResponse => ({
  success: true,
  data: {
    registeredFarmers: 8456,
    totalProduction: 12450,
    marketValue: 125000000.00,
    exportVolume: 2340,
    foodSecurityIndex: 87.5,
    sustainabilityScore: 4.2,
    complianceRate: 92.3,
    subsidyDistributed: 15600000.00,
    productionTrends: {
      type: "multiline",
      title: "Agricultural Production by Category",
      labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Vegetables (tons)",
          data: [1200, 1350, 1420, 1580, 1720, 1890],
          borderColor: "#10B981"
        },
        {
          label: "Fruits (tons)",
          data: [800, 850, 920, 980, 1050, 1120],
          borderColor: "#F59E0B"
        },
        {
          label: "Grains (tons)",
          data: [2000, 2100, 2250, 2400, 2580, 2750],
          borderColor: "#3B82F6"
        },
        {
          label: "Legumes (tons)",
          data: [600, 650, 720, 780, 850, 920],
          borderColor: "#8B5CF6"
        }
      ]
    },
    regionalProduction: {
      type: "choropleth",
      title: "Production by District",
      data: {
        districts: [
          { name: "Kigali", production: 1250, farmers: 456, value: 1250 },
          { name: "Gasabo", production: 890, farmers: 234, value: 890 },
          { name: "Nyagatare", production: 2100, farmers: 678, value: 2100 },
          { name: "Rubavu", production: 1560, farmers: 445, value: 1560 },
          { name: "Huye", production: 1340, farmers: 389, value: 1340 }
        ]
      }
    },
    foodSecurity: {
      type: "radar",
      title: "Food Security Indicators",
      labels: ["Production", "Storage", "Distribution", "Accessibility", "Affordability", "Quality"],
      datasets: [
        {
          label: "Current Year",
          data: [85, 78, 82, 88, 75, 90],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)"
        },
        {
          label: "Previous Year",
          data: [78, 72, 75, 82, 68, 85],
          borderColor: "#94A3B8",
          backgroundColor: "rgba(148, 163, 184, 0.2)"
        }
      ]
    },
    economicImpact: {
      type: "bar",
      title: "Economic Contribution by Sector",
      labels: ["Vegetables", "Fruits", "Grains", "Legumes", "Other"],
      datasets: [
        {
          label: "Market Value (RWF millions)",
          data: [35.2, 28.5, 42.1, 15.8, 3.4],
          backgroundColor: "#10B981"
        },
        {
          label: "Export Value (RWF millions)",
          data: [8.2, 6.5, 12.1, 3.8, 0.8],
          backgroundColor: "#3B82F6"
        }
      ]
    },
    complianceMetrics: {
      type: "pie",
      title: "Compliance Status",
      labels: ["Fully Compliant", "Partially Compliant", "Non-Compliant", "Under Review"],
      datasets: [{
        label: "Compliance",
        data: [65, 25, 8, 2],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
      }]
    }
  },
  message: "Government dashboard retrieved successfully"
});

export const generateNotifications = (): NotificationResponse => ({
  notifications: [
    {
      id: 1,
      type: "success",
      title: "New Order Received",
      message: "You have received a new order for Tomatoes (50kg)",
      timestamp: "2024-03-15T16:45:00",
      isRead: false,
      actionUrl: "/orders/123"
    },
    {
      id: 2,
      type: "warning",
      title: "Low Stock Alert",
      message: "Your inventory for Bananas is running low (15kg remaining)",
      timestamp: "2024-03-15T15:30:00",
      isRead: false,
      actionUrl: "/products/456"
    },
    {
      id: 3,
      type: "info",
      title: "Payment Received",
      message: "Payment of RWF 45,000 has been received for order #789",
      timestamp: "2024-03-15T14:15:00",
      isRead: true,
      actionUrl: "/payments/789"
    }
  ]
});

// Dashboard service functions
export const dashboardService = {
  getBuyerDashboard: async (): Promise<BuyerDashboardResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateBuyerDashboardData();
  },

  getFarmerDashboard: async (): Promise<FarmerDashboardResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateFarmerDashboardData();
  },

  getSupplierDashboard: async (): Promise<SupplierDashboardResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateSupplierDashboardData();
  },

  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateAdminDashboardData();
  },

  getGovernmentDashboard: async (): Promise<GovernmentDashboardResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateGovernmentDashboardData();
  },

  getNotifications: async (): Promise<NotificationResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateNotifications();
  }
};
