'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code'; 
import { Save, Download, MapPin, Building2, QrCode } from 'lucide-react';

export default function AdminQRGenerator() {
  const [formData, setFormData] = useState({
    storeId: '',
    name: '',
    lat: '',
    lng: '',
  });
  
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = JSON.stringify({
      app: "scan2save",
      v: "1.0",
      sid: formData.storeId.toUpperCase(),
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      offers: true
    });
    setGeneratedPayload(payload);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 900, 900);
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(formData.name, canvas.width/2, 980);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${formData.storeId}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <QrCode className="text-indigo-400" />
          QR Generator
        </h2>
        <p className="text-slate-400 mt-1">Create unique check-in codes for your partner stores.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="flex-1 bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                  <Building2 className="text-indigo-400 w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Store Details</h3>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Store Unique ID</label>
              <input 
                type="text" 
                required
                placeholder="e.g. RELIANCE_MUM_01"
                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                value={formData.storeId}
                onChange={(e) => setFormData({...formData, storeId: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Store Name (For Label)</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Reliance Smart, Bandra West"
                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  placeholder="19.0760"
                  className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  value={formData.lat}
                  onChange={(e) => setFormData({...formData, lat: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  placeholder="72.8777"
                  className="w-full bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  value={formData.lng}
                  onChange={(e) => setFormData({...formData, lng: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all hover:shadow-lg hover:shadow-indigo-500/20">
              <Save size={18} /> Generate QR Code
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Preview & Download */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 min-h-[500px]">
          {generatedPayload ? (
            <div className="text-center animate-in fade-in zoom-in duration-300 w-full flex flex-col items-center">
              <h3 className="text-slate-400 mb-6 text-sm uppercase tracking-wider font-semibold">Live Preview</h3>
              
              <div ref={qrRef} className="bg-white p-6 rounded-2xl mb-8 inline-block shadow-2xl shadow-black/50">
                <QRCode 
                  value={generatedPayload} 
                  size={250}
                  level="H" 
                />
              </div>
              
              <div className="w-full max-w-md bg-slate-950 p-4 rounded-xl border border-slate-800 mb-8">
                <p className="text-xs text-slate-500 font-mono break-all text-left">
                  {generatedPayload}
                </p>
              </div>

              <button 
                onClick={downloadQR}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
              >
                <Download size={20} /> Download PNG
              </button>
            </div>
          ) : (
            <div className="text-slate-500 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700 border-dashed">
                  <MapPin size={32} className="opacity-50" />
              </div>
              <h4 className="text-lg font-medium text-slate-300">Ready to Generate</h4>
              <p className="text-sm max-w-xs mt-2">Enter the store coordinates and ID to generate a secure location-locked QR code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}