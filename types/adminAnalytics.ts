import { ChartConfig } from './dashboard';

export interface MetricWithGrowth {
  current: number;
  previous: number;
  growth: number;
}

export interface AdminAnalyticsTopProduct {
  name: string;
  revenue: number;
  orders: number;
}

export interface AdminAnalyticsTopFarmer {
  name: string;
  revenue: number;
  orders: number;
  products: number;
}

export interface AdminAnalyticsMonthlyRow {
  month: string;
  revenue: number;
  orders: number;
  users: number;
}

export interface AdminAnalyticsViewModel {
  revenue: MetricWithGrowth;
  orders: MetricWithGrowth;
  users: MetricWithGrowth;
  products: MetricWithGrowth;
  topProducts: AdminAnalyticsTopProduct[];
  topFarmers: AdminAnalyticsTopFarmer[];
  monthlyData: AdminAnalyticsMonthlyRow[];
  revenueTrend?: ChartConfig;
  ordersTrend?: ChartConfig;
}
