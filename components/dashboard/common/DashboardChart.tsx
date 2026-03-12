'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { ChartComponentProps } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardChart({ config, className, height = 300 }: ChartComponentProps) {
  const renderChart = () => {
    switch (config.type) {
      case 'line':
      case 'dualAxisLine':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={Array.isArray(config.labels) ? config.labels.map((label: string, index: number) => {
              const dataPoint: any = { name: label };
              config.datasets?.forEach(dataset => {
                dataPoint[dataset.label] = dataset.data[index];
              });
              return dataPoint;
            }) : []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {config.datasets?.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  strokeWidth={2}
                  fill={Array.isArray(dataset.backgroundColor) ? undefined : dataset.backgroundColor}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
      case 'horizontalBar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={Array.isArray(config.labels) ? config.labels.map((label: string, index: number) => {
                const dataPoint: any = { name: label };
                config.datasets?.forEach(dataset => {
                  dataPoint[dataset.label] = dataset.data[index];
                });
                return dataPoint;
              }) : []}
              layout={config.type === 'horizontalBar' ? 'horizontal' : 'vertical'}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey={config.type === 'horizontalBar' ? undefined : 'name'}
                type={config.type === 'horizontalBar' ? 'number' : 'category'}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                dataKey={config.type === 'horizontalBar' ? 'name' : undefined}
                type={config.type === 'horizontalBar' ? 'category' : 'number'}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {config.datasets?.map((dataset, index) => (
                <Bar
                  key={index}
                  dataKey={dataset.label}
                  fill={Array.isArray(dataset.backgroundColor) ? undefined : dataset.backgroundColor}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={Array.isArray(config.labels) ? config.labels.map((label: string, index: number) => ({
                  name: label,
                  value: config.datasets?.[0]?.data[index] || 0
                })) : []}
                cx="50%"
                cy="50%"
                innerRadius={config.type === 'donut' ? 60 : 0}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {Array.isArray(config.labels) && config.labels.map((_: string, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={config.datasets?.[0]?.backgroundColor?.[index] || '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={Array.isArray(config.labels) ? config.labels.map((label: string, index: number) => {
              const dataPoint: any = { name: label };
              config.datasets?.forEach(dataset => {
                dataPoint[dataset.label] = dataset.data[index];
              });
              return dataPoint;
            }) : []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {config.datasets?.map((dataset, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  fill={Array.isArray(dataset.backgroundColor) ? undefined : dataset.backgroundColor}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'gauge':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-transparent"
                style={{
                  borderRightColor: config.value && config.max 
                    ? config.value > 90 
                      ? '#10B981' 
                      : config.value > 80 
                        ? '#F59E0B' 
                        : '#EF4444'
                    : '#10B981',
                  transform: `rotate(${config.value && config.max ? (config.value / config.max) * 360 - 90 : 0}deg)`,
                  transformOrigin: 'center'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{config.value}%</p>
                  <p className="text-xs text-muted-foreground">{config.title}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'realtime':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{config.title}</h4>
            <div className="grid grid-cols-2 gap-4">
              {config.metrics?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">{metric.name}</p>
                    <p className="text-sm font-semibold">{metric.value}</p>
                  </div>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Chart type "{config.type}" not yet implemented</p>
          </div>
        );
    }
  };

  return (
    <div className={cn("bg-card rounded-xl p-6 border border-border", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{config.title}</h3>
      {renderChart()}
    </div>
  );
}
