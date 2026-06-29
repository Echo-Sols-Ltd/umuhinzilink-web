'use client';

import Link from 'next/link';
import NavAnchorLink from '@/components/NavAnchorLink';
import { ArrowRight } from '@/lib/icons';
import { useI18n } from '@/contexts/I18nContext';
import HeroSlider from '@/components/home/HeroSlider';
import { ROUTES } from '@/lib/routes';
export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero-section bg-background overflow-hidden pt-[71px] lg:pt-0 lg:mt-[71px]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 xl:py-14">
        <div className="hero-main-grid grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-10 xl:gap-14 items-center w-full">
          {/* Left column — copy & CTAs */}
          <div className="hero-left-col order-2 lg:order-1 min-h-0">
            <div className="h1-block-w max-w-xl space-y-5 lg:space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                </span>
                {t('landing.hero.badge')}
              </div>

              <div className="h1-block space-y-3 lg:space-y-4">
                <h1 className="text-[2rem] sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] font-extrabold leading-[1.06] tracking-tight text-foreground">
                  <span className="block">{t('landing.hero.title.line1')}</span>
                  <span className="block">{t('landing.hero.title.line2')}</span>
                  <span className="block text-green-600">{t('landing.hero.title.highlight')}</span>
                </h1>
                <p className="h-subheader text-sm sm:text-base lg:text-[0.9375rem] xl:text-lg text-muted-foreground max-w-[22rem] sm:max-w-md leading-relaxed">
                  {t('landing.hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={ROUTES.products}
                  className="inline-flex h-11 lg:h-10 xl:h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/30"
                >
                  {t('landing.hero.cta.getStarted')}
                  <ArrowRight size={16} />
                </Link>
                <NavAnchorLink
                  href={ROUTES.homeFeatures}
                  className="inline-flex h-11 lg:h-10 xl:h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {t('landing.hero.cta.viewDemo')}
                </NavAnchorLink>
              </div>
            </div>
          </div>

          {/* Right column — Swiper carousel */}
          <div className="hero-slider-col order-1 lg:order-2 min-h-0 flex flex-col justify-center">
            <HeroSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
