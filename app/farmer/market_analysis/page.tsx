'use client';
import React from 'react';

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

const menuItems = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: CheckCircle },
  { label: 'My Products', href: '/farmer/dashboard/products', icon: LayoutGrid },
  { label: 'Input Request', href: '/farmer/dashboard/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/farmer/dashboard/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/farmer/dashboard/market_analysis', icon: BarChart2 },
  { label: 'Message', href: '/farmer/dashboard/message', icon: Mail },
  { label: 'Orders', href: '/farmer/dashboard/orders', icon: ShoppingCart },
  { label: 'Profile', href: '/farmer/dashboard/profile', icon: User },
  { label: 'Contact', href: '/farmer/dashboard/contact', icon: Phone },
  { label: 'Settings', href: '/farmer/dashboard/settings', icon: Settings },
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
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-[#00A63E] text-white border-r flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6"></div>
          <nav className="flex-1 px-4 space-y-2 ">
            {menuItems.map((m, index) => {
              const isActive = m.label === 'Market Analytics';
              const showDivider = index === 4 || index === 8;
              return (
                <div key={m.label}>
                  <Link href={m.href} className="block">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${isActive
                        ? 'bg-white text-green-500 shadow-sm'
                        : 'text-white hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <m.icon className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-white'}`} />
                      <span>{m.label}</span>
                    </div>
                  </Link>
                  {showDivider && <div className="border-t border-gray-200 my-2 mx-4"></div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto ml-64 space-y-6 bg-gray-50">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            <select className="border border-gray-300 rounded-lg py-2 px- text-sm bg-white text-gray-700 cursor-pointer">
              <option>All Crops</option>
              <option>Maize</option>
              <option>Beans</option>
              <option>Bananas</option>
            </select>
            <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white text-gray-700 cursor-pointer">
              <option>All Regions</option>
              <option>Kigali City</option>
              <option>Huye District</option>
              <option>Musanze District</option>
            </select>
            <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white text-gray-700 cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          {/* Price Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Price Trends</h2>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Buyers</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                  <span>Buyer</span>
                  <span>Location</span>
                  <span>Crop Interest</span>
                  <span>Offer Price</span>
                </div>
                {topBuyers.map(buyer => (
                  <div
                    key={buyer.name}
                    className="grid grid-cols-4 gap-4  items-center py-3 border-b border-gray-900 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${buyer.color} flex items-center justify-center`}
                      >
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{buyer.name}</span>
                    </div>
                    <span className="text-gray-600">{buyer.location}</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      {buyer.cropInterest}
                    </span>
                    <span className="font-semibold text-green-600">{buyer.offerPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Demand Overview</h2>
              <div className="space-y-4">
                {demandOverview.map(item => (
                  <div
                    key={item.crop}
                    className={`flex items-center justify-between p-4 rounded-lg ${item.bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white shadow-sm">
                        <item.icon className={`w-4 h-4 ${item.textColor}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.status}</div>
                        <div className="text-sm text-gray-600">{item.crop}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.textColor}`}>{item.change}</span>
                      {item.color === 'green' && <ArrowUp className="w-4 h-4 text-green-600" />}
                      {item.color === 'yellow' && (
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                      )}
                      {item.color === 'red' && <ArrowDown className="w-4 h-4 text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Best Time to Sell</span>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Based on current trends, the optimal selling window for your maize is in the next
                  2-3 weeks.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Star className="w-3 h-3" />
                  <span>Confidence: 85%</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900">Best Market</span>
                </div>
                <p className="text-sm text-green-800 mb-3">
                  Kigali Agro Market offers the highest prices for maize currently at 450 RWF/kg.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600">
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

export default Dashboard;
