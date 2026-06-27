'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import AdminGuard from '@/contexts/guard/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminProvider>
  );
}
