'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

type FeatureTab = 'buyer' | 'seller';
type CardLayout = 'wide' | 'narrow';
type CardBlock = 'card1' | 'card2' | 'card3' | 'card4';
type CardTone = 'neutral' | 'lavender' | 'mint';

interface FeatureCardConfig {
  id: string;
  layout: CardLayout;
  block: CardBlock;
  tone: CardTone;
  images: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
}

const BUYER_CARDS: FeatureCardConfig[] = [
  {
    id: 'browse',
    layout: 'wide',
    block: 'card1',
    tone: 'neutral',
    images: { primary: '/market.jpg', secondary: '/fresh-yellow-corn.png' },
  },
  {
    id: 'order',
    layout: 'narrow',
    block: 'card2',
    tone: 'lavender',
    images: { primary: '/african-farmer-woman.png', accent: '/hero.png' },
  },
  {
    id: 'negotiate',
    layout: 'narrow',
    block: 'card3',
    tone: 'mint',
    images: { primary: '/african-woman-farmer.png', secondary: '/produve.png' },
  },
  {
    id: 'trust',
    layout: 'wide',
    block: 'card4',
    tone: 'neutral',
    images: { primary: '/fresh-potatoes.png', secondary: '/avocados.png' },
  },
];

const SELLER_CARDS: FeatureCardConfig[] = [
  {
    id: 'list',
    layout: 'wide',
    block: 'card1',
    tone: 'neutral',
    images: { primary: '/maize.png', secondary: '/garden-hoe-tool.png' },
  },
  {
    id: 'findBuyers',
    layout: 'narrow',
    block: 'card2',
    tone: 'lavender',
    images: { primary: '/market.jpg', accent: '/fresh-green-beans.png' },
  },
  {
    id: 'collaborate',
    layout: 'narrow',
    block: 'card3',
    tone: 'mint',
    images: { primary: '/african-farmer-woman.png', secondary: '/green-beans.png' },
  },
  {
    id: 'monetize',
    layout: 'wide',
    block: 'card4',
    tone: 'neutral',
    images: { primary: '/fresh-orange-carrots.png', secondary: '/npk-fertilizer-bag.png' },
  },
];

