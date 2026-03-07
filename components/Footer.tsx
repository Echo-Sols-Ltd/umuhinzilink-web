'use client';

import { Mail } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { switchLanguage } from '@/lib/language-switch';

export default function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer className="bg-background text-muted-foreground py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo and  Description */}
        <div>
          <p className="font-semibold text-primary-foreground">🌱 {t('app.name')}</p>
          <p className="mt-2 text-sm">
            {t('landing.footer.description')}
          </p>
        </div>

        {/* About */}
        <div>
          <p className="font-semibold text-primary-foreground ">{t('landing.footer.about.title')}</p>
          <ul className="mt-2 space-y-1 cursor-pointer">
            <li>{t('landing.footer.about.mission')}</li>
            <li>{t('landing.footer.about.team')}</li>
            <li>{t('landing.footer.about.partners')}</li>
            <li>{t('landing.footer.about.careers')}</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="font-semibold text-primary-foreground">{t('landing.footer.support.title')}</p>
          <ul className="mt-2 space-y-1  cursor-pointer">
            <li>{t('landing.footer.support.helpCenter')}</li>
            <li>{t('landing.footer.support.contactUs')}</li>
            <li>{t('landing.footer.support.smsSupport')}</li>
            <li>{t('landing.footer.support.training')}</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="font-semibold text-primary-foreground ">{t('landing.footer.contact.title')}</p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center gap-2 text-muted-foreground">
              <PhoneIcon className="w-5 h-5" />
              +250 793 373 953
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-5 h-5" />
              iamshemaleandre@gmail.com
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="w-5 h-5" /> Kigali, Rwanda
            </li>
          </ul>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => switchLanguage('en')}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${locale === 'en' ? 'bg-success text-primary-foreground' : 'bg-muted'}`}
            >
              {t('settings.localization.options.language.en')}
            </button>
            <button
              onClick={() => switchLanguage('rw')}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${locale === 'rw' ? 'bg-success text-primary-foreground' : 'bg-muted'}`}
            >
              {t('settings.localization.options.language.rw')}
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-6">
        {t('landing.footer.copyright')}
      </p>
    </footer>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.88 19.88 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.88 19.88 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.26.45 2.48.94 3.62a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.3 12.3 0 0 0 3.62.94A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 4h16v16H4z" stroke="none"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 1 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}
