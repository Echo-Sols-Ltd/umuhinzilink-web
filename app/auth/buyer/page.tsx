'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { BuyerRequest, BuyerType, Province, District } from '@/types';
import { buyerTypeOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';

export default function BuyerSignUp() {
  const { registerBuyer, user } = useAuth();
  const { uploadFile, uploadingFiles, loading: uploadLoading } = useUserAction();
  const [buyerData, setBuyerData] = useState<BuyerRequest>({
    userId: user?.id!,
    buyerType: BuyerType.INDIVIDUAL,
    address: { province: Province.KIGALI_CITY, district: District.GASABO },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'province') {
      setBuyerData(prev => ({ ...prev, address: { ...prev.address, province: value as Province, district: District.GASABO } }));
    } else if (name === 'district') {
      setBuyerData(prev => ({ ...prev, address: { ...prev.address, district: value as District } }));
    } else if (name === 'buyerType') {
      setBuyerData(prev => ({ ...prev, buyerType: value as BuyerType }));
    }

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, buyerData[name as keyof BuyerRequest] || buyerData.address[name as keyof typeof buyerData.address]);
  };

  const validateField = (name: string, value: any) => {
    let error = '';
    if (!value) {
      switch (name) {
        case 'buyerType':
          error = 'Buyer type is required';
          break;
        case 'province':
          error = 'Province is required';
          break;
        case 'district':
          error = 'District is required';
          break;
      }
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    const buyerTypeValid = validateField('buyerType', buyerData.buyerType);
    const provinceValid = validateField('province', buyerData.address.province);
    const districtValid = validateField('district', buyerData.address.district);

    setTouched({ buyerType: true, province: true, district: true });

    return buyerTypeValid && provinceValid && districtValid;
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return notify.error('Please select an image file', 'Invalid file type');
    if (file.size > 5 * 1024 * 1024) return notify.error('Profile image must be less than 5MB', 'File too large');

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      notify.error('Please fix the errors below and try again.', 'Validation Error');
      setLoading(false);
      return;
    }

    try {
      if (profileImage) await uploadFile(profileImage);
      await registerBuyer(buyerData);
      notify.success('Buyer account created successfully!', 'Success');
    } catch {
      notify.error('Failed to create buyer account. Please try again.', 'Registration Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-background flex items-center">
      <div className="w-full overflow-scroll h-full bg-card rounded-lg  p-6 sm:p-6 z-20 relative py-20">
        <h1 className="text-center text-foreground font-extrabold text-xl sm:text-2xl mb-4">Create Your Buyer Account</h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <Link key={idx} href={linkItem.link} target="_blank" className="p-3 text-muted-foreground transition border border-border rounded-md hover:bg-muted">{linkItem.icon}</Link>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mb-6">Or fill in your details below</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Image</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profilePreview ? (
                  <div className="relative">
                    <Image src={profilePreview} alt="Profile preview" width={120} height={120} className="w-30 h-30 rounded-full object-cover border-4 border-border" />
                    <button type="button" onClick={removeProfileImage} className="absolute -top-2 -right-2 bg-destructive text-primary-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-30 h-30 rounded-full bg-muted border-4 border-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button type="button" onClick={() => document.getElementById('profileImage')?.click()} disabled={loading || uploadLoading} variant="outline">Choose Image</Button>
              <input id="profileImage" type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" disabled={loading || uploadLoading} />
            </div>
          </div>

          {/* Buyer Info */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Buyer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerType" className="text-foreground font-medium text-sm">Buyer Type</Label>
                <select id="buyerType" name="buyerType" value={buyerData.buyerType} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.buyerType && fieldErrors.buyerType ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                  <option value="">Select buyer type</option>
                  {buyerTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Business Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province" className="text-foreground font-medium text-sm">Province</Label>
                <select id="province" name="province" value={buyerData.address.province} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.province && fieldErrors.province ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                  <option value="">Select province</option>
                  {provinceOptions.map(option => <option key={option.value} value={option.value}>{option.label.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="district" className="text-foreground font-medium text-sm">District</Label>
                <select id="district" name="district" value={buyerData.address.district} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.district && fieldErrors.district ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                  <option value="">Select district</option>
                  {districtOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="space-y-4">
            <Button type="submit" className="w-full bg-success hover:bg-success/90 text-primary-foreground font-medium text-sm" disabled={loading || uploadLoading}>
              {loading || uploadLoading ? 'Creating Account...' : 'Finish Creating Account'}
            </Button>
          </div>
        </form>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
        <Image src="/Image.png" alt="background" fill className="absolute right-0 top-0 object-cover w-full h-full dark:brightness-50 dark:contrast-110 transition-all duration-300" />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">Buyer Registration</h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">Join our agricultural marketplace and connect with farmers directly</p>
      </div>
    </div>
  );
}
