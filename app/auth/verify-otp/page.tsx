'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyPage() {
    const { verifyOtp, user,askOtpCode } = useAuth()
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(120);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        setError('');
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleContinue =async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            setError('Please enter the complete 4-digit code');
            return;
        }
       await verifyOtp(otpValue)
        console.log('OTP:', otpValue);
    };

    const handleResend = async() => {
       await askOtpCode()
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-screen">
            {/* Left side - Form */}
            <div className="flex flex-[2] flex-col justify-between p-8 bg-white">
                <div className="flex flex-col flex-1 max-w-md mx-auto w-full">
                    {/* Go back button */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Go back
                    </button>

                    <div className="flex flex-col items-center justify-center flex-1">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                            Verify Your Email
                        </h1>
                        <p className="text-gray-500 mb-2">
                            Enter the 4-digit code we sent to your email.
                        </p>
                        <p className="text-green-600 text-sm mb-8">
                           {user?.email}
                        </p>

                        {/* OTP Form */}
                        <form onSubmit={handleContinue} className="w-full">
                            <div className="flex gap-3 justify-center mb-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={`w-12 h-14 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 ${error ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

                            {/* Resend link */}
                            <div className="text-center mb-6">
                                <span className="text-sm text-gray-600">Didn't receive code? </span>
                                {timer == 0 ? (
                                    <span className="text-sm text-green-600">
                                        Resend in {formatTime(timer)}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Resend
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                                Continue
                            </button>
                        </form>

                        {/* Sign in link */}
                        <p className="mt-6 text-sm text-gray-600">
                            Have an account?{' '}
                            <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-gray-500">
                    © Dreamize 2025
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block flex-[2] relative overflow-hidden">
                <Image
                    src="/Image.png"
                    alt="Mountain road"
                    fill
                    className="object-cover object-center scale-105"
                    priority
                    quality={100}
                />
            </div>
        </div>
    );
}