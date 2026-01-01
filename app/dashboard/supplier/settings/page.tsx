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

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

const menuItems = [
  { label: 'Dashboard', href: '/supplier_dashboard', icon: CheckCircle },
  { label: 'My Products', href: '/supplier_dashboard/products', icon: Package },
  { label: 'Requests', href: '/supplier_dashboard/requests', icon: FilePlus },
  { label: 'Orders', href: '/supplier_dashboard/orders', icon: ShoppingCart },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/supplier_dashboard/profile', icon: User },
  { label: 'Contact', href: '/supplier_dashboard/contact', icon: Mail },
  { label: 'Settings', href: '/supplier_dashboard/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
];

export default function SupplierSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-8 shadow-sm">
        <Logo />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6"></div>
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((m, index) => {
              const isActive = m.label === 'Settings';
              const showDivider = index === 4 || index === 8;
              return (
                <div key={m.label}>
                  <Link href={m.href} className="block">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-green-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <m.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
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
        <main className="flex-1 ml-64 p-8">
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
    </div>
  );
}
