'use client';

import React, { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Calendar, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

export type ChartType = 'line' | 'area' | 'bar' | 'pie';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface InteractiveChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: ChartType;
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  showDateFilter?: boolean;
  showExport?: boolean;
  showMetrics?: boolean;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  onExport?: (data: ChartDataPoint[], format: 'csv' | 'json') => void;
  className?: string;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#10b981', // green-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
];

export function InteractiveChart({
  title,
  data,
  type = 'line',
  dataKey = 'value',
  xAxisKey = 'name',
  height = 300,
  showDateFilter = true,
  showExport = true,
  showMetrics = true,
  onDateRangeChange,
  onExport,
  className,
  colors = DEFAULT_COLORS,
}: InteractiveChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!data || !data.length) return null;

    const values = data.map(d => Number(d[dataKey]) || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midPoint);
    const secondHalf = values.slice(midPoint);
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length : 0;
    const trend = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
    const trendPercentage = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return {
      total,
      average,
      max,
      min,
      trend,
      trendPercentage: Math.abs(trendPercentage),
    };
  }, [data, dataKey]);

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    onDateRangeChange?.(newDateRange);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(data, format);
    } else {
      // Default export implementation
      if (format === 'csv') {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-data.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart width={400} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey={dataKey}
              nameKey={xAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {showDateFilter && (
              <>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7D</SelectItem>
                    <SelectItem value="30d">30D</SelectItem>
                    <SelectItem value="90d">90D</SelectItem>
                    <SelectItem value="1y">1Y</SelectItem>
                  </SelectContent>
                </Select>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                />
              </>
            )}
            {showExport && (
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
            )}
          </div>
        </div>

        {showMetrics && metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.total || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(metrics.average || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.max || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Peak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {metrics.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : metrics.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : null}
                <p className={`text-2xl font-bold ${
                  metrics.trend === 'up' ? 'text-green-500' : 
                  metrics.trend === 'down' ? 'text-red-500' : 'text-gray-900'
                }`}>
                  {metrics.trendPercentage.toFixed(1)}%
                </p>
              </div>
              <p className="text-xs text-gray-500">Trend</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}