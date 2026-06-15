'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRequest, UserRole } from '@/types';
import AuthFooter from '@/components/auth/AuthFooter';
import GoogleLogin from '@/components/GoogleLogin';

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 relative">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}


export default function SignUp() {
  const { register, registerGoogle, googleToken } = useAuth();
  const { t } = useI18n();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState<UserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserRole.BUYER,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
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



  const handleGoogleRegister = async () => {
    try {
      if (!googleToken) return
      await registerGoogle({ token: googleToken, role: UserRole.BUYER });

      notify.success(t('auth.signUp.primary'), t('common.primary'));
    } catch (error) {
      notify.error(t('auth.googleSignUp.error'), t('common.error'));
    } finally {

    }
  };

  useEffect(() => {
    if (!googleToken) return
    handleGoogleRegister()
  }, [googleToken])

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
      case 'firstName':
        if (!strVal.trim()) error = t('auth.validation.firstNameRequired');
        else if (strVal.trim().length < 2) error = t('auth.validation.nameMinCharacters', { count: 2 });
        break;
      case 'lastName':
        if (!strVal.trim()) error = t('auth.validation.lastNameRequired');
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
    <div className="h-screen w-full flex items-center justify-center bg-muted/40 dark:bg-background p-4 sm:p-6 md:p-8">
      {/* Floating card */}
      <div className="w-full max-w-5xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px]">

        {/* LEFT – Hero panel */}
        <div className="hidden md:flex relative md:w-[42%] bg-gradient-to-br from-primary to-secondary rounded-2xl m-3 overflow-hidden flex-col justify-between p-8">
          {/* Background image */}
          <Image
            src="/hero.png"
            alt="background"
            fill
            className="absolute inset-0 object-cover opacity-20"
          />
          {/* Text */}
          <div className="relative z-10">
            <h2 className="text-white text-3xl font-extrabold leading-tight">
              {t('auth.signIn.heroTitle')}
            </h2>
            <div className="mt-2 w-16 h-1 bg-white/60 rounded-full" />
            <p className="text-white/80 text-sm mt-4 leading-relaxed">
              {t('auth.signIn.heroSubtitle.line1')} {t('auth.signIn.heroSubtitle.line2')}
            </p>
          </div>
        </div>

        {/* RIGHT – Form Section */}
        <div className="w-full md:w-[62%] flex flex-col px-6 py-8 sm:px-10 overflow-y-scroll">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-bold text-lg text-foreground">UmuhinziLink</span>
          </div>

          <h1 className="text-2xl font-extrabold text-foreground mb-1">{t('auth.signUp.title')}</h1>
          <p className="text-muted-foreground text-sm mb-6">{t('auth.signUp.subtitle')}</p>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex justify-center items-center">
              <GoogleLogin />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('common.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('auth.fields.firstName')} error={touched.firstName && fieldErrors.firstName ? fieldErrors.firstName : undefined}>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={t('auth.placeholders.firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`bg-muted/50 border border-border h-11 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${touched.firstName && fieldErrors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </Field>
              <Field label={t('auth.fields.lastName')} error={touched.lastName && fieldErrors.lastName ? fieldErrors.lastName : undefined}>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={t('auth.placeholders.lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`bg-muted/50 border border-border h-11 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${touched.lastName && fieldErrors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </Field>
            </div>

            {/* Email & Phone Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('auth.fields.email')} error={touched.email && fieldErrors.email ? fieldErrors.email : undefined}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.placeholders.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`bg-muted/50 border border-border h-11 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${touched.email && fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </Field>
              <Field label={t('auth.fields.phoneNumber')} error={touched.phoneNumber && fieldErrors.phoneNumber ? fieldErrors.phoneNumber : undefined}>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder={t('auth.placeholders.phoneNumber')}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`bg-muted/50 border border-border h-11 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${touched.phoneNumber && fieldErrors.phoneNumber ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </Field>
            </div>

            {/* Password Field */}
            <Field label={t('auth.fields.password')} error={touched.password && fieldErrors.password ? fieldErrors.password : undefined}>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.placeholders.passwordDots')}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`bg-muted/50 border border-border h-11 rounded-xl text-sm pr-10 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${touched.password && fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                <button type="button" className="absolute right-3 top-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 cursor-pointer">
              <input id='agree' type="checkbox" checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary" />
              <Label htmlFor='agree' className="text-sm leading-normal text-muted-foreground cursor-pointer select-none">
                {t('auth.signUp.agreeToTerms')}
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors shadow-sm" disabled={loading}>
              {loading ? t('auth.signUp.creatingAccount') : t('auth.signUp.signUp')}
            </Button>

            {/* Sign In Link */}
            <p className="text-sm text-center text-muted-foreground mt-4">
              {t('auth.signUp.alreadyHaveAccount')}{' '}
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline">{t('auth.signUp.signIn')}</Link>
            </p>
          </form>

          <div className="mt-4">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
