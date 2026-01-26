'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from '@/components/ui/typography';
import { UserPlus, ListPlus, Users, TrendingUp } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Register',
    description: 'Sign up via mobile OTP or email. Quick and secure registration process with Kinyarwanda support.',
    icon: <UserPlus className="w-8 h-8" />,
    color: 'text-green-600',
    gradient: 'from-green-100 to-green-200',
  },
  {
    number: 2,
    title: 'List & Request',
    description: 'List your produce or request agri-inputs on credit through our platform with real-time inventory.',
    icon: <ListPlus className="w-8 h-8" />,
    color: 'text-blue-600',
    gradient: 'from-blue-100 to-blue-200',
  },
  {
    number: 3,
    title: 'Connect',
    description: 'Get matched with buyers, suppliers, and receive AI-powered farming advice tailored to your needs.',
    icon: <Users className="w-8 h-8" />,
    color: 'text-purple-600',
    gradient: 'from-purple-100 to-purple-200',
  },
  {
    number: 4,
    title: 'Grow',
    description: 'Manage transactions, track growth metrics, and scale your farming operations with data insights.',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'text-orange-600',
    gradient: 'from-orange-100 to-orange-200',
  },
];

const HowItWorks: FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-25 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-green-400 rounded-full blur-3xl"
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
          className="absolute bottom-32 left-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"
          animate={{ 
            y: [-15, 15, -15],
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

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Heading variant="h2" className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              How UmuhinziLink Works
            </Heading>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Text variant="body" color="muted" className="text-lg max-w-2xl mx-auto">
              Simple steps to transform your farming business and connect with the digital agricultural ecosystem
            </Text>
          </motion.div>
        </motion.div>

        {/* Enhanced Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="relative group"
            >
              {/* Connection Line (except for last item) */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                />
              )}

              {/* Step Card */}
              <motion.div 
                className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200 relative overflow-hidden"
                whileHover={{ 
                  y: -8,
                  scale: 1.02
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                {/* Step Number */}
                <motion.div 
                  className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 10px 25px rgba(0, 166, 62, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {step.number}
                  </motion.span>
                </motion.div>

                {/* Step Icon */}
                <motion.div 
                  className={`${step.color} mb-4 flex justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.icon}
                </motion.div>

                {/* Step Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                >
                  <Heading variant="h5" className="mb-3 font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {step.title}
                  </Heading>
                </motion.div>

                {/* Step Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                >
                  <Text variant="body-sm" color="muted" className="leading-relaxed group-hover:text-gray-600 transition-colors">
                    {step.description}
                  </Text>
                </motion.div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div className="mb-8">
            <Text variant="body" color="muted" className="text-lg mb-6">
              Ready to start your digital farming journey?
            </Text>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 15px 35px rgba(0, 166, 62, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>

          {/* Process Flow Visualization */}
          <motion.div 
            className="flex items-center justify-center gap-3 mt-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div 
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.gradient.replace('100', '400').replace('200', '600')}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                />
                {index < steps.length - 1 && (
                  <motion.div 
                    className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 mx-2"
                    animate={{ scaleX: [0.8, 1.2, 0.8] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
