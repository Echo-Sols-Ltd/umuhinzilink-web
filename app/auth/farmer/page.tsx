'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRequest, UserType } from '@/types';
import { FarmerRequest, FarmSizeCategory, ExperienceLevel, Address, Province, District, RwandaCrop } from '@/types';
import { farmSizeOptions, experienceLevelOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';
import { Upload, X } from 'lucide-react';
import AuthFooter from '@/components/auth/AuthFooter';

export default function FarmerSignUp() {
  const { registerFarmer, user } = useAuth();
  const { t } = useI18n();
  const { uploadFile, uploadingFiles, loading: uploadLoading } = useUserAction();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          error = t('auth.farmer.validation.farmSizeRequired');
        }
        break;
      case 'experienceLevel':
        if (!value) {
          error = t('auth.farmer.validation.experienceLevelRequired');
        }
        break;
      case 'province':
        if (!value) {
          error = t('auth.farmer.validation.provinceRequired');
        }
        break;
      case 'district':
        if (!value) {
          error = t('auth.farmer.validation.districtRequired');
        }
        break;
      case 'crops':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = t('auth.farmer.validation.cropsRequired');
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
        notify.error(t('auth.signUp.validation.fileTooLarge'), t('common.error'));
        return;
      }
      if (!file.type.startsWith('image/')) {
        notify.error(t('auth.signUp.validation.invalidFileType'), t('common.error'));
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
      notify.error(t('auth.farmer.validation.fixErrorsBelow'), t('common.error'));
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

      notify.success(t('auth.farmer.success.accountCreated'), t('common.success'));

    } catch (error) {
      notify.error(t('auth.farmer.error.accountCreationFailed'), t('auth.register.error'));
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


  return (<>
    <div className="w-full h-screen bg-background flex items-center">
      <div className="w-full h-full bg-card shadow-lg rounded-lg p-6 sm:p-6 overflow-scroll z-20 relative">
        <h1 className="text-center text-foreground font-extrabold text-xl sm:text-2xl mb-4">
          {t('auth.signUp.createFarmerAccount')}
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <a
              key={idx}
              href={linkItem.link}
              target="_blank"
              className="p-3 text-muted-foreground transition border border-border rounded-md hover:bg-muted"
            >
              {linkItem.icon}
            </a>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mb-6">{t('auth.signUp.subtitle')}</p>

        <form className="space-y-6">

          {/* Profile Image Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.signUp.profileImage')}</h2>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img src={profilePreview} alt={t('auth.signUp.alt.profilePreview')} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
                {profilePreview && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute -top-1 -right-1 bg-destructive text-primary-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-foreground font-medium text-sm mb-2 block">{t('auth.signUp.uploadProfileImage')}</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profilePreview ? t('auth.farmer.changeImage') : t('auth.farmer.chooseImage')}
                </Button>
                <p className="text-xs text-muted-foreground">{t('auth.signUp.validation.fileSizeHint')}</p>
              </div>
            </div>
          </div>

          {/* Farm Information */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.farmer.farmInformation')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-medium text-sm">{t('auth.farmer.fields.farmSize')}</Label>
                <select
                  name="farmSize"
                  value={farmerData.farmSize}
                  onChange={handleFarmerInputChange}
                  className="w-full text-foreground font-medium text-sm border rounded-md px-3 py-2"
                >
                  <option value="">{t('auth.farmer.placeholders.selectFarmSize')}</option>
                  {farmSizeOptions.map(option => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
                {touched.farmSize && fieldErrors.farmSize && <p className="text-red-500 text-xs mt-1">{fieldErrors.farmSize}</p>}
              </div>
              <div>
                <Label className="text-foreground font-medium text-sm">{t('auth.farmer.fields.farmingExperience')}</Label>
                <select
                  name="experienceLevel"
                  value={farmerData.experienceLevel}
                  onChange={handleFarmerInputChange}
                  className="w-full text-foreground font-medium text-sm border rounded-md px-3 py-2"
                >
                  <option value="">{t('auth.farmer.placeholders.selectExperienceLevel')}</option>
                  {experienceLevelOptions.map(option => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
                {touched.experienceLevel && fieldErrors.experienceLevel && <p className="text-red-500 text-xs mt-1">{fieldErrors.experienceLevel}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.farmer.farmLocation')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-medium text-sm">{t('auth.buyer.fields.province')}</Label>
                <select
                  name="province"
                  value={farmerData.address.province}
                  onChange={handleFarmerInputChange}
                  className="w-full text-foreground font-medium text-sm border rounded-md px-3 py-2"
                >
                  <option value="">{t('auth.buyer.placeholders.selectProvince')}</option>
                  {provinceOptions.map(option => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
                </select>
                {touched.province && fieldErrors.province && <p className="text-red-500 text-xs mt-1">{fieldErrors.province}</p>}
              </div>
              <div>
                <Label className="text-foreground font-medium text-sm">{t('auth.buyer.fields.district')}</Label>
                <select
                  name="district"
                  value={farmerData.address.district}
                  onChange={handleFarmerInputChange}
                  className="w-full text-foreground font-medium text-sm border rounded-md px-3 py-2"
                >
                  <option value="">{t('auth.buyer.placeholders.selectDistrict')}</option>
                  {districtOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                {touched.district && fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
              </div>
            </div>
          </div>

          {/* Crops */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.farmer.cropsYouGrow')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {commonCrops.map(crop => (
                <div key={crop} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={farmerData.crops.includes(crop as RwandaCrop)}
                    onChange={(e) => handleCropChange(crop as RwandaCrop, e.target.checked)}
                    className="rounded border-border text-success focus:ring-success"
                  />
                  <Label className="text-sm text-foreground">{crop.replace(/_/g, ' ')}</Label>
                </div>
              ))}
            </div>
            {touched.crops && fieldErrors.crops && <p className="text-red-500 text-xs mt-2">{fieldErrors.crops}</p>}
          </div>

          {/* Submit */}
          <div className="space-y-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || uploadLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
            >
              {loading || uploadLoading ? t('auth.farmer.creatingAccount') : t('auth.farmer.finishCreatingAccount')}
            </Button>
          </div>
        </form>
        <AuthFooter />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute right-0 top-0 object-cover w-full h-full dark:brightness-50 dark:contrast-110 transition-all duration-300"
        />

        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">
          {t('auth.signUp.farmerRegistration')}
        </h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
          {t('auth.signUp.joinMarketplace.farmer')}
        </p>
      </div>
    </div>
    
  </>
  );
}
