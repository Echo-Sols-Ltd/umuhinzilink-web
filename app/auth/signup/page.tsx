'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BiLogoFacebookCircle} from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { District, UserRequest, UserType } from '@/types';
import AuthFooter from '@/components/auth/AuthFooter';
import GoogleRoleSelectionModal from '@/components/auth/GoogleRoleSelectionModal';
import GoogleLogin from '@/components/GoogleLogin';

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}


export default function SignUp() {
  const { register, registerGoogle, googleToken } = useAuth();
  const { t } = useI18n();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState<UserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserType.FARMER,
    district: District.KICUKIRO
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    district: ''
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
    agreeToTerms: false,
    role: false,
    district: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (googleToken) {
      setShowRoleModal(true);
    }
  }, [googleToken]);


  const handleGoogleRoleSubmit = async (role: UserType) => {
    try {
      if (!googleToken) return
      await registerGoogle({ role, token: googleToken });
      setShowRoleModal(false);
      notify.success(t('auth.signUp.primary'), t('common.primary'));
    } catch (error) {
      notify.error(t('auth.googleSignUp.error'), t('common.error'));
    } finally {

    }
  };

  const handleRoleModalClose = () => {

    setShowRoleModal(false);

  };


  const accountTypes = [
    { value: UserType.FARMER, labelKey: 'auth.accountTypes.farmer' },
    { value: UserType.SUPPLIER, labelKey: 'auth.accountTypes.supplier' },
    { value: UserType.BUYER, labelKey: 'auth.accountTypes.buyer' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      validateField('firstName', formData.firstName) &&
      validateField('lastName', formData.lastName) &&
      validateField('email', formData.email) &&
      validateField('phoneNumber', formData.phoneNumber) &&
      validateField('password', formData.password) &&
      validateField('agreeToTerms', agreeToTerms) &&
      validateField('role', formData.role);
    setTouched({
      firstName: true, lastName: true, email: true, phoneNumber: true, district: true, password: true, agreeToTerms: true, role: true,
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
            <div className="w-16 h-16 bg-linear-to-br from-green-400 to-sucess rounded-2xl flex items-center justify-center shadow-lg">
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
            <GoogleLogin />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('common.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Field */}
            <Field label={t('auth.fields.firstName')}>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder={t('auth.placeholders.firstName')}
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.firstName && fieldErrors.firstName ? 'border-error focus:ring-error' : 'focus:ring-primary'}`}
              />
              {touched.firstName && fieldErrors.firstName && <p className="text-xs text-error mt-1">{fieldErrors.firstName}</p>}
            </Field>
            <Field label={t('auth.fields.lastName')}>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder={t('auth.placeholders.lastName')}
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.lastName && fieldErrors.lastName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.lastName && fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
            </Field>

            {/* Email Field */}
            <Field label={t('auth.fields.email')}>
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
            </Field>

            {/* Phone Field */}
            <Field label={t('auth.fields.phoneNumber')}>
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
            </Field>
            <Field label={t('auth.farmer.fields.farmSize')}>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full text-foreground font-medium text-sm border rounded-md px-3 py-2"
              >
                <option value="">{t('auth.farmer.placeholders.selectFarmSize')}</option>
                {Object.values(District).map(option => <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>)}
              </select>
              {touched.district && fieldErrors.district && <p className="text-red-500 text-xs mt-1">{fieldErrors.district}</p>}
            </Field>

            {/* Account Type */}
            <Field label={t('auth.fields.accountType')}>
              <div className="grid grid-cols-3 gap-2">
                {accountTypes.map(type => (
                  <button key={type.value} type='button'
                    onClick={() => setFormData(p => ({ ...p, role: type.value }))}
                    className={`py-2 rounded-xl text-sm font-medium border transition
                    ${formData.role === type.value
                        ? 'bg-primary border-border text-white'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-green-400'}`}>
                    {t(type.labelKey)}
                  </button>
                ))}
              </div>
            </Field>

            {/* Password Field */}
            <Field label={t('auth.fields.password')}>
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
            </Field>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 cursor-pointer">
              <input id='agree' type="checkbox" checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 accent-primary" />
              <Label htmlFor='agree' className="text-sm leading-relaxed text-foreground cursor-pointer">{
                t('auth.signUp.agreeToTerms')}
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? t('auth.signUp.creatingAccount') : t('auth.signUp.signUp')}
            </Button>

            {/* Sign In Link */}
            <p className="text-sm text-center text-muted-foreground">
              {t('auth.signUp.alreadyHaveAccount')}{' '}
              <Link href="/auth/signin" className="text-primary font-semibold">{t('auth.signUp.signIn')}</Link>
            </p>
          </form>
          {/* Language Selector at Bottom */}
          <AuthFooter />
        </div>
      </div>

      {/* RIGHT – Hero Section */}
      <div className="w-full sm:w-1/2 relative flex flex-col justify-center items-center text-center overflow-hidden h-64 sm:h-auto">
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute object-cover dark:brightness-50 dark:contrast-110 transition-all duration-300"
        />
        <h1 className="text-white text-3xl sm:text-5xl font-extrabold z-10 mt-6 sm:mt-8 px-4">
          {t('auth.signUp.heroTitle')}
        </h1>
        <p className="text-white z-10 mt-2 text-sm sm:text-base px-6 sm:px-0">
          {t('auth.signUp.heroSubtitle.line1')} <br /> {t('auth.signUp.heroSubtitle.line2')}
        </p>
      </div>

      {/* Google Role Selection Modal */}
      <GoogleRoleSelectionModal
        isOpen={showRoleModal}
        onClose={handleRoleModalClose}
        onSubmit={handleGoogleRoleSubmit}
        loading={loading}
      />
    </div>
  );
}
