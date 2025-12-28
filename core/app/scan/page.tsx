'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, Loader2, Camera, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import jsQR from 'jsqr'; // Import the library we just installed

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // 1. Shared Logic: Handles the text whether it comes from Camera or File
  const handleScan = (text: string) => {
    if (loading || !text) return;

    try {
      const data = JSON.parse(text);

      if (data.app === 'scan2save' && data.sid) {
        setLoading(true);
        
        const isLoggedIn = document.cookie.includes('session'); 

        if (isLoggedIn) {
           router.push(`/store/${data.sid}`);
        } else {
           const nextUrl = encodeURIComponent(`/store/${data.sid}`);
           router.push(`/login?next=${nextUrl}`);
        }
        
      } else {
        setError('Invalid QR. This is not a Scan2Save code.');
        setLoading(false); // Reset loading if error
      }
    } catch (e) {
       // Only show error if we explicitly uploaded a file (users expect feedback on upload)
       // For camera, we stay silent to avoid spamming errors
       if(isProcessingFile) {
         setError('Could not find a valid QR code in this image.');
         setIsProcessingFile(false);
       }
    }
  };

  // 2. File Upload Logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to read pixel data
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Extract pixel data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Decode using jsQR
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleScan(code.data); // Success! Pass data to main handler
        } else {
          setError('No QR code detected. Try a clearer image.');
          setIsProcessingFile(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
        <Link 
          href="/" 
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
        >
          <X size={24} />
        </Link>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900">
        
        {/* State A: Live Camera Scanner */}
        {!loading && !isProcessingFile && (
          <Scanner 
            onScan={(result) => handleScan(result[0].rawValue)}
            components={{ torch: true }}
            sound={false}
            styles={{ container: { height: '100%', width: '100%' }, video: { objectFit: 'cover' } }}
          />
        )}

        {/* State B: Loading / Processing */}
        {(loading || isProcessingFile) && (
          <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center text-white space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
            <p className="text-xl font-bold tracking-wide">
              {isProcessingFile ? 'Reading Image...' : 'Verifying Store...'}
            </p>
          </div>
        )}

        {/* Overlay Frame & Controls */}
        {!loading && !isProcessingFile && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
                {/* Visual Frame */}
                <div className="w-72 h-72 border-2 border-indigo-500/50 rounded-3xl relative shadow-[0_0_100px_rgba(99,102,241,0.3)]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl -mb-1 -mr-1"></div>
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                
                {/* Bottom Controls */}
                <div className="mt-12 flex gap-4 pointer-events-auto">
                    {/* Visual Indicator */}
                    <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 border border-white/10">
                        <Camera className="w-5 h-5 text-indigo-400" />
                        <p className="text-white font-medium text-sm">Align QR code</p>
                    </div>

                    {/* NEW: Upload Button */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-slate-900 px-6 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      <ImageIcon className="w-5 h-5 text-indigo-600" />
                      <span>Upload</span>
                    </button>
                    
                    {/* Hidden Input */}
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
      </div>

      {/* Error Toast */}
      {error && (
        <div className="absolute bottom-12 left-6 right-6 bg-red-500/90 text-white p-4 rounded-2xl text-center backdrop-blur-md animate-in slide-in-from-bottom-5 z-30 shadow-xl">
          <p className="font-semibold">{error}</p>
          <button onClick={() => setError('')} className="text-xs bg-white/20 px-3 py-1 rounded mt-2 hover:bg-white/30 transition-colors">Dismiss</button>
        </div>
      )}
    </div>
  );
}