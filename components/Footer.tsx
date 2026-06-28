'use client';

import Link from 'next/link';
import NavAnchorLink from '@/components/NavAnchorLink';
import { Sprout, Mail, Phone, MapPin } from '@/lib/icons';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { applyLocale } from '@/lib/localeUser';
import type { SupportedLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';

export default function Footer() {
  const { t, locale } = useI18n();
  const { user, loadAuthState } = useAuth();

  const setLanguage = async (code: SupportedLocale) => {
    await applyLocale(code, user ? { userId: user.id, persist: true } : undefined);
    if (user) await loadAuthState();
  };

  return (
    <footer className="border-t border-border bg-white dark:bg-gray-900 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href={ROUTES.home} className="flex items-center gap-2">
              <Sprout size={20} className="text-green-600" />
              <span className="font-extrabold text-base">
                <span className="text-green-600">Umuhinzi</span>
                <span className="text-foreground">Link</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('landing.footer.description')}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">
              {t('landing.footer.about.title')}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={ROUTES.products} className="hover:text-foreground transition-colors">
                  Browse products
                </Link>
              </li>
              <li>
                <Link href={ROUTES.becomeSeller} className="hover:text-foreground transition-colors">
                  Become a seller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">
              {t('landing.footer.support.title')}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <NavAnchorLink href={ROUTES.homeContact} className="hover:text-foreground transition-colors">
                  {t('landing.footer.support.helpCenter')}
                </NavAnchorLink>
              </li>
              <li>
                <NavAnchorLink href={ROUTES.homeContact} className="hover:text-foreground transition-colors">
                  {t('landing.footer.support.contactUs')}
                </NavAnchorLink>
              </li>
              <li>
                <Link href={ROUTES.signIn} className="hover:text-foreground transition-colors">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground mb-3">
              {t('landing.footer.contact.title')}
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-green-600 shrink-0" />
                +250 793 373 953
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-green-600 shrink-0" />
                support@umuhinzilink.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-green-600 shrink-0" />
                {t('landing.footer.contact.location')}
              </li>
            </ul>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  locale === 'en'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-foreground',
                )}
              >
                {t('settings.localization.options.language.en')}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('rw')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  locale === 'rw'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-foreground',
                )}
              >
                {t('settings.localization.options.language.rw')}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  locale === 'fr'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-foreground',
                )}
              >
                {t('settings.localization.options.language.fr')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          {t('landing.footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
