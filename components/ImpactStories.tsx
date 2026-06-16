'use client';

import { User } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function ImpactStories() {
  const { t: translate } = useI18n();

  const testimonials = [
    {
      name: 'Marie Uwimana',
      roleKey: 'landing.impact.testimonials.marie.role',
      quoteKey: 'landing.impact.testimonials.marie.quote',
    },
    {
      name: 'Jean Baptiste',
      roleKey: 'landing.impact.testimonials.jean.role',
      quoteKey: 'landing.impact.testimonials.jean.quote',
    },
    {
      name: 'Agnes Mukamana',
      roleKey: 'landing.impact.testimonials.agnes.role',
      quoteKey: 'landing.impact.testimonials.agnes.quote',
    },
  ];

  const highlights = [
    { labelKey: 'landing.impact.metrics.registeredFarmers' },
    { labelKey: 'landing.impact.metrics.activeSuppliers' },
    { labelKey: 'landing.impact.metrics.averageYieldIncrease' },
    { labelKey: 'landing.impact.metrics.totalTransactions' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground">
          {translate('landing.impact.title')}
        </h2>
        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
          {translate('landing.impact.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white dark:bg-gray-900 border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center">
                  <User size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{translate(testimonial.roleKey)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                &ldquo;{translate(testimonial.quoteKey)}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {highlights.map((item) => (
            <div
              key={item.labelKey}
              className="bg-white dark:bg-gray-900 border border-border rounded-2xl p-4 text-center"
            >
              <p className="text-sm font-medium text-foreground">{translate(item.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
