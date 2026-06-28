'use client';
import React, { useState } from 'react';
import { ChevronDown, Globe } from '@/lib/icons';
import { useI18n } from '@/contexts/I18nContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as any);
    setIsOpen(false);
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', langCode);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${
                  lang.code === locale ? 'bg-muted text-foreground' : 'text-muted-foreground'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === locale && (
                  <span className="ml-auto text-success">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
