'use client';

import React, { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  Sprout,
  Sun,
  CloudRain,
  Package,
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

export interface CropYieldData {
  month: string;
  yield: number;
  expectedYield: number;
  rainfall: number;
  temperature: number;
  season: 'planting' | 'growing' | 'harvesting' | 'dormant';
  cropType: string;
  year: number;
}

export interface CropYieldChartProps {
  data: CropYieldData[];
  cropType?: string;
  showSeasonalPatterns?: boolean;
  showWeatherData?: boolean;
  showComparison?: boolean;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onExport?: (data: CropYieldData[], format: 'csv' | 'json') => void;
  className?: string;
}

const SEASON_COLORS = {
  planting: '#4A7C59',    // Agricultural green
  growing: '#7FB069',     // Fresh leaf green
  harvesting: '#FFD700',  // Harvest gold
  dormant: '#8B4513',     // Earth brown
};

const SEASON_ICONS = {
  planting: Sprout,
  growing: Sun,
  harvesting: Package,
  dormant: CloudRain,
};

export function CropYieldChart({
  data,
  cropType = 'All Crops',
  showSeasonalPatterns = true,
  showWeatherData = false,
  showComparison = true,
  onDateRangeChange,
  onExport,
  className,
}: CropYieldChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedYear !== 'all') {
      filtered = filtered.filter(d => d.year.toString() === selectedYear);
    }

    if (selectedSeason !== 'all') {
      filtered = filtered.filter(d => d.season === selectedSeason);
    }

    return filtered;
  }, [data, selectedYear, selectedSeason]);

  // Calculate yield metrics
  const yieldMetrics = useMemo(() => {
    if (!filteredData.length) return null;

    const yields = filteredData.map(d => d.yield);
    const expectedYields = filteredData.map(d => d.expectedYield);
    
    const totalYield = yields.reduce((sum, val) => sum + val, 0);
    const totalExpected = expectedYields.reduce((sum, val) => sum + val, 0);
    const averageYield = totalYield / yields.length;
    const maxYield = Math.max(...yields);
    const minYield = Math.min(...yields);
    
    const performance = totalExpected > 0 ? ((totalYield - totalExpected) / totalExpected) * 100 : 0;
    const trend = yields.length > 1 ? 
      (yields[yields.length - 1] - yields[0]) / yields[0] * 100 : 0;

    return {
      totalYield: Math.round(totalYield),
      averageYield: Math.round(averageYield),
      maxYield: Math.round(maxYield),
      minYield: Math.round(minYield),
      performance: Math.round(performance * 10) / 10,
      trend: Math.round(trend * 10) / 10,
      isPerformingWell: performance > 0,
      isTrendingUp: trend > 0,
    };
  }, [filteredData]);

  // Get seasonal insights
  const seasonalInsights = useMemo(() => {
    if (!showSeasonalPatterns || !filteredData.length) return [];

    const seasonData = filteredData.reduce((acc, item) => {
      if (!acc[item.season]) {
        acc[item.season] = { yield: 0, count: 0, rainfall: 0, temperature: 0 };
      }
      acc[item.season].yield += item.yield;
      acc[item.season].rainfall += item.rainfall;
      acc[item.season].temperature += item.temperature;
      acc[item.season].count += 1;
      return acc;
    }, {} as Record<string, { yield: number; count: number; rainfall: number; temperature: number }>);

    return Object.entries(seasonData).map(([season, data]) => ({
      season: season as keyof typeof SEASON_COLORS,
      averageYield: Math.round(data.yield / data.count),
      averageRainfall: Math.round(data.rainfall / data.count),
      averageTemperature: Math.round(data.temperature / data.count),
      color: SEASON_COLORS[season as keyof typeof SEASON_COLORS],
      icon: SEASON_ICONS[season as keyof typeof SEASON_ICONS],
    }));
  }, [filteredData, showSeasonalPatterns]);

  // Available years for filtering
  const availableYears = useMemo(() => {
    const years = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
    return years;
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
      const filename = `crop-yield-${cropType.toLowerCase().replace(/\s+/g, '-')}-${selectedYear}`;
      
      if (format === 'csv') {
        const headers = ['Month', 'Yield (tons)', 'Expected Yield (tons)', 'Rainfall (mm)', 'Temperature (°C)', 'Season'];
        const csvContent = [
          headers.join(','),
          ...filteredData.map(row => [
            row.month,
            row.yield,
            row.expectedYield,
            row.rainfall,
            row.temperature,
            row.season
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

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      height: 350,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-900">{label}</p>
            <div className="space-y-1 mt-2">
              <p className="text-sm">
                <span className="text-agricultural-primary">Yield:</span> {data.yield} tons
              </p>
              {showComparison && (
                <p className="text-sm">
                  <span className="text-gray-600">Expected:</span> {data.expectedYield} tons
                </p>
              )}
              {showWeatherData && (
                <>
                  <p className="text-sm">
                    <span className="text-sky-blue">Rainfall:</span> {data.rainfall}mm
                  </p>
                  <p className="text-sm">
                    <span className="text-sunrise-orange">Temperature:</span> {data.temperature}°C
                  </p>
                </>
              )}
              <div className="flex items-center gap-1 mt-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: SEASON_COLORS[data.season] }}
                />
                <span className="text-xs text-gray-600 capitalize">{data.season} season</span>
              </div>
            </div>
          </div>
        );
      }
      return null;
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--agricultural-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--agricultural-primary)" stopOpacity={0.05} />
              </linearGradient>
              {showComparison && (
                <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--earth-ochre)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--earth-ochre)" stopOpacity={0.05} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {showComparison && (
              <Area
                type="monotone"
                dataKey="expectedYield"
                stroke="var(--earth-ochre)"
                strokeWidth={2}
                fill="url(#expectedGradient)"
                name="Expected Yield"
                strokeDasharray="5 5"
              />
            )}
            
            <Area
              type="monotone"
              dataKey="yield"
              stroke="var(--agricultural-primary)"
              strokeWidth={3}
              fill="url(#yieldGradient)"
              name="Actual Yield"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar 
              dataKey="yield" 
              fill="var(--agricultural-primary)" 
              radius={[4, 4, 0, 0]}
              name="Actual Yield"
            />
            
            {showComparison && (
              <Bar 
                dataKey="expectedYield" 
                fill="var(--earth-ochre)" 
                radius={[4, 4, 0, 0]}
                name="Expected Yield"
                opacity={0.7}
              />
            )}
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Yield (tons)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line
              type="monotone"
              dataKey="yield"
              stroke="var(--agricultural-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--agricultural-primary)', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: 'var(--agricultural-primary)', strokeWidth: 2 }}
              name="Actual Yield"
            />
            
            {showComparison && (
              <Line
                type="monotone"
                dataKey="expectedYield"
                stroke="var(--earth-ochre)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--earth-ochre)', strokeWidth: 2, r: 4 }}
                name="Expected Yield"
              />
            )}
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
              <Sprout className="w-5 h-5 text-agricultural-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Crop Yield Analysis - {cropType}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Seasonal patterns and yield performance tracking
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="planting">Planting</SelectItem>
                <SelectItem value="growing">Growing</SelectItem>
                <SelectItem value="harvesting">Harvesting</SelectItem>
                <SelectItem value="dormant">Dormant</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
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

        {/* Yield Metrics */}
        {yieldMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-agricultural-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-agricultural-primary">
                {yieldMetrics.totalYield.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Yield (tons)</p>
            </div>
            <div className="text-center p-3 bg-earth-ochre/5 rounded-lg">
              <p className="text-2xl font-bold text-earth-ochre">
                {yieldMetrics.averageYield.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Average (tons)</p>
            </div>
            <div className="text-center p-3 bg-harvest-gold/5 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                {yieldMetrics.isPerformingWell ? (
                  <TrendingUp className="w-4 h-4 text-growth-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-alert-red" />
                )}
                <p className={`text-2xl font-bold ${
                  yieldMetrics.isPerformingWell ? 'text-growth-success' : 'text-alert-red'
                }`}>
                  {yieldMetrics.performance > 0 ? '+' : ''}{yieldMetrics.performance}%
                </p>
              </div>
              <p className="text-xs text-gray-600">vs Expected</p>
            </div>
            <div className="text-center p-3 bg-sky-blue/5 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                {yieldMetrics.isTrendingUp ? (
                  <TrendingUp className="w-4 h-4 text-growth-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-alert-red" />
                )}
                <p className={`text-2xl font-bold ${
                  yieldMetrics.isTrendingUp ? 'text-growth-success' : 'text-alert-red'
                }`}>
                  {yieldMetrics.trend > 0 ? '+' : ''}{yieldMetrics.trend}%
                </p>
              </div>
              <p className="text-xs text-gray-600">Trend</p>
            </div>
          </div>
        )}

        {/* Seasonal Insights */}
        {showSeasonalPatterns && seasonalInsights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Seasonal Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasonalInsights.map(({ season, averageYield, color, icon: Icon }) => (
                <div key={season} className="flex items-center gap-2 p-2 rounded-lg border">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{season}</p>
                    <p className="text-xs text-gray-600">{averageYield} tons avg</p>
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