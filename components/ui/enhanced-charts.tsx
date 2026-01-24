'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Info,
  Download,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Color palette based on the green theme
const chartColors = {
  primary: '#00A63E',
  primaryLight: '#22C55E',
  primaryDark: '#15803D',
  secondary: '#10B981',
  accent: '#059669',
  gradient: ['#00A63E', '#22C55E', '#10B981', '#059669', '#047857'],
  neutral: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6']
};

// Enhanced Line Chart
interface LineChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

interface EnhancedLineChartProps {
  data: LineChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  gradient?: boolean;
  className?: string;
}

export const EnhancedLineChart: React.FC<EnhancedLineChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  showGrid = true,
  showTooltip = true,
  animated = true,
  gradient = true,
  className
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height - padding * 2;

  // Generate path for line
  const generatePath = () => {
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
      const y = padding + ((maxValue - point.value) / range) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
      const y = padding + ((maxValue - point.value) / range) * chartHeight;
      return `${x},${y}`;
    });
    const firstPoint = points[0].split(',');
    const lastPoint = points[points.length - 1].split(',');
    return `M ${firstPoint[0]},${height - padding} L ${points.join(' L ')} L ${lastPoint[0]},${height - padding} Z`;
  };

  const pathLength = svgRef.current?.querySelector('path')?.getTotalLength() || 1000;

  return (
    <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="overflow-visible"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={chartColors.primary} />
              <stop offset="100%" stopColor={chartColors.primaryLight} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartColors.primary} stopOpacity="0.3" />
              <stop offset="100%" stopColor={chartColors.primary} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {showGrid && (
            <g className="opacity-20">
              {/* Horizontal grid lines */}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={padding}
                  y1={padding + (i * chartHeight) / 4}
                  x2={chartWidth - padding}
                  y2={padding + (i * chartHeight) / 4}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-600"
                />
              ))}
              {/* Vertical grid lines */}
              {data.map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={padding + (i / (data.length - 1)) * (chartWidth - padding * 2)}
                  y1={padding}
                  x2={padding + (i / (data.length - 1)) * (chartWidth - padding * 2)}
                  y2={height - padding}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-600"
                />
              ))}
            </g>
          )}

          {/* Area Fill */}
          {gradient && (
            <motion.path
              d={generateAreaPath()}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationProgress }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          )}

          {/* Line */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animationProgress }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Data Points */}
          {data.map((point, index) => {
            const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
            const y = padding + ((maxValue - point.value) / range) * chartHeight;
            
            return (
              <motion.g
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: animationProgress,
                  opacity: animationProgress
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1) 
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredPoint === index ? 6 : 4}
                  fill={chartColors.primary}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => showTooltip && setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* Pulse effect on hover */}
                {hoveredPoint === index && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={chartColors.primary}
                    opacity={0.3}
                    initial={{ scale: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPoint !== null && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-10 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
              style={{
                left: `${((hoveredPoint / (data.length - 1)) * 100)}%`,
                top: '10px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-medium">{data[hoveredPoint].label}</div>
              <div className="text-green-400 dark:text-green-600">
                {data[hoveredPoint].value.toLocaleString()}
              </div>
              {data[hoveredPoint].date && (
                <div className="text-xs opacity-75">
                  {data[hoveredPoint].date}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Enhanced Bar Chart
interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface EnhancedBarChartProps {
  data: BarChartDataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

export const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  horizontal = false,
  showValues = true,
  animated = true,
  className
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              {showValues && (
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: item.color || `linear-gradient(90deg, ${chartColors.primary}, ${chartColors.primaryLight})`
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(item.value / maxValue) * 100 * animationProgress}%` 
                }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1 + 0.5,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Donut Chart
interface DonutChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface EnhancedDonutChartProps {
  data: DonutChartDataPoint[];
  title?: string;
  subtitle?: string;
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

export const EnhancedDonutChart: React.FC<EnhancedDonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 200,
  innerRadius = 60,
  showLegend = true,
  showTooltip = true,
  animated = true,
  className
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);

  if (!data.length) {
    return (
      <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const center = size / 2;

  let cumulativePercentage = 0;

  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const start = polarToCartesian(center, center, outerRadius, endAngle);
    const end = polarToCartesian(center, center, outerRadius, startAngle);
    const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className={cn('p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center space-x-8">
        {/* Chart */}
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = (cumulativePercentage / 100) * 360;
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
              
              cumulativePercentage += percentage;
              
              const color = item.color || chartColors.gradient[index % chartColors.gradient.length];
              const isHovered = hoveredSegment === index;
              const currentRadius = isHovered ? radius + 5 : radius;
              
              return (
                <motion.path
                  key={index}
                  d={createArcPath(
                    startAngle, 
                    startAngle + ((endAngle - startAngle) * animationProgress),
                    currentRadius,
                    innerRadius
                  )}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => showTooltip && setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const color = item.color || chartColors.gradient[index % chartColors.gradient.length];
              
              return (
                <motion.div
                  key={index}
                  className={cn(
                    'flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors',
                    hoveredSegment === index && 'bg-gray-50 dark:bg-gray-800'
                  )}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.value.toLocaleString()} ({percentage}%)
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Chart Container with Actions
interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  title,
  subtitle,
  actions,
  loading = false,
  error,
  className
}) => {
  return (
    <div className={cn('relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading chart...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {error ? (
        <div className="p-6">
          <div className="flex items-center justify-center h-64 text-red-500 dark:text-red-400">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default {
  EnhancedLineChart,
  EnhancedBarChart,
  EnhancedDonutChart,
  ChartContainer,
  chartColors
};