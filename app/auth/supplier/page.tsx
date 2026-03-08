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
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { SupplierRequest, SupplierType, Address, Province, District } from '@/types';
import { supplierTypeOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';
import { Upload, X } from 'lucide-react';
import AuthFooter from '@/components/auth/AuthFooter';

export default function SupplierSignUp() {
  const { registerSupplier, user } = useAuth();
  const { t } = useI18n();
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
          error = t('auth.supplier.validation.businessNameRequired');
        } else if (stringValue.length < 2) {
          error = t('auth.supplier.validation.businessNameMinLength');
        }
        break;
      case 'supplierType':
        if (!value) {
          error = t('auth.supplier.validation.supplierTypeRequired');
        }
        break;
      case 'province':
        if (!value) {
          error = t('auth.supplier.validation.provinceRequired');
        }
        break;
      case 'district':
        if (!value) {
          error = t('auth.supplier.validation.districtRequired');
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
      notify.error(t('auth.supplier.validation.fixErrorsBelow'), t('common.error'));
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

      notify.success(t('auth.supplier.success.accountCreated'), t('common.success'));

    } catch (error) {
      notify.error(t('auth.supplier.error.accountCreationFailed'), t('auth.register.error'));
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
    <div className="w-full h-screen bg-background flex items-center">
      <div className="w-full overflow-scroll h-full bg-card rounded-lg p-6 sm:p-6 z-20 relative py-20">
        <h1 className="text-center text-foreground font-extrabold text-xl sm:text-2xl mb-4">{t('auth.signUp.createSupplierAccount')}</h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <Link
              key={idx}
              href={linkItem.link}
              target="_blank"
              className="p-3 text-muted-foreground transition border border-border rounded-md hover:bg-muted"
            >
              {linkItem.icon}
            </Link>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mb-6">{t('auth.signUp.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.signUp.profileImage')}</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profilePreview ? (
                  <div className="relative">
                    <Image
                      src={profilePreview}
                      alt={t('auth.signUp.alt.profilePreview')}
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full object-cover border-4 border-border"
                    />
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute -top-2 -right-2 bg-destructive text-primary-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-30 h-30 rounded-full bg-muted border-4 border-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => document.getElementById('profileImage')?.click()}
                disabled={loading || uploadLoading}
                variant="outline"
              >
                {t('auth.supplier.chooseImage')}
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
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.supplier.businessInformation')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName" className="text-foreground font-medium text-sm">
                  {t('auth.supplier.fields.businessName')}
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={supplierData.businessName}
                  onChange={handleSupplierInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  placeholder={t('auth.supplier.placeholders.businessName')}
                  className={`text-foreground font-medium text-sm ${touched.businessName && fieldErrors.businessName
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-success focus:ring-success'
                    }`}
                  required
                />
              </div>

              <div>
                <Label htmlFor="supplierType" className="text-foreground font-medium text-sm">
                  {t('auth.supplier.fields.supplierType')}
                </Label>
                <select
                  id="supplierType"
                  name="supplierType"
                  value={supplierData.supplierType}
                  onChange={handleSupplierInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.supplierType && fieldErrors.supplierType
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-success focus:ring-success'
                    }`}
                  required
                >
                  <option value="">{t('auth.supplier.placeholders.selectSupplierType')}</option>
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
            <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.supplier.businessLocation')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province" className="text-foreground font-medium text-sm">
                  {t('auth.buyer.fields.province')}
                </Label>
                <select
                  id="province"
                  name="province"
                  value={supplierData.address.province}
                  onChange={handleSupplierInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.province && fieldErrors.province
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-success focus:ring-success'
                    }`}
                  required
                >
                  <option value="">{t('auth.buyer.placeholders.selectProvince')}</option>
                  {provinceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="district" className="text-foreground font-medium text-sm">
                  {t('auth.buyer.fields.district')}
                </Label>
                <select
                  id="district"
                  name="district"
                  value={supplierData.address.district}
                  onChange={handleSupplierInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.district && fieldErrors.district
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-success focus:ring-success'
                    }`}
                  required
                >
                  <option value="">{t('auth.buyer.placeholders.selectDistrict')}</option>
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
              {loading || uploadLoading ? t('auth.supplier.creatingAccount') : t('auth.supplier.finishCreatingAccount')}
            </Button>
          </div>
        </form>
        <AuthFooter />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center ">
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute top-0 left-0 object-cover w-full h-full dark:brightness-50 dark:contrast-110 transition-all duration-300"
        />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">
          {t('auth.signUp.supplierRegistration')}
        </h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
          {t('auth.signUp.joinMarketplace.supplier')}
        </p>
      </div>

    </div>
  );
}
