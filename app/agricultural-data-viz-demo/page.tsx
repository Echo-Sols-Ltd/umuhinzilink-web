'use client';

import React from 'react';
import { 
  CropYieldChart, 
  PriceTrendChart, 
  WeatherWidget, 
  RwandaRegionalMap,
  type CropYieldData,
  type PriceData,
  type WeatherData,
  type RegionalData,
} from '@/components/agricultural';

// Sample data for demonstrations
const sampleCropYieldData: CropYieldData[] = [
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
  {
    month: 'Apr 2024',
    yield: 200,
    expectedYield: 180,
    rainfall: 85,
    temperature: 21,
    season: 'harvesting',
    cropType: 'Maize',
    year: 2024,
  },
  {
    month: 'May 2024',
    yield: 95,
    expectedYield: 120,
    rainfall: 25,
    temperature: 20,
    season: 'dormant',
    cropType: 'Maize',
    year: 2024,
  },
  {
    month: 'Jun 2024',
    yield: 80,
    expectedYield: 90,
    rainfall: 15,
    temperature: 19,
    season: 'planting',
    cropType: 'Maize',
    year: 2024,
  },
];

const samplePriceData: PriceData[] = [
  {
    date: '2024-01-01',
    price: 450,
    volume: 1200,
    marketPrice: 420,
    highPrice: 480,
    lowPrice: 400,
    volatility: 8.5,
    product: 'Maize',
    market: 'Kigali Central Market',
    currency: 'RWF',
  },
  {
    date: '2024-01-15',
    price: 475,
    volume: 1350,
    marketPrice: 440,
    highPrice: 500,
    lowPrice: 430,
    volatility: 12.3,
    product: 'Maize',
    market: 'Kigali Central Market',
    currency: 'RWF',
  },
  {
    date: '2024-02-01',
    price: 520,
    volume: 980,
    marketPrice: 510,
    highPrice: 550,
    lowPrice: 480,
    volatility: 15.7,
    product: 'Maize',
    market: 'Kigali Central Market',
    currency: 'RWF',
  },
  {
    date: '2024-02-15',
    price: 495,
    volume: 1100,
    marketPrice: 485,
    highPrice: 520,
    lowPrice: 460,
    volatility: 11.2,
    product: 'Maize',
    market: 'Kigali Central Market',
    currency: 'RWF',
  },
  {
    date: '2024-03-01',
    price: 510,
    volume: 1250,
    marketPrice: 500,
    highPrice: 535,
    lowPrice: 485,
    volatility: 9.8,
    product: 'Maize',
    market: 'Kigali Central Market',
    currency: 'RWF',
  },
];

const sampleWeatherData: WeatherData = {
  date: new Date().toISOString(),
  temperature: {
    current: 24,
    high: 28,
    low: 18,
    feelsLike: 26,
  },
  humidity: 65,
  rainfall: 12,
  windSpeed: 8,
  windDirection: 'NE',
  visibility: 10,
  uvIndex: 6,
  pressure: 1013,
  condition: 'cloudy',
  description: 'Partly cloudy with light rain',
};

const sampleForecast: WeatherData[] = [
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    temperature: { current: 26, high: 30, low: 20, feelsLike: 28 },
    humidity: 58, rainfall: 5, windSpeed: 12, windDirection: 'E',
    visibility: 12, uvIndex: 7, pressure: 1015, condition: 'sunny',
    description: 'Sunny with light breeze',
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    temperature: { current: 22, high: 25, low: 16, feelsLike: 24 },
    humidity: 75, rainfall: 25, windSpeed: 15, windDirection: 'SW',
    visibility: 8, uvIndex: 4, pressure: 1008, condition: 'rainy',
    description: 'Heavy rain expected',
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    temperature: { current: 25, high: 29, low: 19, feelsLike: 27 },
    humidity: 62, rainfall: 2, windSpeed: 6, windDirection: 'N',
    visibility: 15, uvIndex: 8, pressure: 1018, condition: 'sunny',
    description: 'Clear and sunny',
  },
];

