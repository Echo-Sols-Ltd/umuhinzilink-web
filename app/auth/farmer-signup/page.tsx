'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRequest, UserType } from '@/types';
import { FarmerRequest, FarmSizeCategory, ExperienceLevel, Address, Province, District, RwandaCrop } from '@/types';
import { farmSizeOptions, experienceLevelOptions, provinceOptions, districtOptions } from '@/types/enums';

export default function FarmerSignUp() {
  const { register } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const [userData, setUserData] = useState<UserRequest>({
    names: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserType.FARMER,
  });

  const [farmerData, setFarmerData] = useState<FarmerRequest>({
    userId: '',
    farmSize: FarmSizeCategory.SMALLHOLDER,
    experienceLevel: ExperienceLevel.LESS_THAN_1Y,
    address: {
      province: Province.KIGALI_CITY,
      district: District.GASABO,
    },
    crops: [],
  });

  const [fieldErrors, setFieldErrors] = useState({
    names: '',
    email: '',
    phoneNumber: '',
    password: '',
    agreeToTerms: '',
    farmSize: '',
    experienceLevel: '',
    province: '',
    district: '',
    crops: '',
  });

  const [touched, setTouched] = useState({
    names: false,
    email: false,
    phoneNumber: false,
    password: false,
    agreeToTerms: false,
    farmSize: false,
    experienceLevel: false,
    province: false,
    district: false,
    crops: false,
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFarmerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'province') {
      setFarmerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          province: value as Province,
          district: District.GASABO, // Reset district when province changes
        },
      }));
    } else if (name === 'district') {
      setFarmerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: value as District,
        },
      }));
    } else if (name === 'farmSize') {
      setFarmerData(prev => ({
        ...prev,
        farmSize: value as FarmSizeCategory,
      }));
    } else if (name === 'experienceLevel') {
      setFarmerData(prev => ({
        ...prev,
        experienceLevel: value as ExperienceLevel,
      }));
    }

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCropChange = (crop: RwandaCrop, isChecked: boolean) => {
    setFarmerData(prev => ({
      ...prev,
      crops: isChecked 
        ? [...prev.crops, crop]
        : prev.crops.filter(c => c !== crop),
    }));

    // Clear crops error when user selects/deselects
    if (fieldErrors.crops) {
      setFieldErrors(prev => ({ ...prev, crops: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, userData[name as keyof typeof userData]);
  };

  const validateField = (name: string, value: string | boolean | any) => {
    let error = '';

    const stringValue = typeof value === 'string' ? value : '';

    switch (name) {
      case 'names':
        if (!stringValue.trim()) {
          error = 'Full name is required';
        } else if (stringValue.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!stringValue.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(stringValue.trim())) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      case 'phoneNumber':
        if (!stringValue.trim()) {
          error = 'Phone number is required';
        } else {
          const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
          const phoneValue = stringValue.replace(/[^0-9+]/g, '');
          if (!phoneRegex.test(phoneValue)) {
            error = 'Please enter a valid phone number';
          } else if (phoneValue.length < 10) {
            error = 'Phone number must be at least 10 digits';
          }
        }
        break;
      case 'password':
        if (!stringValue) {
          error = 'Password is required';
        } else if (stringValue.length < 8) {
          error = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(stringValue)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(stringValue)) {
          error = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*]/.test(stringValue)) {
          error = 'Password must contain at least one special character';
        }
        break;
      case 'agreeToTerms':
        if (value !== true) {
          error = 'You must agree to the terms and conditions';
        }
        break;
      case 'farmSize':
        if (!value) {
          error = 'Farm size is required';
        }
        break;
      case 'experienceLevel':
        if (!value) {
          error = 'Experience level is required';
        }
        break;
      case 'province':
        if (!value) {
          error = 'Province is required';
        }
        break;
      case 'district':
        if (!value) {
          error = 'District is required';
        }
        break;
      case 'crops':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = 'Please select at least one crop';
        }
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const validateForm = () => {
    const namesValid = validateField('names', userData.names);
    const emailValid = validateField('email', userData.email);
    const phoneValid = validateField('phoneNumber', userData.phoneNumber);
    const passwordValid = validateField('password', userData.password);
    const termsValid = validateField('agreeToTerms', agreeToTerms);
    const farmSizeValid = validateField('farmSize', farmerData.farmSize);
    const experienceValid = validateField('experienceLevel', farmerData.experienceLevel);
    const provinceValid = validateField('province', farmerData.address.province);
    const districtValid = validateField('district', farmerData.address.district);
    const cropsValid = validateField('crops', farmerData.crops);

    setTouched({
      names: true,
      email: true,
      phoneNumber: true,
      password: true,
      agreeToTerms: true,
      farmSize: true,
      experienceLevel: true,
      province: true,
      district: true,
      crops: true,
    });

    return namesValid && emailValid && phoneValid && passwordValid && termsValid && 
           farmSizeValid && experienceValid && provinceValid && districtValid && cropsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below and try again.',
        variant: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      // First register the user
      await register(userData);
      
      // TODO: After successful user registration, submit farmer data
      // This would typically be done in the register function or as a separate API call
      
      toast({
        title: 'Success',
        description: 'Farmer account created successfully!',
        variant: 'success',
      });
      
      // Redirect to dashboard or login
      // router.push('/farmer/dashboard');
      
    } catch (error) {
      toast({
        title: 'Registration Error',
        description: 'Failed to create farmer account. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get districts for selected province
  const getDistrictsForProvince = (province: Province) => {
    return districtOptions.filter(district => {
      // This would need the DISTRICT_PROVINCE_MAP from enums
      return true; // For now, return all districts
    });
  };

  // Common Rwanda crops for selection
  const commonCrops: RwandaCrop[] = [
    RwandaCrop.MAIZE,
    RwandaCrop.DRY_BEANS,
    RwandaCrop.IRISH_POTATO,
    RwandaCrop.CASSAVA,
    RwandaCrop.TOMATO,
    RwandaCrop.CABBAGE,
    RwandaCrop.ONION,
    RwandaCrop.CARROT,
    RwandaCrop.COFFEE,
    RwandaCrop.TEA,
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-72 sm:h-96 flex flex-col justify-center items-center text-center">
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute right-0 top-0 object-cover w-full h-full"
        />

        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">
          Farmer Registration
        </h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
          Join our agricultural marketplace and connect with buyers directly
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl -mt-20 p-6 sm:p-8 z-20 relative">
        <h1 className="text-center text-gray-800 font-extrabold text-xl sm:text-2xl mb-4">
          Create Your Farmer Account
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <Link
              key={idx}
              href={linkItem.link}
              target="_blank"
              className="p-3 text-gray-700 transition border border-gray-100 rounded-md hover:bg-gray-100"
            >
              {linkItem.icon}
            </Link>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Or fill in your details below</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="names" className="text-gray-700 font-medium text-sm">
                  Full Name
                </Label>
                <Input
                  id="names"
                  name="names"
                  placeholder="John Doe"
                  value={userData.names}
                  onChange={handleUserInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`text-gray-700 font-medium text-sm border ${touched.names && fieldErrors.names
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                />
                {touched.names && fieldErrors.names && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.names}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={userData.email}
                  onChange={handleUserInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`text-gray-700 font-medium text-sm border ${touched.email && fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                />
                {touched.email && fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+250 7..."
                  value={userData.phoneNumber}
                  onChange={handleUserInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`text-gray-700 font-medium text-sm border ${touched.phoneNumber && fieldErrors.phoneNumber
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                />
                {touched.phoneNumber && fieldErrors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleUserInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`text-gray-700 font-medium text-sm border pr-10 ${touched.password && fieldErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {touched.password && fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Farm Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmSize" className="text-gray-700 font-medium text-sm">
                  Farm Size
                </Label>
                <select
                  id="farmSize"
                  name="farmSize"
                  value={farmerData.farmSize}
                  onChange={handleFarmerInputChange}
                  disabled={loading}
                  className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${touched.farmSize && fieldErrors.farmSize
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                >
                  <option value="">Select farm size</option>
                  {farmSizeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {touched.farmSize && fieldErrors.farmSize && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.farmSize}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="experienceLevel" className="text-gray-700 font-medium text-sm">
                  Farming Experience
                </Label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={farmerData.experienceLevel}
                  onChange={handleFarmerInputChange}
                  disabled={loading}
                  className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${touched.experienceLevel && fieldErrors.experienceLevel
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                >
                  <option value="">Select experience level</option>
                  {experienceLevelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {touched.experienceLevel && fieldErrors.experienceLevel && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.experienceLevel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Farm Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province" className="text-gray-700 font-medium text-sm">
                  Province
                </Label>
                <select
                  id="province"
                  name="province"
                  value={farmerData.address.province}
                  onChange={handleFarmerInputChange}
                  disabled={loading}
                  className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${touched.province && fieldErrors.province
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                >
                  <option value="">Select province</option>
                  {provinceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {touched.province && fieldErrors.province && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.province}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="district" className="text-gray-700 font-medium text-sm">
                  District
                </Label>
                <select
                  id="district"
                  name="district"
                  value={farmerData.address.district}
                  onChange={handleFarmerInputChange}
                  disabled={loading}
                  className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${touched.district && fieldErrors.district
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                >
                  <option value="">Select district</option>
                  {districtOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {touched.district && fieldErrors.district && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.district}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Crops Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Crops You Grow</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {commonCrops.map(crop => (
                <div key={crop} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={crop}
                    checked={farmerData.crops.includes(crop)}
                    onChange={(e) => handleCropChange(crop, e.target.checked)}
                    disabled={loading}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor={crop} className="text-sm text-gray-700">
                    {crop.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
            {touched.crops && fieldErrors.crops && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {fieldErrors.crops}
              </p>
            )}
          </div>

          {/* Terms and Submit */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={loading}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="agreeToTerms" className="text-gray-700 font-medium text-sm">
                I agree to the terms & conditions
              </Label>
            </div>
            {touched.agreeToTerms && fieldErrors.agreeToTerms && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {fieldErrors.agreeToTerms}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Farmer Account'}
            </Button>

            <p className="text-gray-700 text-sm text-center">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-green-600 font-semibold">
                Sign in
              </Link>
              {' '}or{' '}
              <Link href="/auth/signup" className="text-green-600 font-semibold">
                Other account types
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
