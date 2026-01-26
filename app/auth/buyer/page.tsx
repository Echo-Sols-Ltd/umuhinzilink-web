'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, User, MapPin, Briefcase, Upload, X, Loader2, UserCheck, ShoppingCart } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { EnhancedFormField, EnhancedForm, FormSuccessAnimation } from '@/components/ui/enhanced-form';
import { useEnhancedFormValidation } from '@/hooks/useEnhancedFormValidation';
import { commonRules } from '@/lib/validation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRequest, UserType } from '@/types';
import { BuyerRequest, BuyerType, Address, Province, District } from '@/types';
import { buyerTypeOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';

// Enhanced form fields configuration
const buyerFormFields = {
  buyerType: {
    value: BuyerType.INDIVIDUAL,
    rules: { required: true },
    label: 'Buyer Type'
  },
  province: {
    value: Province.KIGALI_CITY,
    rules: { required: true },
    label: 'Province'
  },
  district: {
    value: District.GASABO,
    rules: { required: true },
    label: 'District'
  }
};

export default function BuyerSignUp() {
  const { registerBuyer, user } = useAuth();
  const { uploadFile, uploadingFiles, loading: uploadLoading } = useUserAction();
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');

  // Use enhanced form validation
  const {
    getFieldProps,
    handleSubmit,
    reset,
    isValid,
    values,
    errors,
    submissionState
  } = useEnhancedFormValidation(buyerFormFields, {
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

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Profile image must be less than 5MB',
          variant: 'destructive' as any,
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive' as any,
        });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview('');
  };

  const handleFormSubmit = async (formValues: Record<string, any>) => {
    try {
      // First upload profile image if selected
      if (profileImage) {
        await uploadFile(profileImage);
      }

      // Prepare buyer data
      const buyerData: BuyerRequest = {
        userId: user?.id!,
        buyerType: formValues.buyerType,
        address: {
          province: formValues.province,
          district: formValues.district,
        },
      };

      // Register the buyer
      await registerBuyer(buyerData);

      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        setProfileImage(null);
        setProfilePreview('');
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

  const formIsValid = isValid;
  const isLoading = submissionState.isSubmitting || uploadLoading;

  // Get districts for selected province
  const getDistrictsForProvince = (province: Province) => {
    return districtOptions.filter(district => {
      return true;
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex flex-col items-center">
      {/* Hero Section */}
      <motion.div 
        className="relative w-full h-72 sm:h-96 flex flex-col justify-center items-center text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute right-0 top-0 object-cover w-full h-full"
        />

        <motion.h1 
          className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Buyer Registration
        </motion.h1>
        <motion.p 
          className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Join our agricultural marketplace and connect with farmers directly
        </motion.p>
      </motion.div>

      <motion.div 
        className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl -mt-20 p-6 sm:p-8 z-20 relative"
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
          Create Your Buyer Account
        </motion.h1>

        <motion.div 
          className="flex gap-4 justify-center mb-6"
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
          Or fill in your details below
        </motion.p>

        {/* Enhanced Form */}
        <EnhancedForm onSubmit={onSubmit} loading={isLoading}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, staggerChildren: 0.1 }}
            className="space-y-8"
          >
            {/* Profile Image Section */}
            <motion.div 
              className="border-b border-gray-200 dark:border-gray-600 pb-6"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Image
              </h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profilePreview ? (
                    <div className="relative">
                      <Image
                        src={profilePreview}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="w-30 h-30 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                      />
                      <motion.button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="w-30 h-30 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="profileImage" className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2 block">
                    Upload Profile Image
                  </Label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('profileImage')?.click()}
                    disabled={isLoading}
                    variant="outline"
                    className="mb-2"
                  >
                    {uploadLoading && uploadingFiles.some(f => f.file === profileImage) ? 'Uploading...' : 'Choose Image'}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF up to 5MB</p>
                  {uploadLoading && uploadingFiles.some(f => f.file === profileImage) && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--primary-green)] rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uploading profile image...</span>
                      </div>
                      {uploadingFiles.find(f => f.file === profileImage) && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-[var(--primary-green)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadingFiles.find(f => f.file === profileImage)?.progress || 0}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Buyer Information Section */}
            <motion.div 
              className="border-b border-gray-200 dark:border-gray-600 pb-6"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Buyer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2 block">
                    Buyer Type
                  </Label>
                  <select
                    {...getFieldProps('buyerType')}
                    className="w-full text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 transition-all"
                    disabled={isLoading}
                  >
                    <option value="">Select buyer type</option>
                    {buyerTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  {errors.buyerType && (
                    <p className="text-[var(--error)] text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-[var(--error)] rounded-full"></span>
                      {errors.buyerType}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Location Section */}
            <motion.div 
              className="border-b border-gray-200 dark:border-gray-600 pb-6"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2 block">
                    Province
                  </Label>
                  <select
                    {...getFieldProps('province')}
                    className="w-full text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 transition-all"
                    disabled={isLoading}
                  >
                    <option value="">Select province</option>
                    {provinceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-[var(--error)] text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-[var(--error)] rounded-full"></span>
                      {errors.province}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-2 block">
                    District
                  </Label>
                  <select
                    {...getFieldProps('district')}
                    className="w-full text-gray-700 dark:text-gray-300 font-medium text-sm border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 focus:border-[var(--primary-green)] focus:ring-4 focus:ring-[var(--primary-green)]/10 transition-all"
                    disabled={isLoading}
                  >
                    <option value="">Select district</option>
                    {districtOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-[var(--error)] text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-[var(--error)] rounded-full"></span>
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>
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
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Finish Creating Account
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </EnhancedForm>
      </motion.div>

      {/* Success Animation */}
      <FormSuccessAnimation
        show={showSuccess}
        message="Welcome to UmuhinziLink! Your buyer account has been created successfully."
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}