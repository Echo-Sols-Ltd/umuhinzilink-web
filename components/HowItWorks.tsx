'use client';

import { FC } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface Step {
  number: number;
  titleKey: string;
  descriptionKey: string;
}

const steps: Step[] = [
  {
    number: 1,
    titleKey: 'landing.howItWorks.steps.register.title',
    descriptionKey: 'landing.howItWorks.steps.register.description',
  },
  {
    number: 2,
    titleKey: 'landing.howItWorks.steps.listRequest.title',
    descriptionKey: 'landing.howItWorks.steps.listRequest.description',
  },
  {
    number: 3,
    titleKey: 'landing.howItWorks.steps.connect.title',
    descriptionKey: 'landing.howItWorks.steps.connect.description',
  },
  {
    number: 4,
    titleKey: 'landing.howItWorks.steps.grow.title',
    descriptionKey: 'landing.howItWorks.steps.grow.description',
  },
];

const HowItWorks: FC = () => {
  const { t } = useI18n();
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-foreground">{t('landing.howItWorks.title')}</h2>
        <p className="text-center text-muted-foreground mt-2">
          {t('landing.howItWorks.subtitle')}
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 rounded-full bg-success text-primary-foreground flex items-center justify-center text-lg font-semibold mx-auto">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{t(step.titleKey)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(step.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
