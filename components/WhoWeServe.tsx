'use client';

import { Sprout, Store, ShoppingBag } from '@/lib/icons';
import { useI18n } from '@/contexts/I18nContext';

const CARD_ICONS = {
  farmers: Sprout,
  suppliers: Store,
  buyers: ShoppingBag,
} as const;

const CARD_KEYS = ['farmers', 'suppliers', 'buyers'] as const;

export default function WhoWeServe() {
  const { t } = useI18n();

  return (
    <div className="landing-who-section py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="landing-content-block">
          <div className="landing-h2-block-2col">
            <h2 className="landing-h2">{t('landing.whoWeServe.title')}</h2>
            <div className="landing-h2-subheader-w">
              <p className="landing-h-subheader">{t('landing.whoWeServe.subtitle')}</p>
            </div>
          </div>

          <div className="landing-3col-grid">
            {CARD_KEYS.map((key) => {
              const Icon = CARD_ICONS[key];
              return (
                <div key={key} className="landing-benefit-card">
                  <div className="landing-benefit-card-icon-w">
                    <Icon size={23} strokeWidth={1.75} className="text-primary" />
                  </div>
                  <div className="landing-benefit-card-header-w">
                    <h3 className="landing-benefit-card-header">
                      {t(`landing.whoWeServe.cards.${key}.title`)}
                    </h3>
                    <p className="landing-benefit-card-text">
                      {t(`landing.whoWeServe.cards.${key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
