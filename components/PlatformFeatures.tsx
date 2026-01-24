'use client';

import { Brain, Signal, ShoppingBag, CreditCard, Languages, ClipboardList } from 'lucide-react';
import { Heading, Text, List, ListItem, TypographySection } from '@/components/ui/typography';

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
    <section className="py-12 bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <TypographySection spacing="normal" className="text-center mb-10">
          <Heading variant="h2" className="mb-2">
            Platform Features
          </Heading>
          <Text variant="body" color="muted">
            Comprehensive tools for modern agriculture
          </Text>
        </TypographySection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`${feature.iconBg} rounded-full p-3 flex-shrink-0`}>
                  {feature.icon}
                </div>
                <Heading variant="h5" className="flex-1">
                  {feature.title}
                </Heading>
              </div>
              
              <Text variant="body-sm" color="secondary" className="mb-4">
                {feature.description}
              </Text>
              
              <List variant="none" spacing="tight">
                {feature.points.map((point, i) => (
                  <ListItem key={i}>
                    <Text variant="body-sm" color="muted">
                      • {point}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
