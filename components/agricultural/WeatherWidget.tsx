'use client';

import React, { useState, useMemo } from 'react';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sprout,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface WeatherData {
  date: string;
  temperature: {
    current: number;
    high: number;
    low: number;
    feelsLike: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  pressure: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  description: string;
}

export interface AgriculturalTiming {
  activity: string;
  recommendation: 'ideal' | 'good' | 'poor' | 'avoid';
  reason: string;
  icon: React.ReactNode;
  timeframe: string;
}

export interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  validUntil: string;
}

export interface WeatherWidgetProps {
  currentWeather: WeatherData;
  forecast: WeatherData[];
  location: string;
  showAgriculturalTiming?: boolean;
  showAlerts?: boolean;
  showDetailedMetrics?: boolean;
  onLocationChange?: (location: string) => void;
  className?: string;
}

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudRain,
  snowy: CloudSnow,
};

const RECOMMENDATION_COLORS = {
  ideal: '#10b981',    // Green
  good: '#f59e0b',     // Amber
  poor: '#ef4444',     // Red
  avoid: '#dc2626',    // Dark red
};

const ALERT_COLORS = {
  warning: '#ef4444',  // Red
  watch: '#f59e0b',    // Amber
  advisory: '#3b82f6', // Blue
};

const SEVERITY_COLORS = {
  low: '#10b981',      // Green
  medium: '#f59e0b',   // Amber
  high: '#ef4444',     // Red
};

