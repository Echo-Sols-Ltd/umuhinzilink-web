'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Ban,
  CheckCircle,
  Edit,
  Shield,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { AdminPages, UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { useToast } from '@/components/ui/use-toast-new';
import { adminService } from '@/services/admin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenuItem {
  label: string;
  href: string;
  icon: any;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Orders', href: '/admin/orders', icon: ArrowUpDown },
  { label: 'Notifications', href: '/admin/reports', icon: Bell },
];

const MENU_ITEMS_BOTTOM: MenuItem[] = [
  { label: 'Profile', href: '/admin/settings', icon: UserIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

function UserManagement() {
  const { users, loading, deleteUser, refreshUsers } = useAdmin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredUsers =
    users?.filter(user => {
      const matchesSearch =
        user.names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'verified' && user.verified) ||
        (statusFilter === 'pending' && !user.verified);

      return matchesSearch && matchesRole && matchesStatus;
    }) || [];

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    setActionLoading(userId);
    try {
      await adminService.toggleUserStatus(userId, suspend);
      await refreshUsers();
      toast({
        title: 'Success',
        description: `User ${suspend ? 'suspended' : 'activated'} successfully`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${suspend ? 'suspend' : 'activate'} user`,
        variant: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      await refreshUsers();
      toast({
        title: 'Success',
        description: 'User role updated successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(userId);
    try {
      await deleteUser(userId);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const user = await adminService.getUserById(userId);
      setSelectedUser(user);
      setShowUserModal(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Green */}
      <Sidebar
        userType={UserType.ADMIN}
        activeItem='Users'
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - White with Search and Filters */}
        <header className="bg-white border-b h-16 flex items-center px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 max-w-md mr-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="BUYER">Buyer</SelectItem>
                <SelectItem value="SUPPLIER">Supplier</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
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
                      Profile
                    </th>
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
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(usersItem => (
                      <tr key={usersItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {usersItem.avatar ? (
                              <img
                                src={usersItem.avatar}
                                alt={`${usersItem.names}'s profile`}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                                {usersItem.names.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Select
                            value={usersItem.role}
                            onValueChange={(newRole) => handleUpdateRole(usersItem.id, newRole)}
                            disabled={actionLoading === usersItem.id}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FARMER">Farmer</SelectItem>
                              <SelectItem value="BUYER">Buyer</SelectItem>
                              <SelectItem value="SUPPLIER">Supplier</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {usersItem.names}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usersItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usersItem.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${usersItem.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              {usersItem.verified ? 'Verified' : 'Pending'}
                            </span>
                            {(usersItem as any).suspended && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Suspended
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewUser(usersItem.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleSuspendUser(usersItem.id, !(usersItem as any).suspended)}
                              disabled={actionLoading === usersItem.id}
                              className={`p-1 rounded ${(usersItem as any).suspended
                                ? 'text-green-600 hover:text-green-800'
                                : 'text-orange-600 hover:text-orange-800'
                                }`}
                              title={(usersItem as any).suspended ? 'Activate User' : 'Suspend User'}
                            >
                              {actionLoading === usersItem.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (usersItem as any).suspended ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(usersItem.id)}
                              disabled={actionLoading === usersItem.id}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Delete User"
                            >
                              {actionLoading === usersItem.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={`${selectedUser.names}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-lg font-medium">
                        {selectedUser.names.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.names}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        selectedUser.role === 'FARMER' ? 'bg-green-100 text-green-800' :
                          selectedUser.role === 'BUYER' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                        }`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${selectedUser.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {selectedUser.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Joined</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {(selectedUser as any).suspended ? 'Suspended' : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleSuspendUser(selectedUser.id, !(selectedUser as any).suspended);
                      setShowUserModal(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${(selectedUser as any).suspended
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                  >
                    {(selectedUser as any).suspended ? 'Activate User' : 'Suspend User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
