'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { ArrowLeft, Upload, Loader2, ScanLine } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
          try {
             const data = JSON.parse(code.data);
             if(data.app === 'scan2save' && data.sid) {
                 router.push(`/store/${data.sid}`);
             } else {
                 setError("Invalid QR Code");
                 setIsProcessing(false);
             }
          } catch(err) {
              setError("Could not read store data");
              setIsProcessing(false);
          }
        } else {
          setError('No QR code found in image.');
          setIsProcessing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/" className="p-2 bg-white/10 rounded-full backdrop-blur-md">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="font-bold tracking-widest uppercase text-sm">Scanner Mode</span>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Main Viewfinder Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-900">
        
        {/* Animated Scanning Line */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
             <div className="w-full h-1 bg-green-500 absolute top-0 animate-[scan_3s_ease-in-out_infinite]" />
        </div>

        {/* Viewfinder Brackets */}
        <div className="relative w-72 h-72 border-2 border-white/20 rounded-3xl flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-xl -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-xl -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-xl -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-xl -mb-1 -mr-1"></div>

            {isProcessing ? (
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto mb-2" />
                    <p className="text-sm font-mono text-green-500">DECODING...</p>
                </div>
            ) : (
                <div className="text-center opacity-50">
                    <ScanLine className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-xs uppercase tracking-widest">Align QR Code</p>
                </div>
            )}
        </div>
        
        {error && (
            <div className="absolute bottom-32 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium animate-bounce">
                {error}
            </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="bg-black p-8 pb-12 rounded-t-3xl border-t border-gray-800">
        <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm text-center mb-2">
                Camera access restricted on this device.<br/>Please upload a photo/screenshot of the QR.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload from Gallery
            </button>
        </div>
      </div>
    </div>
  );
}