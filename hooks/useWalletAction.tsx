import { useWallet } from '@/contexts/WalletContext';

/**
 * Wallet actions (handleDeposit, handleWalletPayment, etc.) are provided by WalletContext.
 * This hook re-exports them for backward compatibility.
 */
export default function useWalletAction() {
  const wallet = useWallet();
  return {
    handleDeposit: wallet.handleDeposit,
    handleWalletPayment: wallet.handleWalletPayment,
    handleExternalPayment: wallet.handleExternalPayment,
    checkPaymentStatus: wallet.checkPaymentStatus,
    refreshData: wallet.refreshData,
    loading: wallet.loading,
  };
}
