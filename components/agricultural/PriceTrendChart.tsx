'use client';

import React, { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Brush,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  AlertTriangle,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

export interface PriceData {
  date: string;
  price: number;
  volume: number;
  marketPrice: number;
  highPrice: number;
  lowPrice: number;
  volatility: number;
  product: string;
  market: string;
  currency: 'RWF' | 'USD';
}

export interface MarketFluctuation {
  type: 'spike' | 'drop' | 'stable';
  percentage: number;
  reason?: string;
  date: string;
}

export interface PriceTrendChartProps {
  data: PriceData[];
  productName?: string;
  showVolume?: boolean;
  showMarketComparison?: boolean;
  showFluctuations?: boolean;
  showPrediction?: boolean;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onExport?: (data: PriceData[], format: 'csv' | 'json') => void;
  className?: string;
}

const FLUCTUATION_COLORS = {
  spike: '#10b981',    // Green for price increases
  drop: '#ef4444',     // Red for price drops
  stable: '#6b7280',   // Gray for stable prices
};

const VOLATILITY_LEVELS = {
  low: { threshold: 5, color: '#10b981', label: 'Low' },
  medium: { threshold: 15, color: '#f59e0b', label: 'Medium' },
  high: { threshold: Infinity, color: '#ef4444', label: 'High' },
};

export function PriceTrendChart({
  data,
  productName = 'Product',
  showVolume = true,
  showMarketComparison = true,
  showFluctuations = true,
  showPrediction = false,
  onDateRangeChange,
  onExport,
  className,
}: PriceTrendChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedMarket !== 'all') {
      filtered = filtered.filter(d => d.market === selectedMarket);
    }

    // Apply date range filter if set
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(d => {
        const itemDate = new Date(d.date);
        return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
      });
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedMarket, dateRange]);

  // Calculate price metrics
  const priceMetrics = useMemo(() => {
    if (!filteredData.length) return null;

    const prices = filteredData.map(d => d.price);
    const volumes = filteredData.map(d => d.volume);
    const volatilities = filteredData.map(d => d.volatility);
    
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2] || currentPrice;
    const averagePrice = prices.reduce((sum, val) => sum + val, 0) / prices.length;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const totalVolume = volumes.reduce((sum, val) => sum + val, 0);
    const averageVolatility = volatilities.reduce((sum, val) => sum + val, 0) / volatilities.length;
    
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
    
    // Determine volatility level
    const volatilityLevel = averageVolatility <= VOLATILITY_LEVELS.low.threshold ? 'low' :
                           averageVolatility <= VOLATILITY_LEVELS.medium.threshold ? 'medium' : 'high';

    return {
      currentPrice: Math.round(currentPrice),
      averagePrice: Math.round(averagePrice),
      maxPrice: Math.round(maxPrice),
      minPrice: Math.round(minPrice),
      priceChange: Math.round(priceChange),
      priceChangePercent: Math.round(priceChangePercent * 10) / 10,
      totalVolume: Math.round(totalVolume),
      averageVolatility: Math.round(averageVolatility * 10) / 10,
      volatilityLevel,
      isIncreasing: priceChange > 0,
      currency: filteredData[0]?.currency || 'RWF',
    };
  }, [filteredData]);

  // Detect market fluctuations
  const marketFluctuations = useMemo(() => {
    if (!showFluctuations || filteredData.length < 2) return [];

    const fluctuations: MarketFluctuation[] = [];
    
    for (let i = 1; i < filteredData.length; i++) {
      const current = filteredData[i];
      const previous = filteredData[i - 1];
      
      const changePercent = ((current.price - previous.price) / previous.price) * 100;
      
      if (Math.abs(changePercent) > 10) { // Significant fluctuation threshold
        fluctuations.push({
          type: changePercent > 0 ? 'spike' : 'drop',
          percentage: Math.abs(changePercent),
          date: current.date,
          reason: changePercent > 0 ? 'Market demand increase' : 'Market supply increase',
        });
      }
    }
    
    return fluctuations.slice(-5); // Show last 5 fluctuations
  }, [filteredData, showFluctuations]);

  // Available markets for filtering
  const availableMarkets = useMemo(() => {
    const markets = [...new Set(data.map(d => d.market))];
    return markets;
  }, [data]);

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    onDateRangeChange?.(newDateRange);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(filteredData, format);
    } else {
      // Default export implementation
      const filename = `price-trend-${productName.toLowerCase().replace(/\s+/g, '-')}-${selectedPeriod}`;
      
      if (format === 'csv') {
        const headers = ['Date', 'Price', 'Volume', 'Market Price', 'High', 'Low', 'Volatility', 'Market'];
        const csvContent = [
          headers.join(','),
          ...filteredData.map(row => [
            row.date,
            row.price,
            row.volume,
            row.marketPrice,
            row.highPrice,
            row.lowPrice,
            row.volatility,
            row.market
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{new Date(label).toLocaleDateString()}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-agricultural-primary">Price:</span> {data.currency} {data.price.toLocaleString()}
            </p>
            {showMarketComparison && (
              <p className="text-sm">
                <span className="text-earth-ochre">Market Price:</span> {data.currency} {data.marketPrice.toLocaleString()}
              </p>
            )}
            {showVolume && (
              <p className="text-sm">
                <span className="text-sky-blue">Volume:</span> {data.volume.toLocaleString()} units
              </p>
            )}
            <p className="text-sm">
              <span className="text-gray-600">Volatility:</span> {data.volatility}%
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Market:</span> {data.market}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      height: 350,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--agricultural-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--agricultural-primary)" stopOpacity={0.05} />
            </linearGradient>
            {showMarketComparison && (
              <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--earth-ochre)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--earth-ochre)" stopOpacity={0.05} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            label={{ value: `Price (${priceMetrics?.currency || 'RWF'})`, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {showMarketComparison && (
            <Area
              type="monotone"
              dataKey="marketPrice"
              stroke="var(--earth-ochre)"
              strokeWidth={2}
              fill="url(#marketGradient)"
              name="Market Price"
              strokeDasharray="5 5"
            />
          )}
          
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--agricultural-primary)"
            strokeWidth={3}
            fill="url(#priceGradient)"
            name="Your Price"
          />
          
          {/* Add reference line for average price */}
          {priceMetrics && (
            <ReferenceLine 
              y={priceMetrics.averagePrice} 
              stroke="var(--harvest-gold)" 
              strokeDasharray="3 3"
              label={{ value: "Avg", position: "topRight" }}
            />
          )}
          
          <Brush dataKey="date" height={30} stroke="var(--agricultural-primary)" />
        </AreaChart>
      );
    } else {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            label={{ value: `Price (${priceMetrics?.currency || 'RWF'})`, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--agricultural-primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--agricultural-primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--agricultural-primary)', strokeWidth: 2 }}
            name="Your Price"
          />
          
          {showMarketComparison && (
            <Line
              type="monotone"
              dataKey="marketPrice"
              stroke="var(--earth-ochre)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--earth-ochre)', strokeWidth: 2, r: 3 }}
              name="Market Price"
            />
          )}
          
          {/* Add reference line for average price */}
          {priceMetrics && (
            <ReferenceLine 
              y={priceMetrics.averagePrice} 
              stroke="var(--harvest-gold)" 
              strokeDasharray="3 3"
              label={{ value: "Avg", position: "topRight" }}
            />
          )}
          
          <Brush dataKey="date" height={30} stroke="var(--agricultural-primary)" />
        </LineChart>
      );
    }
  };

  return (
    <Card className={`agricultural-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-agricultural-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-agricultural-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Price Trend Analysis - {productName}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Market fluctuations and price performance tracking
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="90d">90D</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {availableMarkets.map(market => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="h-8 px-2"
              >
                <Download className="w-3 h-3 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="h-8 px-2"
              >
                <Download className="w-3 h-3 mr-1" />
                JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Price Metrics */}
        {priceMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="text-center p-3 bg-agricultural-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-agricultural-primary">
                {priceMetrics.currency} {priceMetrics.currentPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Current Price</p>
            </div>
            <div className="text-center p-3 bg-earth-ochre/5 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                {priceMetrics.isIncreasing ? (
                  <TrendingUp className="w-4 h-4 text-growth-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-alert-red" />
                )}
                <p className={`text-2xl font-bold ${
                  priceMetrics.isIncreasing ? 'text-growth-success' : 'text-alert-red'
                }`}>
                  {priceMetrics.priceChange > 0 ? '+' : ''}{priceMetrics.priceChangePercent}%
                </p>
              </div>
              <p className="text-xs text-gray-600">Change</p>
            </div>
            <div className="text-center p-3 bg-harvest-gold/5 rounded-lg">
              <p className="text-2xl font-bold text-harvest-gold">
                {priceMetrics.currency} {priceMetrics.averagePrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Average</p>
            </div>
            <div className="text-center p-3 bg-sky-blue/5 rounded-lg">
              <p className="text-2xl font-bold text-sky-blue">
                {priceMetrics.totalVolume.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Volume</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: VOLATILITY_LEVELS[priceMetrics.volatilityLevel].color }}
                />
                <p className={`text-2xl font-bold`}
                   style={{ color: VOLATILITY_LEVELS[priceMetrics.volatilityLevel].color }}>
                  {priceMetrics.averageVolatility}%
                </p>
              </div>
              <p className="text-xs text-gray-600">Volatility</p>
            </div>
          </div>
        )}

        {/* Market Fluctuations */}
        {showFluctuations && marketFluctuations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Recent Market Fluctuations
            </h4>
            <div className="space-y-2">
              {marketFluctuations.map((fluctuation, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: FLUCTUATION_COLORS[fluctuation.type] }}
                    />
                    <span className="text-sm font-medium capitalize">
                      {fluctuation.type} ({fluctuation.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {new Date(fluctuation.date).toLocaleDateString()}
                    </p>
                    {fluctuation.reason && (
                      <p className="text-xs text-gray-500">{fluctuation.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}