'use client';

import PortalShell from '@/components/layout/PortalShell';
import { UserRole } from '@/types';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <PortalShell role={UserRole.ADMIN}>
      {children}
    </PortalShell>
  );
}
