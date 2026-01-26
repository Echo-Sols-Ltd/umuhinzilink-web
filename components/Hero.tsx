'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heading, Text, TypographySection } from '@/components/ui/typography';
import { EnhancedButton } from '@/components/ui/animations/enhanced-button';
import { ArrowRight, Play, Users, TrendingUp, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-green-25 to-white pt-20 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-green-400 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-600 rounded-full blur-2xl"
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Enhanced Text Section */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <TypographySection spacing="relaxed">
            {/* Enhanced Badge */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium mb-6 border border-green-200 shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 166, 62, 0.15)" }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mr-2"
              >
                🌱
              </motion.span>
              Empowering Rwandan Agriculture
            </motion.div>
            
            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Heading variant="display" className="max-w-2xl leading-tight mb-6">
                Connect Farmers to{' '}
                <span className="relative inline-block">
                  <motion.span 
                    className="typography-gradient-primary bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    Digital Markets
                  </motion.span>
                  <motion.div 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  />
                </span>
              </Heading>
            </motion.div>
            
            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Text variant="lead" color="secondary" className="max-w-lg text-lg leading-relaxed mb-8">
                Empowering smallholder farmers in Rwanda with cutting-edge technology to access markets, 
                receive AI-powered farming advice, and secure agricultural loans for sustainable growth.
              </Text>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <EnhancedButton 
                size="lg" 
                variant="default"
                animation="hover"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="group shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg" 
                animation="hover"
                icon={<Play className="w-4 h-4" />}
                iconPosition="left"
                className="group border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
              >
                View Demo
              </EnhancedButton>
            </motion.div>

            {/* Enhanced Stats with Better Visual Hierarchy */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 mt-8 border-t border-green-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { icon: Users, value: "500+", label: "Registered Farmers", color: "green", delay: 0 },
                { icon: TrendingUp, value: "50+", label: "Input Suppliers", color: "blue", delay: 0.1 },
                { icon: Award, value: "1000+", label: "Transactions Completed", color: "emerald", delay: 0.2 }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center sm:text-left group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + stat.delay }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                    <motion.div 
                      className={`p-2 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 1 + stat.delay, type: "spring", stiffness: 200 }}
                    >
                      <Heading variant="h3" className={`font-bold text-${stat.color}-600`}>
                        {stat.value}
                      </Heading>
                    </motion.div>
                  </div>
                  <Text variant="body-sm" color="muted" className="font-medium">
                    {stat.label}
                  </Text>
                </motion.div>
              ))}
            </motion.div>
          </TypographySection>
        </motion.div>

        {/* Enhanced Image Section */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Enhanced Decorative Elements */}
            <motion.div 
              className="absolute -top-4 -left-4 w-8 h-8 bg-green-400 rounded-full opacity-60"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div 
              className="absolute -bottom-6 -right-6 w-6 h-6 bg-green-500 rounded-full opacity-40"
              animate={{ 
                y: [0, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-1/2 -left-8 w-4 h-4 bg-green-300 rounded-full opacity-50"
              animate={{ 
                x: [-5, 5, -5],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.5
              }}
            />
            
            {/* Enhanced Main Image Container */}
            <motion.div 
              className="relative w-full h-80 md:h-96 lg:h-[28rem] bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl overflow-hidden group"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Enhanced Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />
              
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/hero.png"
                  alt="Farmer using digital technology in the field"
                  fill
                  className="object-contain p-6 transition-transform duration-500"
                  priority
                />
              </motion.div>
              
              {/* Enhanced Floating Elements */}
              <motion.div 
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.svg 
                  className="w-6 h-6 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                animate={{ 
                  y: [0, 8, 0],
                  x: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.svg 
                  className="w-6 h-6 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </motion.svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
