'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import AuthFooter from '@/components/auth/AuthFooter';
import GoogleLogin from '@/components/GoogleLogin';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login, googleToken, googleLogin, loading } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (googleToken) googleLogin(googleToken);
  }, [googleToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout')) {
      notify.success(t('auth.signIn.toast.loggedOut.body'), t('auth.signIn.toast.loggedOut.title'));
    }
    if (urlParams.get('registered')) {
      notify.success(t('auth.signIn.toast.registered.body'), t('auth.signIn.toast.registered.title'));
    }
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedRememberMe) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) error = t('auth.validation.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('auth.validation.invalidEmailAddress');
    }
    if (name === 'password') {
      if (!value.trim()) error = t('auth.validation.passwordRequired');
      else if (value.length < 6) error = t('auth.validation.minimumCharacters', { count: 6 });
    }
    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    const ok = validateField('email', formData.email) && validateField('password', formData.password);
    setTouched({ email: true, password: true });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      notify.error(t('auth.validation.fixErrorsBelow'), t('common.error'));
      return;
    }
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email.trim());
      localStorage.setItem('rememberMe', 'true');
    }
    await login({ email: formData.email.trim(), password: formData.password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 dark:bg-background p-4">
      {/* Floating card */}
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

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

        {/* RIGHT – Form panel */}
        <div className="w-full md:w-[58%] flex flex-col justify-center px-6 py-8 sm:px-10">
          {/* Logo + brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-bold text-lg text-foreground">UmuhinziLink</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
            {t('auth.signIn.title')}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {t('auth.signIn.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.fields.email')}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`bg-muted/50 border border-border h-12 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${
                  touched.email && fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
              />
              {touched.email && fieldErrors.email && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.fields.password')}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`bg-muted/50 border border-border h-12 rounded-xl text-sm pr-10 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${
                  touched.password && fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.password && fieldErrors.password && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary font-medium hover:underline">
                {t('auth.signIn.forgot')}
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-sm transition-colors"
            >
              {loading ? t('auth.signIn.signingIn') : t('auth.signIn.signIn')}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('common.or')} {t('auth.signIn.continueWithFacebook').replace('Continue with Facebook', 'Login with')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-center">
              <GoogleLogin />
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            {t('auth.signIn.noAccount')}{' '}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
              {t('auth.signIn.signUp')}
            </Link>
          </p>

          <div className="mt-4">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
