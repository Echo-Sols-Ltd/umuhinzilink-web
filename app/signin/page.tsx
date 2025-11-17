'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AuthNavbar from './navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
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
    <div className="max-h-screen bg-gray-50 flex justify-center">
      <div className="w-full relative">
        {/* Navbar */}
        <AuthNavbar />

        {/* Content */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Form */}
          <div className="flex-1">
            <div className="max-w-xl mx-auto">
              <h1 className="text-green-600 font-extrabold text-4xl py-3">Welcome back</h1>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Enter your email and password to sign in
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    required
                    className={`text-gray-700 text-sm font-medium outline-gray-200 rounded-xl ${
                      touched.email && fieldErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      required
                      className={`text-gray-700 text-sm font-medium outline-gray-200 pr-10 rounded-xl ${
                        touched.password && fieldErrors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.password && fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-white"
                  />
                  <Label htmlFor="remember" className="text-gray-700 font-medium text-sm">
                    Remember Me
                  </Label>
                </div>

                {/* Error */}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 hidden md:block">
            <Image
              src="/Image.png"
              alt="thumbnail"
              className="w-full h-screen object-cover"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
