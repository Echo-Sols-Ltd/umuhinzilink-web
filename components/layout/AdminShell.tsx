'use client';

import Sidebar from '@/components/shared/Sidebar';
import { UserRole } from '@/types';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={UserRole.ADMIN} hideTopbar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
