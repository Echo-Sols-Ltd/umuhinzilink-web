'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Sprout, Eye, EyeOff, CheckCircle,
    AlertCircle, Lock, ArrowLeft, Loader2,
    ShieldCheck,
} from '@/lib/icons';
import { cn } from '@/lib/utils';
import { notify } from '@/lib/notify';
import { authService } from '@/services';
import { ResetPasswordRequest } from '@/types';
import PageLoading from '@/components/layout/PageLoading';
import { useI18n } from '@/contexts/I18nContext';

function getStrength(password: string, t: (key: string) => string): {
    score: number; label: string; color: string; bars: string[];
} {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const configs = [
        { label: '', color: 'bg-gray-200 dark:bg-gray-700', bars: ['bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'] },
        { label: t('auth.resetPassword.strength.weak'), color: 'bg-red-500', bars: ['bg-red-500', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'] },
        { label: t('auth.resetPassword.strength.fair'), color: 'bg-amber-500', bars: ['bg-amber-500', 'bg-amber-500', 'bg-gray-200', 'bg-gray-200'] },
        { label: t('auth.resetPassword.strength.good'), color: 'bg-blue-500', bars: ['bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-gray-200'] },
        { label: t('auth.resetPassword.strength.strong'), color: 'bg-green-500', bars: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] },
        { label: t('auth.resetPassword.strength.strong'), color: 'bg-green-500', bars: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] },
    ];

    return { score, ...configs[score] };
}

const RULE_KEYS = ['minLength', 'uppercase', 'number', 'special'] as const;
const RULE_TESTS: Record<typeof RULE_KEYS[number], (p: string) => boolean> = {
    minLength: (p) => p.length >= 8,
    uppercase: (p) => /[A-Z]/.test(p),
    number: (p) => /[0-9]/.test(p),
    special: (p) => /[^A-Za-z0-9]/.test(p),
};

// ── Input component ───────────────────────────────────────────────────────────

