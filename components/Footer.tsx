'use client';

import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Heading, Text } from '@/components/ui/typography';
import { EnhancedButton } from '@/components/ui/animations/enhanced-button';

export default function Footer() {
  const footerSections = [
    {
      title: 'About',
      links: [
        { name: 'Our Mission', href: '#' },
        { name: 'Team', href: '#' },
        { name: 'Partners', href: '#' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'SMS Support', href: '#' },
        { name: 'Training', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { name: 'For Farmers', href: '#' },
        { name: 'For Suppliers', href: '#' },
        { name: 'For Buyers', href: '#' },
        { name: 'API Access', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-20 right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-32 h-32 bg-blue-500 rounded-full blur-2xl"
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <motion.div 
                className="flex items-center gap-2 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  🌱
                </motion.span>
                <Heading variant="h4" className="font-bold text-white">
                  UmuhinziLink
                </Heading>
              </motion.div>
              
              <Text variant="body-sm" className="mb-6 leading-relaxed text-gray-400">
                Empowering Rwandan farmers through digital agriculture and AI-powered solutions. 
                Building the future of sustainable farming.
              </Text>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`p-2 rounded-lg bg-gray-800 text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700`}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + (sectionIndex * 0.1) }}
              >
                <Heading variant="h6" className="font-semibold text-white mb-6">
                  {section.title}
                </Heading>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.3 + (sectionIndex * 0.1) + (linkIndex * 0.05) 
                      }}
                    >
                      <motion.a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer block"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Heading variant="h6" className="font-semibold text-white mb-6">
                Contact Info
              </Heading>
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="p-2 rounded-lg bg-gray-800 text-green-400 group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Phone className="w-4 h-4" />
                  </motion.div>
                  <Text variant="body-sm" className="text-gray-400 group-hover:text-white transition-colors">
                    +250 793 373 953
                  </Text>
                </motion.li>
                
                <motion.li 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="p-2 rounded-lg bg-gray-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Mail className="w-4 h-4" />
                  </motion.div>
                  <Text variant="body-sm" className="text-gray-400 group-hover:text-white transition-colors">
                    iamshemaleandre@gmail.com
                  </Text>
                </motion.li>
                
                <motion.li 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="p-2 rounded-lg bg-gray-800 text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MapPin className="w-4 h-4" />
                  </motion.div>
                  <Text variant="body-sm" className="text-gray-400 group-hover:text-white transition-colors">
                    Kigali, Rwanda
                  </Text>
                </motion.li>
              </ul>

              {/* Language Selector */}
              <motion.div 
                className="flex gap-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                >
                  English
                </EnhancedButton>
                <EnhancedButton
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Kinyarwanda
                </EnhancedButton>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <Heading variant="h6" className="text-white mb-2">
                  Stay Updated
                </Heading>
                <Text variant="body-sm" className="text-gray-400">
                  Get the latest updates on agricultural technology and market insights
                </Text>
              </div>
              
              <motion.div 
                className="flex gap-3 w-full md:w-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
                <EnhancedButton
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 px-6"
                >
                  Subscribe
                </EnhancedButton>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <Text variant="body-sm" className="text-gray-500 text-center md:text-left">
                  © 2025 UmuhinziLink. All rights reserved. Built for Rwandan farmers with{' '}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-red-500"
                  >
                    ❤️
                  </motion.span>
                </Text>
              </motion.div>
              
              <motion.div 
                className="flex gap-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <motion.a
                  href="#"
                  className="text-gray-500 hover:text-white transition-colors duration-300 text-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-500 hover:text-white transition-colors duration-300 text-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-500 hover:text-white transition-colors duration-300 text-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Cookie Policy
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
