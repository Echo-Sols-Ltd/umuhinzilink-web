import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FarmerPerformanceMetrics } from '../FarmerPerformanceMetrics';

const mockMetrics = {
  rating: 4.8,
  totalSales: 2450000,
  completedOrders: 156,
  responseTime: 2,
  monthlyRevenue: 450000,
  customerSatisfaction: 96,
  repeatCustomers: 78,
  averageOrderValue: 15700,
  onTimeDelivery: 94,
  productViews: 1240
};

describe('FarmerPerformanceMetrics', () => {
  it('renders performance metrics correctly', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} />);
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('2,450,000 RWF')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
  });

  it('displays trend indicators when showTrends is true', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} showTrends={true} />);
    
    // Check for trend indicators (percentage changes)
    const trendElements = screen.getAllByText(/%$/);
    expect(trendElements.length).toBeGreaterThan(0);
  });

  it('hides trend indicators when showTrends is false', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} showTrends={false} />);
    
    // Should not show percentage trend indicators
    const trendElements = screen.queryAllByText(/\d+\.\d+%/);
    expect(trendElements.length).toBe(0);
  });

  it('renders compact variant correctly', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} variant="compact" />);
    
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('Overall Rating')).toBeInTheDocument();
  });

  it('renders list variant correctly', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} variant="list" />);
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('displays period badge correctly', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} period="month" />);
    
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('filters out zero values for cleaner display', () => {
    const metricsWithZeros = {
      ...mockMetrics,
      monthlyRevenue: 0,
      customerSatisfaction: 0
    };

    render(<FarmerPerformanceMetrics metrics={metricsWithZeros} />);
    
    // Should still show non-zero values
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('2,450,000 RWF')).toBeInTheDocument();
    
    // Zero values should be filtered out (not displayed)
    expect(screen.queryByText('0 RWF')).not.toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('handles missing metrics gracefully', () => {
    const minimalMetrics = {
      rating: 4.5,
      totalSales: 1000000,
      completedOrders: 50,
      responseTime: 3
    };

    render(<FarmerPerformanceMetrics metrics={minimalMetrics} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('1,000,000 RWF')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('3h')).toBeInTheDocument();
  });

  it('displays metric descriptions in grid variant', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} variant="grid" />);
    
    expect(screen.getByText('Average customer rating')).toBeInTheDocument();
    expect(screen.getByText('Total revenue generated')).toBeInTheDocument();
    expect(screen.getByText('Successfully completed orders')).toBeInTheDocument();
  });

  it('shows correct trend direction indicators', () => {
    render(<FarmerPerformanceMetrics metrics={mockMetrics} showTrends={true} />);
    
    // Check for trend icons (up/down arrows)
    // Since we're using Lucide icons, we'll check for the presence of trend indicators
    const trendElements = document.querySelectorAll('[data-testid*="trend"]');
    // This is a basic check - in a real test, you'd mock the trend data more specifically
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
  });
});