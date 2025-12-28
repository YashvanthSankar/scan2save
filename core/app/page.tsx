'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ScanLine, 
  Upload, 
  Camera, 
  Zap, 
  ArrowRight, 
  CreditCard, 
  TrendingDown 
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Drag & Drop visuals
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate processing a dropped file
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile();
    }
  };

  // Simulate file processing
  const processFile = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('QR Code detected! Redirecting to savings...');
      // router.push('/results'); // Example redirect
    }, 1500);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <ScanLine className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Scan2<span className="text-indigo-400">Save</span>
          </span>
        </div>
        <button 
          onClick={() => router.push('/login')}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-slate-800"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-400">Instant price comparison active</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Stop Overpaying. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Start Scanning.
          </span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Scan any product QR code or upload a receipt. We instantly compare prices across stores to ensure you never miss a deal again.
        </p>

        {/* Interaction Zone */}
        <div className="w-full max-w-3xl grid md:grid-cols-2 gap-4 animate-in fade-in scale-95 duration-700 delay-200">
          
          {/* Option 1: Live Scan */}
          <button 
            onClick={() => alert('Opening Camera... (Requires Permissions)')}
            className="group relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] transition-all duration-300 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Scan QR Code</h3>
            <p className="text-indigo-200 text-sm">Use your camera to scan instantly</p>
          </button>

          {/* Option 2: Upload */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
            className={`cursor-pointer group relative flex flex-col items-center justify-center p-10 bg-slate-900/50 backdrop-blur-md rounded-3xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && processFile()}
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-300 font-medium">Analyzing QR...</p>
              </div>
            ) : (
              <>
                <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-700 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-2">Upload Image</h3>
                <p className="text-slate-500 text-sm">Or drag and drop a screenshot here</p>
              </>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            { 
              icon: Zap, 
              title: "Instant Compare", 
              desc: "Get real-time price comparisons from 50+ local stores." 
            },
            { 
              icon: TrendingDown, 
              title: "Price History", 
              desc: "See if the 'discount' is real or just a marketing trick." 
            },
            { 
              icon: CreditCard, 
              title: "Auto-Cashback", 
              desc: "Link your card and get automatic rewards on scanning." 
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <feature.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Scan2Save. Making shopping smarter.</p>
      </footer>
    </div>
  );
}