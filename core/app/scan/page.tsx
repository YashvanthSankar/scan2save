'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { ArrowLeft, Upload, Loader2, Camera, CameraOff, SwitchCamera, Sparkles, Scan, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'decoding' | 'analyzing' | 'redirecting'>('decoding');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState('');

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

  const handleScanSuccess = async (rawData: string) => {
    stopCamera();
    setIsProcessing(true);
    setProcessingStage('analyzing');

    try {
      const data = JSON.parse(rawData);
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
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden font-sans">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-30 p-5 flex items-center justify-between bg-gradient-to-b from-[#030712] via-[#030712]/80 to-transparent">
        <Link
          href="/dashboard"
          onClick={stopCamera}
          className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-widest text-[10px] uppercase text-muted-foreground">AI Scanner</span>
        </div>

        {cameraPermission ? (
          <button
            onClick={toggleCameraFacing}
            className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md hover:bg-white/10 transition-all"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        ) : <div className="w-11" />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Video Feed */}
        {cameraPermission !== false && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${cameraActive && !isProcessing ? 'opacity-100 scale-100' : 'opacity-30 scale-105 blur-sm'}`}
            muted
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-[#030712]/80 z-10" />

        {/* Scanning Frame */}
        {!isProcessing && (
          <div className="relative w-72 h-72 z-20">
            {/* Neon Corners with Gradient */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-indigo-500 rounded-tl-3xl shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
            <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-violet-500 rounded-tr-3xl shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
            <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-violet-500 rounded-bl-3xl shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-indigo-500 rounded-br-3xl shadow-[0_0_20px_rgba(99,102,241,0.5)]" />

            {/* Scanning Beam */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 absolute top-0 animate-scan-line shadow-[0_0_30px_rgba(99,102,241,0.8)]" />
            </div>

            {/* Center Hint */}
            {!cameraActive && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Initializing Camera</p>
              </div>
            )}

            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-2xl animate-pulse" />
              </div>
            )}
          </div>
        )}

        {/* AI Processing State */}
        {isProcessing && (
          <div className="relative z-30 flex flex-col items-center justify-center p-8">
            <div className="relative w-28 h-28 mb-8">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 rounded-full blur-2xl animate-pulse" />

              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/40 animate-bounce-subtle">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Spinning Rings */}
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-3 border border-violet-500/30 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {processingStage === 'analyzing' ? 'AI Analyzing...' : 'Redirecting...'}
              </h3>
              <p className="text-primary text-sm font-medium flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                {processingStage === 'analyzing'
                  ? 'Matching your personalized profile'
                  : 'Preparing your store experience'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute bottom-40 z-30 premium-card py-3 px-5 border-rose-500/30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-400 text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {!isProcessing && (
        <div className="bg-[#030712]/95 backdrop-blur-xl p-6 pt-5 rounded-t-[2.5rem] border-t border-white/5 z-30">
          <div className="flex gap-4 max-w-md mx-auto">
            <button
              onClick={() => cameraActive ? stopCamera() : startCamera()}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${cameraActive
                ? 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'}`}
            >
              {cameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              {cameraActive ? 'STOP' : 'START'}
            </button>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-4 bg-white text-[#030712] rounded-2xl font-bold text-sm tracking-wide hover:bg-white/90 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              UPLOAD
            </button>
          </div>

          {/* Dev Trigger */}
          <div className="mt-5 text-center">
            <button
              onClick={() => handleScanSuccess(JSON.stringify({ app: 'scan2save', sid: 'freshmart-blr-01' }))}
              className="text-[10px] text-muted-foreground font-mono hover:text-primary transition-colors uppercase tracking-widest"
            >
              [DEV] Simulate Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}