'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notify } from '@/lib/notify';
import { authService } from '@/services/auth';
import { useI18n } from '@/contexts/I18nContext';

type ResetStep = 'code' | 'password' | 'success';

function ResetPassword() {
  const router = useRouter();
  const { t } = useI18n();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<ResetStep>('code');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      notify.error(t('auth.resetPassword.toast.weakPassword.body'), t('auth.resetPassword.toast.weakPassword.title'));
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error(t('auth.resetPassword.toast.passwordMismatch.body'), t('auth.resetPassword.toast.passwordMismatch.title'));
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ newPassword });
      setStep('success');
      notify.success(t('auth.resetPassword.toast.resetSuccessful.body'), t('auth.resetPassword.toast.resetSuccessful.title'));
    } catch (error: any) {
      notify.error(error.message || t('auth.resetPassword.toast.resetFailed.body'), t('auth.resetPassword.toast.resetFailed.title'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('auth.resetPassword.success.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('auth.resetPassword.success.description')}
            </p>
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {t('auth.signIn.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
        <div className="mb-6">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth.forgotPassword.backToSignIn')}
          </Link>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            {t('auth.resetPassword.resetPassword.title')}
          </h2>
          <p className="text-gray-600">
            {t('auth.resetPassword.resetPassword.description')}
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.resetPassword.fields.newPassword')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder={t('auth.resetPassword.placeholders.newPassword')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.resetPassword.fields.confirmNewPassword')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                placeholder={t('auth.resetPassword.placeholders.confirmNewPassword')}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            disabled={loading}
          >
            {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.resetPassword.cta')}
          </Button>
        </form>


        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.forgotPassword.rememberPassword')}{' '}
            <Link href="/auth/signin" className="text-green-600 font-semibold hover:text-green-700">
              {t('auth.signIn.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}