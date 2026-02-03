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
import useUserAction from '@/hooks/useUserAction';
import { Upload, X } from 'lucide-react';

export default function FarmerSignUp() {
  const { registerFarmer, user } = useAuth();
  const { uploadFile, uploadingFiles, loading: uploadLoading } = useUserAction();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const [farmerData, setFarmerData] = useState<FarmerRequest>({
    userId: user?.id!,
    farmSize: FarmSizeCategory.SMALLHOLDER,
    experienceLevel: ExperienceLevel.LESS_THAN_1Y,
    address: {
      province: Province.KIGALI_CITY,
      district: District.GASABO,
    },
    crops: [],
  });

  const [fieldErrors, setFieldErrors] = useState({
    farmSize: '',
    experienceLevel: '',
    province: '',
    district: '',
    crops: '',
  });

  const [touched, setTouched] = useState({
    farmSize: false,
    experienceLevel: false,
    province: false,
    district: false,
    crops: false,
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
          district: District.GASABO,
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
    validateField(name, farmerData[name as keyof typeof farmerData]);
  };

  const validateField = (name: string, value: string | boolean | any) => {
    let error = '';

    const stringValue = typeof value === 'string' ? value : '';

    switch (name) {

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
    const farmSizeValid = validateField('farmSize', farmerData.farmSize);
    const experienceValid = validateField('experienceLevel', farmerData.experienceLevel);
    const provinceValid = validateField('province', farmerData.address.province);
    const districtValid = validateField('district', farmerData.address.district);
    const cropsValid = validateField('crops', farmerData.crops);

    setTouched({
      farmSize: true,
      experienceLevel: true,
      province: true,
      district: true,
      crops: true,
    });

    return farmSizeValid && experienceValid && provinceValid && districtValid && cropsValid;
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

      // Then register the farmer
      await registerFarmer(farmerData);

      toast({
        title: 'Success',
        description: 'Farmer account created successfully!',
        variant: 'success',
      });

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
      return true;
    });
  };

  // Common Rwanda crops for selection

   const farmSizeOptions = ['SMALLHOLDER', 'MEDIUM', 'LARGE'];
  const experienceLevelOptions = ['LESS_THAN_1Y', '1_TO_3Y', 'MORE_THAN_3Y'];
  const provinceOptions = ['KIGALI_CITY', 'EAST', 'WEST', 'NORTH', 'SOUTH'];
  const districtOptions = ['GASABO', 'KANOMBE', 'NYARUGENGE', 'KICUKIRO'];
  const commonCrops = ['MAIZE', 'DRY_BEANS', 'IRISH_POTATO', 'CASSAVA', 'TOMATO', 'CABBAGE', 'ONION', 'CARROT', 'COFFEE', 'TEA'];


  return (
    <div className="w-full h-screen bg-gray-50 flex  items-center">
  

   <div className="w-full h-full bg-white shadow-lg rounded-xl p-6 sm:p-8 overflow-scroll z-20 relative">
        <h1 className="text-center text-gray-800 font-extrabold text-xl sm:text-2xl mb-4">
          Create Your Farmer Account
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <a
              key={idx}
              href={linkItem.link}
              target="_blank"
              className="p-3 text-gray-700 transition border border-gray-100 rounded-md hover:bg-gray-100"
            >
              {linkItem.icon}
            </a>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Or fill in your details below</p>

        <form className="space-y-6">

          {/* Profile Image Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h2>
            <div className="flex items-center space-x-6">
              <div className="relative w-30 h-30 rounded-full bg-gray-200 border-4 border-gray-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <Label className="text-gray-700 font-medium text-sm mb-2 block">Upload Profile Image</Label>
                <Button type="button" variant="outline" className="mb-2">Choose Image</Button>
                <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Farm Information */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Farm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium text-sm">Farm Size</Label>
                <select className="w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2">
                  <option value="">Select farm size</option>
                  {farmSizeOptions.map(option => <option key={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-gray-700 font-medium text-sm">Farming Experience</Label>
                <select className="w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2">
                  <option value="">Select experience level</option>
                  {experienceLevelOptions.map(option => <option key={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Farm Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium text-sm">Province</Label>
                <select className="w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2">
                  <option value="">Select province</option>
                  {provinceOptions.map(option => <option key={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-gray-700 font-medium text-sm">District</Label>
                <select className="w-full text-gray-700 font-medium text-sm border rounded-md px-3 py-2">
                  <option value="">Select district</option>
                  {districtOptions.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Crops */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Crops You Grow</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {commonCrops.map(crop => (
                <div key={crop} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <Label className="text-sm text-gray-700">{crop.replace(/_/g, ' ')}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="space-y-4">
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm">
              Finish Creating Account
            </Button>
          </div>
        </form>
      </div>

          {/* Hero Section */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
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
    </div>
  );
}
