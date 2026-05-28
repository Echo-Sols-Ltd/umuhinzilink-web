'use client';

import React, { useState, useMemo } from 'react';
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  Filter,
  Download,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Wallet as IWallet, Transaction } from '@/types';
import { cn } from '@/lib/utils';

import { useI18n } from '@/contexts/I18nContext';

interface WalletDashboardProps {
  wallet: IWallet | null;
  transactions: Transaction[];
  loading?: boolean;
  onDeposit?: (amount: number, description?: string) => void;
  onPayOrder?: (orderId: string, description?: string) => void;
  className?: string;
}

type FilterType = 'all' | 'deposit' | 'withdrawal' | 'payment';
type SortType = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  wallet,
  transactions,
  loading = false,
  onDeposit,
  onPayOrder,
  className,
}) => {
  const { t, locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      const searchMatch = searchTerm === '' ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
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

    // Sort transactions
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

  // Transaction statistics
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

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'PENDING') return <Clock className="w-4 h-4 text-warning" />;
    if (status === 'FAILED' || status === 'CANCELLED') return <XCircle className="w-4 h-4 text-destructive" />;

    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'PAYMENT':
      case 'TRANSFER_OUT':
        return <ArrowUpRight className="w-4 h-4 text-info" />;
      case 'WITHDRAWAL':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      default:
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-success/10 text-success';
      case 'PENDING':
        return 'bg-warning/10 text-warning';
      case 'FAILED':
        return 'bg-destructive/10 text-destructive';
      case 'CANCELLED':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'rw' ? 'rw-RW' : 'en-US', {
      style: 'currency',
      currency: wallet?.currency || 'RWF',
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

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && onDeposit) {
      onDeposit(amount, depositDescription.trim() || undefined);
      setDepositAmount('');
      setDepositDescription('');
      setShowDepositModal(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Wallet className="w-8 h-8 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('buyer.wallet.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('buyer.wallet.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Balance Hero Card */}
        <div className="relative overflow-hidden bg-linear-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-lg border border-green-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1">
              <p className="text-green-50/80 text-sm font-medium uppercase tracking-wider">{t('buyer.wallet.balance')}</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  {formatCurrency(wallet?.balance || 0)}
                </h2>
                <span className="text-green-100/60 text-lg font-medium">{wallet?.currency || 'RWF'}</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <span className="flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  {t('buyer.wallet.active')}
                </span>
                <span className="text-xs font-mono text-green-50/60">
                  ID: {wallet?.id ? `****${wallet.id.slice(-8)}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all transform active:scale-95 shadow-md"
              >
                <Plus className="w-5 h-5" />
                {t('buyer.wallet.addMoney')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('space-y-6', className)}>


        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t('buyer.wallet.stats.totalDeposits'), value: stats.totalDeposits, icon: TrendingUp, color: 'success' },
            { label: t('buyer.wallet.stats.totalPayments'), value: stats.totalPayments, icon: CreditCard, color: 'info' },
            { label: t('buyer.wallet.stats.withdrawals'), value: stats.totalWithdrawals, icon: TrendingDown, color: 'destructive' },
            { label: t('buyer.wallet.stats.pending'), value: stats.pendingTransactions, icon: Clock, color: 'warning', isCount: true }
          ].map((item, idx) => (
            <div key={idx} className="bg-card p-6 rounded-2xl border border-border hover:border-foreground/10 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    item.color === 'success' ? 'text-success' :
                      item.color === 'info' ? 'text-info' :
                        item.color === 'destructive' ? 'text-destructive' :
                          'text-warning'
                  )}>
                    {item.isCount ? item.value : formatCurrency(item.value as number)}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  item.color === 'success' ? 'bg-success/10 group-hover:bg-success/20' :
                    item.color === 'info' ? 'bg-info/10 group-hover:bg-info/20' :
                      item.color === 'destructive' ? 'bg-destructive/10 group-hover:bg-destructive/20' :
                        'bg-warning/10 group-hover:bg-warning/20'
                )}>
                  <item.icon className={cn(
                    "w-6 h-6",
                    item.color === 'success' ? 'text-success' :
                      item.color === 'info' ? 'text-info' :
                        item.color === 'destructive' ? 'text-destructive' :
                          'text-warning'
                  )} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder={t('buyer.wallet.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-card"
            >
              <Filter className="w-4 h-4" />
              <span>{t('buyer.wallet.filters.title')}</span>
            </button>

            {/* Export */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Download className="w-4 h-4" />
              <span>{t('buyer.wallet.export')}</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t('buyer.wallet.filters.transactionType')}</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">{t('buyer.wallet.filters.allTransactions')}</option>
                  <option value="deposit">{t('buyer.wallet.filters.deposits')}</option>
                  <option value="payment">{t('buyer.wallet.filters.payments')}</option>
                  <option value="withdrawal">{t('buyer.wallet.filters.withdrawals')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t('buyer.wallet.filters.sortBy')}</label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">{t('buyer.wallet.filters.newestFirst')}</option>
                  <option value="oldest">{t('buyer.wallet.filters.oldestFirst')}</option>
                  <option value="amount_high">{t('buyer.wallet.filters.highestAmount')}</option>
                  <option value="amount_low">{t('buyer.wallet.filters.lowestAmount')}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">{t('buyer.wallet.history')}</h3>
            </div>
          </div>

          {filteredAndSortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('buyer.wallet.noTransactions')}</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? t('buyer.wallet.tryAdjusting')
                  : t('buyer.wallet.historyDescription')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredAndSortedTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {transaction.description || `${transaction.type.toLowerCase()} transaction`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.createdAt)} • ID: {transaction.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-sm font-semibold',
                        (transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN') ? 'text-success' : 'text-destructive'
                      )}>
                        {(transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_IN') ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusColor(transaction.status)
                      )}>
                        {translateStatus(transaction.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md m-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('buyer.wallet.modal.title')}</h3>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      {t('buyer.wallet.modal.amount')} ({wallet?.currency || 'RWF'})
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      {t('buyer.wallet.modal.description')}
                    </label>
                    <input
                      type="text"
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      placeholder={t('buyer.wallet.modal.descriptionPlaceholder')}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">{t('buyer.wallet.modal.instructionsTitle')}</p>
                        <p className="mt-1">
                          {t('buyer.wallet.modal.instructions')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
                    >
                      {t('buyer.wallet.modal.cancel')}
                    </button>
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('buyer.wallet.modal.confirm')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;