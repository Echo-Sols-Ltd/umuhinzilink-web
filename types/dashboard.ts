import { OrderStatus } from './enums';

export interface DashboardStats {
    farm?: {
        size: number;
        activeCrops: number;
        lastLogin: string;
        totalCropsPlanted: number;
        productReady: number;
        totalEarnings: number;
        upcomingHarvests: number;
        pendingOrders: number;
        completedOrders: number;
        monthlyEarnings: {
            month: string;
            amount: number;
        }[];
    };
    buyer?: {
        pendingOffers: number;
        savedItems: number;
        recentPurchases: number;
        activeOrders: number;
        totalPurchase: number;
        totalSpent: number;
        favoriteSellers: number;
        monthlySpending: {
            month: string;
            amount: number;
        }[];
    };
    supplier?: {
        activeProducts: number;
        totalProducts: number;
        pendingOrders: number;
        completedOrders: number;
        totalEarnings: number;
        monthlyEarnings: {
            month: string;
            amount: number;
        }[];
    };
}

export interface RequestProps {
    id: string;
    title: string;
    type: 'order' | 'inquiry' | 'quote' | 'custom';
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    farmer?: {
        id: string;
        name: string;
        avatar?: string;
    };
    buyer?: {
        id: string;
        name: string;
        avatar?: string;
    };
    product?: {
        id: string;
        name: string;
        image?: string;
        price: number;
        quantity: number;
    };
    message?: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
}

export interface ProductionCardProps {
    id: string;
    crop: string;
    price: string;
    quantity: number;
    unit: string;
    image?: string;
    status: OrderStatus;
    stat?: {
        rising: boolean;
        amount: string;
    };
    delivered?: boolean;
    orderDate: Date;
    expectedDelivery?: Date;
    buyer?: {
        name: string;
        location: string;
        avatar?: string;
    };
}

export interface DashboardActivity {
    id: string;
    type: 'order' | 'message' | 'system' | 'alert' | 'update';
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    priority: 'low' | 'medium' | 'high';
    relatedTo?: {
        type: 'order' | 'product' | 'user' | 'payment';
        id: string;
        name?: string;
    };
}

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    color?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
    meta?: any;
}

export interface ChartConfig {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    data: ChartDataPoint[];
    xAxisLabel?: string;
    yAxisLabel?: string;
    color?: string;
    fillColor?: string;
    height?: number;
    width?: number;
    showLegend?: boolean;
    showGrid?: boolean;
    showDots?: boolean;
    curveType?: 'linear' | 'step' | 'bezier' | 'stepBefore' | 'stepAfter';
}