'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Calendar,
  CreditCard,
  Building,
  Globe,
  FileText,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EnhancedFormField, EnhancedForm, FormSuccessAnimation } from './enhanced-form';
import { useEnhancedFormValidation } from '@/hooks/useEnhancedFormValidation';
import { commonRules } from '@/lib/validation';
import { showToast } from '@/components/ui';

// Demo form fields configuration
const formFields = {
  firstName: {
    value: '',
    rules: { required: true, minLength: 2 },
    label: 'First Name'
  },
  lastName: {
    value: '',
    rules: { required: true, minLength: 2 },
    label: 'Last Name'
  },
  email: {
    value: '',
    rules: commonRules.email,
    label: 'Email Address'
  },
  phone: {
    value: '',
    rules: commonRules.phone,
    label: 'Phone Number'
  },
  password: {
    value: '',
    rules: commonRules.password,
    label: 'Password'
  },
  confirmPassword: {
    value: '',
    rules: {
      required: true,
      custom: (value: string, allValues?: Record<string, any>) => {
        if (allValues && value !== allValues.password) {
          return 'Passwords do not match';
        }
        return null;
      }
    },
    label: 'Confirm Password'
  },
  company: {
    value: '',
    rules: { required: true, minLength: 2 },
    label: 'Company Name'
  },
  website: {
    value: '',
    rules: {
      pattern: /^https?:\/\/.+\..+/,
      custom: (value: string) => {
        if (value && !value.startsWith('http')) {
          return 'Website must start with http:// or https://';
        }
        return null;
      }
    },
    label: 'Website (Optional)'
  },
  address: {
    value: '',
    rules: { required: true, minLength: 10 },
    label: 'Address'
  },
  creditCard: {
    value: '',
    rules: {
      required: true,
      pattern: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
      custom: (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        if (cleaned.length !== 16) {
          return 'Credit card must be 16 digits';
        }
        return null;
      }
    },
    label: 'Credit Card Number'
  },
  bio: {
    value: '',
    rules: { maxLength: 500 },
    label: 'Bio (Optional)'
  }
};

// Contextual help data
const contextualHelp = {
  password: {
    title: 'Password Requirements',
    examples: ['MySecure123!', 'StrongPass456@'],
    tips: [
      'Use at least 8 characters',
      'Include uppercase and lowercase letters',
      'Add at least one number',
      'Include a special character (@, #, $, etc.)'
    ]
  },
  email: {
    title: 'Email Format',
    examples: ['user@example.com', 'john.doe@company.co.uk'],
    tips: [
      'Use a valid email format',
      'Make sure the domain exists',
      'Avoid spaces and special characters'
    ]
  },
  phone: {
    title: 'Phone Number Format',
    examples: ['+1234567890', '(555) 123-4567'],
    tips: [
      'Include country code if international',
      'Use digits, spaces, dashes, or parentheses',
      'Minimum 10 digits required'
    ]
  },
  creditCard: {
    title: 'Credit Card Format',
    examples: ['1234 5678 9012 3456', '1234567890123456'],
    tips: [
      'Enter 16 digits',
      'Spaces are optional',
      'Only numbers allowed'
    ]
  }
};

