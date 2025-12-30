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
  Hash
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verify token via API
  const verifyToken = async (token: string) => {
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

    try {
      const data = JSON.parse(rawValue);
      // Check if it's a valid Gate Pass QR
      if (data.type === 'GATE_PASS' && data.token) {
        verifyToken(data.token);
      } else {
        setResult({ valid: false, message: 'Invalid QR Format - Not a Gate Pass' });
      }
    } catch (e) {
      // Maybe it's just the raw token string
      if (rawValue.startsWith('GP-')) {
        verifyToken(rawValue);
      } else {
        setResult({ valid: false, message: 'Not a Scan2Save QR Code' });
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
          alert("No QR Code found in image");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen text-foreground p-6 font-sans flex flex-col items-center relative">

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 border border-primary/20">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Guard Checkpoint</h1>
        <p className="text-muted-foreground text-sm">Verify customer's exit gate pass</p>
      </div>

      <div className="w-full max-w-md space-y-6">

        {/* SCANNER AREA */}
        {!scanResult && !loading && (
          <>
            <div className="bg-card rounded-3xl overflow-hidden border-2 border-border relative shadow-2xl">
              <div className="h-72 relative">
                <Scanner
                  onScan={(res) => handleScan(res[0].rawValue)}
                  styles={{ container: { height: '100%' } }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="w-44 h-44 border-2 border-primary rounded-2xl relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>

              {/* Manual Upload Button (For Testing) */}
              <div className="p-4 bg-muted/80 backdrop-blur-sm flex justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ImageIcon className="w-4 h-4" /> Upload Image
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
            <div className="bg-card/50 border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Or enter token manually
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                  placeholder="GP-XXXXXXXX-XXXX"
                  className="flex-1 bg-muted border border-border rounded-xl px-4 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleManualVerify}
                  disabled={!manualToken.trim()}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </div>
          </>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="h-80 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-bold text-foreground">Verifying Gate Pass...</p>
          </div>
        )}

        {/* RESULT: ACCESS GRANTED */}
        {scanResult && scanResult.valid && scanResult.transaction && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 text-center animate-in zoom-in duration-300">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-1">ACCESS GRANTED</h2>
            <p className="text-emerald-500 text-sm mb-6">Customer may exit</p>

            {/* Customer Info */}
            <div className="bg-background/50 rounded-xl p-4 text-left border border-border mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Customer</span>
                </div>
                <div className="text-right text-foreground font-medium">{scanResult.transaction.customer.name}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>Amount Paid</span>
                </div>
                <div className="text-right text-foreground font-bold">₹{scanResult.transaction.total.toLocaleString()}</div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Verified At</span>
                </div>
                <div className="text-right text-foreground text-xs font-mono">
                  {new Date(scanResult.transaction.verifiedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-background/50 rounded-xl p-4 text-left border border-border">
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Purchased Items ({scanResult.transaction.items.length})
              </p>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {scanResult.transaction.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground font-mono">×{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setResult(null); setManualToken(''); }}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              Scan Next Customer
            </button>
          </div>
        )}

        {/* RESULT: ACCESS DENIED */}
        {scanResult && !scanResult.valid && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-2">ACCESS DENIED</h2>
            <p className="text-red-400 mb-4">{scanResult.message}</p>

            <button
              onClick={() => { setResult(null); setManualToken(''); }}
              className="mt-4 w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Admin Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}