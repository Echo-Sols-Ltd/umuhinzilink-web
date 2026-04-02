'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export const NegotiationEmptyState: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="relative mb-12">
        {/* Animated Background Rings */}
        <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 animate-pulse" />
        <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 animate-pulse [animation-delay:-0.5s]" />
        
        {/* Hands Illustration Mock - Using SVG for high quality */}
        <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl border border-gray-50 overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full p-8 text-primary">
                <path 
                    fill="currentColor" 
                    fillOpacity="0.1" 
                    d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"
                />
                <path 
                    fill="currentColor" 
                    d="M140 90h-30V60c0-5.5-4.5-10-10-10s-10 4.5-10 10v30H60c-5.5 0-10 4.5-10 10s4.5 10 10 10h30v30c0 5.5 4.5 10 10 10s10-4.5 10-10v-30h30c5.5 0 10-4.5 10-10s-4.5-10-10-10z"
                />
            </svg>
        </div>
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{t('negotiations.emptyStateTitle')}</h2>
      <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
        {t('negotiations.emptyStateDescription')}
      </p>

      <Link 
        href="/products" 
        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-3"
      >
        <Search className="w-4 h-4" />
        {t('negotiations.browseProducts')}
      </Link>
    </div>
  );
};
