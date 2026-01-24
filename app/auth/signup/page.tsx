'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserCheck, Loader2 } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { UserRequest, UserType } from '@/types';


// Enhanced form fields configuration
const signupFormFields = {
  names: {
    value: '',
    rules: { required: true, minLength: 2 },
    label: 'Full Name'
  },
  email: {
    value: '',
    rules: commonRules.email,
    label: 'Email Address'
  },
  phoneNumber: {
    value: '',
    rules: commonRules.phone,
    label: 'Phone Number'
  },
  password: {
    value: '',
    rules: commonRules.password,
    label: 'Password'
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
      'We\'ll never share your email with anyone'
    ]
  },
  phoneNumber: {
    title: 'Phone Number Format',
    examples: ['+250788123456', '0788123456'],
    tips: [
      'Include country code (+250) or start with 07/08',
      'Use digits, spaces, or dashes',
      'Must be a valid Rwandan number'
    ]
  }
};

export default function SignUp() {
  const { register } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserType>(UserType.FARMER);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Use enhanced form validation
  const {
    getFieldProps,
    handleSubmit,
    reset,
    isValid,
    values,
    errors,
    submissionState
  } = useEnhancedFormValidation(signupFormFields, {
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

  const accountTypes = [
    { value: UserType.FARMER, label: 'Farmer', icon: '🌾' },
    { value: UserType.SUPPLIER, label: 'Supplier', icon: '🏪' },
    { value: UserType.BUYER, label: 'Buyer', icon: '🛒' },
  ];

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    // Validate terms agreement
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions');
      toast({
        title: 'Validation Error',
        description: 'Please agree to the terms and conditions.',
        variant: 'destructive' as any,
      });
      return;
    }
    setTermsError('');

    // Prepare user data
    const userData: UserRequest = {
      names: formValues.names,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      password: formValues.password,
      role: selectedRole,
    };

    try {
      await register(userData);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        setAgreeToTerms(false);
        setSelectedRole(UserType.FARMER);
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: 'Please try again later.',
        variant: 'destructive' as any,
      });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit);
  };

  const formIsValid = isValid && agreeToTerms;

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
          Welcome!
        </motion.h1>
        <motion.p 
          className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Use these awesome forms to login or create a new <br /> account in your project for free
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
          Register with
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
          Or continue with your details
        </motion.p>

        {/* Enhanced Form */}
        <EnhancedForm onSubmit={onSubmit} loading={submissionState.isSubmitting}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <motion.div variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}>
              <EnhancedFormField
                {...getFieldProps('names')}
                label="Full Name"
                icon={<User className="h-4 w-4" />}
                helpText="Enter your first and last name"
                placeholder="John Doe"
              />
            </motion.div>

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
                {...getFieldProps('phoneNumber')}
                label="Phone Number"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
                contextualHelp={contextualHelp.phoneNumber}
                placeholder="+250 7..."
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

            {/* Account Type Selection */}
            <motion.div 
              className="space-y-3"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                Account Type
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {accountTypes.map(type => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedRole(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedRole === type.value
                        ? 'border-[var(--primary-green)] bg-[var(--primary-green)]/10 text-[var(--primary-green)]'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Terms Agreement */}
            <motion.div 
              className="space-y-2"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <div className="flex items-center space-x-3">
                <Switch
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(checked);
                    if (checked) setTermsError('');
                  }}
                  className="data-[state=checked]:bg-[var(--primary-green)]"
                />
                <Label 
                  htmlFor="agreeToTerms" 
                  className="text-gray-700 dark:text-gray-300 font-medium text-sm cursor-pointer"
                >
                  I agree to the terms & conditions
                </Label>
              </div>
              <AnimatePresence>
                {termsError && (
                  <motion.div
                    className="flex items-center gap-2 text-xs text-[var(--error)]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <span className="w-1 h-1 bg-[var(--error)] rounded-full"></span>
                    {termsError}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <Button
                type="submit"
                className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)] text-white font-medium text-sm py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
                disabled={!formIsValid || submissionState.isSubmitting}
                loading={submissionState.isSubmitting}
              >
                {submissionState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Sign Up
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Sign In Link */}
            <motion.p 
              className="text-gray-700 dark:text-gray-300 text-sm text-center"
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
            >
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[var(--primary-green)] font-semibold hover:underline">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </EnhancedForm>
      </motion.div>

      {/* Success Animation */}
      <FormSuccessAnimation
        show={showSuccess}
        message="Welcome to UmuhinziLink! Your account has been created successfully."
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}
