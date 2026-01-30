import { useRouter } from 'next/navigation';

export function useNavigationWithLoading() {
  const router = useRouter();

  const navigate = (href: string) => {
    // Trigger loading bar immediately
    if (typeof window !== 'undefined' && (window as any).startNavigation) {
      (window as any).startNavigation();
    }
    
    // Navigate
    router.push(href);
  };

  return { navigate };
}

// Global function to trigger loading bar for any navigation
export const triggerLoadingBar = () => {
  if (typeof window !== 'undefined' && (window as any).startNavigation) {
    (window as any).startNavigation();
  }
};