'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BannerData {
  title: string;
  subtitle: string;
  image: string;
}

interface BannerProps {
  banners: BannerData[];
  className?: string;
}

export function Banner({ banners, className = '' }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className={`relative bg-gradient-to-r from-teal-600 to-green-500 rounded-xl p-8 text-white overflow-hidden ${className}`}>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
        aria-label="Next banner"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-2">{formatDate()}</p>
          <h2 className="text-2xl font-bold mb-2">{currentBanner.title}</h2>
          <p className="text-lg opacity-90">{currentBanner.subtitle}</p>
        </div>
        <div className="w-64 h-48 bg-white/10 rounded-lg flex items-center justify-center ml-8">
          <img
            src={currentBanner.image}
            alt="Banner"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

function formatDate() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

