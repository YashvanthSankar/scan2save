'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { ArrowLeft, Upload, Loader2, ScanLine, Camera, CameraOff, SwitchCamera } from 'lucide-react';
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
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment'); // 'environment' is back camera
  const [error, setError] = useState('');

  // ----------------------------------------------------------------------
  // 1. Camera Handling Logic
  // ----------------------------------------------------------------------

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
    stopCamera(); // Ensure previous streams are closed

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready to play
        videoRef.current.setAttribute("playsinline", "true"); // required for iOS
        videoRef.current.play().then(() => {
            setCameraActive(true);
            setCameraPermission(true);
            requestAnimationFrame(tick);
        });
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setCameraPermission(false);
      setCameraActive(false);
      setError("Camera access denied or unavailable. Use upload below.");
    }
  }, [facingMode, stopCamera]);

  // The loop that checks video frames for QR codes
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
          
          // Attempt to find QR code
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            handleScanSuccess(code.data);
            return; // Stop the loop on success
          }
        }
      }
    }
    // Keep looping
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  // Switch between front and back camera
  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);


  // ----------------------------------------------------------------------
  // 2. File Upload Handling Logic
  // ----------------------------------------------------------------------

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      stopCamera(); // Pause camera while processing file
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
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

        if (code) {
          handleScanSuccess(code.data);
        } else {
          setError('No QR code found in image.');
          setIsProcessing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };


  // ----------------------------------------------------------------------
  // 3. Shared Success Logic
  // ----------------------------------------------------------------------

  const handleScanSuccess = (rawData: string) => {
    stopCamera(); // Stop scanning immediately
    setIsProcessing(true);
    
    try {
        const data = JSON.parse(rawData);
        if(data.app === 'scan2save' && data.sid) {
            // Provide a small vibration feedback if supported
            if (navigator.vibrate) navigator.vibrate(200);
            router.push(`/store/${data.sid}`);
        } else {
            setError("Invalid QR Code: Not a Scan2Save code");
            setIsProcessing(false);
        }
     } catch(err) {
         setError("Could not read store data");
         setIsProcessing(false);
     }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      
      {/* Hidden Canvas for processing video frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <Link href="/" onClick={stopCamera} className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="font-bold tracking-widest uppercase text-sm shadow-black drop-shadow-md">Scanner Mode</span>
        
        {/* Camera Toggle Button (Only show if we have permission) */}
        {cameraPermission && (
            <button 
                onClick={toggleCameraFacing} 
                className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition"
            >
                <SwitchCamera className="w-6 h-6" />
            </button>
        )}
        {!cameraPermission && <div className="w-10" />}
      </div>

      {/* Main Viewfinder Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-900 overflow-hidden">
        
        {/* --- VIDEO LAYER --- */}
        {cameraPermission !== false && (
            <video 
                ref={videoRef} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                muted 
            />
        )}

        {/* --- UI OVERLAY LAYER --- */}
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Slight dimming */}

        {/* Animated Scanning Line */}
        <div className="absolute inset-0 overflow-hidden z-20 pointer-events-none">
             <div className="w-full h-1 bg-green-500/80 absolute top-0 animate-[scan_3s_ease-in-out_infinite] shadow-[0_0_15px_rgba(34,197,94,0.7)]" />
        </div>

        {/* Viewfinder Brackets */}
        <div className="relative w-72 h-72 z-20">
            {/* The Border Box */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-3xl" />
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-xl -mt-1 -ml-1 shadow-sm"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-xl -mt-1 -mr-1 shadow-sm"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-xl -mb-1 -ml-1 shadow-sm"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-xl -mb-1 -mr-1 shadow-sm"></div>

            {/* Inner Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {isProcessing ? (
                    <div className="text-center bg-black/60 p-4 rounded-xl backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto mb-2" />
                        <p className="text-sm font-mono text-green-500 font-bold">DECODING...</p>
                    </div>
                ) : (
                    !cameraActive && !error && (
                        <div className="text-center opacity-60">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            <p className="text-xs uppercase tracking-widest">Starting Camera...</p>
                        </div>
                    )
                )}
            </div>
        </div>
        
        {/* Error / Status Messages */}
        {error && (
            <div className="absolute bottom-36 z-30 max-w-xs text-center bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
                {error}
            </div>
        )}
        
        {!cameraPermission && !error && (
             <div className="absolute bottom-36 z-30 max-w-xs text-center bg-gray-800/90 backdrop-blur-md text-white px-6 py-3 rounded-xl text-sm font-medium">
                Camera inactive. Use upload below.
            </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="bg-black p-6 pb-10 rounded-t-3xl border-t border-gray-800 z-30">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            
            <div className="flex w-full gap-3">
                {/* Manual Camera Toggle (In case user wants to stop the video) */}
                <button
                    onClick={() => cameraActive ? stopCamera() : startCamera()}
                    className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                        cameraActive 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {cameraActive ? <CameraOff className="w-5 h-5"/> : <Camera className="w-5 h-5"/>}
                    {cameraActive ? "Stop Cam" : "Start Cam"}
                </button>

                {/* Upload Button */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
                >
                    <Upload className="w-5 h-5" />
                    Upload Image
                </button>
            </div>
            
            <p className="text-gray-500 text-xs text-center">
                Align QR code within the green frame
            </p>
        </div>
      </div>
    </div>
  );
}