function PasswordInput({
    label, value, onChange, error, placeholder, id,
}: {
    label: string; value: string; onChange: (v: string) => void;
    error?: string; placeholder?: string; id: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder ?? '••••••••'}
                    className={cn(
                        'w-full h-11 pl-10 pr-10 text-sm text-foreground bg-gray-50 dark:bg-gray-800/60 border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all',
                        error ? 'border-red-400' : 'border-border'
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={11} /> {error}
                </p>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ResetPasswordContent() {
    const { t } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [codeValid, setCodeValid] = useState<boolean | null>(null); // null = checking

    const strength = getStrength(password, t);

    // ── Validate code on mount ────────────────────────────────────────────

    useEffect(() => {
        if (!code) {
            setCodeValid(false);
            return;
        }

        // GET /api/v1/auth/validate-reset-code?code=xxx
        const check = async () => {
            try {
                const res = await authService.checkResetCode(code);
                setCodeValid(res.success && res.data === true);
            } catch {
                setCodeValid(false);
            }
        };
        check();
    }, [code]);

    // ── Validation ────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const e: typeof errors = {};
        if (!password) {
            e.password = t('auth.resetPassword.validation.passwordRequired');
        } else if (password.length < 8) {
            e.password = t('auth.resetPassword.validation.passwordMinLength');
        } else if (strength.score < 2) {
            e.password = t('auth.resetPassword.validation.passwordTooWeak');
        }
        if (!confirm) {
            e.confirm = t('auth.resetPassword.validation.confirmRequired');
        } else if (confirm !== password) {
            e.confirm = t('auth.resetPassword.validation.passwordMismatch');
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !codeValid) return;
        setLoading(true);
        try {
            const data: ResetPasswordRequest = {
                code: code!,
                newPassword: password,
            }
            const res = await authService.resetPassword(data);
            if (!res.success) {
                notify.error(res.message || t('auth.resetPassword.validation.resetFailed'));
                return;
            }
            setDone(true);
        } catch {
            notify.error(t('auth.resetPassword.validation.resetFailed'));
        } finally {
            setLoading(false);
        }
    };

    // ── Loading code check ────────────────────────────────────────────────

    if (codeValid === null) {
        return (
            <PageLoading
                label={t('auth.resetPassword.verifyingLink.label')}
                description={t('auth.resetPassword.verifyingLink.description')}
            />
        );
    }

    // ── Invalid / missing code ────────────────────────────────────────────

    if (!code || codeValid === false) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center animate-in fade-in zoom-in-95 duration-400">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-5">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h1 className="text-xl font-extrabold text-foreground">{t('auth.resetPassword.invalidLink.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {t('auth.resetPassword.invalidLink.description')}
                    </p>
                    <div className="flex flex-col gap-3 mt-6">
                        <Link
                            href="/auth/forgot-password"
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors">
                            {t('auth.resetPassword.invalidLink.requestNew')}
                        </Link>
                        <Link
                            href="/auth/signin"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
                            <ArrowLeft size={13} /> {t('auth.resetPassword.invalidLink.backToSignIn')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Success state ─────────────────────────────────────────────────────

    if (done) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center animate-in fade-in zoom-in-95 duration-400">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck size={36} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground">{t('auth.resetPassword.success.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {t('auth.resetPassword.success.description')}
                    </p>
                    <Link
                        href="/auth/signin"
                        className="mt-6 w-full h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors active:scale-[0.98]">
                        {t('auth.resetPassword.setPassword.signInNow')}
                    </Link>
                </div>
            </div>
        );
    }

    // ── Main form ─────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 py-12">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 mb-8">
                <Sprout size={20} className="text-green-600" />
                <span className="text-lg font-extrabold">
                    <span className="text-green-600">Umuhinzi</span>
                    <span className="text-foreground">Link</span>
                </span>
            </Link>

            <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground">{t('auth.resetPassword.setPassword.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {t('auth.resetPassword.setPassword.description')}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6 shadow-sm space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <PasswordInput
                            id="password"
                            label={t('auth.resetPassword.fields.newPassword')}
                            value={password}
                            onChange={v => {
                                setPassword(v);
                                if (errors.password) setErrors(p => ({ ...p, password: undefined }));
                            }}
                            error={errors.password}
                        />

                        {/* Strength indicator */}
                        {password.length > 0 && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">{t('auth.resetPassword.setPassword.strength')}</p>
                                    <p className={cn(
                                        'text-xs font-semibold',
                                        strength.score <= 1 && 'text-red-500',
                                        strength.score === 2 && 'text-amber-500',
                                        strength.score === 3 && 'text-blue-500',
                                        strength.score >= 4 && 'text-green-600',
                                    )}>
                                        {strength.label}
                                    </p>
                                </div>

                                {/* Bar */}
                                <div className="flex gap-1">
                                    {strength.bars.map((bar, i) => (
                                        <div
                                            key={i}
                                            className={cn('flex-1 h-1.5 rounded-full transition-all duration-300', bar)}
                                        />
                                    ))}
                                </div>

                                {/* Rules */}
                                <div className="grid grid-cols-2 gap-1.5 mt-1">
                                    {RULE_KEYS.map((key) => {
                                        const passed = RULE_TESTS[key](password);
                                        const label = t(`auth.resetPassword.rules.${key}`);
                                        return (
                                            <div key={key} className="flex items-center gap-1.5">
                                                <CheckCircle
                                                    size={11}
                                                    className={passed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}
                                                />
                                                <span className={cn(
                                                    'text-[10px]',
                                                    passed ? 'text-foreground' : 'text-muted-foreground'
                                                )}>
                                                    {label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <PasswordInput
                            id="confirm"
                            label={t('auth.resetPassword.setPassword.confirmPassword')}
                            value={confirm}
                            onChange={v => {
                                setConfirm(v);
                                if (errors.confirm) setErrors(p => ({ ...p, confirm: undefined }));
                            }}
                            error={errors.confirm}
                            placeholder={t('auth.resetPassword.setPassword.confirmPlaceholder')}
                        />

                        {/* Match indicator */}
                        {confirm.length > 0 && password.length > 0 && (
                            <div className={cn(
                                'flex items-center gap-1.5 text-xs font-medium animate-in fade-in duration-200',
                                confirm === password ? 'text-green-600' : 'text-red-500'
                            )}>
                                {confirm === password
                                    ? <><CheckCircle size={12} /> {t('auth.resetPassword.setPassword.passwordsMatch')}</>
                                    : <><AlertCircle size={12} /> {t('auth.resetPassword.setPassword.passwordsMismatch')}</>
                                }
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-green-600 hover:bg-green-700 disabled:opacity-60 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all mt-2">
                            {loading ? (
                                <><Loader2 size={15} className="animate-spin" /> {t('auth.resetPassword.setPassword.resetting')}</>
                            ) : (
                                <><ShieldCheck size={15} /> {t('auth.resetPassword.resetPassword.cta')}</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-1.5 mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={13} /> {t('auth.resetPassword.invalidLink.backToSignIn')}
                </Link>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    const { t } = useI18n();
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">{t('common.processing')}</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}