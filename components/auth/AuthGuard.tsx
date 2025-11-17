'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/enums';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserType[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  children,
  requiredRoles,
  redirectTo = '/auth/signin',
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Still loading auth state
    if (authLoading) {
      return;
    }

    // Check if user is authenticated via auth token
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!authToken || !user) {
      console.log('User not authenticated, redirecting to signin');
      router.replace(redirectTo);
      return;
    }

    // If specific roles are required, check user role
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = user.role;

      if (!userRole || !requiredRoles.includes(userRole)) {
        console.log(`User role ${userRole} not authorized for required roles:`, requiredRoles);
        router.replace('/unauthorized');
        return;
      }
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [user, authLoading, router, requiredRoles, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      )
    );
  }

  // Show children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // This shouldn't render as we redirect, but just in case
  return null;
}

// Convenience components for specific roles
export function FarmerGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRoles'>) {
  return (
    <AuthGuard requiredRoles={[UserType.FARMER]} {...props}>
      {children}
    </AuthGuard>
  );
}

export function SupplierGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRoles'>) {
  return (
    <AuthGuard requiredRoles={[UserType.SUPPLIER]} {...props}>
      {children}
    </AuthGuard>
  );
}

export function BuyerGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRoles'>) {
  return (
    <AuthGuard requiredRoles={[UserType.BUYER]} {...props}>
      {children}
    </AuthGuard>
  );
}

export function AdminGuard({ children, ...props }: Omit<AuthGuardProps, 'requiredRoles'>) {
  return (
    <AuthGuard requiredRoles={[UserType.FARMER, UserType.SUPPLIER, UserType.BUYER]} {...props}>
      {children}
    </AuthGuard>
  );
}
