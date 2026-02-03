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
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRequest, UserType } from '@/types';
import { SupplierRequest, SupplierType, Address, Province, District } from '@/types';
import { supplierTypeOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';
import { Upload, X } from 'lucide-react';

export default function SupplierSignUp() {
  const { registerSupplier, user } = useAuth();
  const { uploadFile, uploadingFiles, loading: uploadLoading } = useUserAction();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
const {toast}=useToast()
  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const [supplierData, setSupplierData] = useState<SupplierRequest>({
    userId: user?.id!,
    businessName: '',
    supplierType: SupplierType.WHOLESALER,
    address: {
      province: Province.KIGALI_CITY,
      district: District.GASABO,
    },
  });

  const [fieldErrors, setFieldErrors] = useState({
    businessName: '',
    supplierType: '',
    province: '',
    district: '',
  });

  const [touched, setTouched] = useState({
    businessName: false,
    supplierType: false,
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

  const handleSupplierInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'businessName') {
      setSupplierData(prev => ({
        ...prev,
        businessName: value,
      }));
    } else if (name === 'province') {
      setSupplierData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          province: value as Province,
          district: District.GASABO,
        },
      }));
    } else if (name === 'district') {
      setSupplierData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district: value as District,
        },
      }));
    } else if (name === 'supplierType') {
      setSupplierData(prev => ({
        ...prev,
        supplierType: value as SupplierType,
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
    validateField(name, supplierData[name as keyof typeof supplierData] || supplierData.address[name as keyof typeof supplierData.address]);
  };

  const validateField = (name: string, value: string | boolean | any) => {
    let error = '';

    const stringValue = typeof value === 'string' ? value : '';

    switch (name) {
      case 'businessName':
        if (!value || stringValue.trim() === '') {
          error = 'Business name is required';
        } else if (stringValue.length < 2) {
          error = 'Business name must be at least 2 characters';
        }
        break;
      case 'supplierType':
        if (!value) {
          error = 'Supplier type is required';
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
    const businessNameValid = validateField('businessName', supplierData.businessName);
    const supplierTypeValid = validateField('supplierType', supplierData.supplierType);
    const provinceValid = validateField('province', supplierData.address.province);
    const districtValid = validateField('district', supplierData.address.district);

    setTouched({
      businessName: true,
      supplierType: true,
      province: true,
      district: true,
    });

    return businessNameValid && supplierTypeValid && provinceValid && districtValid;
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Profile image must be less than 5MB',
          variant: 'error',
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'error',
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
      // First upload profile image if selected
      if (profileImage) {
        await uploadFile(profileImage);
      }

      // Then register the supplier
      await registerSupplier(supplierData);

      toast({
        title: 'Success',
        description: 'Supplier account created successfully!',
        variant: 'success',
      });

    } catch (error) {
      toast({
        title: 'Registration Error',
        description: 'Failed to create supplier account. Please try again.',
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
  <div className="w-full h-screen bg-gray-50 flex items-center">
    <div className="w-full overflow-scroll h-full bg-white rounded-xl p-6 sm:p-8 z-20 relative py-20">
      <h1 className="text-center text-gray-800 font-extrabold text-xl sm:text-2xl mb-4">
        Create Your Supplier Account
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
        {/* Profile Image Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profilePreview ? (
                <div className="relative">
                  <Image
                    src={profilePreview}
                    alt="Profile preview"
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-30 h-30 rounded-full bg-gray-200 border-4 border-gray-200 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => document.getElementById('profileImage')?.click()}
              disabled={loading || uploadLoading}
              variant="outline"
            >
              Choose Image
            </Button>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
              disabled={loading || uploadLoading}
            />
          </div>
        </div>

        {/* Business Information Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName" className="text-gray-700 font-medium text-sm">
                Business Name
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={supplierData.businessName}
                onChange={handleSupplierInputChange}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="Enter your business name"
                className={`text-gray-700 font-medium text-sm ${
                  touched.businessName && fieldErrors.businessName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
                required
              />
            </div>

            <div>
              <Label htmlFor="supplierType" className="text-gray-700 font-medium text-sm">
                Supplier Type
              </Label>
              <select
                id="supplierType"
                name="supplierType"
                value={supplierData.supplierType}
                onChange={handleSupplierInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${
                  touched.supplierType && fieldErrors.supplierType
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
                required
              >
                <option value="">Select supplier type</option>
                {supplierTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Business Location Section */}
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
                value={supplierData.address.province}
                onChange={handleSupplierInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${
                  touched.province && fieldErrors.province
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
            </div>

            <div>
              <Label htmlFor="district" className="text-gray-700 font-medium text-sm">
                District
              </Label>
              <select
                id="district"
                name="district"
                value={supplierData.address.district}
                onChange={handleSupplierInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2 ${
                  touched.district && fieldErrors.district
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
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
            disabled={loading || uploadLoading}
          >
            {loading || uploadLoading ? 'Creating Account...' : 'Finish Creating Account'}
          </Button>
        </div>
      </form>
    </div>

    {/* Hero Section */}
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center ">
      <Image
        src="/Image.png"
        alt="background"
        fill
        className="absolute top-0 left-0 object-cover w-full h-full"
      />
      <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">
        Supplier Registration
      </h1>
      <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
        Join our agricultural marketplace and connect with farmers and buyers
      </p>
    </div>
  </div>
);

}
