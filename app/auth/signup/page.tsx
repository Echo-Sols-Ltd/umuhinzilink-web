'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from '@/lib/icons';
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
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const inputClass =
  'bg-muted/50 border border-border h-9 rounded-lg text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary';

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-destructive leading-tight">{error}</p>}
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
    const errorMessage = await register(formData);
    if (errorMessage) {
      const lower = errorMessage.toLowerCase();
      if (lower.includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: errorMessage }));
        setTouched(prev => ({ ...prev, email: true }));
      }
      if (lower.includes('phone')) {
        setFieldErrors(prev => ({ ...prev, phoneNumber: errorMessage }));
        setTouched(prev => ({ ...prev, phoneNumber: true }));
      }
    }
    setLoading(false);
  };

  const fieldError = (name: keyof typeof fieldErrors) =>
    touched[name] && fieldErrors[name] ? fieldErrors[name] : undefined;

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-muted/40 dark:bg-background p-3 sm:p-4">
      <div className="w-full max-w-5xl max-h-[calc(100dvh-1.5rem)] bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT – Hero panel */}
        <div className="hidden md:flex relative md:w-[42%] shrink-0 bg-gradient-to-br from-primary to-secondary rounded-2xl m-2 overflow-hidden flex-col justify-between p-6">
          <Image
            src="/hero.png"
            alt="background"
            fill
            className="absolute inset-0 object-cover opacity-20"
          />
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-extrabold leading-tight">
              {t('auth.signIn.heroTitle')}
            </h2>
            <div className="mt-2 w-12 h-0.5 bg-white/60 rounded-full" />
            <p className="text-white/80 text-xs mt-3 leading-relaxed">
              {t('auth.signIn.heroSubtitle.line1')} {t('auth.signIn.heroSubtitle.line2')}
            </p>
          </div>
        </div>

        {/* RIGHT – Form Section */}
        <div className="w-full md:w-[58%] flex flex-col min-h-0 min-w-0 px-4 py-4 sm:px-6 sm:py-5 overflow-y-auto overscroll-contain">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 mb-2 shrink-0 w-fit rounded-lg transition-opacity hover:opacity-80"
            aria-label="UmuhinziLink home"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/icon.png" alt="" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-bold text-base text-foreground">UmuhinziLink</span>
          </Link>

          <div className="shrink-0 mb-3">
            <h1 className="text-xl font-extrabold text-foreground">{t('auth.signUp.title')}</h1>
            <p className="text-muted-foreground text-xs mt-0.5">{t('auth.signUp.subtitle')}</p>
          </div>

          <div className="shrink-0 mb-3">
            <GoogleLogin size="medium" />
          </div>

          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">{t('common.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
              <Field label={t('auth.fields.firstName')} error={fieldError('firstName')}>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={t('auth.placeholders.firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={cn(inputClass, touched.firstName && fieldErrors.firstName && 'border-destructive focus-visible:ring-destructive')}
                />
              </Field>
              <Field label={t('auth.fields.lastName')} error={fieldError('lastName')}>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={t('auth.placeholders.lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={cn(inputClass, touched.lastName && fieldErrors.lastName && 'border-destructive focus-visible:ring-destructive')}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
              <Field label={t('auth.fields.email')} error={fieldError('email')}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.placeholders.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={cn(inputClass, touched.email && fieldErrors.email && 'border-destructive focus-visible:ring-destructive')}
                />
              </Field>
              <Field label={t('auth.fields.phoneNumber')} error={fieldError('phoneNumber')}>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder={t('auth.placeholders.phoneNumber')}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={cn(inputClass, touched.phoneNumber && fieldErrors.phoneNumber && 'border-destructive focus-visible:ring-destructive')}
                />
              </Field>
            </div>

            <Field label={t('auth.fields.password')} error={fieldError('password')}>
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
                  className={cn(inputClass, 'pr-9', touched.password && fieldErrors.password && 'border-destructive focus-visible:ring-destructive')}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <div className="flex items-start gap-2 pt-0.5">
              <input
                id="agree"
                type="checkbox"
                checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary accent-primary shrink-0"
              />
              <Label htmlFor="agree" className="text-xs leading-snug text-muted-foreground cursor-pointer select-none">
                {t('auth.signUp.agreeToTerms')}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors shadow-sm"
              disabled={loading}
            >
              {loading ? t('auth.signUp.creatingAccount') : t('auth.signUp.signUp')}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('auth.signUp.alreadyHaveAccount')}{' '}
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline">{t('auth.signUp.signIn')}</Link>
            </p>
          </form>

          <AuthFooter className="mt-2 px-0 py-2 border-t-0 bg-transparent" />
        </div>
      </div>
    </div>
  );
}
