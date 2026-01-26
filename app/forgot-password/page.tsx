'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { EnhancedFormField, EnhancedForm, FormSuccessAnimation } from '@/components/ui/enhanced-form';
import { useEnhancedFormValidation } from '@/hooks/useEnhancedFormValidation';
import { commonRules } from '@/lib/validation';

// Enhanced form fields configuration
const forgotPasswordFormFields = {
  email: {
    value: '',
    rules: commonRules.email,
    label: 'Email Address'
  }
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Use enhanced form validation
  const {
    getFieldProps,
    handleSubmit,
    reset,
    isValid,
    values,
    errors,
    submissionState
  } = useEnhancedFormValidation(forgotPasswordFormFields, {
    validateOnChange: true,
    validateOnBlur: true,
    showSuccessStates: true,
    enableRealTimeValidation: true,
    debounceMs: 300
  });

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    try {
      // TODO: Implement password reset API call
      // await authService.forgotPassword(formValues.email);
      
      setSubmitted(true);
      setShowSuccess(true);
      
      toast({
        title: 'Reset Link Sent',
        description: 'Check your email for password reset instructions.',
        variant: 'success',
      });

      // Hide success animation after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset link. Please try again.',
        variant: 'destructive' as any,
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit);
  };

  const formIsValid = isValid;
  const isLoading = submissionState.isSubmitting;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center px-4">
        <motion.div 
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 bg-[var(--bg-success)] rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <CheckCircle className="w-8 h-8 text-[var(--success)]" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Check Your Email
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We've sent a password reset link to {values.email}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => router.push('/auth/signin')}
                className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)] text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
              >
                Back to Sign In
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Forgot Password?
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </motion.p>
        </motion.div>

        {/* Enhanced Form */}
        <EnhancedForm onSubmit={onSubmit} loading={isLoading}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
              <EnhancedFormField
                {...getFieldProps('email')}
                label="Email Address"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
                helpText="We'll send reset instructions to this email"
              />
            </motion.div>

            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <Button
                type="submit"
                className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)] text-white font-medium py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
                disabled={!formIsValid || isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Reset Link
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </EnhancedForm>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-[var(--primary-green)] font-semibold hover:text-[var(--primary-green-dark)] hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>

      {/* Success Animation */}
      <FormSuccessAnimation
        show={showSuccess}
        message="Password reset link has been sent to your email successfully!"
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}
