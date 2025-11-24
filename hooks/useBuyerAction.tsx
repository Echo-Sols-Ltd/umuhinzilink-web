import { toast } from '@/components/ui/use-toast';
import { buyerService } from '@/services/buyers';
import { useState } from 'react';

export default function useBuyerAction() {
  const [loading, setLoading] = useState(false);

  const bookmarkProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await buyerService.saveProduct(id);
      if (!res) {
        toast({
          title: 'Failed to bookmark',
          description: 'Please try again later',
          variant: 'error',
        });
      }
      toast({
        title: 'Product bookmarked',
        description: 'Product has been bookmarked successfully',
      });
    } catch {
      toast({
        title: 'Failed to bookmark',
        description: 'Please try again later',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bookmarkProduct,
  };
}
