'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code'; 
import { CheckCircle, Home } from 'lucide-react';

export default function ExitPass() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Generate the JSON payload for the Security Guard
  const qrPayload = JSON.stringify({ 
    type: "GATE_PASS", 
    token: token 
  });

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl space-y-6 w-full max-w-sm animate-in zoom-in duration-300">
        
        {/* Success Header */}
        <div>
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Successful!</h1>
          <p className="text-slate-500 text-sm mt-1">Order #{token}</p>
        </div>
        
        {/* QR Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-emerald-500/30">
          <div className="bg-white p-2 inline-block">
             <QRCode value={qrPayload} size={200} />
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">
            Show this to Security Guard
          </p>
        </div>
        
        {/* Warning */}
        <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
          ⚠️ Do not close this screen until you have exited the store.
        </p>

        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" /> Go to Home
        </button>
      </div>
    </div>
  );
}