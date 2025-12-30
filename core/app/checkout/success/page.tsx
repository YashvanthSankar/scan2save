'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { CheckCircle, Home } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Generate the JSON payload for the Security Guard
  const qrPayload = JSON.stringify({
    type: "GATE_PASS",
    token: token
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans">

      <div className="bg-card text-card-foreground p-8 rounded-[2rem] shadow-2xl space-y-6 w-full max-w-sm animate-in zoom-in duration-300 border border-border">

        {/* Success Header */}
        <div>
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm mt-1">Order #{token}</p>
        </div>

        {/* QR Section */}
        <div className="bg-background p-6 rounded-2xl border-2 border-dashed border-emerald-500/30">
          <div className="bg-white p-2 inline-block rounded-xl">
            <QRCode value={qrPayload} size={200} />
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-wider">
            Show this to Security Guard
          </p>
        </div>

        {/* Warning */}
        <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          ⚠️ Do not close this screen until you have exited the store.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground font-semibold hover:bg-muted rounded-xl transition-colors hover:text-foreground"
        >
          <Home className="w-4 h-4" /> Go to Home
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-foreground">Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}