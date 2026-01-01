'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', offset: 0 },
        { id: 'features', offset: 0 },
        { id: 'agribusiness', offset: 0 },
        { id: 'lenders', offset: 0 },
        { id: 'contact', offset: 0 },
      ];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          if (window.scrollY >= top) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo placeholder */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold tracking-tight text-green-600 font-sans">
            Umuhinzi
            <span className="text-2xl font-extrabold tracking-tight text-gray-700 font-sans">
              Link
            </span>
          </span>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Home', href: '#home' },
            { name: 'Features', href: '#features' },
            { name: 'AgriBussiness', href: '#agribusiness' },
            { name: 'Lenders', href: '#lenders' },
            { name: 'Contact Us', href: '#contact' },
          ].map(link => (
            <a
              key={link.name}
              href={link.href}
              className={
                `px-3 py-2 rounded-md text-base font-medium tracking-wide transition-colors duration-200 ` +
                (activeSection === link.href.replace('#', '')
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-gray-700 hover:text-green-600')
              }
            >
              {link.name}
            </a>
          ))}
        </div>

        <Link
          href="/auth/signin"
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
