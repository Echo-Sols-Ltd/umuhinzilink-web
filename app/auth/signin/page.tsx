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
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout')) {
      toast({ title: 'Signed Out', description: 'You have been logged out successfully.' });
    }
    if (urlParams.get('registered')) {
      toast({
        title: 'Account Created',
        description: 'Registration successful. Please sign in to continue.',
        variant: 'success',
      });
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
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
    }
    if (name === 'password') {
      if (!value.trim()) error = 'Password is required';
      else if (value.length < 6) error = 'Minimum 6 characters';
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
      toast({ title: 'Error', description: 'Fix the errors below', variant: 'error' });
      return;
    }
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email.trim());
      localStorage.setItem('rememberMe', 'true');
    }
    await login({ email: formData.email.trim(), password: formData.password });
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row bg-gray-50 overflow-hidden">
      {/* LEFT – Form Section */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Sign in to your account</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {socialLinks.map((item, i) => (
              <Link
                key={i}
                href={item.link}
                target="_blank"
                className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
              >
                {item.icon}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${
                  touched.email && fieldErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-green-500'
                }`}
              />
              {touched.email && fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <Label className="text-sm">Password</Label>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 pr-10 ${
                  touched.password && fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-green-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.password && fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={rememberMe} onCheckedChange={setRememberMe} />
                <span className="text-sm text-gray-600">Remember me</span>
              </div>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              No account?{' '}
              <Link href="/auth/signup" className="text-green-600 font-semibold">
                Sign up
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
          className="absolute object-cover"
        />
        <h1 className="text-white text-3xl sm:text-5xl font-extrabold z-10 mt-6 sm:mt-8 px-4">
          Welcome Back!
        </h1>
        <p className="text-white z-10 mt-2 text-sm sm:text-base px-6 sm:px-0">
          Sign in to access your account and continue your journey <br /> with UmuhinziLink
        </p>
      </div>
    </div>
  );
}
