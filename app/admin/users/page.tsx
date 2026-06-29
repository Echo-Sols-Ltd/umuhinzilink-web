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
} from '@/lib/icons';
import { useAdmin } from '@/contexts/AdminContext';
import { useI18n } from '@/contexts/I18nContext';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import { AdminPages, User, UserRole } from '@/types';
import { notify } from '@/lib/notify';
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

const isSuspended = (user: User) => user.active === false;

function UserManagement() {
  const { deleteUser } = useAdmin();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
      notify.error(t('admin.users.toasts.fetchFailed'), t('common.error'));
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
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'verified' && user.emailVerified) ||
        (statusFilter === 'pending' && !user.emailVerified);

      return matchesSearch && matchesRole && matchesStatus;
    }) || [];

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    setActionLoading(userId);
    try {
      await adminService.toggleUserStatus(userId, suspend);
      await fetchUsers(currentPage);
      notify.success(suspend ? t('admin.users.toasts.userSuspended') : t('admin.users.toasts.userActivated'), t('common.success'));
    } catch (error) {
      notify.error(suspend ? t('admin.users.toasts.suspendFailed') : t('admin.users.toasts.activateFailed'), t('common.error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      await fetchUsers(currentPage);
      notify.success(t('admin.users.toasts.roleUpdated'), t('common.success'));
    } catch (error) {
      notify.error(t('admin.users.toasts.roleUpdateFailed'), t('common.error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('admin.users.confirmDelete'))) {
      return;
    }

    setActionLoading(userId);
    try {
      await deleteUser(userId);
      await fetchUsers(currentPage);
    } catch (error) {
      notify.error(t('admin.users.toasts.deleteFailed'), t('common.error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <>
      <AdminPageHeader
          title="User Management"
          description="Manage and monitor all platform members"
          toolbar={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('admin.users.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-success"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32 rounded-lg border border-border">
                    <SelectValue placeholder={t('admin.users.filters.allRoles')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.users.filters.allRoles')}</SelectItem>
                    <SelectItem value="FARMER">{t('auth.accountTypes.farmer')}</SelectItem>
                    <SelectItem value="BUYER">{t('auth.accountTypes.buyer')}</SelectItem>
                    <SelectItem value="SUPPLIER">{t('auth.accountTypes.supplier')}</SelectItem>
                    <SelectItem value="ADMIN">{t('nav.roles.admin')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 rounded-lg border border-border">
                    <SelectValue placeholder={t('admin.users.filters.allStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.users.filters.allStatus')}</SelectItem>
                    <SelectItem value="verified">{t('admin.users.filters.verified')}</SelectItem>
                    <SelectItem value="pending">{t('admin.users.filters.pending')}</SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={() => fetchUsers(currentPage)}
                  className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          }
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.users.table.profile')}</TableHead>
                  <TableHead>{t('admin.users.table.status')}</TableHead>
                  <TableHead>{t('admin.users.table.role')}</TableHead>
                  <TableHead>{t('admin.users.table.contactInfo')}</TableHead>
                  <TableHead className="text-right">{t('admin.users.table.actions')}</TableHead>
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
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-card border border-border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            {usersItem.profilePicture ? (
                              <img src={imageUrl(usersItem.profilePicture)} alt={`${usersItem.firstName} ${usersItem.lastName}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-success to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                                {usersItem.firstName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground leading-tight">{usersItem.firstName} {usersItem.lastName}</span>
                            <span className="text-[11px] text-muted-foreground">{usersItem.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant={usersItem.emailVerified ? 'success' : 'warning'} className="font-semibold text-[9px] uppercase  px-2 py-0.5">
                            {usersItem.emailVerified ? t('admin.users.status.verified') : t('admin.users.status.pending')}
                          </Badge>
                          {isSuspended(usersItem) && (
                            <Badge variant="destructive" className="font-semibold text-[9px] uppercase  px-2 py-0.5">
                              {t('admin.users.status.suspended')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px]">
                          {usersItem.role}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground font-medium">{usersItem.phoneNumber || '—'}</span>
                          <span className="text-[10px] text-muted-foreground uppercase ">{t('admin.users.table.primaryContact')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 transition-all">
                          <button
                            onClick={() => handleViewUser(usersItem)}
                            className="p-2 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg transition-all"
                            title={t('admin.users.actions.quickView')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendUser(usersItem.id, !isSuspended(usersItem))}
                            disabled={actionLoading === usersItem.id}
                            className={`p-2 rounded-lg transition-all ${isSuspended(usersItem)
                              ? 'text-muted-foreground hover:text-success hover:bg-success/10'
                              : 'text-muted-foreground hover:text-warning hover:bg-warning/10'
                              }`}
                          >
                            {actionLoading === usersItem.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isSuspended(usersItem) ? (
                              <UserCheck className="w-4 h-4" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usersItem.id)}
                            disabled={actionLoading === usersItem.id}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
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
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Users className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg font-medium">{t('admin.users.empty')}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 0 && (
              <div className="p-4 border-t border-border flex items-center justify-between bg-card">
                <div className="text-sm text-muted-foreground font-medium">
                  {t('admin.users.pagination', { current: currentPage + 1, total: totalPages })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || loading}
                    className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-all"
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
                          return <span key={pageNum} className="px-2 text-muted-foreground">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className={`min-w-[32px] h-8 text-xs font-semibold rounded-lg transition-all ${pageNum === currentPage
                            ? 'bg-success text-white shadow-sm'
                            : 'text-muted-foreground hover:text-success hover:bg-success/10'
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
                    className="p-2 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
            <div className="relative h-24 bg-linear-to-r from-success to-emerald-600">
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-card p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-card flex items-center justify-center border border-border">
                    {selectedUser.profilePicture ? (
                      <img src={imageUrl(selectedUser.profilePicture)} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-success flex items-center justify-center text-white text-2xl font-semibold">
                        {selectedUser.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-muted-foreground font-medium">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-card rounded-xl border border-border">
                    <p className="text-[10px] uppercase  font-semibold text-muted-foreground mb-1">{t('admin.users.modal.phone')}</p>
                    <p className="text-sm font-semibold text-foreground">{selectedUser.phoneNumber || t('admin.users.modal.notLinked')}</p>
                  </div>
                  <div className="p-3 bg-card rounded-xl border border-border">
                    <p className="text-[10px] uppercase  font-semibold text-muted-foreground mb-1">{t('admin.users.modal.joined')}</p>
                    <p className="text-sm font-semibold text-foreground">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={selectedUser.emailVerified ? 'success' : 'warning'} className="font-semibold">
                    {selectedUser.emailVerified ? t('admin.users.status.verifiedAccount') : t('admin.users.status.pendingVerification')}
                  </Badge>
                  {isSuspended(selectedUser) && (
                    <Badge variant="destructive" className="font-semibold">{t('admin.users.status.suspended')}</Badge>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <button
                    onClick={() => handleSuspendUser(selectedUser.id, !isSuspended(selectedUser))}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${isSuspended(selectedUser)
                      ? 'bg-success text-white hover:bg-success/90 shadow-md shadow-success/20'
                      : 'bg-warning text-white hover:bg-warning/90 shadow-md shadow-warning/20'
                      }`}
                  >
                    {isSuspended(selectedUser) ? t('admin.users.actions.reactivateAccount') : t('admin.users.actions.suspendAccount')}
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold text-sm rounded-xl hover:bg-muted/80 transition-all"
                  >
                    {t('admin.users.actions.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function UserManagementPage() {
  return <UserManagement />;
}
