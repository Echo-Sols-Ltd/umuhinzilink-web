'use client';

import React from 'react';
import { ToastDemo } from '@/components/ui/toast-demo';

export default function ToastDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <ToastDemo />
        </div>
      </div>
    </div>
  );
}