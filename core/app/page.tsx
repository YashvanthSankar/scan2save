'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    
    // SIMULATION: Just pretend to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      alert('DEV MODE: OTP is 123456');
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATION: Verify fixed OTP
    if (otp !== '123456') {
      alert('Invalid OTP (Try 123456)');
      setLoading(false);
      return;
    }

    try {
      // Call backend with just the phone number (Dev Mode)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: `+91${phoneNumber}` }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('userId', data.userId);
        router.push('/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">SmartPick</h1>
          <p className="text-gray-500 mt-2">Your Personalized Supermarket Companion</p>
          <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">DEV MODE ACTIVE</span>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  className="block w-full pl-16 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Sent to +91 {phoneNumber}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full text-sm text-blue-600 hover:text-blue-500"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
