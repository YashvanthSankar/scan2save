'use client';

import { useState, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  CheckCircle,
  XCircle,
  Package,
  ShieldCheck,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import jsQR from 'jsqr';

export default function GuardVerifyPage() {
  const [scanResult, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. HANDLE THE SCAN (Camera or File) ---
  const handleScan = (rawValue: string) => {
    if (!rawValue || loading) return;

    try {
      const data = JSON.parse(rawValue);

      // Verify it is a valid Gate Pass
      if (data.type === 'GATE_PASS' && data.token) {
        setLoading(true);

        // SIMULATE BACKEND VERIFICATION
        // In real app: fetch('/api/admin/verify-pass', ...)
        setTimeout(() => {
          setLoading(false);
          setResult({
            valid: true,
            token: data.token,
            // Mock items that would come from DB
            items: [
              { name: 'Amul Gold Milk', qty: 1 },
              { name: 'Coke Zero', qty: 2 }
            ],
            timestamp: new Date().toLocaleTimeString()
          });
        }, 1500);

      } else {
        setResult({ valid: false, message: 'Invalid QR Format' });
      }
    } catch (e) {
      setResult({ valid: false, message: 'Not a Scan2Save QR' });
    }
  };

  // --- 2. HANDLE FILE UPLOAD (For testing on Laptop) ---
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
        <p className="text-muted-foreground text-sm">Scan customer's exit QR</p>
      </div>

      <div className="w-full max-w-md space-y-6">

        {/* SCANNER AREA */}
        {!scanResult && !loading && (
          <div className="bg-card rounded-3xl overflow-hidden border-2 border-border relative shadow-2xl">
            <div className="h-80 relative">
              <Scanner
                onScan={(res) => handleScan(res[0].rawValue)}
                styles={{ container: { height: '100%' } }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-48 h-48 border-2 border-primary rounded-2xl relative">
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>

            {/* Manual Upload Button (For Testing) */}
            <div className="p-4 bg-muted/80 backdrop-blur-sm flex justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ImageIcon className="w-4 h-4" /> Upload Screenshot (Test)
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
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="h-80 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-bold text-foreground">Verifying Receipt...</p>
          </div>
        )}

        {/* RESULT: ACCESS GRANTED */}
        {scanResult && scanResult.valid && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-1">ACCESS GRANTED</h2>
            <p className="text-emerald-500 font-mono text-xs mb-6">Token: {scanResult.token}</p>

            <div className="bg-background/50 rounded-xl p-4 text-left border border-border">
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Verified Items
              </p>
              <ul className="space-y-2">
                {scanResult.items.map((item: any, i: number) => (
                  <li key={i} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground font-mono">x{item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
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
            <p className="text-red-400">{scanResult.message}</p>

            <button
              onClick={() => setResult(null)}
              className="mt-8 w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}