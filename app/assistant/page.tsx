'use client';

import AppLayout from '@/components/layout/AppLayout';
import AssistantChat from '@/components/ai/AssistantChat';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';

export default function AssistantPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const isSeller = user?.role === UserRole.SELLER;

  return (
    <AppLayout maxWidth="max-w-4xl" mainClassName="flex flex-col !py-4 !pb-6 min-h-[calc(100vh-4rem)]">
      <div className="shrink-0 mb-3 px-1">
        <h1 className="text-xl font-bold text-foreground">{t('assistant.page.title')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t(isSeller ? 'assistant.page.description' : 'assistant.page.descriptionBuyer')}
        </p>
      </div>
      <AssistantChat layout="full" className="flex-1" />
    </AppLayout>
  );
}
