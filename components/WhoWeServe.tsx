'use client';

import { motion } from 'framer-motion';
import { Heading, Text, List, ListItem, TypographySection } from '@/components/ui/typography';
import { EnhancedCard } from '@/components/ui/animations/enhanced-card';

const LucideIcons = {
  Phone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h2.5a1 1 0 011 .78l1 4a1 1 0 01-.25.92l-1.5 1.5a16 16 0 006.72 6.72l1.5-1.5a1 1 0 01.92-.25l4 1a1 1 0 01.78 1V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
      />
    </svg>
  ),
  Leaf: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13c0 5 4 9 9 9s9-4 9-9-4-9-9-9H5v9z"
      />
    </svg>
  ),
  CreditCard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  ChartBar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  ClipboardList: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 5h6M9 3h6v2H9z" />
      <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
      <path d="M9 9h6M9 13h6M9 17h6" />
    </svg>
  ),
  Users: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M17 21v-2a4 4 0 00-3-3.87" />
      <path d="M9 21v-2a4 4 0 013-3.87" />
      <path d="M7 4a4 4 0 100 8 4 4 0 000-8z" />
      <path d="M17 4a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  Search: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Lock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
};

export default function WhoWeServe() {
  const data = [
    {
      title: 'Farmers',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      gradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      items: [
        { icon: LucideIcons.Phone, text: 'Mobile OTP & Kinyarwanda support' },
        { icon: LucideIcons.Leaf, text: 'AI-powered agronomy tips' },
        { icon: LucideIcons.CreditCard, text: 'Credit access for inputs' },
        { icon: LucideIcons.ChartBar, text: 'Market price trends' },
      ],
      delay: 0,
    },
    {
      title: 'Suppliers',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      items: [
        { icon: LucideIcons.ClipboardList, text: 'List agri-inputs & inventory' },
        { icon: LucideIcons.Users, text: 'Farmer demand matching' },
        { icon: LucideIcons.CreditCard, text: 'Credit request management' },
        { icon: LucideIcons.ChartBar, text: 'Sales tracking & analytics' },
      ],
      delay: 0.2,
    },
    {
      title: 'Buyers',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      items: [
        { icon: LucideIcons.Search, text: 'Browse fresh produce' },
        { icon: LucideIcons.ClipboardList, text: 'Filter by region & price' },
        { icon: LucideIcons.Phone, text: 'Direct farmer contact' },
        { icon: LucideIcons.Lock, text: 'Secure payment processing' },
      ],
      delay: 0.4,
    },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-16 left-10 w-24 h-24 bg-green-400 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-16 w-20 h-20 bg-blue-400 rounded-full blur-xl"
          animate={{ 
            y: [-8, 8, -8],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
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
              <Heading variant="h2" className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Who We Serve
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Text variant="body" color="muted" className="text-lg max-w-2xl mx-auto">
                Three interconnected communities driving agricultural growth and innovation in Rwanda
              </Text>
            </motion.div>
          </TypographySection>
        </motion.div>

        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: group.delay,
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
                <div className={`absolute inset-0 bg-gradient-to-br ${group.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                
                <div className="relative p-8 h-full">
                  {/* Enhanced Title */}
                  <motion.div
                    className="mb-8"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heading 
                      variant="h4" 
                      className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors flex items-center gap-3"
                    >
                      <motion.div 
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${group.gradient.replace('from-', 'from-').replace('to-', 'to-').replace('-50', '-400').replace('-100', '-600')}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {group.title}
                    </Heading>
                  </motion.div>
                  
                  {/* Enhanced Feature List */}
                  <List variant="none" spacing="normal">
                    {group.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.4, 
                          delay: group.delay + 0.1 + (idx * 0.1) 
                        }}
                      >
                        <ListItem className="group/item mb-4">
                          <motion.div 
                            className="flex items-center gap-4 p-3 rounded-lg bg-white/50 group-hover/item:bg-white/80 transition-all duration-300 hover:shadow-md"
                            whileHover={{ x: 5, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div 
                              className={`${group.iconColor} p-2 rounded-lg bg-white shadow-sm group-hover/item:shadow-md transition-all duration-300`}
                              whileHover={{ 
                                scale: 1.1, 
                                rotate: 5 
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.icon}
                            </motion.div>
                            <Text 
                              variant="body-sm" 
                              color="secondary" 
                              className="font-medium group-hover/item:text-gray-700 transition-colors flex-1"
                            >
                              {item.text}
                            </Text>
                          </motion.div>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${group.gradient.replace('-50', '-400/10').replace('-100', '-600/10')} opacity-0 group-hover:opacity-100 pointer-events-none`}
                  transition={{ duration: 0.3 }}
                />
              </EnhancedCard>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Connection Visualization */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"
              animate={{ scaleX: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div 
              className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500"
              animate={{ scaleX: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="w-3 h-3 bg-orange-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>
          <Text variant="body" color="muted" className="max-w-lg mx-auto">
            Our platform creates a seamless ecosystem where farmers, suppliers, and buyers 
            connect to drive agricultural innovation and economic growth.
          </Text>
        </motion.div>
      </div>
    </section>
  );
}
