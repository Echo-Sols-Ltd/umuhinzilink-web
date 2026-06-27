'use client';

import PageLoading from '@/components/layout/PageLoading';
import { useI18n } from '@/contexts/I18nContext';

export default function Loading() {
  const { t } = useI18n();

  return (
    <PageLoading
      label={t('layout.loadingPage.label')}
      description={t('layout.loadingPage.description')}
    />
  );
}
