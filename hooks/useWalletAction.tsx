import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { PaymentRequest } from '@/types/wallet';
import { toast } from '@/components/ui/use-toast';

export default function useWalletAction() {
  const [loading, setLoading] = useState(false);
  const { 
    deposit, 
    payOrder, 
    processPayment, 
    getPaymentStatus,
    refreshWalletData 
  } = useWallet();

  const handleDeposit = async (amount: number, description?: string) => {
    try {
      setLoading(true);
      const result = await deposit(amount, description);
      
      if (result) {
        // Refresh wallet data to get updated balance
        await refreshWalletData();
        return result;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deposit money';
      toast({
        title: 'Deposit Failed',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async (orderId: string, description?: string) => {
    try {
      setLoading(true);
      const result = await payOrder(orderId, description);
      
      if (result) {
        // Refresh wallet data to get updated balance
        await refreshWalletData();
        return result;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleExternalPayment = async (request: PaymentRequest) => {
    try {
      setLoading(true);
      const result = await processPayment(request);
      
      if (result) {
        // Refresh wallet data in case it affects wallet balance
        await refreshWalletData();
        return result;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const result = await getPaymentStatus(transactionId);
      return result;
    } catch (err) {
      console.error('Failed to check payment status:', err);
      return null;
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await refreshWalletData();
    } catch (err) {
      console.error('Failed to refresh wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleDeposit,
    handleWalletPayment,
    handleExternalPayment,
    checkPaymentStatus,
    refreshData,
  };
}
