'use client';

import { useState, useEffect } from 'react';
// Ensure these paths match your actual file structure
import { sendOTP, verifyOTP } from '@/lib/firebaseAuth'; 
import { ScanLine, Smartphone, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  useEffect(() => {
    // Setup reCAPTCHA when component mounts
    if (typeof window !== 'undefined') {
      import('@/lib/firebaseAuth').then(({ setupRecaptcha }) => {
        setupRecaptcha();
      });
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setLoading(true);
    try {
      // The sendOTP function from your lib should handle the recaptchaVerifier
      const result = await sendOTP(phoneNumber);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please check the number and try again.');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;

    setLoading(true);
    try {
      const result = await verifyOTP(confirmationResult, otp);
      const idToken = await result.user.getIdToken();

      // Send to backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 mb-4 border border-indigo-500/20">
            <ScanLine className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Scan2<span className="text-indigo-400">Save</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Login to access your savings dashboard
          </p>
        </div>

        {/* Forms */}
        <div className="relative">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative group">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Include country code (e.g., +91)
                </p>
              </div>

              {/* Invisible Recaptcha Container */}
              <div id="sign-in-button" className="hidden"></div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Verification Code
                </label>
                <div className="relative group">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 tracking-widest"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Sent to {phoneNumber}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ShieldCheck className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors py-2"
              >
                ← Use a different number
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Scan2Save. Secure Login.
      </p>
    </div>
  );
}