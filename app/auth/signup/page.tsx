'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BiLogoFacebookCircle, BiLogoGoogle } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRequest, UserType } from '@/types';
import LanguageSelector from '@/components/auth/LanguageSelector';
import AuthFooter from '@/components/auth/AuthFooter';

export default function SignUp() {
  const { register, registerGoogle, googleLogin } = useAuth();
  const { t } = useI18n();
  const [showModal, setShowModal] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState<UserRequest>({
    names: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserType.FARMER,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    names: '', email: '', phoneNumber: '', password: '', role: '',
  });
  const [touched, setTouched] = useState({
    names: false, email: false, phoneNumber: false, password: false, agreeToTerms: false, role: false,
  });
  const [loading, setLoading] = useState(false);

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={22} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={22} />, link: 'https://google.com' },
  ];

  const accountTypes = [
    { value: UserType.FARMER, labelKey: 'auth.accountTypes.farmer' },
    { value: UserType.SUPPLIER, labelKey: 'auth.accountTypes.supplier' },
    { value: UserType.BUYER, labelKey: 'auth.accountTypes.buyer' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: string | boolean) => {
    let error = '';
    const strVal = typeof value === 'string' ? value : '';

    switch (name) {
      case 'names':
        if (!strVal.trim()) error = t('auth.validation.fullNameRequired');
        else if (strVal.trim().length < 2) error = t('auth.validation.nameMinCharacters', { count: 2 });
        break;
      case 'email':
        if (!strVal.trim()) error = t('auth.validation.emailRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) error = t('auth.validation.invalidEmail');
        break;
      case 'phoneNumber':
        if (!strVal.trim()) error = t('auth.validation.phoneNumberRequired');
        else if (strVal.replace(/[^0-9+]/g, '').length < 10) error = t('auth.validation.minimumDigits', { count: 10 });
        break;
      case 'password':
        if (!strVal) error = t('auth.validation.passwordRequired');
        else if (strVal.length < 8) error = t('auth.validation.minimumCharacters', { count: 8 });
        else if (!/[A-Z]/.test(strVal)) error = t('auth.validation.mustContainUppercase');
        else if (!/[0-9]/.test(strVal)) error = t('auth.validation.mustContainNumber');
        else if (!/[!@#$%^&*]/.test(strVal)) error = t('auth.validation.mustContainSpecialChar');
        break;
      case 'agreeToTerms':
        if (value !== true) error = t('auth.validation.mustAgreeToTerms');
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    const ok =
      validateField('names', formData.names) &&
      validateField('email', formData.email) &&
      validateField('phoneNumber', formData.phoneNumber) &&
      validateField('password', formData.password) &&
      validateField('agreeToTerms', agreeToTerms) &&
      validateField('role', formData.role);
    setTouched({
      names: true, email: true, phoneNumber: true, password: true, agreeToTerms: true, role: true,
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      notify.error(t('auth.validation.fixErrorsBelow'), t('common.error'));
      setLoading(false);
      return;
    }
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row bg-background overflow-hidden">
      {/* LEFT – Form Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-card overflow-auto">
        <div className="w-full max-w-md flex flex-col justify-center">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">UL</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-2">{t('auth.signUp.title')}</h1>
          <p className="text-muted-foreground text-sm sm:text-base text-center mb-6">{t('auth.signUp.subtitle')}</p>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BiLogoFacebookCircle size={20} className="mr-2 text-blue-600" />
              <span>{t('auth.signUp.continueWithFacebook')}</span>
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BiLogoGoogle size={20} className="mr-2 text-red-500" />
              <span>{t('auth.signUp.continueWithGoogle')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('common.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Field */}
            <div>
              <Label htmlFor="names" className="text-sm">{t('auth.fields.fullName')}</Label>
              <Input
                id="names"
                name="names"
                type="text"
                placeholder={t('auth.placeholders.fullName')}
                value={formData.names}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.names && fieldErrors.names ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.names && fieldErrors.names && <p className="text-xs text-red-500 mt-1">{fieldErrors.names}</p>}
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm">{t('auth.fields.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.placeholders.email')}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.email && fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.email && fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <Label htmlFor="phoneNumber" className="text-sm">{t('auth.fields.phoneNumber')}</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder={t('auth.placeholders.phoneNumber')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.phoneNumber && fieldErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.phoneNumber && fieldErrors.phoneNumber && <p className="text-xs text-red-500 mt-1">{fieldErrors.phoneNumber}</p>}
            </div>

            {/* Account Type */}
            <div>
              <Label className="text-sm">{t('auth.fields.accountType')}</Label>
              <div className="flex gap-4 mt-2 mb-4">
                {accountTypes.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <Switch
                      id={type.value}
                      checked={formData.role === type.value}
                      onCheckedChange={() => setFormData(prev => ({ ...prev, role: type.value }))}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <span className="text-foreground text-sm">{t(type.labelKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <Label htmlFor="password" className="text-sm">{t('auth.fields.password')}</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.placeholders.passwordDots')}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 pr-10 ${touched.password && fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              <button type="button" className="absolute right-3 top-9 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.password && fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center gap-2">
              <Switch checked={agreeToTerms} onCheckedChange={setAgreeToTerms} className="data-[state=checked]:bg-green-600" />
              <Label className="text-sm text-foreground">{t('auth.signUp.agreeToTerms')}</Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-success hover:bg-success/90" disabled={loading}>
              {loading ? t('auth.signUp.creatingAccount') : t('auth.signUp.signUp')}
            </Button>

            {/* Sign In Link */}
            <p className="text-sm text-center text-muted-foreground">
              {t('auth.signUp.alreadyHaveAccount')}{' '}
              <Link href="/auth/signin" className="text-success font-semibold">{t('auth.signUp.signIn')}</Link>
            </p>
          </form>
          {/* Language Selector at Bottom */}
          <AuthFooter />
        </div>
      </div>

      {/* RIGHT – Hero Section */}
      <div className="w-full sm:w-1/2 relative flex flex-col justify-center items-center text-center h-64 sm:h-auto">
        <Image src="/Image.png" alt="background" fill className="absolute object-cover dark:brightness-50 dark:contrast-110 transition-all duration-300" />
        <h1 className="text-white text-3xl sm:text-5xl font-extrabold z-10 mt-6 sm:mt-8 px-4">{t('auth.signUp.heroTitle')}</h1>
        <p className="text-white z-10 mt-2 text-sm sm:text-base px-6 sm:px-0">
          {t('auth.s  ignUp.heroSubtitle.line1')} <br /> {t('auth.signUp.heroSubtitle.line2')}
        </p>
      </div>


    </div>
  );
}
