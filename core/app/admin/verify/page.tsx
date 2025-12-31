'use client';

import { useState, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  CheckCircle,
  XCircle,
  Package,
  ShieldCheck,
  Image as ImageIcon,
  Loader2,
  User,
  CreditCard,
  Clock,
  Hash,
  QrCode,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import jsQR from 'jsqr';
import Link from 'next/link';

interface VerifyResult {
  valid: boolean;
  message?: string;
  transaction?: {
    id: string;
    customer: { name: string; phone?: string };
    store: string;
    total: number;
    items: { name: string; quantity: number; category: string }[];
    paidAt: string;
    verifiedAt: string;
  };
}

export default function GuardVerifyPage() {
  const [scanResult, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [scannerError, setScannerError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verify token via API
  const verifyToken = async (token: string) => {
    if (!token || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({ valid: false, message: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle QR Scan (Camera or File)
  const handleScan = (rawValue: string) => {
    if (!rawValue || loading) return;

    console.log('Scanned:', rawValue);

    try {
      const data = JSON.parse(rawValue);
      // Check if it's a valid Gate Pass QR
      if (data.type === 'GATE_PASS' && data.token) {
        verifyToken(data.token);
      } else if (data.token) {
        // Fallback for just token in JSON
        verifyToken(data.token);
      } else {
        setResult({ valid: false, message: 'Invalid QR Format - Not a Gate Pass' });
      }
    } catch (e) {
      // Maybe it's just the raw token string
      if (rawValue.startsWith('GP-')) {
        verifyToken(rawValue);
      } else {
        setResult({ valid: false, message: 'Not a valid Gate Pass QR' });
      }
    }
  };

  // Handle manual token entry
  const handleManualVerify = () => {
    if (manualToken.trim()) {
      verifyToken(manualToken.trim());
    }
  };

  // Handle File Upload (For testing on Laptop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleScan(code.data);
        } else {
          setResult({ valid: false, message: 'No QR Code found in image' });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetScanner = () => {
    setResult(null);
    setManualToken('');
    setScannerError(false);
  };

  return (
    <div className="min-h-screen text-foreground font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`
          }} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">Guard Checkpoint</h1>
          <p className="text-white/70 text-sm mt-1">Scan customer's exit gate pass</p>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-md mx-auto space-y-4">

        {/* SCANNER AREA */}
        {!scanResult && !loading && (
          <>
            <div className="premium-card overflow-hidden">
              <div className="h-64 md:h-72 relative bg-black">
                {!scannerError ? (
                  <Scanner
                    onScan={(res) => {
                      if (res && res.length > 0) {
                        handleScan(res[0].rawValue);
                      }
                    }}
                    onError={() => setScannerError(true)}
                    styles={{
                      container: { height: '100%', width: '100%' },
                      video: { objectFit: 'cover' }
                    }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                    <QrCode className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium mb-2">Camera not available</p>
                    <p className="text-xs">Use image upload or manual entry below</p>
                  </div>
                )}

                {/* Scan Frame Overlay */}
                {!scannerError && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <div className="w-40 h-40 relative">
                      {/* Corner Brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                      {/* Scan Line */}
                      <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line" />
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload QR Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Manual Token Entry */}
            <div className="premium-card p-4">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider font-bold">
                <Hash className="w-3 h-3" />
                Manual Entry
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                  placeholder="GP-XXXXXXXX-XXXX"
                  className="input-premium flex-1 font-mono text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                />
                <button
                  onClick={handleManualVerify}
                  disabled={!manualToken.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25"
                >
                  Verify
                </button>
              </div>
            </div>
          </>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="premium-card p-12 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
            </div>
            <p className="text-lg font-bold text-foreground mt-6">Verifying Gate Pass...</p>
            <p className="text-sm text-muted-foreground mt-1">Please wait</p>
          </div>
        )}

        {/* RESULT: ACCESS GRANTED */}
        {scanResult && scanResult.valid && scanResult.transaction && (
          <div className="premium-card overflow-hidden animate-scale-in">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">ACCESS GRANTED</h2>
              <p className="text-emerald-100 text-sm">Customer may exit</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Customer Info */}
              <div className="bg-white/[0.02] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <User className="w-4 h-4" />
                    <span>Customer</span>
                  </div>
                  <span className="font-bold text-foreground">{scanResult.transaction.customer.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>Amount Paid</span>
                  </div>
                  <span className="font-bold text-emerald-400">₹{scanResult.transaction.total.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Verified At</span>
                  </div>
                  <span className="font-mono text-xs text-foreground">
                    {new Date(scanResult.transaction.verifiedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Package className="w-3 h-3" />
                  Items ({scanResult.transaction.items.length})
                </p>
                <ul className="space-y-2 max-h-32 overflow-y-auto">
                  {scanResult.transaction.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground font-mono">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={resetScanner}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Scan Next Customer
              </button>
            </div>
          </div>
        )}

        {/* RESULT: ACCESS DENIED */}
        {scanResult && !scanResult.valid && (
          <div className="premium-card overflow-hidden animate-scale-in">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-rose-600 to-red-600 p-6 text-white text-center">
              <XCircle className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">ACCESS DENIED</h2>
              <p className="text-rose-100 text-sm mt-1">{scanResult.message}</p>
            </div>

            <div className="p-5">
              <button
                onClick={resetScanner}
                className="w-full bg-white/5 hover:bg-white/10 text-foreground font-bold py-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Back to Admin Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}