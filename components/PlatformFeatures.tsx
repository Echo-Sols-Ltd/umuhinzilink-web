'use client';

import { Brain, Signal, ShoppingBag, CreditCard, Languages, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { Heading, Text, List, ListItem, TypographySection } from '@/components/ui/typography';
import { EnhancedCard, CardGrid } from '@/components/ui/animations/enhanced-card';

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
      gradient: 'from-green-50 to-green-100',
      delay: 0,
    },
    {
      title: 'Market Access',
      bg: 'bg-blue-100',
      iconBg: 'bg-blue-500',
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      description:
        'Connect directly with buyers and access real–time market information and pricing trends.',
      points: ['Direct buyer matching', 'Price trend analysis', 'Demand forecasting'],
      gradient: 'from-blue-50 to-blue-100',
      delay: 0.1,
    },
    {
      title: 'Input Credit',
      bg: 'bg-orange-100',
      iconBg: 'bg-orange-500',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      description:
        'Access agricultural inputs on credit through partnerships with NGOs and microfinance institutions.',
      points: ['Seeds & fertilizer credit', 'NGO partnerships', 'Flexible payment terms'],
      gradient: 'from-orange-50 to-orange-100',
      delay: 0.2,
    },
    {
      title: 'Offline Support',
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: <Signal className="w-6 h-6 text-white" />,
      description:
        'Stay connected even in low–connectivity areas with SMS–based features and notifications.',
      points: ['SMS login & tips', 'Offline notifications', 'Low-bandwidth design'],
      gradient: 'from-green-50 to-green-100',
      delay: 0.3,
    },
    {
      title: 'Kinyarwanda Support',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      icon: <Languages className="w-6 h-6 text-white" />,
      description:
        'Full platform support in Kinyarwanda for UI, chatbot interactions, and SMS communications.',
      points: ['Native language UI', 'Kinyarwanda chatbot', 'Local SMS support'],
      gradient: 'from-purple-50 to-purple-100',
      delay: 0.4,
    },
    {
      title: 'Inventory Management',
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      description:
        'Manage your produce listings and input inventory with real–time updates and tracking.',
      points: ['Real-time inventory', 'Automated updates', 'Order tracking'],
      gradient: 'from-red-50 to-red-100',
      delay: 0.5,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-green-25 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-20 right-10 w-20 h-20 bg-green-400 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-16 w-16 h-16 bg-blue-400 rounded-full blur-xl"
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <TypographySection spacing="normal" className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Heading variant="h2" className="mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Platform Features
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Text variant="body" color="muted" className="text-lg max-w-2xl mx-auto">
                Comprehensive tools for modern agriculture that empower farmers with technology, 
                market access, and financial support
              </Text>
            </motion.div>
          </TypographySection>
        </motion.div>

        {/* Enhanced Feature Cards Grid */}
        <CardGrid columns={3} gap="lg" className="mb-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: feature.delay,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <EnhancedCard 
                variant="elevated"
                hover="float"
                padding="none"
                interactive
                className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500"
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                <div className="relative p-6 h-full flex flex-col">
                  {/* Enhanced Icon and Title */}
                  <motion.div 
                    className="flex items-center space-x-4 mb-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className={`${feature.iconBg} rounded-xl p-3 flex-shrink-0 shadow-lg`}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 5,
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <Heading variant="h5" className="flex-1 font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {feature.title}
                    </Heading>
                  </motion.div>
                  
                  {/* Enhanced Description */}
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Text variant="body-sm" color="secondary" className="mb-6 leading-relaxed text-gray-600">
                      {feature.description}
                    </Text>
                  </motion.div>
                  
                  {/* Enhanced Feature Points */}
                  <div className="mt-auto">
                    <List variant="none" spacing="tight">
                      {feature.points.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.4, 
                            delay: feature.delay + 0.1 + (i * 0.1) 
                          }}
                        >
                          <ListItem className="group/item">
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
                                whileHover={{ scale: 1.5 }}
                                transition={{ duration: 0.2 }}
                              />
                              <Text 
                                variant="body-sm" 
                                color="muted" 
                                className="group-hover/item:text-gray-700 transition-colors font-medium"
                              >
                                {point}
                              </Text>
                            </div>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 pointer-events-none"
                  transition={{ duration: 0.3 }}
                />
              </EnhancedCard>
            </motion.div>
          ))}
        </CardGrid>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Text variant="body" color="muted" className="mb-6">
            Ready to transform your farming experience?
          </Text>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(0, 166, 62, 0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
