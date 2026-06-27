'use client';

import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import { useI18n } from '@/contexts/I18nContext';
import { Brain, Sprout, Search, Camera, TrendingUp, MessageCircle } from 'lucide-react';

const FEATURES = [
  { icon: MessageCircle, key: 'chat' },
  { icon: Sprout, key: 'farming' },
  { icon: Camera, key: 'crop' },
  { icon: TrendingUp, key: 'price' },
  { icon: Search, key: 'search' },
] as const;

export default function AssistantPage() {
  const { t } = useI18n();

  return (
    <AppLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t('assistant.page.title')}
        description={t('assistant.page.description')}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {FEATURES.map(({ icon: Icon, key }) => (
          <div
            key={key}
            className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t(`assistant.features.${key}.title`)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t(`assistant.features.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <Brain size={24} className="text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          {t('assistant.page.hint')}
        </p>
      </div>
    </AppLayout>
  );
}
