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
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  X,
  Loader2,
} from '@/lib/icons';
import { Wallet as IWallet, Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import PageLoading from '@/components/layout/PageLoading';

interface WalletDashboardProps {
  wallet: IWallet | null;
  transactions: Transaction[];
  loading?: boolean;
  onDeposit?: (amount: number, description?: string) => void;
  onPayOrder?: (orderId: string, description?: string) => void;
  className?: string;
  depositOpen?: boolean;
  onDepositOpenChange?: (open: boolean) => void;
}

type FilterType = 'all' | 'deposit' | 'withdrawal' | 'payment';
type SortType = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

const FILTER_OPTIONS: { value: FilterType; labelKey: string }[] = [
  { value: 'all', labelKey: 'buyer.wallet.filters.allTransactions' },
  { value: 'deposit', labelKey: 'buyer.wallet.filters.deposits' },
  { value: 'payment', labelKey: 'buyer.wallet.filters.payments' },
  { value: 'withdrawal', labelKey: 'buyer.wallet.filters.withdrawals' },
];

function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: 'default' | 'success' | 'info' | 'warning' | 'destructive';
}) {
  const toneClasses = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-sky-600 dark:text-sky-400',
    warning: 'text-amber-600 dark:text-amber-400',
    destructive: 'text-red-500 dark:text-red-400',
  };

  return (
    <div className="rounded-2xl border border-border bg-white dark:bg-gray-900 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
          <Icon size={14} className="text-green-600" />
        </div>
      </div>
      <p className={cn('text-xl font-extrabold tracking-tight', toneClasses[tone])}>{value}</p>
    </div>
  );
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  wallet,
  transactions,
  loading = false,
  onDeposit,
  className,
  depositOpen,
  onDepositOpenChange,
}) => {
  const { t, locale } = useI18n();
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
    let filtered = transactions.filter(transaction => {
      const searchMatch =
        searchTerm === '' ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

      let typeMatch = filterType === 'all';
      if (!typeMatch) {
        const type = transaction.type.toLowerCase();
        if (filterType === 'deposit') {
          typeMatch = type === 'deposit' || type === 'transfer_in';
        } else if (filterType === 'payment') {
          typeMatch = type === 'payment' || type === 'transfer_out';
        } else if (filterType === 'withdrawal') {
          typeMatch = type === 'withdrawal';
        }
      }

      return searchMatch && typeMatch;
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
  }, [transactions, searchTerm, filterType, sortType]);

  const stats = useMemo(() => {
    const totalDeposits = transactions
      .filter(t => (t.type === 'DEPOSIT' || t.type === 'TRANSFER_IN') && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPayments = transactions
      .filter(t => (t.type === 'PAYMENT' || t.type === 'TRANSFER_OUT') && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;

    return { totalDeposits, totalPayments, totalWithdrawals, pendingTransactions };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', {
      style: 'currency',
      currency: wallet?.currency || 'RWF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400';
      case 'FAILED':
        return 'text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400';
      default:
        return 'text-muted-foreground bg-gray-100 dark:bg-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED': return t('common.status.completed');
      case 'PENDING': return t('common.status.pending');
      case 'FAILED': return t('common.error');
      case 'CANCELLED': return t('common.status.cancelled');
      default: return status;
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

  if (loading) {
    return (
      <PageLoading
        variant="inline"
        label="Loading wallet"
        description="Fetching balance and transactions…"
        className={cn('bg-transparent dark:bg-transparent', className)}
      />
    );
  }

  return (
    <div className={cn('space-y-5', className)}>
      {/* Balance hero */}
      <div className="rounded-2xl border border-green-600 bg-green-600 p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-100">
              {t('buyer.wallet.balance')}
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              {formatCurrency(wallet?.balance || 0)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 px-2.5 py-1 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                {t('buyer.wallet.active')}
              </span>
              <span className="text-xs text-green-100/80 font-mono">
                {wallet?.currency || 'RWF'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDepositModal(true)}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-semibold rounded-xl bg-white text-green-700 hover:bg-green-50 transition-colors shrink-0"
          >
            <Plus size={16} />
            {t('buyer.wallet.addMoney')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label={t('buyer.wallet.stats.totalDeposits')}
          value={formatCurrency(stats.totalDeposits)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label={t('buyer.wallet.stats.totalPayments')}
          value={formatCurrency(stats.totalPayments)}
          icon={CreditCard}
          tone="info"
        />
        <StatCard
          label={t('buyer.wallet.stats.withdrawals')}
          value={formatCurrency(stats.totalWithdrawals)}
          icon={TrendingDown}
          tone="destructive"
        />
        <StatCard
          label={t('buyer.wallet.stats.pending')}
          value={stats.pendingTransactions}
          icon={Clock}
          tone="warning"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('buyer.wallet.filters.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
            className="h-10 px-3 text-sm bg-white dark:bg-gray-900 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">{t('buyer.wallet.filters.newestFirst')}</option>
            <option value="oldest">{t('buyer.wallet.filters.oldestFirst')}</option>
            <option value="amount_high">{t('buyer.wallet.filters.highestAmount')}</option>
            <option value="amount_low">{t('buyer.wallet.filters.lowestAmount')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_OPTIONS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterType(value)}
              className={cn(
                'h-8 px-3 text-xs font-semibold rounded-xl border transition-colors',
                filterType === value
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-white dark:bg-gray-900 border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
          <History size={16} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground">{t('buyer.wallet.history')}</h2>
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredAndSortedTransactions.length} {filteredAndSortedTransactions.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {filteredAndSortedTransactions.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4">
              <History size={24} className="text-green-500" />
            </div>
            <p className="text-sm font-semibold text-foreground">{t('buyer.wallet.noTransactions')}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {searchTerm || filterType !== 'all'
                ? t('buyer.wallet.tryAdjusting')
                : t('buyer.wallet.historyDescription')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAndSortedTransactions.map((transaction) => {
              const isCredit =
                transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN';
              return (
                <div
                  key={transaction.id}
                  className="px-4 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        isCredit
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600',
                      )}
                    >
                      {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {transaction.description || transaction.type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(transaction.createdAt)} · {transaction.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        'text-sm font-bold',
                        isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                      )}
                    >
                      {isCredit ? '+' : '−'}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <span
                      className={cn(
                        'inline-flex mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        getStatusBadge(transaction.status),
                      )}
                    >
                      {translateStatus(transaction.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deposit modal */}
      {showDepositModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deposit-modal-title"
        >
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 id="deposit-modal-title" className="text-base font-bold text-foreground">
                {t('buyer.wallet.modal.title')}
              </h3>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {t('buyer.wallet.modal.amount')} ({wallet?.currency || 'RWF'})
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-gray-950 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {t('buyer.wallet.modal.description')}
                </label>
                <input
                  type="text"
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                  placeholder={t('buyer.wallet.modal.descriptionPlaceholder')}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-gray-950 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-3 flex gap-2">
                <AlertCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                <div className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
                  <p className="font-semibold">{t('buyer.wallet.modal.instructionsTitle')}</p>
                  <p className="mt-1 opacity-90">{t('buyer.wallet.modal.instructions')}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  disabled={depositing}
                  className="flex-1 h-10 text-sm font-semibold border border-border rounded-xl text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {t('buyer.wallet.modal.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || depositing}
                  className="flex-1 h-10 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {depositing ? <Loader2 size={16} className="animate-spin" /> : null}
                  {t('buyer.wallet.modal.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;
