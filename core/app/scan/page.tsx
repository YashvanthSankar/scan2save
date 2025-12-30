'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { ArrowLeft, Upload, Loader2, Camera, CameraOff, SwitchCamera, Sparkles, Scan } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const router = useRouter();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'decoding' | 'analyzing' | 'redirecting'>('decoding');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState('');

  // 1. Camera Handling Logic
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError('');
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        try {
          await videoRef.current.play();
          setCameraActive(true);
          setCameraPermission(true);
          requestAnimationFrame(tick);
        } catch (playErr: any) {
          if (playErr.name === 'AbortError') return;
          throw playErr;
        }
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      if (err.name !== 'AbortError') {
        setCameraPermission(false);
        setCameraActive(false);
        setError("Camera access denied. Use upload below.");
      }
    }
  }, [facingMode, stopCamera]);

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code) {
            handleScanSuccess(code.data);
            return;
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const toggleCameraFacing = () => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // 2. File Upload Logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      stopCamera();
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    setProcessingStage('decoding');
    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) { setIsProcessing(false); return; }
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) handleScanSuccess(code.data);
        else {
          setError('No QR code found in image.');
          setIsProcessing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 3. Success Logic with AI Animation
  const handleScanSuccess = async (rawData: string) => {
    stopCamera();
    setIsProcessing(true);
    setProcessingStage('analyzing');

    try {
      const data = JSON.parse(rawData);
      // Simulate "AI Analysis" delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.app === 'scan2save' && data.sid) {
        if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
        setProcessingStage('redirecting');
        router.push(`/store/${data.sid}`);
      } else {
        setError("Invalid QR Code");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Could not read data");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden font-sans">
      <canvas ref={canvasRef} className="hidden" />

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full z-30 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/dashboard" onClick={stopCamera} className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-bold tracking-[0.2em] text-xs uppercase text-slate-300 drop-shadow-md">AI Scanner</span>
        {cameraPermission ? (
          <button onClick={toggleCameraFacing} className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition">
            <SwitchCamera className="w-5 h-5" />
          </button>
        ) : <div className="w-10" />}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Video feed */}
        {cameraPermission !== false && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${cameraActive && !isProcessing ? 'opacity-100 scale-100' : 'opacity-30 scale-105 blur-sm'}`}
            muted
          />
        )}

        {/* Dynamic Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* --- SCANNING STATE --- */}
        {!isProcessing && (
          <div className="relative w-72 h-72 z-20">
            {/* Neon Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-500 rounded-tl-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500 rounded-tr-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-500 rounded-bl-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-500 rounded-br-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

            {/* Scanning Beam */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="w-full h-1 bg-emerald-500/80 absolute top-0 animate-scan-line shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
            </div>

            {/* Center Hint */}
            {!cameraActive && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-emerald-500">Initializing</p>
              </div>
            )}
          </div>
        )}

        {/* --- AI PROCESSING STATE (Micro-interaction) --- */}
        {isProcessing && (
          <div className="relative z-30 flex flex-col items-center justify-center p-8">
            {/* Floating Particles Animation */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-indigo-400 animate-bounce" />
              </div>
              {/* Ring Particles */}
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin [animation-duration:3s]" />
              <div className="absolute inset-2 border border-emerald-500/30 rounded-full animate-spin [animation-duration:2s] [animation-direction:reverse]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight animate-pulse">
                {processingStage === 'analyzing' ? 'AI Analyzing...' : 'Redirecting...'}
              </h3>
              <p className="text-indigo-300 text-sm font-medium">
                {processingStage === 'analyzing'
                  ? 'Matching your personalized profile'
                  : 'Preparing your store experience'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute bottom-40 z-30 bg-red-500/20 border border-red-500/50 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-200 text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* --- CONTROLS --- */}
      {!isProcessing && (
        <div className="bg-black/80 backdrop-blur-xl p-8 pt-6 rounded-t-[2.5rem] border-t border-white/5 z-30">
          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={() => cameraActive ? stopCamera() : startCamera()}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${cameraActive
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20'}`}
            >
              {cameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              {cameraActive ? 'STOP' : 'START'}
            </button>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-200 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              UPLOAD
            </button>
          </div>

          {/* Dev Trigger */}
          <div className="mt-6 text-center">
            <button
              onClick={() => handleScanSuccess(JSON.stringify({ app: 'scan2save', sid: 'freshmart-blr-01' }))}
              className="text-[10px] text-slate-600 font-mono hover:text-indigo-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-indigo-400"
            >
              [DEV] Simulate Scan Signal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}