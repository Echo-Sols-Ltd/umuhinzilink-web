'use client';
import React, { useState } from 'react';

import {
  LayoutGrid,
  FilePlus,
  BarChart2,
  MessageSquare,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Filter,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  MapPin,
  Star,
  CheckCircle,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Sidebar from '@/components/shared/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { FarmerPages, UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

const menuItems = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: CheckCircle },
  { label: 'My Products', href: '/farmer/products', icon: LayoutGrid },
  { label: 'Input Request', href: '/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/farmer/market_analysis', icon: BarChart2 },
  { label: 'Message', href: '/chat', icon: Mail },
  { label: 'Orders', href: '/farmer/orders', icon: ShoppingCart },
  { label: 'Profile', href: '/farmer/profile', icon: User },
  { label: 'Contact', href: '/farmercontact', icon: Phone },
  { label: 'Settings', href: '/farmer/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
];

const topBuyers = [
  {
    name: 'Kigali Agro Market',
    location: 'Kigali City',
    cropInterest: 'Maize',
    offerPrice: '450 RWF/kg',
    icon: '🏢',
    color: 'bg-blue-100',
  },
  {
    name: 'Rwanda Export Co.',
    location: 'Huye District',
    cropInterest: 'Beans',
    offerPrice: '800 RWF/kg',
    icon: '🌱',
    color: 'bg-green-100',
  },
  {
    name: 'Fresh Produce Ltd.',
    location: 'Musanze District',
    cropInterest: 'Bananas',
    offerPrice: '300 RWF/kg',
    icon: '🍌',
    color: 'bg-orange-100',
  },
];

const demandOverview = [
  {
    crop: 'Beans',
    status: 'High Demand',
    change: '+25%',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: ArrowUp,
  },
  {
    crop: 'Maize',
    status: 'Trending',
    change: '+12%',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: TrendingUp,
  },
  {
    crop: 'Bananas',
    status: 'Low Demand',
    change: '-8%',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: ArrowDown,
  },
];

const priceData = [
  { month: 'Jan', price: 250000 },
  { month: 'Feb', price: 230000 },
  { month: 'Mar', price: 200000 },
  { month: 'Apr', price: 220000 },
  { month: 'May', price: 260000 },
  { month: 'Jun', price: 280000 },
  { month: 'Jul', price: 300000 },
  { month: 'Aug', price: 320000 },
  { month: 'Sep', price: 310000 },
  { month: 'Oct', price: 330000 },
  { month: 'Nov', price: 340000 },
  { month: 'Dec', price: 360000 },
];

const Logo = () => (
  <span className="font-extrabold text-2xl ">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function MarketAnalysis() {
  const { logout } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false)

  const handleLogout = () => {
    setLogoutPending(true)
    logout()
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-white">


      <div className="flex flex-1 h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          userType={UserType.FARMER}
          activeItem='Market Intelligence'
        />


        {/* Main Content */}
        <main className="flex-1 h-screen p-6 space-y-6 bg-background overflow-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Filters:</span>
            </div>
            <select className="border border-border rounded-lg py-2 px-3 text-sm bg-card text-foreground cursor-pointer">
              <option>All Crops</option>
              <option>Maize</option>
              <option>Beans</option>
              <option>Bananas</option>
            </select>
            <select className="border border-border rounded-lg py-2 px-3 text-sm bg-card text-foreground cursor-pointer">
              <option>All Regions</option>
              <option>Kigali City</option>
              <option>Huye District</option>
              <option>Musanze District</option>
            </select>
            <select className="border border-border rounded-lg py-2 px-3 text-sm bg-card text-foreground cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          {/* Price Trends */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Price Trends</h2>
              <div className="flex items-center gap-2 text-sm text-success font-medium">
                <ArrowUp className="w-4 h-4" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
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
                    tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#10b981',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '6px 10px',
                    }}
                    formatter={(value) => [`${value?.toLocaleString() || '0'}`, 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                    dot={{ r: 4, fill: '#10b981' }}
                    activeDot={{ r: 5, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Buyers and Demand Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Buyers */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Top Buyers</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <span>Buyer</span>
                  <span>Location</span>
                  <span>Crop Interest</span>
                  <span>Offer Price</span>
                </div>
                {topBuyers.map(buyer => (
                  <div
                    key={buyer.name}
                    className="grid grid-cols-4 gap-4  items-center py-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${buyer.color} flex items-center justify-center`}
                      >
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-foreground">{buyer.name}</span>
                    </div>
                    <span className="text-muted-foreground">{buyer.location}</span>
                    <span className="px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium">
                      {buyer.cropInterest}
                    </span>
                    <span className="font-semibold text-success">{buyer.offerPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Overview */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Demand Overview</h2>
              <div className="space-y-4">
                {demandOverview.map(item => (
                  <div
                    key={item.crop}
                    className={`flex items-center justify-between p-4 rounded-lg ${item.bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-card shadow-sm">
                        <item.icon className={`w-4 h-4 ${item.textColor}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{item.status}</div>
                        <div className="text-sm text-muted-foreground">{item.crop}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${item.textColor}`}>{item.change}</span>
                      {item.color === 'green' && <ArrowUp className="w-4 h-4 text-success" />}
                      {item.color === 'yellow' && (
                        <TrendingUp className="w-4 h-4 text-warning" />
                      )}
                      {item.color === 'red' && <ArrowDown className="w-4 h-4 text-destructive" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-info/10 rounded flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-info" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-info" />
                  <span className="font-semibold text-foreground">Best Time to Sell</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on current trends, the optimal selling window for your maize is in the next
                  2-3 weeks.
                </p>
                <div className="flex items-center gap-2 text-xs text-info">
                  <Star className="w-3 h-3" />
                  <span>Confidence: 85%</span>
                </div>
              </div>
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-success" />
                  <span className="font-semibold text-foreground">Best Market</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Kigali Agro Market offers the highest prices for maize currently at 450 RWF/kg.
                </p>
                <div className="flex items-center gap-2 text-xs text-success">
                  <MapPin className="w-3 h-3" />
                  <span>Distance: 25km from you</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function MarketAnalysisPage() {
  return (
    <FarmerGuard>
      <MarketAnalysis />
    </FarmerGuard>
  );
}
