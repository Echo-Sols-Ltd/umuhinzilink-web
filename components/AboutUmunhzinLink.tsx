'use client';

import React from 'react';
import { CheckIcon } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const AboutUmuhinzinLink: React.FC = () => {
  const { t } = useI18n();
  return (
    <section className="flex flex-col md:flex-row items-center justify-center max-w-full mx-auto px-6 md:px-12 py-12 gap-36 bg-background">
      {/* Left side*/}
      <div className="relative flex-shrink-0">
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden shadow-2xl ring-4 ring-success/20 hover:ring-success/40 transition-all duration-300 transform hover:scale-105">
          <img
            src="/about1.png"
            alt={t('landing.about.images.primaryAlt')}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="absolute bottom-0 left-0 transform translate-x-[-25%] translate-y-[25%] w-[200px] h-[200px] md:w-[230px] md:h-[230px] rounded-full overflow-hidden border-4 border-success/30 shadow-2xl bg-card hover:border-success/50 transition-all duration-300 hover:scale-110">
          <img
            src="/about2.png"
            alt={t('landing.about.images.secondaryAlt')}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="max-w-xl">
        <p className="text-sm text-success font-semibold mb-2 border border-border  w-52 px-5 py-2 rounded-md">
          {t('landing.about.badge')}
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
          {t('landing.about.title')}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t('landing.about.description')}
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <span className="flex mt-1 w-5 h-5 rounded-full bg-success text-primary-foreground items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-foreground">{t('landing.about.points.marketAccess.title')}</p>
              <p className="text-muted-foreground text-sm">{t('landing.about.points.marketAccess.description')}</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="flex mt-1 w-5 h-5 rounded-full bg-success text-primary-foreground items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-foreground">{t('landing.about.points.aiAdvice.title')}</p>
              <p className="text-muted-foreground text-sm">
                {t('landing.about.points.aiAdvice.description')}
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="flex mt-1 w-5 h-5 rounded-full bg-success text-primary-foreground items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-foreground">{t('landing.about.points.financialInclusion.title')}</p>
              <p className="text-muted-foreground text-sm">{t('landing.about.points.financialInclusion.description')}</p>
            </div>
          </li>
        </ul>

        <button className="bg-success text-primary-foreground px-6 py-2 rounded hover:bg-success/90 transition cursor-pointer">
          {t('landing.about.learnMore')}
        </button>
      </div>
    </section>
  );
};

export default AboutUmuhinzinLink;
