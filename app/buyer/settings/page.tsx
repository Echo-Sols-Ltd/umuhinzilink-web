'use client';
import Link from 'next/link';
import {
  Mail,
  LayoutGrid,
  FilePlus,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  User,
  Bell,
  Lock,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/shared/Sidebar';
import { BuyerPages, UserType } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);


function BuyerSettingsPageComponent() {
  const router = useRouter();
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {

  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          userType={UserType.BUYER}
          activeItem='Settings'
        />
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto h-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-green-600 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="+250 788 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Kigali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Gasabo"
                />
              </div>

              <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Save Changes
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="text-green-600 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Update Password
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-green-600 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <input type="checkbox" className="toggle-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">SMS Notifications</span>
                <input type="checkbox" className="toggle-checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Order Updates</span>
                <input type="checkbox" className="toggle-checkbox" />
              </label>
            </div>
          </div>
        </main>
    </div>
  );
}

export default function BuyerSettingsPage() {
  return (
    <BuyerGuard>
      <BuyerSettingsPageComponent />
    </BuyerGuard>
  );
}
