'use client';

import { useState } from 'react';
import { Brain } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';
import AssistantChat from '@/components/ai/AssistantChat';

export default function AssistantWidget() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  const hiddenOnRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/assistant') ||
    !isAuthenticated ||
    isAdmin;

  if (hiddenOnRoute) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
          aria-label={t('assistant.open')}
        >
          <Brain size={20} />
          <span className="text-sm font-semibold hidden sm:inline">{t('assistant.title')}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,420px)] h-[min(85vh,600px)]">
          <AssistantChat layout="panel" onClose={() => setOpen(false)} className="h-full" />
        </div>
      )}
    </>
  );
}
