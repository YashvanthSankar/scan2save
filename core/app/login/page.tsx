'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOTP, verifyOTP } from '@/lib/firebaseAuth';
import { ScanLine, Smartphone, Lock, Loader2, ArrowRight, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import type { ConfirmationResult } from 'firebase/auth';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/firebaseAuth').then(({ setupRecaptcha, clearRecaptcha }) => {
        setupRecaptcha();
        return () => clearRecaptcha();
      });
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = `+91${phoneNumber}`;
      const result = await sendOTP(formattedNumber);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      alert(`Failed to send OTP: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      alert("Session expired. Please request OTP again.");
      setStep('phone');
      return;
    }
    if (otp.length < 6) return;

    setLoading(true);
    try {
      const result = await verifyOTP(confirmationResult, otp);
      const idToken = await result.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.role === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }

        const nextUrl = searchParams.get('next');
        if (nextUrl) {
          router.push(decodeURIComponent(nextUrl));
        } else {
          router.push('/dashboard');
        }
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shared Styles for Consistency
  const inputBaseClasses = "w-full bg-slate-900/50 border border-white/10 rounded-xl text-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-950 font-sans text-slate-200">

      {/* Login Card */}
      <div className="w-full max-w-md relative">
        {/* Glow Effect Behind Card */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 -z-10" />

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-5 shadow-lg shadow-indigo-500/30">
              <ScanLine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Scan<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">2Save</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              {step === 'phone' ? 'Welcome back! Enter your phone to continue' : 'Enter the verification code'}
            </p>
          </div>

          {/* Forms */}
          <div className="relative">
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                  <div className="relative group">

                    {/* FIXED: Country Code Container */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <div className="flex items-center gap-2 border-r border-white/10 pr-3 h-6">
                        <span className="text-lg leading-none">🇮🇳</span>
                        <span className="text-sm font-medium text-slate-300">+91</span>
                      </div>
                    </div>

                    {/* FIXED: Input Padding & Classes */}
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      className={`${inputBaseClasses} pl-[5.5rem] pr-12 py-4 tracking-wide`}
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />

                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                </div>

                <div id="sign-in-button"></div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Get OTP</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  By continuing, you agree to our Terms & Privacy Policy.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Verification Code</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />

                    <input
                      type="text"
                      required
                      maxLength={6}
                      className={`${inputBaseClasses} pl-12 pr-4 py-4 tracking-[0.5em] text-center font-mono text-xl focus:border-emerald-500/50 focus:ring-emerald-500/20`}
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Code sent to +91 {phoneNumber}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Verify & Login</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-sm text-slate-400 hover:text-white transition-colors py-3 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Wrong Number?
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="mt-8 text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm z-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}