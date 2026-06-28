'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import AdminGuard from '@/contexts/guard/AdminGuard';
import AdminShell from '@/components/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AdminProvider>
  );
}
