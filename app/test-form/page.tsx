'use client';

import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { EnhancedFormField, EnhancedForm } from '@/components/ui/enhanced-form';
import { useEnhancedFormValidation } from '@/hooks/useEnhancedFormValidation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const testFormFields = {
  name: {
    value: '',
    rules: { required: true, minLength: 2 },
    label: 'Name'
  },
  email: {
    value: '',
    rules: { required: true, email: true },
    label: 'Email'
  },
  password: {
    value: '',
    rules: { required: true, minLength: 8 },
    label: 'Password'
  }
};

export default function TestFormPage() {
  const {
    getFieldProps,
    handleSubmit,
    isValid,
    submissionState
  } = useEnhancedFormValidation(testFormFields);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(async (values) => {
      console.log('Form submitted:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Form submitted successfully!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Form Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedForm onSubmit={onSubmit} loading={submissionState.isSubmitting}>
              <div className="space-y-6">
                <EnhancedFormField
                  {...getFieldProps('name')}
                  label="Name"
                  icon={<User className="h-4 w-4" />}
                  placeholder="Enter your name"
                />
                
                <EnhancedFormField
                  {...getFieldProps('email')}
                  label="Email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="Enter your email"
                />
                
                <EnhancedFormField
                  {...getFieldProps('password')}
                  label="Password"
                  type="password"
                  icon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  placeholder="Enter your password"
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isValid}
                  loading={submissionState.isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </EnhancedForm>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}