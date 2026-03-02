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
import { WalletDTO, WalletTransactionDTO } from '@/types/wallet';
import { cn } from '@/lib/utils';

interface WalletDashboardProps {
  wallet: WalletDTO | null;
  transactions: WalletTransactionDTO[];
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet?.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className='flex space-x-3'>
            <Wallet className="w-8 h-8 text-success" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">My Wallet</h1>
              <p className="text-muted-foreground">Manage your earnings, balance and transactions</p>
            </div>
          </div>
          <div className="text-right justify-end items-end">
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-green-500/80 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span > Add Money</span>
            </button>
          </div>
        </div>
      </div>

      <div className={cn('space-y-6', className)}>


        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="text-xl font-semibold text-success">{formatCurrency(stats.totalDeposits)}</p>
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-xl font-semibold text-info">{formatCurrency(stats.totalPayments)}</p>
              </div>
              <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-info" />
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Withdrawals</p>
                <p className="text-xl font-semibold text-destructive">{formatCurrency(stats.totalWithdrawals)}</p>
              </div>
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold text-warning">{stats.pendingTransactions}</p>
              </div>
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
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
              <span>Filters</span>
            </button>

            {/* Export */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Transaction Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="payment">Payments</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Sort By</label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Highest Amount</option>
                  <option value="amount_low">Lowest Amount</option>
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
              <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
            </div>
          </div>

          {filteredAndSortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Your transaction history will appear here'}
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
                        {transaction.status}
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
                  <h3 className="text-lg font-semibold text-foreground">Add Money to Wallet</h3>
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
                      Amount ({wallet?.currency || 'USD'})
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
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                      placeholder="Add a note for this deposit"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Payment Instructions</p>
                        <p className="mt-1">
                          You will be redirected to complete the payment using your selected method.
                          Funds will be available in your wallet once the payment is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-card transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeposit}
                      disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Money
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