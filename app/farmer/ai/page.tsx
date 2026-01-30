'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  MessageSquare,
  Settings,
  AlertTriangle,
  FilePlus,
  BarChart2,
  ShoppingCart,
  User,
  Mail,
  Bell,
  Package,
  Leaf,
  Send,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { FarmerPages, UserType } from '@/types';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

const menuItems = [
  { label: 'Dashboard', href: '/farmer/dashboard', icon: LayoutGrid },
  { label: 'Products', href: '/farmer/products', icon: Package },
  { label: 'Input Request', href: '/farmer/requests', icon: FilePlus },
  { label: 'AI Tips', href: '/farmer/ai', icon: MessageSquare },
  { label: 'Market Analytics', href: '/farmer/market_analysis', icon: BarChart2 },
  { label: 'Messages', href: '/farmer/message', icon: Mail },
  { label: 'Notifications', href: '/farmer/notifications', icon: Bell },
  { label: 'Profile', href: '/farmer/profile', icon: User },
  { label: 'Orders', href: '/farmer/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/farmer/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isLogout: true },
];

const tips = [
  {
    title: 'Maize Planting Tips',
    description:
      'Get comprehensive tips on when and how to plant maize for optimal yields and healthy crop development.',
    image: '/maize-field.jpg',
    tags: ['Planting', 'Maize'],
    views: 1234,
  },
  {
    title: 'Maize Planting Tips',
    description:
      'Get comprehensive tips on when and how to plant maize for optimal yields and healthy crop development.',
    image: '/maize-field.jpg',
    tags: ['Planting', 'Maize'],
    views: 1234,
  },
  {
    title: 'Maize Planting Tips',
    description:
      'Get comprehensive tips on when and how to plant maize for optimal yields and healthy crop development.',
    image: '/maize-field.jpg',
    tags: ['Planting', 'Maize'],
    views: 1234,
  },
  {
    title: 'Maize Planting Tips',
    description:
      'Get comprehensive tips on when and how to plant maize for optimal yields and healthy crop development.',
    image: '/maize-field.jpg',
    tags: ['Planting', 'Maize'],
    views: 1234,
  },
];

const Logo = () => (
  <div className="flex items-center px-6 py-4">
    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
      <Leaf className="w-5 h-5 text-green-600" />
    </div>
    <span className="font-bold text-xl text-white">UmuhinziLink</span>
  </div>
);

function AiDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    logout();
    setLoading(false)
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userType={UserType.FARMER}
        activeItem='AI Tips' />


      {/* Main Content */}
      <main className="flex-1  bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">AI Tips</h1>
        </header>

        <div className="p-6">
          {/* Weather Alert */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl p-6 mb-8 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <span className="font-semibold">Urgent Weather Alert</span>
                <p className="text-sm opacity-90 mt-1">
                  Heavy rainfall expected in the next 3 days. Prepare your crops and watch out for
                  pests.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Now</div>
              <div className="font-bold">15:30</div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Suggested AI Tips</h2>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Ask AI Assistant</span>
                </div>
              </div>

              {/* Tips Grid */}
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {tip.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{tip.views} views</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar - AI Assistant */}
            <div className="w-80">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-gray-900">Ask AI Assistant</span>
                </div>

                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  <div className="text-sm text-gray-600">
                    Hi! I&apos;m your AI farming assistant. Ask me anything about farming, crops, or
                    agricultural best practices.
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">You</div>
                    <div className="text-sm">How do I prepare soil for maize planting?</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">AI Assistant</div>
                    <div className="text-sm">
                      For maize planting, start by testing your soil pH (should be 6.0-7.0). Clear
                      weeds, till the soil to 20-25cm depth, and add organic matter like compost.
                      Ensure good drainage and apply recommended fertilizers based on soil test
                      results.
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AiDashboardPage() {
  return (
    <FarmerGuard>
      <AiDashboard />
    </FarmerGuard>
  );
}
