'use client';
import React from 'react';
import LanguageSelector from './LanguageSelector';

interface AuthFooterProps {
  className?: string;
}

export default function AuthFooter({ className = "" }: AuthFooterProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-50 ${className}`}>
      <div className="flex justify-center">
        <LanguageSelector />
      </div>
    </div>
  );
}