export function WeatherWidget({
  currentWeather,
  forecast,
  location,
  showAgriculturalTiming = true,
  showAlerts = true,
  showDetailedMetrics = true,
  onLocationChange,
  className,
}: WeatherWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'current' | 'forecast' | 'timing'>('current');

  // Generate agricultural timing recommendations
  const agriculturalTimings = useMemo((): AgriculturalTiming[] => {
    if (!showAgriculturalTiming) return [];

    const weather = selectedDay === 0 ? currentWeather : forecast[selectedDay - 1];
    if (!weather) return [];

    const timings: AgriculturalTiming[] = [];

    // Planting recommendations
    if (weather.rainfall < 5 && weather.temperature.current > 15 && weather.temperature.current < 30) {
      timings.push({
        activity: 'Planting',
        recommendation: 'ideal',
        reason: 'Perfect temperature and low rainfall for seed planting',
        icon: <Sprout className="w-4 h-4" />,
        timeframe: 'Today',
      });
    } else if (weather.rainfall > 20) {
      timings.push({
        activity: 'Planting',
        recommendation: 'avoid',
        reason: 'Heavy rainfall may wash away seeds',
        icon: <Sprout className="w-4 h-4" />,
        timeframe: 'Today',
      });
    }

    // Irrigation recommendations
    if (weather.rainfall < 2 && weather.humidity < 60) {
      timings.push({
        activity: 'Irrigation',
        recommendation: 'ideal',
        reason: 'Low rainfall and humidity - crops need water',
        icon: <Droplets className="w-4 h-4" />,
        timeframe: 'Today',
      });
    } else if (weather.rainfall > 10) {
      timings.push({
        activity: 'Irrigation',
        recommendation: 'avoid',
        reason: 'Sufficient rainfall - avoid overwatering',
        icon: <Droplets className="w-4 h-4" />,
        timeframe: 'Today',
      });
    }

    // Harvesting recommendations
    if (weather.condition === 'sunny' && weather.rainfall < 1 && weather.windSpeed < 15) {
      timings.push({
        activity: 'Harvesting',
        recommendation: 'ideal',
        reason: 'Dry conditions perfect for harvesting',
        icon: <Package className="w-4 h-4" />,
        timeframe: 'Today',
      });
    } else if (weather.condition === 'rainy' || weather.rainfall > 5) {
      timings.push({
        activity: 'Harvesting',
        recommendation: 'poor',
        reason: 'Wet conditions may damage harvested crops',
        icon: <Package className="w-4 h-4" />,
        timeframe: 'Today',
      });
    }

    // Spraying recommendations
    if (weather.windSpeed < 10 && weather.rainfall < 1 && weather.temperature.current < 28) {
      timings.push({
        activity: 'Spraying',
        recommendation: 'good',
        reason: 'Low wind and no rain - good for pesticide application',
        icon: <Wind className="w-4 h-4" />,
        timeframe: 'Today',
      });
    } else if (weather.windSpeed > 15 || weather.rainfall > 0) {
      timings.push({
        activity: 'Spraying',
        recommendation: 'avoid',
        reason: 'High wind or rain will reduce spray effectiveness',
        icon: <Wind className="w-4 h-4" />,
        timeframe: 'Today',
      });
    }

    return timings;
  }, [currentWeather, forecast, selectedDay, showAgriculturalTiming]);

  // Generate weather alerts
  const weatherAlerts = useMemo((): WeatherAlert[] => {
    if (!showAlerts) return [];

    const alerts: WeatherAlert[] = [];
    const weather = selectedDay === 0 ? currentWeather : forecast[selectedDay - 1];
    if (!weather) return [];

    // Temperature alerts
    if (weather.temperature.high > 35) {
      alerts.push({
        type: 'warning',
        title: 'High Temperature Warning',
        description: 'Extreme heat may stress crops. Ensure adequate irrigation.',
        severity: 'high',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    if (weather.temperature.low < 5) {
      alerts.push({
        type: 'warning',
        title: 'Frost Warning',
        description: 'Low temperatures may damage sensitive crops. Consider protection measures.',
        severity: 'high',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Rainfall alerts
    if (weather.rainfall > 50) {
      alerts.push({
        type: 'warning',
        title: 'Heavy Rainfall Alert',
        description: 'Excessive rainfall may cause flooding and crop damage.',
        severity: 'medium',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Wind alerts
    if (weather.windSpeed > 25) {
      alerts.push({
        type: 'advisory',
        title: 'High Wind Advisory',
        description: 'Strong winds may damage crops and make spraying ineffective.',
        severity: 'medium',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return alerts;
  }, [currentWeather, forecast, selectedDay, showAlerts]);

  const selectedWeather = selectedDay === 0 ? currentWeather : forecast[selectedDay - 1];
  const WeatherIcon = WEATHER_ICONS[selectedWeather?.condition || 'sunny'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUVIndexLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: '#10b981' };
    if (uvIndex <= 5) return { level: 'Moderate', color: '#f59e0b' };
    if (uvIndex <= 7) return { level: 'High', color: '#ef4444' };
    if (uvIndex <= 10) return { level: 'Very High', color: '#dc2626' };
    return { level: 'Extreme', color: '#7c2d12' };
  };

  return (
    <Card className={`agricultural-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-blue/10 rounded-lg flex items-center justify-center">
              <WeatherIcon className="w-5 h-5 text-sky-blue" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Weather & Agricultural Timing
              </CardTitle>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="forecast">Forecast</SelectItem>
                <SelectItem value="timing">Timing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Day selector for forecast */}
        {viewMode === 'forecast' && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <Button
              variant={selectedDay === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(0)}
              className="flex-shrink-0"
            >
              Today
            </Button>
            {forecast.slice(0, 6).map((day, index) => (
              <Button
                key={index}
                variant={selectedDay === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(index + 1)}
                className="flex-shrink-0"
              >
                {formatDate(day.date)}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {viewMode === 'current' && (
          <div className="space-y-6">
            {/* Current Weather Overview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sky-blue/10 rounded-full flex items-center justify-center">
                  <WeatherIcon className="w-8 h-8 text-sky-blue" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {currentWeather.temperature.current}°C
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentWeather.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Feels like {currentWeather.temperature.feelsLike}°C
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  H: {currentWeather.temperature.high}°C
                </p>
                <p className="text-sm text-gray-600">
                  L: {currentWeather.temperature.low}°C
                </p>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            {showDetailedMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Droplets className="w-4 h-4 text-sky-blue" />
                  <div>
                    <p className="text-sm font-medium">{currentWeather.humidity}%</p>
                    <p className="text-xs text-gray-600">Humidity</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CloudRain className="w-4 h-4 text-sky-blue" />
                  <div>
                    <p className="text-sm font-medium">{currentWeather.rainfall}mm</p>
                    <p className="text-xs text-gray-600">Rainfall</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Wind className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{currentWeather.windSpeed} km/h</p>
                    <p className="text-xs text-gray-600">{currentWeather.windDirection}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Sun className="w-4 h-4 text-sunrise-orange" />
                  <div>
                    <p className="text-sm font-medium">{currentWeather.uvIndex}</p>
                    <p className="text-xs text-gray-600">
                      {getUVIndexLevel(currentWeather.uvIndex).level}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Alerts */}
            {showAlerts && weatherAlerts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Weather Alerts
                </h4>
                {weatherAlerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg border-l-4"
                    style={{ borderLeftColor: ALERT_COLORS[alert.type] }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: SEVERITY_COLORS[alert.severity],
                          color: SEVERITY_COLORS[alert.severity]
                        }}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'forecast' && selectedWeather && (
          <div className="space-y-6">
            {/* Selected Day Weather */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sky-blue/10 rounded-full flex items-center justify-center">
                  <WeatherIcon className="w-8 h-8 text-sky-blue" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedWeather.temperature.current}°C
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedWeather.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedDay === 0 ? 'Today' : formatDate(selectedWeather.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  H: {selectedWeather.temperature.high}°C
                </p>
                <p className="text-sm text-gray-600">
                  L: {selectedWeather.temperature.low}°C
                </p>
              </div>
            </div>

            {/* 7-Day Forecast Strip */}
            <div className="grid grid-cols-7 gap-2">
              {[currentWeather, ...forecast.slice(0, 6)].map((day, index) => {
                const DayIcon = WEATHER_ICONS[day.condition];
                return (
                  <div 
                    key={index}
                    className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedDay === index ? 'bg-agricultural-primary/10' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDay(index)}
                  >
                    <p className="text-xs text-gray-600 mb-1">
                      {index === 0 ? 'Today' : formatDate(day.date)}
                    </p>
                    <DayIcon className="w-6 h-6 mx-auto mb-1 text-sky-blue" />
                    <p className="text-xs font-medium">{day.temperature.high}°</p>
                    <p className="text-xs text-gray-500">{day.temperature.low}°</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'timing' && (
          <div className="space-y-6">
            {/* Agricultural Timing Recommendations */}
            {showAgriculturalTiming && agriculturalTimings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agricultural Timing Recommendations
                </h4>
                {agriculturalTimings.map((timing, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${RECOMMENDATION_COLORS[timing.recommendation]}20` }}
                      >
                        <div style={{ color: RECOMMENDATION_COLORS[timing.recommendation] }}>
                          {timing.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{timing.activity}</p>
                        <p className="text-xs text-gray-600">{timing.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: RECOMMENDATION_COLORS[timing.recommendation],
                          color: RECOMMENDATION_COLORS[timing.recommendation]
                        }}
                      >
                        {timing.recommendation}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{timing.timeframe}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Agricultural Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-agricultural-primary/5 rounded-lg">
                <h5 className="text-sm font-medium text-agricultural-primary mb-2">
                  Growing Conditions
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Temperature Range</span>
                    <span className={
                      selectedWeather.temperature.current >= 15 && selectedWeather.temperature.current <= 30
                        ? 'text-growth-success' : 'text-caution-yellow'
                    }>
                      {selectedWeather.temperature.current >= 15 && selectedWeather.temperature.current <= 30 
                        ? 'Optimal' : 'Suboptimal'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Soil Moisture</span>
                    <span className={
                      selectedWeather.rainfall > 5 && selectedWeather.rainfall < 25
                        ? 'text-growth-success' : 'text-caution-yellow'
                    }>
                      {selectedWeather.rainfall > 5 && selectedWeather.rainfall < 25
                        ? 'Good' : selectedWeather.rainfall <= 5 ? 'Low' : 'High'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Humidity Level</span>
                    <span className={
                      selectedWeather.humidity >= 40 && selectedWeather.humidity <= 70
                        ? 'text-growth-success' : 'text-caution-yellow'
                    }>
                      {selectedWeather.humidity >= 40 && selectedWeather.humidity <= 70
                        ? 'Ideal' : selectedWeather.humidity < 40 ? 'Low' : 'High'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-earth-ochre/5 rounded-lg">
                <h5 className="text-sm font-medium text-earth-ochre mb-2">
                  Field Work Conditions
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Wind Speed</span>
                    <span className={
                      selectedWeather.windSpeed < 15 ? 'text-growth-success' : 'text-alert-red'
                    }>
                      {selectedWeather.windSpeed < 15 ? 'Suitable' : 'Too High'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Visibility</span>
                    <span className={
                      selectedWeather.visibility > 5 ? 'text-growth-success' : 'text-caution-yellow'
                    }>
                      {selectedWeather.visibility > 5 ? 'Good' : 'Limited'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>UV Exposure</span>
                    <span style={{ color: getUVIndexLevel(selectedWeather.uvIndex).color }}>
                      {getUVIndexLevel(selectedWeather.uvIndex).level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}