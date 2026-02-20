import { useState } from 'react';
import { DeliveryStatus } from '@/types/enums';
import { useToast } from '@/components/ui/use-toast';

interface UseDeliveryUpdateProps {
  orderId: string;
  onUpdateStatus?: (orderId: string, status: DeliveryStatus) => Promise<void>;
}

export const useDeliveryUpdate = ({ orderId, onUpdateStatus }: UseDeliveryUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!onUpdateStatus) return;

    setIsLoading(true);
    try {
      await onUpdateStatus(orderId, newStatus);
      
      toast({
        title: "Delivery Status Updated",
        description: `Order delivery status has been updated successfully.`,
        variant: "success"
      });
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      
      toast({
        title: "Update Failed",
        description: "Failed to update delivery status. Please try again.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateDeliveryStatus,
    isLoading
  };
};
