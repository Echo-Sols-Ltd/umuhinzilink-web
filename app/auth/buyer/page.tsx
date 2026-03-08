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
import { useI18n } from '@/contexts/I18nContext';
import { BuyerRequest, BuyerType, Province, District } from '@/types';
import { buyerTypeOptions, provinceOptions, districtOptions } from '@/types/enums';
import useUserAction from '@/hooks/useUserAction';
import AuthFooter from '@/components/auth/AuthFooter';

export default function BuyerSignUp() {
  const { registerBuyer, user } = useAuth();
  const { t } = useI18n();
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          error = t('auth.buyer.validation.buyerTypeRequired');
          break;
        case 'province':
          error = t('auth.buyer.validation.provinceRequired');
          break;
        case 'district':
          error = t('auth.buyer.validation.districtRequired');
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

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      notify.error(t('auth.buyer.validation.fixErrorsBelow'), t('common.error'));
      setLoading(false);
      return;
    }

    try {
      if (profileImage) await uploadFile(profileImage);
      await registerBuyer(buyerData);
      notify.success(t('auth.buyer.success.accountCreated'), t('common.success'));
    } catch {
      notify.error(t('auth.buyer.error.accountCreationFailed'), t('auth.register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-background flex items-center">
      <div className="w-full overflow-scroll h-full bg-card rounded-lg  p-6 sm:p-6 z-20 relative py-20">
        <h1 className="text-center text-foreground font-extrabold text-xl sm:text-2xl mb-4">{t('auth.signUp.createBuyerAccount')}</h1>

        <div className="flex gap-4 justify-center mb-6">
          {socialLinks.map((linkItem, idx) => (
            <a
              key={idx}
              href={linkItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-success/10 hover:text-success transition"
            >
              {linkItem.icon}
            </a>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('auth.signUp.profileImage')}</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profilePreview ? (
                    <img src={profilePreview} alt={t('auth.signUp.alt.profilePreview')} className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white hover:bg-success/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyerType" className="text-foreground font-medium text-sm">{t('auth.buyer.fields.buyerType')}</Label>
              <select id="buyerType" name="buyerType" value={buyerData.buyerType} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.buyerType && fieldErrors.buyerType ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                <option value="">{t('auth.buyer.placeholders.selectBuyerType')}</option>
                {buyerTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {touched.buyerType && fieldErrors.buyerType && <p className="text-destructive text-xs mt-1">{fieldErrors.buyerType}</p>}
            </div>
            <div>
              <Label htmlFor="profileImage" className="text-foreground font-medium text-sm mb-2 block">{t('auth.signUp.uploadProfileImage')}</Label>
              <select id="province" name="province" value={buyerData.address.province} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.province && fieldErrors.province ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                <option value="">{t('auth.buyer.placeholders.selectProvince')}</option>
                {provinceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {touched.province && fieldErrors.province && <p className="text-destructive text-xs mt-1">{fieldErrors.province}</p>}
            </div>
            <div>
              <Label htmlFor="district" className="text-foreground font-medium text-sm">{t('auth.buyer.fields.district')}</Label>
              <select id="district" name="district" value={buyerData.address.district} onChange={handleInputChange} onBlur={handleBlur} disabled={loading} className={`w-full text-foreground font-medium text-sm border rounded-md px-3 py-2 ${touched.district && fieldErrors.district ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-success focus:ring-success'}`} required>
                <option value="">{t('auth.buyer.placeholders.selectDistrict')}</option>
                {districtOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {touched.district && fieldErrors.district && <p className="text-destructive text-xs mt-1">{fieldErrors.district}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="space-y-4">
            <Button type="submit" className="w-full bg-success hover:bg-success/90 text-primary-foreground font-medium text-sm" disabled={loading || uploadLoading}>
              {loading || uploadLoading ? t('auth.buyer.creatingAccount') : t('auth.buyer.finishCreatingAccount')}
            </Button>
          </div>
        </form>
         <AuthFooter />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center">
        <Image src="/Image.png" alt="background" fill className="absolute right-0 top-0 object-cover w-full h-full dark:brightness-50 dark:contrast-110 transition-all duration-300" />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">{t('auth.signUp.buyerRegistration')}</h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">{t('auth.signUp.joinMarketplace.buyer')}</p>
      </div>
    </div>

  );
}
