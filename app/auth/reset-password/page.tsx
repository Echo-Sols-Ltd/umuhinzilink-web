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

// ── Password strength ─────────────────────────────────────────────────────────

function getStrength(password: string): {
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
        { label: 'Weak', color: 'bg-red-500', bars: ['bg-red-500', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'] },
        { label: 'Fair', color: 'bg-amber-500', bars: ['bg-amber-500', 'bg-amber-500', 'bg-gray-200', 'bg-gray-200'] },
        { label: 'Good', color: 'bg-blue-500', bars: ['bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-gray-200'] },
        { label: 'Strong', color: 'bg-green-500', bars: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] },
        { label: 'Strong', color: 'bg-green-500', bars: ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'] },
    ];

    return { score, ...configs[score] };
}

const RULES = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [codeValid, setCodeValid] = useState<boolean | null>(null); // null = checking

    const strength = getStrength(password);

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
            e.password = 'Password is required';
        } else if (password.length < 8) {
            e.password = 'Password must be at least 8 characters';
        } else if (strength.score < 2) {
            e.password = 'Password is too weak';
        }
        if (!confirm) {
            e.confirm = 'Please confirm your password';
        } else if (confirm !== password) {
            e.confirm = 'Passwords do not match';
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
                notify.error(res.message || 'Failed to reset password. The link may have expired.');
                return;
            }
            setDone(true);
        } catch {
            notify.error('Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    // ── Loading code check ────────────────────────────────────────────────

    if (codeValid === null) {
        return (
            <PageLoading
                label="Verifying reset link"
                description="Checking that your link is still valid…"
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
                    <h1 className="text-xl font-extrabold text-foreground">Invalid reset link</h1>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        This password reset link is invalid or has expired. Reset links are only valid for 15 minutes.
                    </p>
                    <div className="flex flex-col gap-3 mt-6">
                        <Link
                            href="/auth/forgot-password"
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors">
                            Request a new link
                        </Link>
                        <Link
                            href="/auth/signin"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
                            <ArrowLeft size={13} /> Back to sign in
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
                    <h1 className="text-2xl font-extrabold text-foreground">Password reset!</h1>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Your password has been updated successfully. You can now sign in with your new password.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="mt-6 w-full h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors active:scale-[0.98]">
                        Sign in now
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
                    <h1 className="text-2xl font-extrabold text-foreground">Set new password</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Choose a strong password for your account.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6 shadow-sm space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <PasswordInput
                            id="password"
                            label="New password"
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
                                    <p className="text-xs text-muted-foreground">Password strength</p>
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
                                    {RULES.map(({ label, test }) => {
                                        const passed = test(password);
                                        return (
                                            <div key={label} className="flex items-center gap-1.5">
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
                            label="Confirm password"
                            value={confirm}
                            onChange={v => {
                                setConfirm(v);
                                if (errors.confirm) setErrors(p => ({ ...p, confirm: undefined }));
                            }}
                            error={errors.confirm}
                            placeholder="Re-enter your password"
                        />

                        {/* Match indicator */}
                        {confirm.length > 0 && password.length > 0 && (
                            <div className={cn(
                                'flex items-center gap-1.5 text-xs font-medium animate-in fade-in duration-200',
                                confirm === password ? 'text-green-600' : 'text-red-500'
                            )}>
                                {confirm === password
                                    ? <><CheckCircle size={12} /> Passwords match</>
                                    : <><AlertCircle size={12} /> Passwords don't match</>
                                }
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-green-600 hover:bg-green-700 disabled:opacity-60 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all mt-2">
                            {loading ? (
                                <><Loader2 size={15} className="animate-spin" /> Resetting…</>
                            ) : (
                                <><ShieldCheck size={15} /> Reset password</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-1.5 mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={13} /> Back to sign in
                </Link>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}