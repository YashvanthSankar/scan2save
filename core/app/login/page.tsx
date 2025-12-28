'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendOTP, verifyOTP } from '@/lib/firebaseAuth'; 
import { ScanLine, Smartphone, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ConfirmationResult } from 'firebase/auth';
import { Suspense } from 'react';

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
      import('@/lib/firebaseAuth').then(({ setupRecaptcha }) => {
        setupRecaptcha();
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
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. If testing, check if number is whitelisted.');
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
      // 1. Firebase Verify
      const result = await verifyOTP(confirmationResult, otp);
      const idToken = await result.user.getIdToken();

      // 2. Backend Verify & Session Creation
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        
        // A. If Admin -> Always go to Admin Panel
        if (data.role === 'ADMIN') {
          router.push('/admin/dashboard');
          return;
        }

        // B. If User -> Check if they were trying to visit a store (from Scan Page)
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 mb-4 border border-indigo-500/20">
            <ScanLine className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Scan2<span className="text-indigo-400">Save</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 'phone' ? 'Login to access your savings' : 'Enter the code sent to your phone'}
          </p>
        </div>

        <div className="relative">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <span className="text-slate-400 font-medium border-r border-slate-700 pr-3">🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    className="block w-full pl-24 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg tracking-wide"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                  <Smartphone className="absolute right-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
              </div>

              <div id="sign-in-button"></div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Sending Code...</> : <><ArrowRight className="mr-2 h-4 w-4" /> Get OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Verification Code</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all tracking-[0.5em] text-center font-mono text-xl"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Code sent to +91 {phoneNumber}</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Verifying...</> : <><ShieldCheck className="mr-2 h-4 w-4" /> Verify & Login</>}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors py-2"
              >
                ← Wrong Number?
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}