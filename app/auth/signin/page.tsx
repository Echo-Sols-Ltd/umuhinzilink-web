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
    { icon: <BiLogoFacebookCircle size={25} />, link: 'https://facebook.com' },
    { icon: <BiLogoGoogle size={25} />, link: 'https://google.com' },
  ];

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login, loading } = useAuth();

  // Handle URL parameters and redirect if already authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLogout = urlParams.get('logout');
    const registered = urlParams.get('registered');

    if (isLogout) {
      toast({
        title: 'Signed Out',
        description: 'You have been logged out successfully.',
      });
    }

    if (registered) {
      toast({
        title: 'Account Created',
        description: 'Registration successful. Please sign in to continue.',
        variant: 'success',
      });
    }
  }, []);

  // Load saved credentials if remember me was enabled
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

    // Clear field error when user starts typing
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

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateForm = () => {
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    setTouched({ email: true, password: true });
    return emailValid && passwordValid;
  };

  const handleRememberMe = (email: string) => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validateForm()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'error',
      });
      return;
    }

    // Handle remember me
    if (rememberMe) {
      handleRememberMe(formData.email.trim());
    }

    // Call login from auth context - it handles all backend errors and toasts
    await login({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-72 sm:h-96 flex flex-col justify-center items-center text-center">
        {/* Background Image */}
        <Image
          src="/Image.png"
          alt="background"
          fill
          className="absolute right-0 top-0 object-cover w-full h-full"
        />

        {/* Welcome Text */}
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold z-10 relative mt-8">
          Welcome Back!
        </h1>
        <p className="text-white z-10 relative mt-2 text-sm sm:text-base px-4 sm:px-0">
          Sign in to access your account and continue your journey <br /> with UmuhinziLink
        </p>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl -mt-20 p-6 sm:p-8 z-20 relative">
        <h1 className="text-center text-gray-800 font-extrabold text-xl sm:text-2xl mb-4">
          Sign in with
        </h1>

        <div className="flex gap-4 justify-center mb-4">
          {socialLinks.map((linkItem, idx) => (
            <Link
              key={idx}
              href={linkItem.link}
              target="_blank"
              className="p-3 text-gray-700 transition border border-gray-100 rounded-md hover:bg-gray-100"
            >
              {linkItem.icon}
            </Link>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Or continue with your credentials</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`text-gray-700 font-medium text-sm border ${touched.email && fieldErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
              required
            />
            {touched.email && fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`text-gray-700 font-medium text-sm border pr-10 ${touched.password && fieldErrors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                }`}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {touched.password && fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
              />
              <Label htmlFor="remember" className="text-gray-700 font-medium text-sm">
                Remember Me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-gray-700 text-sm text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-green-600 font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}