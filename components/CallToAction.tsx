'use client';

import { useI18n } from '@/contexts/I18nContext';

export default function CallToAction() {
  const { t } = useI18n();
  const buttons = [
    { textKey: 'landing.cta.buttons.farmers', color: 'bg-card text-success', icon: UsersIcon },
    { textKey: 'landing.cta.buttons.business', color: 'bg-card text-success', icon: BriefcaseIcon },
    { textKey: 'landing.cta.buttons.sms', color: 'bg-card text-success', icon: MessageSquareIcon },
  ];

  return (
    <section className="bg-background py-20 text-foreground text-center">
      <h2 className="text-2xl font-semibold">{t('landing.cta.title')}</h2>
      <p className="mt-2">
        {t('landing.cta.subtitle')}
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow cursor-pointer ${btn.color}`}
          >
            <btn.icon className="w-5 h-5" />
            {t(btn.textKey)}
          </button>
        ))}
      </div>
      <p className="text-sm mt-2">{t('landing.cta.noSmartphone')}</p>
    </section>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"></rect>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
    </svg>
  );
}
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
