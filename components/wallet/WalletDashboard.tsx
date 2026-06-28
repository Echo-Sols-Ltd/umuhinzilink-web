'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CreditCard,
  X,
  Loader2,
} from '@/lib/icons';
import { Wallet as IWallet, Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { formatRwf } from '@/services/adminAnalytics';
import AdminStatCard from '@/components/admin/AdminStatCard';
import PageLoading from '@/components/layout/PageLoading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WalletDashboardProps {
  wallet: IWallet | null;
  transactions: Transaction[];
  loading?: boolean;
  onDeposit?: (amount: number, description?: string) => void;
  className?: string;
  depositOpen?: boolean;
  onDepositOpenChange?: (open: boolean) => void;
  variant?: 'buyer' | 'seller';
}

type BuyerFilterType = 'all' | 'deposit' | 'withdrawal' | 'payment';
type SellerFilterType = 'all' | 'earnings' | 'deposit' | 'withdrawal';
type FilterType = BuyerFilterType | SellerFilterType;
type SortType = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

function isCreditTransaction(type: string): boolean {
  return (
    type === 'DEPOSIT' ||
    type === 'TRANSFER_IN' ||
    type === 'INCOME' ||
    type === 'REFUND'
  );
}

function matchesFilter(transaction: Transaction, filterType: FilterType, variant: 'buyer' | 'seller'): boolean {
  if (filterType === 'all') return true;

  const type = transaction.type.toLowerCase();

  if (variant === 'seller') {
    if (filterType === 'earnings') {
      return type === 'income' || type === 'transfer_in' || type === 'refund';
    }
    if (filterType === 'deposit') return type === 'deposit';
    if (filterType === 'withdrawal') {
      return type === 'withdrawal' || type === 'transfer_out' || type === 'payment';
    }
    return true;
  }

  if (filterType === 'deposit') return type === 'deposit' || type === 'transfer_in';
  if (filterType === 'payment') return type === 'payment' || type === 'transfer_out';
  if (filterType === 'withdrawal') return type === 'withdrawal';
  return true;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  wallet,
  transactions,
  loading = false,
  onDeposit,
  className,
  depositOpen,
  onDepositOpenChange,
  variant = 'buyer',
}) => {
  const { t, locale } = useI18n();
  const copyPrefix = variant === 'seller' ? 'supplier.wallet' : 'buyer.wallet';

  const [internalDepositOpen, setInternalDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');

  const showDepositModal = depositOpen ?? internalDepositOpen;
  const setShowDepositModal = onDepositOpenChange ?? setInternalDepositOpen;

  useEffect(() => {
    if (!showDepositModal) {
      setDepositAmount('');
      setDepositDescription('');
      setDepositing(false);
    }
  }, [showDepositModal]);

  const filteredAndSortedTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = transactions.filter((transaction) => {
      const searchMatch =
        query === '' ||
        transaction.description?.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query);

      return searchMatch && matchesFilter(transaction, filterType, variant);
    });

    filtered.sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount_high':
          return b.amount - a.amount;
        case 'amount_low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortType, variant]);

  const stats = useMemo(() => {
    const completed = (types: string[]) =>
      transactions
        .filter((tx) => types.includes(tx.type) && tx.status === 'COMPLETED')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalDeposits = completed(['DEPOSIT', 'TRANSFER_IN']);
    const totalPayments = completed(['PAYMENT', 'TRANSFER_OUT']);
    const totalWithdrawals = completed(['WITHDRAWAL']);
    const totalEarnings = completed(['INCOME', 'TRANSFER_IN', 'REFUND']);
    const pendingTransactions = transactions.filter((tx) => tx.status === 'PENDING').length;

    return { totalDeposits, totalPayments, totalWithdrawals, totalEarnings, pendingTransactions };
  }, [transactions]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusVariant = (status: string): 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'COMPLETED':
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
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return t('common.status.completed');
      case 'PENDING':
        return t('common.status.pending');
      case 'FAILED':
        return t('common.error');
      case 'CANCELLED':
        return t('common.status.cancelled');
      default:
        return status;
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0 || !onDeposit) return;
    setDepositing(true);
    try {
      await onDeposit(amount, depositDescription.trim() || undefined);
      setShowDepositModal(false);
    } finally {
      setDepositing(false);
    }
  };

  const filterOptions: { value: FilterType; labelKey: string }[] =
    variant === 'seller'
      ? [
          { value: 'all', labelKey: `${copyPrefix}.filters.allTransactions` },
          { value: 'earnings', labelKey: `${copyPrefix}.filters.earnings` },
          { value: 'deposit', labelKey: `${copyPrefix}.filters.deposits` },
          { value: 'withdrawal', labelKey: `${copyPrefix}.filters.withdrawals` },
        ]
      : [
          { value: 'all', labelKey: `${copyPrefix}.filters.allTransactions` },
          { value: 'deposit', labelKey: `${copyPrefix}.filters.deposits` },
          { value: 'payment', labelKey: `${copyPrefix}.filters.payments` },
          { value: 'withdrawal', labelKey: `${copyPrefix}.filters.withdrawals` },
        ];

  if (loading) {
    return (
      <PageLoading
        variant="inline"
        label={t(`${copyPrefix}.title`)}
        description={t(`${copyPrefix}.subtitle`)}
        className={cn('bg-transparent dark:bg-transparent', className)}
      />
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card className="overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white dark:border-emerald-900">
        <CardContent className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-emerald-100">{t(`${copyPrefix}.balance`)}</p>
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {formatRwf(wallet?.balance ?? 0)}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/15">
                  {t(`${copyPrefix}.active`)}
                </Badge>
                <span className="text-xs text-emerald-100/90">{wallet?.currency ?? 'RWF'}</span>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setShowDepositModal(true)}
              variant="secondary"
              className="shrink-0 gap-2 bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Plus size={16} />
              {t(`${copyPrefix}.addMoney`)}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {variant === 'seller' ? (
          <>
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.totalEarnings`)}
              value={stats.totalEarnings}
              format="currency"
              icon={TrendingUp}
              iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              hint="From completed sales"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.totalDeposits`)}
              value={stats.totalDeposits}
              format="currency"
              icon={ArrowDownLeft}
              iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.withdrawals`)}
              value={stats.totalWithdrawals}
              format="currency"
              icon={TrendingDown}
              iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.pending`)}
              value={stats.pendingTransactions}
              format="number"
              icon={Clock}
              iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            />
          </>
        ) : (
          <>
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.totalDeposits`)}
              value={stats.totalDeposits}
              format="currency"
              icon={TrendingUp}
              iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.totalPayments`)}
              value={stats.totalPayments}
              format="currency"
              icon={CreditCard}
              iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.withdrawals`)}
              value={stats.totalWithdrawals}
              format="currency"
              icon={TrendingDown}
              iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            <AdminStatCard
              variant="featured"
              title={t(`${copyPrefix}.stats.pending`)}
              value={stats.pendingTransactions}
              format="number"
              icon={Clock}
              iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t(`${copyPrefix}.history`)}</CardTitle>
          <CardDescription>
            {filteredAndSortedTransactions.length}{' '}
            {filteredAndSortedTransactions.length === 1 ? 'transaction' : 'transactions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder={t(`${copyPrefix}.filters.searchPlaceholder`)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="newest">{t(`${copyPrefix}.filters.newestFirst`)}</option>
              <option value="oldest">{t(`${copyPrefix}.filters.oldestFirst`)}</option>
              <option value="amount_high">{t(`${copyPrefix}.filters.highestAmount`)}</option>
              <option value="amount_low">{t(`${copyPrefix}.filters.lowestAmount`)}</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map(({ value, labelKey }) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={filterType === value ? 'default' : 'outline'}
                onClick={() => setFilterType(value)}
                className="h-8"
              >
                {t(labelKey)}
              </Button>
            ))}
          </div>

          {filteredAndSortedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <History size={22} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t(`${copyPrefix}.noTransactions`)}</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {searchTerm || filterType !== 'all'
                    ? t(`${copyPrefix}.tryAdjusting`)
                    : t(`${copyPrefix}.historyDescription`)}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-4">Transaction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="pr-4 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTransactions.map((transaction) => {
                    const credit = isCreditTransaction(transaction.type);
                    return (
                      <TableRow key={transaction.id} className="hover:bg-muted/30">
                        <TableCell className="pl-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                credit
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-muted text-muted-foreground',
                              )}
                            >
                              {credit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {transaction.description || transaction.type}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.type} · {transaction.id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(transaction.status)}>
                            {translateStatus(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-medium',
                            credit && 'text-emerald-600 dark:text-emerald-400',
                          )}
                        >
                          {credit ? '+' : '−'} {formatRwf(transaction.amount)}
                        </TableCell>
                        <TableCell className="pr-4 text-right text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {showDepositModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deposit-modal-title"
        >
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle id="deposit-modal-title" className="text-base">
                {t(`${copyPrefix}.modal.title`)}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowDepositModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t(`${copyPrefix}.modal.amount`)} ({wallet?.currency ?? 'RWF'})
                </label>
                <Input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t(`${copyPrefix}.modal.description`)}
                </label>
                <Input
                  type="text"
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                  placeholder={t(`${copyPrefix}.modal.descriptionPlaceholder`)}
                />
              </div>

              <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <div className="space-y-1 text-xs text-emerald-900 dark:text-emerald-100">
                  <p className="font-medium">{t(`${copyPrefix}.modal.instructionsTitle`)}</p>
                  <p className="opacity-90">{t(`${copyPrefix}.modal.instructions`)}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDepositModal(false)}
                  disabled={depositing}
                  className="flex-1"
                >
                  {t(`${copyPrefix}.modal.cancel`)}
                </Button>
                <Button
                  type="button"
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || depositing}
                  className="flex-1 gap-2"
                >
                  {depositing ? <Loader2 size={16} className="animate-spin" /> : null}
                  {t(`${copyPrefix}.modal.confirm`)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;
