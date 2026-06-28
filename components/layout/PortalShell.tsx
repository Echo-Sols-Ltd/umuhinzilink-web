'use client';

import Sidebar from '@/components/shared/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface PortalShellProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function PortalShell({ children, role }: PortalShellProps) {
  const { user } = useAuth();
  const effectiveRole = role ?? user?.role ?? UserRole.BUYER;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={effectiveRole} hideTopbar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
