'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Download,
  Filter,
  Layers,
  BarChart3,
  Info,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface RegionalData {
  province: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  metrics: {
    totalFarmers: number;
    totalBuyers: number;
    totalProducts: number;
    totalRevenue: number;
    averagePrice: number;
    topCrops: string[];
    growthRate: number;
  };
  demographics: {
    population: number;
    ruralPercentage: number;
    averageIncome: number;
  };
  infrastructure: {
    marketAccess: 'high' | 'medium' | 'low';
    internetCoverage: number;
    roadQuality: 'good' | 'fair' | 'poor';
  };
}

export interface RwandaRegionalMapProps {
  data: RegionalData[];
  selectedMetric?: 'farmers' | 'buyers' | 'products' | 'revenue' | 'growth';
  showProvinces?: boolean;
  showDistricts?: boolean;
  showInfrastructure?: boolean;
  onRegionSelect?: (region: RegionalData) => void;
  onExport?: (data: RegionalData[], format: 'csv' | 'json') => void;
  className?: string;
}

// Rwanda provinces and their approximate coordinates
const RWANDA_PROVINCES = {
  'Kigali': { lat: -1.9441, lng: 30.0619, color: '#2D5016' },
  'Eastern': { lat: -2.0000, lng: 30.5000, color: '#4A7C59' },
  'Northern': { lat: -1.5000, lng: 29.8000, color: '#7FB069' },
  'Southern': { lat: -2.5000, lng: 29.7000, color: '#B8E6B8' },
  'Western': { lat: -2.2000, lng: 29.2000, color: '#9CDB9C' },
};

const METRIC_COLORS = {
  farmers: '#2D5016',    // Agricultural primary
  buyers: '#4A7C59',     // Agricultural light
  products: '#FFD700',   // Harvest gold
  revenue: '#CC7722',    // Earth ochre
  growth: '#10b981',     // Growth success
};

const INFRASTRUCTURE_COLORS = {
  high: '#10b981',       // Green
  medium: '#f59e0b',     // Amber
  low: '#ef4444',        // Red
  good: '#10b981',       // Green
  fair: '#f59e0b',       // Amber
  poor: '#ef4444',       // Red
};

