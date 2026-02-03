'use client';
import React, { useState } from 'react';
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
import { UserRequest, UserType } from '@/types';

export default function SignUp() {
  const { register } = useAuth();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState<UserRequest>({
    names: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserType.FARMER,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    names: '', email: '', phoneNumber: '', password: '', role: '',
  });
  const [touched, setTouched] = useState({
    names: false, email: false, phoneNumber: false, password: false, agreeToTerms: false, role: false,
  });
  const [loading, setLoading] = useState(false);

  const socialLinks = [
    { icon: <BiLogoFacebookCircle size={22} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={22} />, link: 'https://google.com' },
  ];

  const accountTypes = [
    { value: UserType.FARMER, label: 'Farmer' },
    { value: UserType.SUPPLIER, label: 'Supplier' },
    { value: UserType.BUYER, label: 'Buyer' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: string | boolean) => {
    let error = '';
    const strVal = typeof value === 'string' ? value : '';

    switch (name) {
      case 'names':
        if (!strVal.trim()) error = 'Full name is required';
        else if (strVal.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!strVal.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) error = 'Invalid email';
        break;
      case 'phoneNumber':
        if (!strVal.trim()) error = 'Phone number required';
        else if (strVal.replace(/[^0-9+]/g, '').length < 10) error = 'Minimum 10 digits';
        break;
      case 'password':
        if (!strVal) error = 'Password required';
        else if (strVal.length < 8) error = 'At least 8 characters';
        else if (!/[A-Z]/.test(strVal)) error = 'Must contain uppercase';
        else if (!/[0-9]/.test(strVal)) error = 'Must contain number';
        else if (!/[!@#$%^&*]/.test(strVal)) error = 'Must contain special char';
        break;
      case 'agreeToTerms':
        if (value !== true) error = 'You must agree to terms';
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    const ok =
      validateField('names', formData.names) &&
      validateField('email', formData.email) &&
      validateField('phoneNumber', formData.phoneNumber) &&
      validateField('password', formData.password) &&
      validateField('agreeToTerms', agreeToTerms) &&
      validateField('role', formData.role);
    setTouched({
      names: true, email: true, phoneNumber: true, password: true, agreeToTerms: true, role: true,
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      toast({ title: 'Error', description: 'Fix the errors below', variant: 'error' });
      setLoading(false);
      return;
    }
    await register(formData);
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row bg-gray-50 overflow-hidden">
      {/* LEFT – Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white overflow-auto">
        <div className="w-full max-w-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Sign up using social or form</p>
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
            {/* Names */}
            <div>
              <Label className="text-sm">Full Name</Label>
              <Input
                name="names"
                placeholder="John Doe"
                value={formData.names}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.names && fieldErrors.names ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.names && fieldErrors.names && <p className="text-xs text-red-500 mt-1">{fieldErrors.names}</p>}
            </div>

            {/* Email */}
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
                className={`mt-1 ${touched.email && fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.email && fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm">Phone Number</Label>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="+250 7..."
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`mt-1 ${touched.phoneNumber && fieldErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              {touched.phoneNumber && fieldErrors.phoneNumber && <p className="text-xs text-red-500 mt-1">{fieldErrors.phoneNumber}</p>}
            </div>

            {/* Account Type */}
            <div>
              <Label className="text-sm">Account Type</Label>
              <div className="flex gap-4 mt-2 mb-4">
                {accountTypes.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <Switch
                      id={type.value}
                      checked={formData.role === type.value}
                      onCheckedChange={() => setFormData(prev => ({ ...prev, role: type.value }))}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <span className="text-gray-700 text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
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
                className={`mt-1 pr-10 ${touched.password && fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
              />
              <button type="button" className="absolute right-3 top-9 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {touched.password && fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Agree Terms */}
            <div className="flex items-center gap-2">
              <Switch checked={agreeToTerms} onCheckedChange={setAgreeToTerms} className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200" />
              <Label className="text-sm text-gray-700">I agree to the terms & conditions</Label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? 'Creating Account…' : 'Sign Up'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-green-600 font-semibold">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT – Hero */}
      <div className="w-full sm:w-1/2 relative flex flex-col justify-center items-center text-center h-64 sm:h-auto">
        <Image src="/Image.png" alt="background" fill className="absolute object-cover" />
        <h1 className="text-white text-3xl sm:text-5xl font-extrabold z-10 mt-6 sm:mt-8 px-4">Welcome!</h1>
        <p className="text-white z-10 mt-2 text-sm sm:text-base px-6 sm:px-0">
          Use these awesome forms to login or create a new <br /> account in your project for free
        </p>
      </div>
    </div>
  );
}
