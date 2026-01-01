'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  LayoutGrid,
  ArrowUpDown,
  Bell,
  User as UserIcon,
  Settings,
  Menu,
  X,
  Eye,
  Trash2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  label: string;
  href: string;
  icon: any;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutGrid },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Payments', href: '/dashboard/admin/orders', icon: ArrowUpDown },
  { label: 'Notifications', href: '/dashboard/admin/reports', icon: Bell },
];

const MENU_ITEMS_BOTTOM: MenuItem[] = [
  { label: 'Profile', href: '/dashboard/admin/settings', icon: UserIcon },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function UserManagement() {
  const { users, loading, deleteUser, refreshUsers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredUsers =
    users?.filter(
      user =>
        user.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Green */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">UmuhinziLink</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU_ITEMS.map(item => {
            const isActive = item.label === 'Users';
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white text-green-600' : 'text-white hover:bg-green-700'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-green-500 my-4"></div>

          {MENU_ITEMS_BOTTOM.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-green-700"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - White with Search */}
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-6">
          {/* Users Table */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Users</h2>
              <button
                onClick={refreshUsers}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.names}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {user.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            <button className="text-green-600 hover:text-green-800 flex items-center gap-1">
                              <Eye className="w-4 h-4" /> View
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <AdminGuard>
      <UserManagement />
    </AdminGuard>
  );
}
