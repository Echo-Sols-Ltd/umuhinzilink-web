'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            {t('landing.hero.title.line1')}{' '}
            <span className="text-green-600">{t('landing.hero.title.highlight')}</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="h-10 px-5 flex items-center justify-center bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              {t('landing.hero.cta.getStarted')}
            </Link>
            <Link
              href="/about#features"
              className="h-10 px-5 flex items-center justify-center border border-border bg-white dark:bg-gray-900 text-foreground text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('landing.hero.cta.viewDemo')}
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-border bg-white dark:bg-gray-900 shadow-sm">
            <Image
              src="/hero.png"
              alt={t('landing.hero.imageAlt')}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
