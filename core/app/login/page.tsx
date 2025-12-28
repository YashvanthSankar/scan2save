'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added for redirect
import { sendOTP, verifyOTP } from '@/lib/firebaseAuth'; 
import { ScanLine, Smartphone, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
// Import the type only
import type { ConfirmationResult } from 'firebase/auth';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  // Explicitly type the state so TypeScript knows what confirmationResult is
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Use Next.js router for redirection
  const router = useRouter();

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
    
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = `+91${phoneNumber}`;
      const result = await sendOTP(formattedNumber);
      
      setConfirmationResult(result);
      setStep('otp'); // Only move to next step if successful
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. If testing, check if the number is whitelisted in Firebase Console.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check if we have the session key from Firebase
    if (!confirmationResult) {
      alert("Session expired. Please request OTP again.");
      setStep('phone');
      return;
    }

    if (otp.length < 6) {
      alert('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      // 2. Verify OTP with Firebase to get the User's ID Token
      const result = await verifyOTP(confirmationResult, otp);
      const idToken = await result.user.getIdToken();

      console.log("Firebase Verified. Sending to Backend...");

      // 3. SEND TO BACKEND (This was missing in your code!)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      // 4. Get the response from your server
      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        // 5. Redirect based on Role
        if (data.role === 'ADMIN') {
          console.log("Redirecting to Admin Panel...");
          router.push('/admin/generate-qr'); 
        } else {
          console.log("Redirecting to User Dashboard...");
          router.push('/dashboard');       
        }
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
      }

    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong. Check the console (F12) for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 selection:bg-indigo-500/30">
      
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
            Login to access your savings dashboard
          </p>
        </div>

        <div className="relative">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <span className="text-slate-400 font-medium border-r border-slate-700 pr-3">🇮🇳 +91</span>
                  </div>
                  
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={10}
                    className="block w-full pl-24 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-lg tracking-wide"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                  <Smartphone className="absolute right-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
              </div>

              {/* Necessary div for ReCaptcha */}
              <div id="sign-in-button"></div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 10}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Get OTP
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
                    maxLength={6}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 tracking-[0.5em] text-center font-mono text-xl"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Code sent to +91 {phoneNumber}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
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
                ← Edit Phone Number
              </button>
            </form>
          )}
        </div>
      </div>
      
      <p className="absolute bottom-6 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Scan2Save. Secure Login.
      </p>
    </div>
  );
}