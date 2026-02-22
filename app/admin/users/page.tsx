'use client';

import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import Sidebar from '@/components/shared/Sidebar';
import { AdminPages, User, UserType } from '@/types';
import AdminGuard from '@/contexts/guard/AdminGuard';
import { useToast } from '@/components/ui/use-toast';
import { adminService } from '@/services/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { imageUrl } from '@/lib/utils';

function UserManagement() {
  const { deleteUser } = useAdmin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users with pagination
  const fetchUsers = async (page = currentPage) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(page, pageSize);
      setUsers(response.data || []);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalElements);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount and when page changes
  React.useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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
      await fetchUsers(currentPage);
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
      await fetchUsers(currentPage);
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
      await fetchUsers(currentPage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar userType={UserType.ADMIN} activeItem="Users" />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
            <p className="text-xs text-gray-500">Manage and monitor all platform members</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 rounded-lg border border-gray-300">
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
                <SelectTrigger className="w-32 rounded-lg border border-gray-300">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => fetchUsers(currentPage)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Directory</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage and monitor all platform members</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100">
                  <span className="text-xs font-bold text-green-700">
                    {totalUsers} Member{totalUsers !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => fetchUsers(currentPage)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PROFILE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>CONTACT INFO</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(usersItem => (
                    <TableRow key={usersItem.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            {usersItem.avatar ? (
                              <img src={imageUrl(usersItem.avatar)} alt={usersItem.names} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                                {usersItem.names.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 leading-tight">{usersItem.names}</span>
                            <span className="text-[11px] text-gray-400">{usersItem.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant={usersItem.verified ? 'success' : 'warning'} className="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                            {usersItem.verified ? 'Verified' : 'Pending'}
                          </Badge>
                          {(usersItem as any).suspended && (
                            <Badge variant="destructive" className="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5">
                              Suspended
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px]">
                          <Select
                            value={usersItem.role}
                            onValueChange={(newRole) => handleUpdateRole(usersItem.id, newRole)}
                            disabled={actionLoading === usersItem.id}
                          >
                            <SelectTrigger className="h-8 text-[11px] font-bold uppercase tracking-tight bg-gray-50/50 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FARMER">Farmer</SelectItem>
                              <SelectItem value="BUYER">Buyer</SelectItem>
                              <SelectItem value="SUPPLIER">Supplier</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-medium">{usersItem.phoneNumber || '—'}</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Primary Contact</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 transition-all">
                          <button
                            onClick={() => handleViewUser(usersItem)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendUser(usersItem.id, !(usersItem as any).suspended)}
                            disabled={actionLoading === usersItem.id}
                            className={`p-2 rounded-lg transition-all ${(usersItem as any).suspended
                              ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                              }`}
                          >
                            {actionLoading === usersItem.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (usersItem as any).suspended ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usersItem.id)}
                            disabled={actionLoading === usersItem.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Users className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg font-medium">No users match your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 0 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <div className="text-sm text-gray-500 font-medium">
                  Page <span className="text-gray-900">{currentPage + 1}</span> of <span className="text-gray-900">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || loading}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i).map(pageNum => {
                      const showPage =
                        pageNum === 0 ||
                        pageNum === totalPages - 1 ||
                        Math.abs(pageNum - currentPage) <= 1;

                      if (!showPage) {
                        if ((pageNum === 1 && currentPage > 2) || (pageNum === totalPages - 2 && currentPage < totalPages - 3)) {
                          return <span key={pageNum} className="px-2 text-gray-300">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${pageNum === currentPage
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1 || loading}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="relative h-24 bg-linear-to-r from-green-500 to-emerald-600">
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.names} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedUser.names.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedUser.names}</h3>
                  <p className="text-gray-500 font-medium">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Phone</p>
                    <p className="text-sm font-semibold text-gray-700">{selectedUser.phoneNumber || 'Not linked'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Joined</p>
                    <p className="text-sm font-semibold text-gray-700">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={selectedUser.verified ? 'success' : 'warning'} className="font-bold">
                    {selectedUser.verified ? 'Verified Account' : 'Pending Verification'}
                  </Badge>
                  {(selectedUser as any).suspended && (
                    <Badge variant="destructive" className="font-bold">Suspended</Badge>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => handleSuspendUser(selectedUser.id, !(selectedUser as any).suspended)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${(selectedUser as any).suspended
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200'
                      : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-200'
                      }`}
                  >
                    {(selectedUser as any).suspended ? 'Reactivate Account' : 'Suspend Account'}
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Close
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
