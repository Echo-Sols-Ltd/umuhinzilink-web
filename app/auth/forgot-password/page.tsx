'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, CheckCircle, Loader2 } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notify } from '@/lib/notify';
import { authService } from '@/services/auth';
import { useI18n } from '@/contexts/I18nContext';
import AuthFooter from '@/components/auth/AuthFooter';
import { ROUTES } from '@/lib/routes';
import { ForgotPasswordRequest } from '@/types';
import { cn } from '@/lib/utils';

const inputClass =
  'bg-muted/50 border border-border/80 h-12 rounded-xl text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary transition-colors pl-10';

function HeroPanel({ t }: { t: (key: string) => string }) {
  return (
    <div className="hidden md:flex relative md:w-[42%] bg-gradient-to-br from-primary to-secondary rounded-2xl m-3 overflow-hidden flex-col justify-between p-8">
      <Image
        src="/hero.png"
        alt=""
        fill
        className="absolute inset-0 object-cover opacity-20"
      />
      <div className="relative z-10">
        <h2 className="text-white text-3xl font-extrabold leading-tight">
          {t('auth.forgotPassword.heroTitle')}
        </h2>
        <div className="mt-2 w-16 h-1 bg-white/60 rounded-full" />
        <p className="text-white/80 text-sm mt-4 leading-relaxed">
          {t('auth.forgotPassword.heroSubtitle.line1')}{' '}
          {t('auth.forgotPassword.heroSubtitle.line2')}
        </p>
      </div>
    </div>
  );
}

function BrandHeader() {
  return (
    <Link
      href={ROUTES.home}
      className="flex items-center gap-3 mb-6 w-fit rounded-lg transition-opacity hover:opacity-80"
      aria-label="UmuhinziLink home"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center">
        <img src="/icon.png" alt="" className="w-10 h-10 object-contain" />
      </div>
      <span className="font-bold text-lg text-foreground">UmuhinziLink</span>
    </Link>
  );
}

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value.trim()) return t('auth.validation.emailRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return t('auth.validation.invalidEmailAddress');
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      notify.error(t('auth.validation.fixErrorsBelow'), t('common.error'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data: ForgotPasswordRequest = { email: email.trim() };
      const res = await authService.forgotPassword(data);
      if (!res.success) {
        notify.error(
          res.message || t('auth.forgotPassword.toast.resetCodeFailed.body'),
          t('common.error'),
        );
        return;
      }
      setSubmitted(true);
      notify.success(
        t('auth.forgotPassword.toast.resetCodeSent.body'),
        t('auth.forgotPassword.toast.resetCodeSent.title'),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      notify.error(
        message || t('auth.forgotPassword.toast.resetCodeFailed.body'),
        t('common.error'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 dark:bg-background p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        <HeroPanel t={t} />

        <div className="w-full md:w-[58%] flex flex-col justify-center px-6 py-8 sm:px-10">
          <BrandHeader />

          <Link
            href={ROUTES.signIn}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.forgotPassword.backToSignIn')}
          </Link>

          {submitted ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                {t('auth.forgotPassword.submitted.title')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {t('auth.forgotPassword.submitted.description', { email: email.trim() })}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t('auth.forgotPassword.submitted.inboxHint')}
              </p>
              <Button
                asChild
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-none"
              >
                <Link href={ROUTES.signIn}>
                  {t('auth.forgotPassword.submitted.cta')}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
                {t('auth.forgotPassword.title')}
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                {t('auth.forgotPassword.description')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-[18px] h-[18px]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className={cn(
                        inputClass,
                        error && 'border-destructive focus-visible:ring-destructive/30',
                      )}
                      placeholder={t('auth.placeholders.enterYourEmail')}
                      autoComplete="email"
                      disabled={loading}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-destructive mt-1">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-none transition-colors"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('auth.forgotPassword.sending')}
                    </span>
                  ) : (
                    t('auth.forgotPassword.sendResetCode')
                  )}
                </Button>
              </form>

              <p className="text-sm text-center text-muted-foreground mt-6">
                {t('auth.forgotPassword.rememberPassword')}{' '}
                <Link
                  href={ROUTES.signIn}
                  className="text-primary font-semibold hover:underline"
                >
                  {t('auth.signIn.signIn')}
                </Link>
              </p>
            </>
          )}

          <div className="mt-4">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
