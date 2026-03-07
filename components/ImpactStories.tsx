'use client';

import { useI18n } from '@/contexts/I18nContext';

export default function ImpactStories() {
  const { t: translate } = useI18n();
  const metrics = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      value: '500+',
      labelKey: 'landing.impact.metrics.registeredFarmers',
    },
    {
      value: '50+',
      labelKey: 'landing.impact.metrics.activeSuppliers',
    },
    {
      value: '30%',
      labelKey: 'landing.impact.metrics.averageYieldIncrease',
    },
    {
      value: '$50K',
      labelKey: 'landing.impact.metrics.totalTransactions',
    },
  ];

  const testimonials = [
    {
      name: 'Marie Uwimana',
      roleKey: 'landing.impact.testimonials.marie.role',
      quoteKey: 'landing.impact.testimonials.marie.quote',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Jean Baptiste',
      roleKey: 'landing.impact.testimonials.jean.role',
      quoteKey: 'landing.impact.testimonials.jean.quote',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      name: 'Agnes Mukamana',
      roleKey: 'landing.impact.testimonials.agnes.role',
      quoteKey: 'landing.impact.testimonials.agnes.quote',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-foreground">{translate('landing.impact.title')}</h2>
        <p className="text-center text-muted-foreground mt-2">
          {translate('landing.impact.subtitle')}
        </p>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-card shadow-md rounded-lg p-4">
              {/* Profile */}
              <div className="flex items-center mb-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{translate(testimonial.roleKey)}</p>
                </div>
              </div>
              {/* Quote */}
              <p className="text-foreground text-sm ">"{translate(testimonial.quoteKey)}"</p>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-8">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-lg font-semibold mt-2 text-success ">{m.value}</p>
              <p className="text-muted-foreground text-sm">{translate(m.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
