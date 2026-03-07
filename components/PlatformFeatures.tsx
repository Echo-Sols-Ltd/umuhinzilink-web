'use client';

import { Brain, Signal, ShoppingBag, CreditCard, Languages, ClipboardList } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function PlatformFeatures() {
  const { t } = useI18n();
  const features = [
    {
      titleKey: 'landing.features.items.aiAdvisory.title',
      bg: 'bg-green-100',
      iconBg: 'bg-green-500',
      icon: <Brain className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.aiAdvisory.description',
      pointsKeys: [
        'landing.features.items.aiAdvisory.points.cropGuidance',
        'landing.features.items.aiAdvisory.points.weatherRecommendations',
        'landing.features.items.aiAdvisory.points.soilAnalysis',
      ],
    },
    {
      titleKey: 'landing.features.items.marketAccess.title',
      bg: 'bg-blue-100',
      iconBg: 'bg-blue-500',
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.marketAccess.description',
      pointsKeys: [
        'landing.features.items.marketAccess.points.directBuyerMatching',
        'landing.features.items.marketAccess.points.priceTrendAnalysis',
        'landing.features.items.marketAccess.points.demandForecasting',
      ],
    },
    {
      titleKey: 'landing.features.items.inputCredit.title',
      bg: 'bg-orange-100',
      iconBg: 'bg-orange-500',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.inputCredit.description',
      pointsKeys: [
        'landing.features.items.inputCredit.points.seedsAndFertilizerCredit',
        'landing.features.items.inputCredit.points.ngoPartnerships',
        'landing.features.items.inputCredit.points.flexiblePaymentTerms',
      ],
    },
    {
      titleKey: 'landing.features.items.offlineSupport.title',
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: <Signal className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.offlineSupport.description',
      pointsKeys: [
        'landing.features.items.offlineSupport.points.smsLoginAndTips',
        'landing.features.items.offlineSupport.points.offlineNotifications',
        'landing.features.items.offlineSupport.points.lowBandwidthDesign',
      ],
    },
    {
      titleKey: 'landing.features.items.kinyarwandaSupport.title',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      icon: <Languages className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.kinyarwandaSupport.description',
      pointsKeys: [
        'landing.features.items.kinyarwandaSupport.points.nativeUi',
        'landing.features.items.kinyarwandaSupport.points.chatbot',
        'landing.features.items.kinyarwandaSupport.points.smsSupport',
      ],
    },
    {
      titleKey: 'landing.features.items.inventoryManagement.title',
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      descriptionKey: 'landing.features.items.inventoryManagement.description',
      pointsKeys: [
        'landing.features.items.inventoryManagement.points.realTimeInventory',
        'landing.features.items.inventoryManagement.points.automatedUpdates',
        'landing.features.items.inventoryManagement.points.orderTracking',
      ],
    },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-foreground">{t('landing.features.title')}</h2>
        <p className="text-center text-muted-foreground mt-2">{t('landing.features.subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {features.map((feature, idx) => (
            <div key={idx} className={`bg-card rounded-lg shadow-sm p-6`}>
              <div className="flex items-center space-x-3">
                <div className={`${feature.iconBg} rounded-full p-3`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{t(feature.titleKey)}</h3>
              </div>
              <p className="text-muted-foreground text-sm mt-3">{t(feature.descriptionKey)}</p>
              <ul className="mt-3 space-y-1">
                {feature.pointsKeys.map((pointKey, i) => (
                  <li key={i} className="text-muted-foreground text-sm">
                    • {t(pointKey)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
