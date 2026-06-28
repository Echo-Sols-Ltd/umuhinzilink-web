'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useI18n } from '@/contexts/I18nContext';

import 'swiper/css';
import 'swiper/css/pagination';

const HERO_SLIDES = [
  { src: '/hero.png', altKey: 'landing.hero.slides.marketplace' as const },
  { src: '/market.jpg', altKey: 'landing.hero.slides.market' as const },
  { src: '/african-farmer-woman.png', altKey: 'landing.hero.slides.farmer' as const },
  { src: '/fresh-yellow-corn.png', altKey: 'landing.hero.slides.produce' as const },
] as const;

export default function HeroSlider() {
  const { t } = useI18n();

  return (
    <div className="hero-slider-block w-full">
      <div className="hero-slider-grid">
        <div className="hero-swiper-1-w">
          <Swiper
            modules={[Pagination, Autoplay]}
            className="hero-main-slider swiper-horizontal swiper-backface-hidden"
            slidesPerView={1}
            loop
            speed={700}
            autoplay={{
              delay: 5500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: '.hero-swiper-pagination',
              type: 'bullets',
            }}
            navigation={false}
            onBeforeInit={(swiper) => {
              swiper.params.pagination = {
                ...(typeof swiper.params.pagination === 'object' ? swiper.params.pagination : {}),
                el: '.hero-swiper-pagination',
                clickable: true,
                type: 'bullets',
              };
            }}
          >
            {HERO_SLIDES.map((slide, index) => (
              <SwiperSlide key={slide.src} className="hero-main-slide">
                <div className="hero-main-slide-img-w">
                  <div className="hero-main-slide-img-inner">
                    <Image
                      src={slide.src}
                      alt={t(slide.altKey)}
                      fill
                      priority={index === 0}
                      className="hero-main-slide-img"
                      sizes="(max-width: 1024px) 90vw, 560px"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-pagination-w">
            <div className="hero-swiper-pagination swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal" />
          </div>
        </div>
      </div>
    </div>
  );
}