export function RwandaRegionalMap({
  data,
  selectedMetric = 'farmers',
  showProvinces = true,
  showDistricts = true,
  showInfrastructure = false,
  onRegionSelect,
  onExport,
  className,
}: RwandaRegionalMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'stats'>('map');

  // Filter data by province
  const filteredData = useMemo(() => {
    if (selectedProvince === 'all') return data;
    return data.filter(region => region.province === selectedProvince);
  }, [data, selectedProvince]);

  // Calculate provincial summaries
  const provincialSummaries = useMemo(() => {
    const summaries = Object.keys(RWANDA_PROVINCES).map(province => {
      const provinceData = data.filter(region => region.province === province);
      
      if (provinceData.length === 0) {
        return {
          province,
          totalFarmers: 0,
          totalBuyers: 0,
          totalProducts: 0,
          totalRevenue: 0,
          averageGrowth: 0,
          districts: 0,
          coordinates: RWANDA_PROVINCES[province as keyof typeof RWANDA_PROVINCES],
          color: RWANDA_PROVINCES[province as keyof typeof RWANDA_PROVINCES].color,
        };
      }

      const totals = provinceData.reduce((acc, region) => ({
        farmers: acc.farmers + region.metrics.totalFarmers,
        buyers: acc.buyers + region.metrics.totalBuyers,
        products: acc.products + region.metrics.totalProducts,
        revenue: acc.revenue + region.metrics.totalRevenue,
        growth: acc.growth + region.metrics.growthRate,
      }), { farmers: 0, buyers: 0, products: 0, revenue: 0, growth: 0 });

      return {
        province,
        totalFarmers: totals.farmers,
        totalBuyers: totals.buyers,
        totalProducts: totals.products,
        totalRevenue: totals.revenue,
        averageGrowth: totals.growth / provinceData.length,
        districts: provinceData.length,
        coordinates: RWANDA_PROVINCES[province as keyof typeof RWANDA_PROVINCES],
        color: RWANDA_PROVINCES[province as keyof typeof RWANDA_PROVINCES].color,
      };
    });

    return summaries;
  }, [data]);

  // Get metric value for visualization
  const getMetricValue = (region: RegionalData) => {
    switch (selectedMetric) {
      case 'farmers': return region.metrics.totalFarmers;
      case 'buyers': return region.metrics.totalBuyers;
      case 'products': return region.metrics.totalProducts;
      case 'revenue': return region.metrics.totalRevenue;
      case 'growth': return region.metrics.growthRate;
      default: return 0;
    }
  };

  // Get metric label
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'farmers': return 'Farmers';
      case 'buyers': return 'Buyers';
      case 'products': return 'Products';
      case 'revenue': return 'Revenue (RWF)';
      case 'growth': return 'Growth Rate (%)';
      default: return 'Metric';
    }
  };

  // Calculate metric ranges for visualization
  const metricRange = useMemo(() => {
    const values = filteredData.map(getMetricValue);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
    };
  }, [filteredData, selectedMetric]);

  // Get circle size based on metric value
  const getCircleSize = (value: number) => {
    if (metricRange.max === metricRange.min) return 20;
    const normalized = (value - metricRange.min) / (metricRange.max - metricRange.min);
    return 10 + (normalized * 30); // Size between 10 and 40
  };

  // Get circle opacity based on metric value
  const getCircleOpacity = (value: number) => {
    if (metricRange.max === metricRange.min) return 0.7;
    const normalized = (value - metricRange.min) / (metricRange.max - metricRange.min);
    return 0.3 + (normalized * 0.7); // Opacity between 0.3 and 1.0
  };

  const handleRegionClick = (region: RegionalData) => {
    setSelectedRegion(region);
    onRegionSelect?.(region);
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (onExport) {
      onExport(filteredData, format);
    } else {
      // Default export implementation
      const filename = `rwanda-regional-data-${selectedMetric}-${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'csv') {
        const headers = [
          'Province', 'District', 'Farmers', 'Buyers', 'Products', 
          'Revenue', 'Growth Rate', 'Population', 'Market Access', 'Internet Coverage'
        ];
        const csvContent = [
          headers.join(','),
          ...filteredData.map(row => [
            row.province,
            row.district,
            row.metrics.totalFarmers,
            row.metrics.totalBuyers,
            row.metrics.totalProducts,
            row.metrics.totalRevenue,
            row.metrics.growthRate,
            row.demographics.population,
            row.infrastructure.marketAccess,
            row.infrastructure.internetCoverage
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

  return (
    <Card className={`agricultural-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-agricultural-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-agricultural-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Rwanda Regional Analysis
              </CardTitle>
              <p className="text-sm text-gray-600">
                Agricultural data visualization by province and district
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmers">Farmers</SelectItem>
                <SelectItem value="buyers">Buyers</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {Object.keys(RWANDA_PROVINCES).map(province => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="map">Map</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="stats">Stats</SelectItem>
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

        {/* Metric Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-agricultural-primary/5 rounded-lg">
            <p className="text-2xl font-bold text-agricultural-primary">
              {filteredData.reduce((sum, region) => sum + region.metrics.totalFarmers, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Farmers</p>
          </div>
          <div className="text-center p-3 bg-earth-ochre/5 rounded-lg">
            <p className="text-2xl font-bold text-earth-ochre">
              {filteredData.reduce((sum, region) => sum + region.metrics.totalBuyers, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Buyers</p>
          </div>
          <div className="text-center p-3 bg-harvest-gold/5 rounded-lg">
            <p className="text-2xl font-bold text-harvest-gold">
              {filteredData.reduce((sum, region) => sum + region.metrics.totalProducts, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Products</p>
          </div>
          <div className="text-center p-3 bg-sky-blue/5 rounded-lg">
            <p className="text-2xl font-bold text-sky-blue">
              RWF {(filteredData.reduce((sum, region) => sum + region.metrics.totalRevenue, 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600">Total Revenue</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'map' && (
          <div className="space-y-4">
            {/* Map Legend */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Showing: {getMetricLabel()}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-agricultural-primary opacity-30" />
                  <span className="text-xs">Low</span>
                  <div className="w-4 h-4 rounded-full bg-agricultural-primary opacity-70" />
                  <span className="text-xs">Medium</span>
                  <div className="w-5 h-5 rounded-full bg-agricultural-primary" />
                  <span className="text-xs">High</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Range: {metricRange.min.toLocaleString()} - {metricRange.max.toLocaleString()}
              </div>
            </div>

            {/* Simplified Rwanda Map Visualization */}
            <div className="relative bg-gradient-to-br from-sky-blue/10 to-agricultural-primary/10 rounded-lg p-8 min-h-[400px]">
              <TooltipProvider>
                {/* Provincial boundaries (simplified representation) */}
                {showProvinces && provincialSummaries.map((province, index) => (
                  <div
                    key={province.province}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <div 
                          className="w-16 h-12 rounded-lg border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: province.color }}
                        >
                          {province.province}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="p-2">
                          <p className="font-medium">{province.province} Province</p>
                          <p className="text-xs">Districts: {province.districts}</p>
                          <p className="text-xs">Farmers: {province.totalFarmers.toLocaleString()}</p>
                          <p className="text-xs">Revenue: RWF {(province.totalRevenue / 1000000).toFixed(1)}M</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}

                {/* District data points */}
                {showDistricts && filteredData.map((region, index) => {
                  const metricValue = getMetricValue(region);
                  const circleSize = getCircleSize(metricValue);
                  const circleOpacity = getCircleOpacity(metricValue);
                  
                  return (
                    <div
                      key={`${region.province}-${region.district}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        left: `${25 + (index * 8) % 60}%`,
                        top: `${25 + Math.floor(index / 8) * 15}%`,
                      }}
                      onClick={() => handleRegionClick(region)}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className="rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110"
                            style={{
                              width: `${circleSize}px`,
                              height: `${circleSize}px`,
                              backgroundColor: METRIC_COLORS[selectedMetric],
                              opacity: circleOpacity,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-2">
                            <p className="font-medium">{region.district}</p>
                            <p className="text-xs text-gray-600">{region.province} Province</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs">
                                {getMetricLabel()}: {metricValue.toLocaleString()}
                              </p>
                              <p className="text-xs">
                                Farmers: {region.metrics.totalFarmers.toLocaleString()}
                              </p>
                              <p className="text-xs">
                                Revenue: RWF {(region.metrics.totalRevenue / 1000000).toFixed(1)}M
                              </p>
                              {showInfrastructure && (
                                <>
                                  <p className="text-xs">
                                    Market Access: 
                                    <span 
                                      className="ml-1 font-medium"
                                      style={{ color: INFRASTRUCTURE_COLORS[region.infrastructure.marketAccess] }}
                                    >
                                      {region.infrastructure.marketAccess}
                                    </span>
                                  </p>
                                  <p className="text-xs">
                                    Internet: {region.infrastructure.internetCoverage}%
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredData
              .sort((a, b) => getMetricValue(b) - getMetricValue(a))
              .map((region, index) => (
                <div 
                  key={`${region.province}-${region.district}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRegionClick(region)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-agricultural-primary">
                        #{index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{region.district}</p>
                      <p className="text-sm text-gray-600">{region.province} Province</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: METRIC_COLORS[selectedMetric] }}>
                        {getMetricValue(region).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">{getMetricLabel()}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {region.metrics.totalFarmers.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Farmers</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        RWF {(region.metrics.totalRevenue / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {region.metrics.growthRate > 0 ? (
                        <TrendingUp className="w-4 h-4 text-growth-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-alert-red" />
                      )}
                      <span className={`text-sm font-medium ${
                        region.metrics.growthRate > 0 ? 'text-growth-success' : 'text-alert-red'
                      }`}>
                        {region.metrics.growthRate > 0 ? '+' : ''}{region.metrics.growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {viewMode === 'stats' && (
          <div className="space-y-6">
            {/* Provincial Statistics */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Provincial Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provincialSummaries.map((province) => (
                  <div key={province.province} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{province.province}</h5>
                      <Badge variant="outline">{province.districts} districts</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Farmers:</span>
                        <span className="font-medium">{province.totalFarmers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Buyers:</span>
                        <span className="font-medium">{province.totalBuyers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-medium">RWF {(province.totalRevenue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Growth:</span>
                        <span className={`font-medium ${
                          province.averageGrowth > 0 ? 'text-growth-success' : 'text-alert-red'
                        }`}>
                          {province.averageGrowth > 0 ? '+' : ''}{province.averageGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Districts */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Top Districts by {getMetricLabel()}
              </h4>
              <div className="space-y-2">
                {filteredData
                  .sort((a, b) => getMetricValue(b) - getMetricValue(a))
                  .slice(0, 5)
                  .map((region, index) => (
                    <div key={`${region.province}-${region.district}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-agricultural-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-agricultural-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{region.district}</p>
                          <p className="text-xs text-gray-600">{region.province}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: METRIC_COLORS[selectedMetric] }}>
                          {getMetricValue(region).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">{getMetricLabel()}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Region Details */}
        {selectedRegion && (
          <div className="mt-6 p-4 bg-agricultural-primary/5 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                {selectedRegion.district}, {selectedRegion.province}
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRegion(null)}
              >
                Close
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-agricultural-primary">
                  {selectedRegion.metrics.totalFarmers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Farmers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-earth-ochre">
                  {selectedRegion.metrics.totalBuyers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Buyers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-harvest-gold">
                  {selectedRegion.metrics.totalProducts.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Products</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-sky-blue">
                  RWF {(selectedRegion.metrics.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
            </div>
            
            {showInfrastructure && (
              <div className="mt-4 pt-4 border-t">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Infrastructure</h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: INFRASTRUCTURE_COLORS[selectedRegion.infrastructure.marketAccess] }}
                    >
                      {selectedRegion.infrastructure.marketAccess}
                    </p>
                    <p className="text-xs text-gray-600">Market Access</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedRegion.infrastructure.internetCoverage}%
                    </p>
                    <p className="text-xs text-gray-600">Internet Coverage</p>
                  </div>
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: INFRASTRUCTURE_COLORS[selectedRegion.infrastructure.roadQuality] }}
                    >
                      {selectedRegion.infrastructure.roadQuality}
                    </p>
                    <p className="text-xs text-gray-600">Road Quality</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}