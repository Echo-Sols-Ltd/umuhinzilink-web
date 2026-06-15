'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notify } from '@/lib/notify';
import { authService } from '@/services/auth';
import { useI18n } from '@/contexts/I18nContext';
import { ForgotPasswordRequest } from '@/types';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data:ForgotPasswordRequest={
        email
      }
      const res = await authService.forgotPassword(data);
      if (!res.success) {
        notify.error(res.message || t('auth.forgotPassword.toast.resetCodeFailed.body'), t('common.error'));
        return;
      }
      setSubmitted(true);
      notify.success(t('auth.forgotPassword.toast.resetCodeSent.body'), t('auth.forgotPassword.toast.resetCodeSent.title'));
    } catch (error: any) {
      notify.error(error.message || t('auth.forgotPassword.toast.resetCodeFailed.body'), t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('auth.forgotPassword.submitted.title')}</h2>
            <p className="text-gray-600 mb-6">
              {t('auth.forgotPassword.submitted.description', { email })}
            </p>
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {t('auth.forgotPassword.backToSignIn')}
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
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">{t('auth.forgotPassword.title')}</h2>
          <p className="text-gray-600">
            {t('auth.forgotPassword.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.fields.emailAddress')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder={t('auth.placeholders.enterYourEmail')}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
            disabled={loading}
          >
            {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetCode')}
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
