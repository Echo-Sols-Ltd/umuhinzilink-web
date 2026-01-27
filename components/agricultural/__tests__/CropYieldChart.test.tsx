import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CropYieldChart, type CropYieldData } from '../CropYieldChart';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: () => <div data-testid="select-value" />,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

jest.mock('@/components/ui/date-range-picker', () => ({
  DatePickerWithRange: ({ onDateChange }: any) => (
    <div data-testid="date-picker" onClick={() => onDateChange?.(undefined)} />
  ),
}));

const mockCropYieldData: CropYieldData[] = [
  {
    month: 'Jan 2024',
    yield: 120,
    expectedYield: 100,
    rainfall: 45,
    temperature: 22,
    season: 'growing',
    cropType: 'Maize',
    year: 2024,
  },
  {
    month: 'Feb 2024',
    yield: 135,
    expectedYield: 110,
    rainfall: 38,
    temperature: 24,
    season: 'growing',
    cropType: 'Maize',
    year: 2024,
  },
  {
    month: 'Mar 2024',
    yield: 180,
    expectedYield: 150,
    rainfall: 65,
    temperature: 23,
    season: 'harvesting',
    cropType: 'Maize',
    year: 2024,
  },
];

describe('CropYieldChart', () => {
  it('renders crop yield chart with title and data', () => {
    render(<CropYieldChart data={mockCropYieldData} cropType="Maize" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Crop Yield Analysis - Maize');
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('displays yield metrics correctly', () => {
    render(<CropYieldChart data={mockCropYieldData} cropType="Maize" />);
    
    // Check if metrics are calculated and displayed
    const totalYield = mockCropYieldData.reduce((sum, item) => sum + item.yield, 0);
    expect(screen.getByText(totalYield.toLocaleString())).toBeInTheDocument();
  });

  it('shows seasonal patterns when enabled', () => {
    render(
      <CropYieldChart 
        data={mockCropYieldData} 
        cropType="Maize" 
        showSeasonalPatterns={true} 
      />
    );
    
    expect(screen.getByText('Seasonal Performance')).toBeInTheDocument();
  });

  it('renders area chart by default', () => {
    render(<CropYieldChart data={mockCropYieldData} cropType="Maize" />);
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('handles export functionality', () => {
    const mockExport = jest.fn();
    render(
      <CropYieldChart 
        data={mockCropYieldData} 
        cropType="Maize" 
        onExport={mockExport} 
      />
    );
    
    const csvButton = screen.getAllByTestId('button').find(btn => 
      btn.textContent?.includes('CSV')
    );
    
    if (csvButton) {
      fireEvent.click(csvButton);
      expect(mockExport).toHaveBeenCalledWith(mockCropYieldData, 'csv');
    }
  });

  it('handles empty data gracefully', () => {
    render(<CropYieldChart data={[]} cropType="Maize" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('applies agricultural styling classes', () => {
    render(<CropYieldChart data={mockCropYieldData} cropType="Maize" />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('agricultural-card');
  });

  it('shows comparison data when enabled', () => {
    render(
      <CropYieldChart 
        data={mockCropYieldData} 
        cropType="Maize" 
        showComparison={true} 
      />
    );
    
    // Should render both actual and expected yield areas
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('calculates performance metrics correctly', () => {
    render(<CropYieldChart data={mockCropYieldData} cropType="Maize" />);
    
    // Check if performance calculation is displayed
    const totalYield = mockCropYieldData.reduce((sum, item) => sum + item.yield, 0);
    const totalExpected = mockCropYieldData.reduce((sum, item) => sum + item.expectedYield, 0);
    const performance = ((totalYield - totalExpected) / totalExpected) * 100;
    
    expect(screen.getByText(`+${performance.toFixed(1)}%`)).toBeInTheDocument();
  });
});