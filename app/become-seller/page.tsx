'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Sprout, MapPin, Phone, FileText, ChevronRight,
    ChevronLeft, CheckCircle, Package, TrendingUp,
    Users, ArrowRight, Wheat, Leaf, ShoppingBag
} from 'lucide-react';
import { SellerRegistration } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SellerFormData {
    displayName: string;
    location: string;
    district: string;
    phone: string;
    description: string;
}

// ── Rwanda Districts ───────────────────────────────────────────────────────────

const DISTRICTS = [
    'Bugesera', 'Burera', 'Gakenke', 'Gasabo', 'Gatsibo',
    'Gicumbi', 'Gisagara', 'Huye', 'Kamonyi', 'Karongi',
    'Kayonza', 'Kicukiro', 'Kirehe', 'Muhanga', 'Musanze',
    'Ngoma', 'Ngororero', 'Nyabihu', 'Nyagatare', 'Nyamasheke',
    'Nyanza', 'Nyarugenge', 'Nyaruguru', 'Rubavu', 'Ruhango',
    'Rulindo', 'Rusizi', 'Rutsiro', 'Rwamagana',
];

// ── Benefit cards data ────────────────────────────────────────────────────────

const BENEFITS = [
    {
        icon: TrendingUp,
        title: 'Earn more',
        body: 'Sell directly to buyers across Rwanda. No middlemen, full price.',
    },
    {
        icon: Users,
        title: 'Reach buyers',
        body: 'Your listings are visible to thousands of buyers from day one.',
    },
    {
        icon: ShoppingBag,
        title: 'Negotiate freely',
        body: 'Chat and agree on prices that work for both you and your buyer.',
    },
];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                            ? 'w-6 bg-green-600'
                            : i < current
                                ? 'w-3 bg-green-300'
                                : 'w-3 bg-gray-200 dark:bg-gray-700'
                        }`}
                />
            ))}
        </div>
    );
}

// ── Field component ───────────────────────────────────────────────────────────

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BecomeSeller() {
    const [step, setStep] = useState(0); // 0 = intro, 1 = form, 2 = success
    const [formData, setFormData] = useState<SellerRegistration>({
        businessName: '',
        location: '',
        description: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState<Partial<SellerRegistration>>({});

    const { registerSeller, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/auth/signin?redirect=/become-seller');
        }
    }, [loading, isAuthenticated, router]);

    // ── Validation ─────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const e: Partial<SellerRegistration> = {};
        if (!formData.businessName.trim())
            e.businessName = 'Farm or business name is required';
        if (!formData.location)
            e.location = 'Please select your district';
        if (!formData.phoneNumber.trim())
            e.phoneNumber = 'Phone number is required';
        else if (!/^(\+?250|0)?[7][0-9]{8}$/.test(formData.phoneNumber.replace(/\s/g, '')))
            e.phoneNumber = 'Enter a valid Rwandan phone number';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ──────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await registerSeller(formData)
            setStep(2);
        } catch {
            // handle error
        }
    };

    const handleChange = (field: keyof SellerRegistration, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    // ── Input shared className ──────────────────────────────────────────────

    const inputCls = (field: keyof SellerRegistration) =>
        `w-full h-11 px-3.5 rounded-xl border text-sm text-foreground bg-gray-50 dark:bg-gray-800/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors[field]
            ? 'border-red-400 focus:ring-red-400'
            : 'border-border'
        }`;

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-auto pb-20">

            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border flex items-center px-4">
                <Link href="/" className="flex items-center gap-1.5">
                    <Sprout size={18} className="text-green-600" />
                    <span className="font-extrabold text-base">
                        <span className="text-green-600">Umuhinzi</span>
                        <span className="text-foreground">Link</span>
                    </span>
                </Link>
            </header>

            <main className="flex-1 pt-14 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* ── STEP 0: Intro ─────────────────────────────────── */}
                    {step === 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Hero illustration area */}
                            <div className="relative mb-8 h-52 rounded-2xl bg-green-600 overflow-hidden flex items-end px-6 pb-6">
                                {/* Dot pattern */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                                        backgroundSize: '20px 20px',
                                    }}
                                />
                                {/* Decorative icons */}
                                <Wheat size={80} className="absolute top-4 right-6 text-green-400 opacity-30 rotate-12" />
                                <Leaf size={48} className="absolute top-10 right-28 text-green-300 opacity-20 -rotate-6" />
                                <Package size={36} className="absolute top-6 left-6 text-green-300 opacity-20 rotate-6" />

                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                        <Sprout size={22} className="text-white" />
                                    </div>
                                    <h1 className="text-2xl font-extrabold text-white leading-tight">
                                        Start selling<br />on UmuhinziLink
                                    </h1>
                                    <p className="text-green-200 text-sm mt-1">
                                        Reach buyers across Rwanda
                                    </p>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-3 mb-8">
                                {BENEFITS.map(({ icon: Icon, title, body }) => (
                                    <div
                                        key={title}
                                        className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-border">
                                        <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                                            <Icon size={17} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => setStep(1)}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                Get started
                                <ArrowRight size={16} />
                            </button>

                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Already a seller?{' '}
                                <Link href="/seller/dashboard" className="text-green-600 font-medium hover:underline">
                                    Go to dashboard
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* ── STEP 1: Form ──────────────────────────────────── */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-400">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => setStep(0)}
                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <ChevronLeft size={16} />
                                    Back
                                </button>
                                <StepDots current={0} total={1} />
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-foreground">Your seller profile</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    This is what buyers will see when they view your listings.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 space-y-4">

                                <Field label="Farm or business name" error={errors.businessName}>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mugisha's Farm, AgriSupplies Kigali"
                                        value={formData.businessName}
                                        onChange={e => handleChange('businessName', e.target.value)}
                                        className={inputCls('businessName')}
                                    />
                                </Field>

                                <Field label="District" error={errors.location}>
                                    <select
                                        value={formData.location}
                                        onChange={e => handleChange('location', e.target.value)}
                                        className={inputCls('location')}>
                                        <option value="">Select your district</option>
                                        {DISTRICTS.map(d => (
                                            <option key={d} value={d.toUpperCase()}>{d}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Business phone" error={errors.phoneNumber}>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                                            +250
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="78 000 0000"
                                            value={formData.phoneNumber}
                                            onChange={e => handleChange('phoneNumber', e.target.value)}
                                            className={`${inputCls('phoneNumber')} pl-14`}
                                        />
                                    </div>
                                </Field>

                                <Field label="What do you sell? (optional)" error={errors.description}>
                                    <textarea
                                        rows={3}
                                        placeholder="e.g. Fresh maize, beans, and vegetables from Musanze. Also seeds and fertilizer."
                                        value={formData.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        className={`${inputCls('description')} h-auto py-3 resize-none`}
                                    />
                                </Field>
                            </div>

                            {/* Info note */}
                            <div className="flex items-start gap-2.5 mt-4 px-1">
                                <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You can still buy products as a buyer after becoming a seller. Your account works for both.
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-12 mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                        </svg>
                                        Setting up your profile…
                                    </>
                                ) : (
                                    <>
                                        Become a seller
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: Success ───────────────────────────────── */}
                    {step === 2 && (
                        <div className="animate-in fade-in zoom-in-95 duration-500 text-center">

                            {/* Success badge */}
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>

                            <h2 className="text-2xl font-extrabold text-foreground">
                                You're a seller! 🌱
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
                                Your seller profile is ready. Start by adding your first listing — it only takes a minute.
                            </p>

                            {/* Profile preview card */}
                            <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-border text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <Sprout size={22} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm">{formData.businessName}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <MapPin size={11} />
                                            {formData.location ? formData.location.charAt(0) + formData.location.slice(1).toLowerCase() : ''}
                                        </p>
                                    </div>
                                    <span className="ml-auto text-xs text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-1 rounded-full font-medium border border-green-200 dark:border-green-800">
                                        Verified
                                    </span>
                                </div>
                                {formData.description && (
                                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">
                                        {formData.description}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 mt-6">
                                <Link
                                    href="/products/create"
                                    className="w-full h-12 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all">
                                    <Package size={16} />
                                    Add your first listing
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="w-full h-11 bg-white dark:bg-gray-900 border border-border hover:bg-gray-50 dark:hover:bg-gray-800/50 text-foreground font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                                    Go to dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}