function FeatureCardVisual({ card, title }: { card: FeatureCardConfig; title: string }) {
  const { block, images } = card;

  if (block === 'card1') {
    return (
      <div className="landing-features-visual landing-features-visual--card1">
        <div className="landing-features-float-card landing-features-float-card--meta">
          <div className="landing-features-float-row">
            <span className="landing-features-float-dot" />
            <span>Fresh listings near you</span>
          </div>
          <div className="landing-features-float-row">
            <span className="landing-features-float-dot" />
            <span>Filter by region &amp; price</span>
          </div>
          <div className="landing-features-float-row">
            <span className="landing-features-float-dot" />
            <span>Verified seller profiles</span>
          </div>
        </div>
        <div className="landing-features-phone">
          <Image src={images.primary} alt={title} fill className="object-cover" sizes="280px" />
        </div>
        {images.secondary && (
          <Image
            src={images.secondary}
            alt=""
            width={280}
            height={200}
            className="landing-features-img landing-features-img--card1-secondary"
            sizes="280px"
          />
        )}
      </div>
    );
  }

  if (block === 'card2') {
    return (
      <div className="landing-features-visual landing-features-visual--card2">
        {images.accent && (
          <Image
            src={images.accent}
            alt=""
            width={320}
            height={240}
            className="landing-features-img landing-features-img--card2-accent"
            sizes="320px"
          />
        )}
        <div className="landing-features-profile-card">
          <div className="landing-features-profile-top">
            <div className="landing-features-profile-avatar">
              <Image src={images.primary} alt={title} fill className="object-cover" sizes="56px" />
            </div>
            <div>
              <p className="landing-features-profile-name">Verified seller</p>
              <p className="landing-features-profile-meta">5.0★ · Farm fresh</p>
            </div>
          </div>
          <div className="landing-features-profile-gallery">
            {[images.primary, images.accent ?? images.primary, images.primary].map((src, i) => (
              <div key={i} className="landing-features-profile-thumb">
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
          <p className="landing-features-profile-quote">Ready to fulfill your order this week.</p>
        </div>
      </div>
    );
  }

  if (block === 'card3') {
    return (
      <div className="landing-features-visual landing-features-visual--card3">
        <div className="landing-features-card3-stack">
          <div className="landing-features-phone landing-features-phone--card3">
            <div className="landing-features-phone-header">
              <span>Messages</span>
              <span className="landing-features-phone-badge">3</span>
            </div>
            <div className="landing-features-chat-preview">
              <div className="landing-features-chat-avatar">
                <Image src={images.primary} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="landing-features-chat-name">Seller</p>
                <p className="landing-features-chat-msg">Can we agree on RWF 2,500/kg?</p>
              </div>
            </div>
          </div>
          {images.secondary && (
            <Image
              src={images.secondary}
              alt=""
              width={400}
              height={90}
              className="landing-features-img landing-features-img--card3-strip"
              sizes="400px"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="landing-features-visual landing-features-visual--card4">
      <div className="landing-features-card4-media">
        <Image
          src={images.primary}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 560px"
        />
        <div className="landing-features-card4-media-fade" aria-hidden />
      </div>
      <div className="landing-features-float-card landing-features-float-card--review">
        <div className="landing-features-stars" aria-hidden>
          {'★★★★☆'}
        </div>
        <p className="landing-features-review-text">
          Great quality produce — delivery was fast and exactly as listed.
        </p>
        <div className="landing-features-review-user">
          <div className="landing-features-review-avatar">
            {images.secondary && (
              <Image src={images.secondary} alt="" fill className="object-cover" sizes="36px" />
            )}
          </div>
          <div>
            <p className="landing-features-review-name">Happy buyer</p>
            <p className="landing-features-review-role">5.0★ · Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  card,
  title,
  description,
}: {
  card: FeatureCardConfig;
  title: string;
  description: string;
}) {
  return (
    <article
      className={cn(
        'landing-features-card',
        `landing-features-card--${card.tone}`,
        card.layout === 'wide' ? 'landing-features-card--wide' : 'landing-features-card--narrow',
      )}
    >
      <div className="landing-features-card-header">
        <h3 className="landing-features-h3">{title}</h3>
        <p className="landing-features-item-desc">{description}</p>
      </div>
      <FeatureCardVisual card={card} title={title} />
    </article>
  );
}

export default function PlatformFeatures() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<FeatureTab>('buyer');

  return (
    <div className="landing-features-section py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="landing-features-content-block">
          <div className="landing-features-intro">
            <div className="landing-features-h2-block">
              <h2 className="landing-features-h2">{t('landing.features.title')}</h2>
              <div className="landing-features-h2-subheader-w">
                <p className="landing-h-subheader">{t('landing.features.subtitle')}</p>
              </div>
            </div>

            <div className="landing-features-tabs-menu-wrap">
              <div
                className="landing-features-tabs-menu"
                role="tablist"
                aria-label={t('landing.features.tabs.ariaLabel')}
              >
                {(['buyer', 'seller'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`features-tab-${tab}`}
                    aria-selected={activeTab === tab}
                    aria-controls={`features-panel-${tab}`}
                    className={cn(
                      'landing-features-tab-button',
                      activeTab === tab && 'is-active',
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`landing.features.tabs.${tab}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="landing-features-tabs" data-current={activeTab}>
            <div className="landing-features-tab-content">
              {(['buyer', 'seller'] as const).map((tab) => (
                <div
                  key={tab}
                  id={`features-panel-${tab}`}
                  role="tabpanel"
                  aria-labelledby={`features-tab-${tab}`}
                  hidden={activeTab !== tab}
                  className={cn(
                    'landing-features-tab-pane',
                    activeTab === tab && 'is-active',
                  )}
                >
                  <div className="landing-features-tab-grid">
                    {(tab === 'buyer' ? BUYER_CARDS : SELLER_CARDS).map((card) => (
                      <FeatureCard
                        key={`${tab}-${card.id}`}
                        card={card}
                        title={t(`landing.features.${tab}.cards.${card.id}.title`)}
                        description={t(`landing.features.${tab}.cards.${card.id}.description`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
