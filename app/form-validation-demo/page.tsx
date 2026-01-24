'use client';

import React from 'react';
import { FormValidationDemo } from '@/components/ui/form-validation-demo';

export default function FormValidationDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
      <FormValidationDemo />
    </div>
  );
}