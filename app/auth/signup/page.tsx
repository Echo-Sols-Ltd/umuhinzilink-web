'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notify } from '@/lib/notify';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { District, UserRequest, UserType } from '@/types';
import AuthFooter from '@/components/auth/AuthFooter';
import GoogleRoleSelectionModal from '@/components/auth/GoogleRoleSelectionModal';
import GoogleLogin from '@/components/GoogleLogin';

// ── tiny reusable field ───────────────────────────────────────────
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── validation ────────────────────────────────────────────────────
function validate(data: UserRequest, agreed: boolean) {
  const e: Record<string, string> = {};
  if (!data.firstName.trim())       e.firstName   = 'First name is required';
  if (!data.lastName.trim())        e.lastName    = 'Last name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Valid email required';
  if (data.phoneNumber.replace(/\D/g,'').length < 10)  e.phoneNumber = 'At least 10 digits';
  if (data.password.length < 8)     e.password    = 'At least 8 characters';
  if (!agreed)                      e.terms       = 'You must agree to terms';
  return e;
}

const ROLES = [
  { value: UserType.FARMER,   label: 'Farmer'   },
  { value: UserType.SUPPLIER, label: 'Supplier' },
  { value: UserType.BUYER,    label: 'Buyer'    },
];

// ── base input style ──────────────────────────────────────────────
const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-white/60 px-4 py-2.5 text-sm text-zinc-800
   placeholder:text-zinc-400 outline-none transition
   focus:ring-2 focus:ring-green-500/30 focus:border-green-500
   ${err ? 'border-red-400' : 'border-zinc-200'}`;

// ─────────────────────────────────────────────────────────────────
export default function SignUp() {
  const { register, registerGoogle, googleToken } = useAuth();
  const { t } = useI18n();

  const [form, setForm]         = useState<UserRequest>({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    password: '', role: UserType.FARMER, district: District.KICUKIRO,
  });
  const [agreed, setAgreed]     = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { if (googleToken) setShowModal(true); }, [googleToken]);

  const set = (k: keyof UserRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, agreed);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await register(form);
    setLoading(false);
  };

  const handleGoogleRole = async (role: UserType) => {
    if (!googleToken) return;
    setLoading(true);
    try {
      await registerGoogle({ role, token: googleToken });
      setShowModal(false);
    } catch {
      notify.error('Google sign-up failed', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f7f6f2]">

      {/* ── LEFT PANEL ──────────────────────────────────────────── */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto">

        {/* brand */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-semibold text-zinc-800 tracking-tight">UmuhinziLink</span>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Create your account</h1>
        <p className="text-sm text-zinc-500 mb-8">Join Rwanda's agricultural marketplace</p>

        {/* google */}
        <GoogleLogin />
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-zinc-100" />
          <span className="text-xs text-zinc-400">or continue with email</span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={errors.firstName}>
              <input className={inputCls(errors.firstName)}
                placeholder="Amina" value={form.firstName} onChange={set('firstName')} />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input className={inputCls(errors.lastName)}
                placeholder="Uwase" value={form.lastName} onChange={set('lastName')} />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input className={inputCls(errors.email)} type="email"
              placeholder="amina@example.com" value={form.email} onChange={set('email')} />
          </Field>

          <Field label="Phone number" error={errors.phoneNumber}>
            <input className={inputCls(errors.phoneNumber)} type="tel"
              placeholder="+250 7XX XXX XXX" value={form.phoneNumber} onChange={set('phoneNumber')} />
          </Field>

          <Field label="District">
            <select className={inputCls()} value={form.district} onChange={set('district')}>
              {Object.values(District).map(d =>
                <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>
              )}
            </select>
          </Field>

          {/* role selector */}
          <Field label="I am a">
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button key={r.value} type="button"
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  className={`py-2 rounded-xl text-sm font-medium border transition
                    ${form.role === r.value
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-green-400'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </Field>

          {/* password */}
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input className={inputCls(errors.password) + ' pr-10'}
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password} onChange={set('password')} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {/* terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 accent-green-600" />
            <span className="text-xs text-zinc-500 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-green-600 underline underline-offset-2">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-green-600 underline underline-offset-2">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white
              text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-sm text-center text-zinc-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-green-600 font-medium">Sign in</Link>
          </p>
        </form>

        <div className="mt-8">
          <AuthFooter />
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative items-end p-12 overflow-hidden">
        <Image src="/Image.png" alt="Rwanda farmland" fill
          className="object-cover brightness-75" priority />

        {/* overlay card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20
          rounded-2xl p-8 max-w-md text-white">
          <div className="w-10 h-10 rounded-full bg-green-500/30 border border-green-400/50
            flex items-center justify-center mb-4">
            <Leaf size={18} className="text-green-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2 leading-tight">
            Rwanda's farmers deserve better markets
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Connect directly with buyers, negotiate fair prices, and grow your agricultural business — all in one platform.
          </p>
          <div className="flex gap-6 mt-6 pt-6 border-t border-white/20">
            {[['20k+','Farmers'],['500+','Buyers'],['95%','Satisfaction']].map(([n,l]) => (
              <div key={l}>
                <div className="text-xl font-bold">{n}</div>
                <div className="text-xs text-white/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GoogleRoleSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleGoogleRole}
        loading={loading}
      />
    </div>
  );
}