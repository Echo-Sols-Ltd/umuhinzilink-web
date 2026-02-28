'use client';
import Link from 'next/link';
import {
  Mail,
  FilePlus,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  User,
  Bell,
  Lock,
  Package,
} from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { SupplierPages, UserType } from '@/types';
import SupplierGuard from '@/contexts/guard/SupplierGuard';


function SupplierSettingsPageComponent() {
  const [logoutPending, setLogoutPending] = useState(false);

  const handleLogout = async () => {
    // Handle logout logic
  };
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        userType={UserType.SUPPLIER}
        activeItem='Settings'
      />

      {/* Main Content */}
      <main className="flex-1 p-6 h-full overflow-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">First Name</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Last Name</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Phone</label>
              <input
                type="tel"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="+250 788 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">District</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="Kigali"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Sector</label>
              <input
                type="text"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
                placeholder="Gasabo"
              />
            </div>

            <button className="mt-3 bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90">
              Save Changes
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-card rounded-lg shadow-sm border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-success w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Current Password</label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">New Password</label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                className="mt-1 w-full border border-border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-success/50"
              />
            </div>

            <button className="mt-3 bg-success text-white px-4 py-2 rounded-lg hover:bg-success/90">
              Update Password
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-success w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">Dark Mode</label>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted">
                <span className="inline-block h-4 w-4 transform rounded-full bg-card transition-transform translate-x-1"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">Language</label>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
              <select className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-success focus:border-success">
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Notifications */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-success w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-foreground">Email Notifications</span>
                <p className="text-xs text-muted-foreground">Order updates and promotions</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-foreground">SMS Notifications</span>
                <p className="text-xs text-muted-foreground">Critical alerts via SMS</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-foreground">Order Updates</span>
                <p className="text-xs text-muted-foreground">Real-time order status</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-foreground">Price Alerts</span>
                <p className="text-xs text-muted-foreground">Product price changes</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-foreground">Marketing Emails</span>
                <p className="text-xs text-muted-foreground">Promotions and news</p>
              </div>
              <input type="checkbox" className="toggle-checkbox" />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SupplierSettingsPage() {
  return (
    <SupplierGuard>
      <SupplierSettingsPageComponent />
    </SupplierGuard>
  );
}
