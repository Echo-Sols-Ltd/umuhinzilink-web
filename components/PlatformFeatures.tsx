'use client';

import { Brain, Signal, ShoppingBag, CreditCard, Languages, ClipboardList } from 'lucide-react';

export default function PlatformFeatures() {
  const features = [
    {
      title: 'AI–Powered Advisory',
      bg: 'bg-green-100',
      iconBg: 'bg-green-500',
      icon: <Brain className="w-6 h-6 text-white" />,
      description:
        'Get personalized agronomy tips via chatbot and SMS based on your crops and local conditions.',
      points: [
        'Crop-specific guidance',
        'Weather-based recommendations',
        'Soil condition analysis',
      ],
    },
    {
      title: 'Market Access',
      bg: 'bg-blue-100',
      iconBg: 'bg-blue-500',
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      description:
        'Connect directly with buyers and access real–time market information and pricing trends.',
      points: ['Direct buyer matching', 'Price trend analysis', 'Demand forecasting'],
    },
    {
      title: 'Input Credit',
      bg: 'bg-orange-100',
      iconBg: 'bg-orange-500',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      description:
        'Access agricultural inputs on credit through partnerships with NGOs and microfinance institutions.',
      points: ['Seeds & fertilizer credit', 'NGO partnerships', 'Flexible payment terms'],
    },
    {
      title: 'Offline Support',
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: <Signal className="w-6 h-6 text-white" />,
      description:
        'Stay connected even in low–connectivity areas with SMS–based features and notifications.',
      points: ['SMS login & tips', 'Offline notifications', 'Low-bandwidth design'],
    },
    {
      title: 'Kinyarwanda Support',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      icon: <Languages className="w-6 h-6 text-white" />,
      description:
        'Full platform support in Kinyarwanda for UI, chatbot interactions, and SMS communications.',
      points: ['Native language UI', 'Kinyarwanda chatbot', 'Local SMS support'],
    },
    {
      title: 'Inventory Management',
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      description:
        'Manage your produce listings and input inventory with real–time updates and tracking.',
      points: ['Real-time inventory', 'Automated updates', 'Order tracking'],
    },
  ];

  return (
    <section className="py-12 bg-success/10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-foreground">Platform Features</h2>
        <p className="text-center text-muted-foreground mt-2">Comprehensive tools for modern agriculture</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {features.map((feature, idx) => (
            <div key={idx} className={`bg-card rounded-lg shadow-sm p-6`}>
              <div className="flex items-center space-x-3">
                <div className={`${feature.iconBg} rounded-full p-3`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mt-3">{feature.description}</p>
              <ul className="mt-3 space-y-1">
                {feature.points.map((point, i) => (
                  <li key={i} className="text-muted-foreground text-sm">
                    • {point}
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
