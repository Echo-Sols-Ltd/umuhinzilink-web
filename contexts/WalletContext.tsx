import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '@/services/wallet';
import { paymentService } from '@/services/payments';
import { Wallet, Transaction, PaymentRequest, TransactionStatus } from '@/types';
import { useAuth } from './AuthContext';
import { notify } from '@/lib/notify';

const STORAGE_KEYS = {
  WALLET: 'walletData',
  TRANSACTIONS: 'walletTransactions',
  PAYMENT_HISTORY: 'paymentHistory',
};

type WalletContextValue = {
  loading: boolean;
  error?: string | null;
  wallet: Wallet | null;
  transactions: Transaction[];
  paymentHistory: Transaction[];

  // Wallet operations
  fetchWallet: () => Promise<Wallet | null>;
  fetchTransactions: () => Promise<Transaction[] | null>;
  fetchPaymentHistory: () => Promise<Transaction[] | null>;

  deposit: (amount: number, description?: string) => Promise<Transaction | null>;
  payOrder: (orderId: string, description?: string) => Promise<Transaction | null>;
  processPayment: (request: PaymentRequest) => Promise<Transaction | null>;

  refreshWalletData: () => Promise<void>;
  getPaymentStatus: (transactionId: string) => Promise<Transaction | null>;

  handleDeposit: (amount: number, description?: string) => Promise<Transaction | null>;
  handleWalletPayment: (orderId: string, description?: string) => Promise<Transaction | null>;
  handleExternalPayment: (request: PaymentRequest) => Promise<Transaction | null>;
  checkPaymentStatus: (transactionId: string) => Promise<Transaction | null>;
  refreshData: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);
  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedWallet = localStorage.getItem(STORAGE_KEYS.WALLET);
        const cachedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const cachedPaymentHistory = localStorage.getItem(STORAGE_KEYS.PAYMENT_HISTORY);

        if (cachedWallet) setWallet(JSON.parse(cachedWallet));
        if (cachedTransactions) setTransactions(JSON.parse(cachedTransactions));
        if (cachedPaymentHistory) setPaymentHistory(JSON.parse(cachedPaymentHistory));
      } catch (e) {
        console.warn('Failed to load cached wallet data', e);
      }
    };

    loadCachedData();
  }, []);

  // Fetch wallet data
  const fetchWallet = async (): Promise<Wallet | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await walletService.getBalance();
      if (!res.success) {
        setError(res.message || 'Failed to fetch wallet data');
        return null;
      }

      setWallet(res.data ?? null);
      if (res.data) {
        localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(res.data));
      }

      return res.data ?? null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet data';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet transactions
  const fetchTransactions = async (): Promise<Transaction[] | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await walletService.getTransactions({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
      if (!res.success) {
        setError(res.message || 'Failed to fetch transactions');
        return null;
      }

      const transactionData = res.data;
      const transactionList = transactionData ? transactionData : [];

      setTransactions(transactionList as any);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactionList));

      return transactionList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async (): Promise<Transaction[] | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await paymentService.getMyTransactions({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
      if (!res.success) {
        setError(res.message || 'Failed to fetch payment history');
        return null;
      }


      const paymentData = res.data;
      const paymentList = Array.isArray(paymentData)
        ? paymentData
        : (paymentData as any)?.content || [];

      setPaymentHistory(paymentList as any);
      localStorage.setItem(STORAGE_KEYS.PAYMENT_HISTORY, JSON.stringify(paymentList));

      return paymentList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment history';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deposit money to wallet
  const deposit = async (amount: number, description?: string): Promise<Transaction | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await walletService.deposit({ amount, description });
      if (!res.success) {
        const errorMessage = res.message || 'Failed to deposit money';
        setError(errorMessage);
        notify.error(errorMessage, 'Deposit Failed');
        return null;
      }

      const transaction = res.data;
      if (transaction) {
        // Add to transactions list
        setTransactions(prev => [transaction as any, ...prev]);

        // Update wallet balance if transaction is completed
        if (transaction.status === TransactionStatus.COMPLETED && wallet) {
          const updatedWallet = { ...wallet, balance: wallet.balance + amount };
          setWallet(updatedWallet);
          localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(updatedWallet));
        }

        // Update cached transactions
        const updatedTransactions = [transaction, ...transactions];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));

        notify.success('Your deposit request has been submitted successfully.', 'Deposit Initiated');
      }

      return (transaction as any) ?? null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deposit money';
      setError(errorMessage);
      notify.error(errorMessage, 'Deposit Failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Pay for order using wallet
  const payOrder = async (orderId: string, description?: string): Promise<Transaction | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await walletService.payOrder({ orderId, description });
      if (!res.success) {
        const errorMessage = res.message || 'Failed to process payment';
        setError(errorMessage);
        notify.error(errorMessage, 'Payment Failed');
        return null;
      }

      const transaction = res.data;
      if (transaction) {
        // Add to transactions list
        setTransactions(prev => [transaction as any, ...prev]);

        // Update wallet balance if transaction is completed
        if (transaction.status === TransactionStatus.COMPLETED && wallet) {
          const updatedWallet = { ...wallet, balance: wallet.balance - transaction.amount };
          setWallet(updatedWallet);
          localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(updatedWallet));
        }

        // Update cached transactions
        const updatedTransactions = [transaction, ...transactions];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));

        notify.success('Your order has been paid successfully.', 'Payment Successful');
      }

      return (transaction as any) ?? null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setError(errorMessage);
      notify.error(errorMessage, 'Payment Failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Process payment using external methods
  const processPayment = async (request: PaymentRequest): Promise<Transaction | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await paymentService.processPayment(request as any);
      if (!res.success) {
        const errorMessage = res.message || 'Failed to process payment';
        setError(errorMessage);
        notify.error(errorMessage, 'Payment Failed');
        return null;
      }

      const payment = res.data as Transaction;
      if (payment) {
        // Add to payment history
        setPaymentHistory(prev => [payment, ...prev]);

        // Update cached payment history
        const updatedHistory = [payment, ...paymentHistory];
        localStorage.setItem(STORAGE_KEYS.PAYMENT_HISTORY, JSON.stringify(updatedHistory));

        if (payment.status === TransactionStatus.COMPLETED) {
          notify.success('Your payment has been processed successfully.', 'Payment Successful');
        } else if (payment.status === TransactionStatus.PENDING) {
          notify.warning('Your payment is being processed. You will receive a confirmation shortly.', 'Payment Processing');
        }
      }

      return payment ?? null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setError(errorMessage);
      notify.error(errorMessage, 'Payment Failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get payment status
  const getPaymentStatus = async (transactionId: string): Promise<Transaction | null> => {
    try {
      const res = await paymentService.getPaymentStatus(transactionId);
      if (!res.success) {
        return null;
      }

      const payment = res.data as Transaction;
      if (payment) {
        // Update payment in history
        setPaymentHistory(prev =>
          prev.map(p => p.transactionId === transactionId ? payment : p)
        );
      }

      return payment ?? null;
    } catch (err) {
      console.error('Failed to get payment status:', err);
      return null;
    }
  };

  // Refresh all wallet data
  const refreshWalletData = async (): Promise<void> => {
    await Promise.all([
      fetchWallet(),
      fetchTransactions(),
      fetchPaymentHistory(),
    ]);
  };

  const handleDeposit = async (amount: number, description?: string): Promise<Transaction | null> => {
    const result = await deposit(amount, description);
    if (result) await refreshWalletData();
    return result;
  };

  const handleWalletPayment = async (orderId: string, description?: string): Promise<Transaction | null> => {
    const result = await payOrder(orderId, description);
    if (result) await refreshWalletData();
    return result;
  };

  const handleExternalPayment = async (request: PaymentRequest): Promise<Transaction | null> => {
    const result = await processPayment(request);
    if (result) await refreshWalletData();
    return result;
  };

  const checkPaymentStatus = async (transactionId: string): Promise<Transaction | null> => {
    return getPaymentStatus(transactionId);
  };

  const refreshData = async (): Promise<void> => {
    await refreshWalletData();
  };

  // Auto-fetch when user logs in
  useEffect(() => {
    if (!user?.id) return;
    refreshWalletData();
  }, [user?.id]);

  const value: WalletContextValue = {
    loading,
    error,
    wallet,
    transactions,
    paymentHistory,
    fetchWallet,
    fetchTransactions,
    fetchPaymentHistory,
    deposit,
    payOrder,
    processPayment,
    refreshWalletData,
    getPaymentStatus,
    handleDeposit,
    handleWalletPayment,
    handleExternalPayment,
    checkPaymentStatus,
    refreshData,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return ctx;
}
