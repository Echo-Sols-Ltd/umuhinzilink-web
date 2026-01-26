'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { EnhancedFormField, EnhancedForm, FormSuccessAnimation } from '@/components/ui/enhanced-form';
import { useEnhancedFormValidation } from '@/hooks/useEnhancedFormValidation';
import { commonRules } from '@/lib/validation';
import { useAuth } from '@/contexts/AuthContext';

// Enhanced form fields configuration
const signinFormFields = {
  email: {
    value: '',
    rules: commonRules.email,
    label: 'Email Address'
  },
  password: {
    value: '',
    rules: { required: true, minLength: 6 },
    label: 'Password'
  }
};

// Contextual help data
const contextualHelp = {
  email: {
    title: 'Email Format',
    examples: ['user@example.com', 'john.doe@company.co.uk'],
    tips: [
      'Use a valid email format',
      'Make sure the domain exists',
      'Check for typos in your email address'
    ]
  },
  password: {
    title: 'Password Help',
    examples: [],
    tips: [
      'Enter the password you used when signing up',
      'Password is case-sensitive',
      'Use "Forgot Password?" if you can\'t remember'
    ]
  }
};

export default function SignIn() {
  const { login, loading: authLoading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
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
  } = useEnhancedFormValidation(signinFormFields, {
    validateOnChange: true,
    validateOnBlur: true,
    showSuccessStates: true,
    enableRealTimeValidation: true,
    debounceMs: 300
  });
  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  // Handle URL parameters and redirect if already authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLogout = urlParams.get('logout');
    const registered = urlParams.get('registered');

    if (isLogout) {
      toast({
        title: 'Signed Out',
        description: 'You have been logged out successfully.',
      });
    }

    if (registered) {
      toast({
        title: 'Account Created',
        description: 'Registration successful. Please sign in to continue.',
        variant: 'success',
      });
    }
  }, []);

  // Load saved credentials if remember me was enabled
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedRememberMe) {
      // Set the email value in the form
      const emailField = getFieldProps('email');
      emailField.onChange({ target: { value: savedEmail } } as any);
      setRememberMe(true);
    }
  }, [getFieldProps]);

  const handleRememberMe = (email: string) => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
  };

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    try {
      // Handle remember me
      if (rememberMe) {
        handleRememberMe(formValues.email.trim());
      }

      // Call login from auth context - it handles all backend errors and toasts
      await login({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      // Show success animation briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive' as any,
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit);
  };

  const formIsValid = isValid;
  const isLoading = submissionState.isSubmitting || authLoading;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex flex-col items-center">
      {/* Hero Section */}
      <motion.div 
        className="relative w-full h-72 sm:h-96 flex flex-col justify-center items-center text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image */}
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute right-0 top-0 object-cover w-full h-full"
        />

        {/* Welcome Text */}
        <motion.h1 
          className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome Back!
        </motion.h1>
        <motion.p 
          className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Sign in to access your account and continue your journey <br /> with UmuhinziLink
        </motion.p>
      </motion.div>

      <motion.div 
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl -mt-20 p-6 sm:p-8 z-20 relative"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <motion.h1 
          className="text-center text-gray-800 dark:text-white font-extrabold text-xl sm:text-2xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sign in with
        </motion.h1>

        <motion.div 
          className="flex gap-4 justify-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {socialLinks.map((linkItem, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={linkItem.link}
                target="_blank"
                className="p-3 text-gray-700 dark:text-gray-300 transition-all border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
              >
                {linkItem.icon}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p 
          className="text-center text-gray-400 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Or continue with your credentials
        </motion.p>

        {/* Enhanced Form */}
        <EnhancedForm onSubmit={onSubmit} loading={isLoading}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
              <EnhancedFormField
                {...getFieldProps('email')}
                label="Email Address"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                contextualHelp={contextualHelp.email}
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
              <EnhancedFormField
                {...getFieldProps('password')}
                label="Password"
                type="password"
                icon={<Lock className="h-4 w-4" />}
                showPasswordToggle
                contextualHelp={contextualHelp.password}
                placeholder="••••••••"
              />
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div 
              className="flex items-center justify-between"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-center space-x-3">
                <Switch
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="data-[state=checked]:bg-[var(--primary-green)] data-[state=unchecked]:bg-gray-200"
                />
                <Label htmlFor="remember" className="text-gray-700 dark:text-gray-300 font-medium text-sm cursor-pointer">
                  Remember Me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[var(--primary-green)] hover:text-[var(--primary-green-dark)] text-sm font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <Button
                type="submit"
                className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)] text-white font-medium text-sm py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
                disabled={!formIsValid || isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.p 
              className="text-gray-700 dark:text-gray-300 text-sm text-center"
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
            >
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[var(--primary-green)] font-semibold hover:underline">
                Sign up
              </Link>
            </motion.p>
          </motion.div>
        </EnhancedForm>
      </motion.div>

      {/* Success Animation */}
      <FormSuccessAnimation
        show={showSuccess}
        message="Welcome back! You have been signed in successfully."
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}