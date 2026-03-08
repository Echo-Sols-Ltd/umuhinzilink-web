'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t('landing.hero.title.line1')}{' '}
            <span className="text-success">{t('landing.hero.title.highlight')}</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg">
            {t('landing.hero.subtitle')}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <a href="#" className="bg-success text-primary-foreground px-5 py-2 rounded-md hover:bg-success/90">
              {t('landing.hero.cta.getStarted')}
            </a>
            <a
              href="#"
              className="border border-border text-foreground px-5 py-2 rounded-md hover:bg-muted"
            >
              {t('landing.hero.cta.viewDemo')}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex space-x-10">
            <div>
              <p className="text-success text-2xl font-semibold">500+</p>
              <p className="text-muted-foreground text-sm">{t('landing.hero.stats.registeredFarmers')}</p>
            </div>
            <div>
              <p className="text-purple-600 text-2xl font-semibold">50+</p>
              <p className="text-muted-foreground text-sm">{t('landing.hero.stats.inputSuppliers')}</p>
            </div>
            <div>
              <p className="text-info text-2xl font-semibold">1000+</p>
              <p className="text-muted-foreground text-sm">{t('landing.hero.stats.transactionsCompleted')}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-2xl h-[500px]">
            <Image
              src="/hero.png"
              alt={t('landing.hero.imageAlt')}
              fill
              className=" w-xl h-[500px] object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
