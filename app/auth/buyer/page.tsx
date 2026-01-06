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
import { BuyerRequest, BuyerType, Address, Province, District } from '@/types';
import { buyerTypeOptions, provinceOptions, districtOptions } from '@/types/enums';

export default function BuyerSignUp() {
  const { registerBuyer, user } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const [buyerData, setBuyerData] = useState<BuyerRequest>({
    userId: user?.id!,
    buyerType: BuyerType.INDIVIDUAL,
    address: {
      province: Province.KIGALI_CITY,
      district: District.GASABO,
    },
  });

  const [fieldErrors, setFieldErrors] = useState({
    buyerType: '',
    province: '',
    district: '',
  });

  const [touched, setTouched] = useState({
    buyerType: false,
    province: false,
    district: false,
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBuyerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'province') {
      setBuyerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          province: value as Province,
          district: District.GASABO,
        },
      }));
    } else if (name === 'district') {
      setBuyerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: value as District,
        },
      }));
    } else if (name === 'buyerType') {
      setBuyerData(prev => ({
        ...prev,
        buyerType: value as BuyerType,
      }));
    }

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, buyerData[name as keyof typeof buyerData] || buyerData.address[name as keyof typeof buyerData.address]);
  };

  const validateField = (name: string, value: string | boolean | any) => {
    let error = '';

    const stringValue = typeof value === 'string' ? value : '';

    switch (name) {
      case 'buyerType':
        if (!value) {
          error = 'Buyer type is required';
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
    const buyerTypeValid = validateField('buyerType', buyerData.buyerType);
    const provinceValid = validateField('province', buyerData.address.province);
    const districtValid = validateField('district', buyerData.address.district);

    setTouched({
      buyerType: true,
      province: true,
      district: true,
    });

    return buyerTypeValid && provinceValid && districtValid;
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
      // Register buyer
      await registerBuyer(buyerData);

      toast({
        title: 'Success',
        description: 'Buyer account created successfully!',
        variant: 'success',
      });

    } catch (error) {
      toast({
        title: 'Registration Error',
        description: 'Failed to create buyer account. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get districts for selected province
  const getDistrictsForProvince = (province: Province) => {
    return districtOptions.filter(district => {
      return true;
    });
  };

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
          Buyer Registration
        </h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
          Join our agricultural marketplace and connect with farmers directly
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl -mt-20 p-6 sm:p-8 z-20 relative">
        <h1 className="text-center text-gray-800 font-extrabold text-xl sm:text-2xl mb-4">
          Create Your Buyer Account
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

          {/* Buyer Information Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Buyer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerType" className="text-gray-700 font-medium text-sm">
                  Buyer Type
                </Label>
                <select
                  id="buyerType"
                  name="buyerType"
                  value={buyerData.buyerType}
                  onChange={handleBuyerInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${touched.buyerType && fieldErrors.buyerType
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  required
                >
                  <option value="">Select buyer type</option>
                  {buyerTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                {touched.buyerType && fieldErrors.buyerType && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.buyerType}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province" className="text-gray-700 font-medium text-sm">
                  Province
                </Label>
                <select
                  id="province"
                  name="province"
                  value={buyerData.address.province}
                  onChange={handleBuyerInputChange}
                  onBlur={handleBlur}
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
                  value={buyerData.address.district}
                  onChange={handleBuyerInputChange}
                  onBlur={handleBlur}
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

          {/* Terms and Submit */}
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Finish Creating account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}