'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { walletService } from '@/services/wallet';
import { Wallet as IWallet } from '@/types';
import {
  Wallet,
  Search,
  ChevronRight,
  RefreshCw,
  User,
  ShieldCheck,
  TrendingUp,
} from '@/lib/icons';
import { notify } from '@/lib/notify';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { formatRwf } from '@/services/adminAnalytics';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { useAdmin } from '@/contexts/AdminContext';

function getOwnerName(wallet: IWallet): string {
  const first = wallet.user?.firstName?.trim() ?? '';
  const last = wallet.user?.lastName?.trim() ?? '';
  const name = `${first} ${last}`.trim();
  return name || 'Unknown user';
}

export default function AdminWalletsPage() {
  const router = useRouter();
  const { systemWallet } = useAdmin();
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchWallets = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await walletService.getAllWallets({
        page,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      if (response.success && response.data) {
        setWallets(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || response.data.length);
      } else {
        notify.error(response.message || 'Failed to fetch wallets', 'Error');
      }
    } catch {
      notify.error('Failed to fetch wallets', 'Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const filteredWallets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return wallets;

    return wallets.filter((wallet) => {
      const email = wallet.user?.email?.toLowerCase() ?? '';
      const firstName = wallet.user?.firstName?.toLowerCase() ?? '';
      const lastName = wallet.user?.lastName?.toLowerCase() ?? '';
      const id = wallet.id?.toLowerCase() ?? '';
      return (
        email.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        id.includes(query)
      );
    });
  }, [wallets, searchTerm]);

  const pageStats = useMemo(() => {
    const activeCount = filteredWallets.filter((w) => w.isActive).length;
    const totalBalance = filteredWallets.reduce((acc, w) => acc + w.balance, 0);
    const avgBalance = filteredWallets.length ? totalBalance / filteredWallets.length : 0;
    return { activeCount, totalBalance, avgBalance };
  }, [filteredWallets]);

  const handleWalletClick = (wallet: IWallet) => {
    router.push(`/admin/wallets/${wallet.id}`);
  };

  return (
    <>
      <AdminPageHeader
        title="Wallet Management"
        description={`Monitor ${totalElements.toLocaleString()} user wallets across the platform`}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, email, or wallet ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWallets(true)}
              disabled={refreshing || loading}
              className="gap-2 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      <main className="flex-1 space-y-8 overflow-auto p-4 pb-8 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            variant="featured"
            title="Platform wallet"
            value={systemWallet?.balance ?? 0}
            format="currency"
            icon={ShieldCheck}
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            hint="System treasury balance"
          />
          <AdminStatCard
            variant="featured"
            title="Total wallets"
            value={totalElements}
            format="number"
            icon={Wallet}
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            hint="Registered user wallets"
          />
          <AdminStatCard
            variant="featured"
            title="Active on page"
            value={pageStats.activeCount}
            format="number"
            icon={TrendingUp}
            iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            hint={`${filteredWallets.length} shown after filters`}
          />
          <AdminStatCard
            variant="featured"
            title="Avg balance"
            value={pageStats.avgBalance}
            format="currency"
            icon={Wallet}
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            hint="Average on current view"
          />
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>All wallets</CardTitle>
            <CardDescription>
              Click a row to view wallet details and transaction history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-6">Owner</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="pr-6 text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="ml-auto h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredWallets.length > 0 ? (
                    filteredWallets.map((wallet) => (
                      <TableRow
                        key={wallet.id}
                        onClick={() => handleWalletClick(wallet)}
                        className="cursor-pointer hover:bg-muted/30"
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {getOwnerName(wallet)}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {wallet.user?.email ?? '—'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {formatRwf(wallet.balance)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={wallet.isActive ? 'success' : 'destructive'}>
                            {wallet.isActive ? 'Active' : 'Locked'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(wallet.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Wallet className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">No wallets found</p>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm
                                ? 'Try a different search term.'
                                : 'Wallets will appear here once users register.'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && totalPages > 1 && (
              <div className="border-t border-border px-6 py-4">
                <Pagination
                  currentPage={page + 1}
                  totalPages={totalPages}
                  onPageChange={(next) => setPage(next - 1)}
                  showSummary
                  totalItems={totalElements}
                  itemsPerPage={pageSize}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
