'use client';
import React, { useState, useEffect } from 'react';
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
import LanguageSelector from '@/components/auth/LanguageSelector';
import AuthFooter from '@/components/auth/AuthFooter';

export default function SignIn() {
  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={22} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={22} />, link: 'https://google.com' },
  ];

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login, loading } = useAuth();
  const { t } = useI18n();

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
    <div className="w-full h-screen flex flex-col sm:flex-row bg-background overflow-hidden">
      {/* LEFT – Form Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-card">
        <div className="w-full max-w-md flex flex-col justify-center">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">UL</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-2">{t('auth.signIn.title')}</h1>
          <p className="text-muted-foreground text-sm sm:text-base text-center mb-6">{t('auth.signIn.subtitle')}</p>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BiLogoFacebookCircle size={20} className="mr-2 text-blue-600" />
              <span>{t('auth.signIn.continueWithFacebook')}</span>
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BiLogoGoogle size={20} className="mr-2 text-red-500" />
              <span>{t('auth.signIn.continueWithGoogle')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{t('common.or')}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`mt-1 ${touched.email && fieldErrors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-green-500'
                  }`}
              />
              {touched.email && fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
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
                className={`mt-1 pr-10 ${touched.password && fieldErrors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-green-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.password && fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={setRememberMe}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                  {t('auth.signIn.rememberMe')}
                </Label>
              </div>

              <Link href="/forgot-password" className="text-sm text-success hover:underline">
                {t('auth.signIn.forgot')}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-success hover:bg-success/90"
            >
              {loading ? t('auth.signIn.signingIn') : t('auth.signIn.signIn')}
            </Button>

            {/* Sign Up Link */}
            <p className="text-sm text-center text-muted-foreground">
              {t('auth.signIn.noAccount')}{' '}
              <Link href="/auth/signup" className="text-success font-semibold">
                {t('auth.signIn.signUp')}
              </Link>
            </p>
          </form>
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
          {t('auth.signIn.heroTitle')}
        </h1>
        <p className="text-white z-10 mt-2 text-sm sm:text-base px-6 sm:px-0">
          {t('auth.signIn.heroSubtitle.line1')} <br /> {t('auth.signIn.heroSubtitle.line2')}
        </p>
      </div>

      {/* Language Selector at Bottom */}
      <AuthFooter />
    </div>
  );
}