const sampleRegionalData: RegionalData[] = [
  {
    province: 'Kigali',
    district: 'Gasabo',
    coordinates: { lat: -1.9441, lng: 30.0619 },
    metrics: {
      totalFarmers: 1250,
      totalBuyers: 890,
      totalProducts: 3400,
      totalRevenue: 45000000,
      averagePrice: 485,
      topCrops: ['Maize', 'Beans', 'Tomatoes'],
      growthRate: 12.5,
    },
    demographics: {
      population: 530000,
      ruralPercentage: 25,
      averageIncome: 180000,
    },
    infrastructure: {
      marketAccess: 'high',
      internetCoverage: 85,
      roadQuality: 'good',
    },
  },
  {
    province: 'Eastern',
    district: 'Kayonza',
    coordinates: { lat: -2.0000, lng: 30.5000 },
    metrics: {
      totalFarmers: 2100,
      totalBuyers: 450,
      totalProducts: 5200,
      totalRevenue: 38000000,
      averagePrice: 420,
      topCrops: ['Rice', 'Maize', 'Bananas'],
      growthRate: 8.3,
    },
    demographics: {
      population: 344000,
      ruralPercentage: 78,
      averageIncome: 95000,
    },
    infrastructure: {
      marketAccess: 'medium',
      internetCoverage: 45,
      roadQuality: 'fair',
    },
  },
  {
    province: 'Northern',
    district: 'Musanze',
    coordinates: { lat: -1.5000, lng: 29.8000 },
    metrics: {
      totalFarmers: 1800,
      totalBuyers: 320,
      totalProducts: 4100,
      totalRevenue: 32000000,
      averagePrice: 395,
      topCrops: ['Potatoes', 'Wheat', 'Vegetables'],
      growthRate: 15.7,
    },
    demographics: {
      population: 368000,
      ruralPercentage: 85,
      averageIncome: 87000,
    },
    infrastructure: {
      marketAccess: 'medium',
      internetCoverage: 38,
      roadQuality: 'fair',
    },
  },
  {
    province: 'Southern',
    district: 'Huye',
    coordinates: { lat: -2.5000, lng: 29.7000 },
    metrics: {
      totalFarmers: 1650,
      totalBuyers: 280,
      totalProducts: 3800,
      totalRevenue: 28000000,
      averagePrice: 375,
      topCrops: ['Coffee', 'Bananas', 'Beans'],
      growthRate: 6.2,
    },
    demographics: {
      population: 381000,
      ruralPercentage: 82,
      averageIncome: 78000,
    },
    infrastructure: {
      marketAccess: 'medium',
      internetCoverage: 42,
      roadQuality: 'good',
    },
  },
  {
    province: 'Western',
    district: 'Karongi',
    coordinates: { lat: -2.2000, lng: 29.2000 },
    metrics: {
      totalFarmers: 1950,
      totalBuyers: 380,
      totalProducts: 4600,
      totalRevenue: 35000000,
      averagePrice: 410,
      topCrops: ['Tea', 'Maize', 'Sweet Potatoes'],
      growthRate: 9.8,
    },
    demographics: {
      population: 331000,
      ruralPercentage: 88,
      averageIncome: 82000,
    },
    infrastructure: {
      marketAccess: 'low',
      internetCoverage: 28,
      roadQuality: 'poor',
    },
  },
];

export default function AgriculturalDataVizDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Agricultural Data Visualization Components
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive data visualization components designed specifically for agricultural workflows, 
            featuring crop yield analysis, price trend monitoring, weather integration, and regional mapping 
            for Rwanda's agricultural landscape.
          </p>
        </div>

        {/* Crop Yield Chart */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Crop Yield Analysis
            </h2>
            <p className="text-gray-600">
              Seasonal pattern visualization with yield performance tracking and agricultural timing insights.
            </p>
          </div>
          <CropYieldChart
            data={sampleCropYieldData}
            cropType="Maize"
            showSeasonalPatterns={true}
            showWeatherData={true}
            showComparison={true}
          />
        </section>

        {/* Price Trend Chart */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Price Trend Analysis
            </h2>
            <p className="text-gray-600">
              Market fluctuation displays with price performance tracking and volatility analysis.
            </p>
          </div>
          <PriceTrendChart
            data={samplePriceData}
            productName="Maize"
            showVolume={true}
            showMarketComparison={true}
            showFluctuations={true}
          />
        </section>

        {/* Weather Widget */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Weather Integration Widget
            </h2>
            <p className="text-gray-600">
              Agricultural timing recommendations with weather data integration and farming activity guidance.
            </p>
          </div>
          <WeatherWidget
            currentWeather={sampleWeatherData}
            forecast={sampleForecast}
            location="Kigali, Rwanda"
            showAgriculturalTiming={true}
            showAlerts={true}
            showDetailedMetrics={true}
          />
        </section>

        {/* Regional Map */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Rwanda Regional Analysis
            </h2>
            <p className="text-gray-600">
              Map-based visualizations for Rwandan geography with agricultural data distribution and regional insights.
            </p>
          </div>
          <RwandaRegionalMap
            data={sampleRegionalData}
            selectedMetric="farmers"
            showProvinces={true}
            showDistricts={true}
            showInfrastructure={true}
          />
        </section>

        {/* Features Overview */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Component Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-agricultural-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-agricultural-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Crop Yield Charts</h3>
              <p className="text-sm text-gray-600">
                Seasonal pattern visualization with yield vs expected comparisons and weather correlation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-earth-ochre/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-earth-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Price Trends</h3>
              <p className="text-sm text-gray-600">
                Market fluctuation displays with volatility analysis and price prediction insights.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-sky-blue/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Weather Integration</h3>
              <p className="text-sm text-gray-600">
                Agricultural timing recommendations with weather alerts and farming activity guidance.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-harvest-gold/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-harvest-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Regional Mapping</h3>
              <p className="text-sm text-gray-600">
                Rwanda-specific geographic visualizations with provincial and district-level agricultural data.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="bg-agricultural-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Technical Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-agricultural-primary">Agricultural Theme</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Earth-tone color palette</li>
                <li>• Agricultural iconography</li>
                <li>• Seasonal pattern recognition</li>
                <li>• Farming-specific metrics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-agricultural-primary">Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time data updates</li>
                <li>• Export functionality (CSV/JSON)</li>
                <li>• Responsive design</li>
                <li>• Touch-optimized controls</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-agricultural-primary">Rural Optimization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-first design</li>
                <li>• Low-bandwidth friendly</li>
                <li>• High contrast readability</li>
                <li>• Offline capability indicators</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}