export const FormValidationDemo: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    getFieldProps,
    handleSubmit,
    reset,
    isValid,
    isDirty,
    values,
    errors,
    isValidating,
    submissionState
  } = useEnhancedFormValidation(formFields, {
    validateOnChange: true,
    validateOnBlur: true,
    showSuccessStates: true,
    enableRealTimeValidation: true,
    debounceMs: 300
  });

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted with values:', formValues);
    setShowSuccess(true);
    
    // Hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      reset();
    }, 3000);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit);
  };

  // Form steps for multi-step demo
  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      title: 'Security',
      description: 'Set up your account security',
      fields: ['password', 'confirmPassword']
    },
    {
      title: 'Company Details',
      description: 'Information about your company',
      fields: ['company', 'website', 'address']
    },
    {
      title: 'Additional Information',
      description: 'Optional details',
      fields: ['creditCard', 'bio']
    }
  ];

  const currentStepFields = steps[currentStep]?.fields || [];
  const canProceed = currentStepFields.every(field => !errors[field] && values[field]);
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text">
          Beautiful Form Validation System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience real-time validation with smooth animations, contextual help, 
          and delightful user feedback
        </p>
      </div>

      {/* Form Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[var(--primary-green)]">
              {Object.keys(values).filter(key => values[key]).length}
            </div>
            <div className="text-sm text-muted-foreground">Fields Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[var(--error)]">
              {Object.keys(errors).length}
            </div>
            <div className="text-sm text-muted-foreground">Validation Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[var(--info)]">
              {submissionState.submitCount}
            </div>
            <div className="text-sm text-muted-foreground">Submit Attempts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${isValid ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
              {isValid ? 'Valid' : 'Invalid'}
            </div>
            <div className="text-sm text-muted-foreground">Form Status</div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-step Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStep 
                      ? 'bg-[var(--primary-green)] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                    backgroundColor: index <= currentStep ? 'var(--primary-green)' : 'var(--gray-200)'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-16 h-1 mx-2 transition-colors ${
                      index < currentStep ? 'bg-[var(--primary-green)]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold">{steps[currentStep]?.title}</h3>
            <p className="text-muted-foreground">{steps[currentStep]?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
            Fill out the form below with real-time validation and helpful feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedForm onSubmit={onSubmit} loading={submissionState.isSubmitting}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormField
                    {...getFieldProps('firstName')}
                    label="First Name"
                    icon={<User className="h-4 w-4" />}
                    helpText="Enter your first name"
                  />
                  <EnhancedFormField
                    {...getFieldProps('lastName')}
                    label="Last Name"
                    icon={<User className="h-4 w-4" />}
                    helpText="Enter your last name"
                  />
                  <EnhancedFormField
                    {...getFieldProps('email')}
                    label="Email Address"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    helpText="We'll never share your email"
                    contextualHelp={contextualHelp.email}
                  />
                  <EnhancedFormField
                    {...getFieldProps('phone')}
                    label="Phone Number"
                    type="tel"
                    icon={<Phone className="h-4 w-4" />}
                    helpText="Include country code if international"
                    contextualHelp={contextualHelp.phone}
                  />
                </div>
              )}

              {/* Step 2: Security */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <EnhancedFormField
                    {...getFieldProps('password')}
                    label="Password"
                    type="password"
                    icon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    contextualHelp={contextualHelp.password}
                  />
                  <EnhancedFormField
                    {...getFieldProps('confirmPassword')}
                    label="Confirm Password"
                    type="password"
                    icon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    helpText="Re-enter your password to confirm"
                  />
                </div>
              )}

              {/* Step 3: Company Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <EnhancedFormField
                    {...getFieldProps('company')}
                    label="Company Name"
                    icon={<Building className="h-4 w-4" />}
                    helpText="Enter your company or organization name"
                  />
                  <EnhancedFormField
                    {...getFieldProps('website')}
                    label="Website"
                    type="url"
                    icon={<Globe className="h-4 w-4" />}
                    helpText="Optional: Your company website"
                  />
                  <EnhancedFormField
                    {...getFieldProps('address')}
                    label="Address"
                    icon={<MapPin className="h-4 w-4" />}
                    helpText="Your business address"
                  />
                </div>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <EnhancedFormField
                    {...getFieldProps('creditCard')}
                    label="Credit Card Number"
                    icon={<CreditCard className="h-4 w-4" />}
                    helpText="For billing purposes"
                    contextualHelp={contextualHelp.creditCard}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      {...getFieldProps('bio')}
                      className="w-full px-4 py-3 border border-input rounded-xl focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 transition-all duration-300"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Maximum 500 characters
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => reset()}
                  disabled={submissionState.isSubmitting}
                >
                  Reset Form
                </Button>
                
                {isLastStep ? (
                  <Button
                    type="submit"
                    loading={submissionState.isSubmitting}
                    disabled={!isValid || isValidating}
                    icon={<Send className="h-4 w-4" />}
                  >
                    {submissionState.isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={!canProceed}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </EnhancedForm>
        </CardContent>
      </Card>

      {/* Form Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Form Values:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Validation Errors:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(errors, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span>Valid: {isValid ? '✅' : '❌'}</span>
              <span>Dirty: {isDirty ? '✅' : '❌'}</span>
              <span>Validating: {isValidating ? '⏳' : '✅'}</span>
              <span>Submitting: {submissionState.isSubmitting ? '⏳' : '✅'}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Animation */}
      <FormSuccessAnimation
        show={showSuccess}
        message="Your registration has been completed successfully!"
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default FormValidationDemo;