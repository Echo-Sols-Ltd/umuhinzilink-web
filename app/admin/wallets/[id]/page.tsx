'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { walletService } from '@/services/wallet';
import { Wallet as IWallet, Transaction } from '@/types';
import {
  Wallet,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  User,
  DollarSign,
  ShieldCheck,
  Calendar,
} from '@/lib/icons';
import { notify } from '@/lib/notify';
import AdminPageHeader from '@/components/layout/AdminPageHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import PageLoading from '@/components/layout/PageLoading';
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

function getTransactionStatusVariant(status: string) {
  switch (status) {
    case 'COMPLETED':
    case 'INCOME':
      return 'success';
    case 'PENDING':
    case 'PROCESSING':
      return 'warning';
    case 'FAILED':
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function isCreditTransaction(type: string): boolean {
  return type === 'DEPOSIT' || type === 'TRANSFER_IN' || type === 'INCOME' || type === 'REFUND';
}

function getOwnerName(wallet: IWallet): string {
  const first = wallet.user?.firstName?.trim() ?? '';
  const last = wallet.user?.lastName?.trim() ?? '';
  return `${first} ${last}`.trim() || 'Unknown user';
}

export default function WalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;

  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const fetchUserTransactions = useCallback(async (userId: string) => {
    try {
      setLoadingTransactions(true);
      const response = await walletService.getTransactionsByUserId(userId, {
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });
      if (response.success && response.data) {
        setUserTransactions(response.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  const fetchWalletDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await walletService.getAllWallets({
        page: 0,
        size: 1000,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      if (response.success && response.data) {
        const foundWallet = response.data.find((w) => w.id === walletId);
        if (foundWallet) {
          setWallet(foundWallet);
          await fetchUserTransactions(foundWallet.user.id);
        } else {
          notify.error('Wallet not found', 'Error');
          router.push('/admin/wallets');
        }
      } else {
        notify.error(response.message || 'Failed to fetch wallet details', 'Error');
      }
    } catch {
      notify.error('Failed to fetch wallet details', 'Error');
    } finally {
      setLoading(false);
    }
  }, [walletId, router, fetchUserTransactions]);

  useEffect(() => {
    if (walletId) {
      fetchWalletDetails();
    }
  }, [walletId, fetchWalletDetails]);

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Wallet details" backHref="/admin/wallets" backLabel="Back to wallets" />
        <main className="flex flex-1 items-center justify-center p-6">
          <PageLoading
            variant="section"
            label="Loading wallet"
            description="Fetching wallet details and transactions…"
            className="bg-transparent dark:bg-transparent"
          />
        </main>
      </>
    );
  }

  if (!wallet) {
    return (
      <>
        <AdminPageHeader title="Wallet details" backHref="/admin/wallets" backLabel="Back to wallets" />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Wallet not found.</p>
            <Button variant="outline" onClick={() => router.push('/admin/wallets')}>
              Back to wallets
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title={getOwnerName(wallet)}
        description={wallet.user?.email ?? `Wallet ID: ${wallet.id}`}
        backHref="/admin/wallets"
        backLabel="Back to wallets"
      />

      <main className="flex-1 space-y-8 overflow-auto p-4 pb-8 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            variant="featured"
            title="Available balance"
            value={wallet.balance}
            format="currency"
            icon={DollarSign}
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            hint={`Currency: ${wallet.currency}`}
          />
          <AdminStatCard
            variant="featured"
            title="Account status"
            value={wallet.isActive ? 'Active' : 'Restricted'}
            format="raw"
            icon={ShieldCheck}
            iconClassName={
              wallet.isActive
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }
            hint={wallet.isActive ? 'Wallet can send and receive' : 'Wallet access is limited'}
          />
          <AdminStatCard
            variant="featured"
            title="Transactions"
            value={userTransactions.length}
            format="number"
            icon={History}
            iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            hint="Recent activity loaded"
          />
          <AdminStatCard
            variant="featured"
            title="Member since"
            value={new Date(wallet.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            format="raw"
            icon={Calendar}
            iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            hint="Wallet created"
          />
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Account holder</CardTitle>
                <CardDescription>Owner profile linked to this wallet</CardDescription>
              </div>
              <Badge variant={wallet.isActive ? 'success' : 'destructive'}>
                {wallet.isActive ? 'Active' : 'Restricted'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">{getOwnerName(wallet)}</p>
                <p className="text-sm text-muted-foreground">{wallet.user?.email ?? '—'}</p>
                <p className="mt-1 text-xs text-muted-foreground">Wallet ID: {wallet.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Transaction history</CardTitle>
            <CardDescription>
              {userTransactions.length > 0
                ? `${userTransactions.length} recent transactions`
                : 'No transactions recorded yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loadingTransactions ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading transactions…</p>
              </div>
            ) : userTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="pl-6">Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="pr-6 text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTransactions.map((tx) => {
                      const credit = isCreditTransaction(tx.type);
                      return (
                        <TableRow key={tx.id} className="hover:bg-muted/30">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                  credit
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                {credit ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground">{tx.type}</p>
                                {tx.description && (
                                  <p className="truncate text-xs text-muted-foreground max-w-[240px]">
                                    {tx.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTransactionStatusVariant(tx.status)}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              credit ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                            }`}
                          >
                            {credit ? '+' : '−'} {formatRwf(tx.amount)}
                          </TableCell>
                          <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Wallet className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No transaction history for this wallet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
