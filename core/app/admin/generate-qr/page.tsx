'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code'; // Renders the QR
import { Save, Download, MapPin, Building2 } from 'lucide-react';

export default function AdminQRGenerator() {
  // Form State
  const [formData, setFormData] = useState({
    storeId: '',
    name: '',
    lat: '',
    lng: '',
  });
  
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  
  // Ref to help us download the SVG as an image
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create the exact JSON format we discussed
    const payload = JSON.stringify({
      app: "scan2save",
      v: "1.0",
      sid: formData.storeId.toUpperCase(), // 'sid' is shorter than 'store_id' to save QR space
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      offers: true
    });

    setGeneratedPayload(payload);
    
    // TODO: Call API to save this Store to your Database here
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    
    // Technical logic to convert SVG to PNG for download
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000; // High resolution for printing
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw the QR
        ctx.drawImage(img, 50, 50, 900, 900);
        
        // Optional: Draw text (Store Name) below the QR
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(formData.name, canvas.width/2, 980);

        const pngFile = canvas.toDataURL("image/png");
        
        // Trigger browser download
        const downloadLink = document.createElement("a");
        downloadLink.download = `${formData.storeId}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white flex gap-8 font-sans">
      
      {/* LEFT COLUMN: The Input Form */}
      <div className="w-1/2 bg-slate-900 p-8 rounded-2xl border border-slate-800 h-fit">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Building2 className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold">Generate Store QR</h2>
        </div>
        
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Store Unique ID</label>
            <input 
              type="text" 
              required
              placeholder="e.g. RELIANCE_MUM_01"
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-indigo-500 outline-none"
              value={formData.storeId}
              onChange={(e) => setFormData({...formData, storeId: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Store Name (For Admin Reference)</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Reliance Smart, Bandra West"
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-indigo-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Latitude</label>
              <input 
                type="number" 
                step="any"
                required
                placeholder="19.0760"
                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-indigo-500 outline-none"
                value={formData.lat}
                onChange={(e) => setFormData({...formData, lat: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Longitude</label>
              <input 
                type="number" 
                step="any"
                required
                placeholder="72.8777"
                className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white focus:border-indigo-500 outline-none"
                value={formData.lng}
                onChange={(e) => setFormData({...formData, lng: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-colors">
            <Save size={18} /> Generate Payload
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: Preview & Download */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 p-8 min-h-[500px]">
        {generatedPayload ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <h3 className="text-slate-400 mb-4 text-sm uppercase tracking-wider">Preview</h3>
            
            <div ref={qrRef} className="bg-white p-6 rounded-xl mb-6 inline-block shadow-2xl">
              <QRCode 
                value={generatedPayload} 
                size={250}
                level="H" // High error correction so it scans even if slightly damaged
              />
            </div>
            
            <div className="text-slate-500 text-xs mb-8 font-mono bg-slate-950 p-4 rounded-lg text-left overflow-x-auto max-w-md border border-slate-800">
              {generatedPayload}
            </div>

            <button 
              onClick={downloadQR}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
            >
              <Download size={20} /> Download Printable QR
            </button>
          </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <MapPin size={32} />
            </div>
            <p className="font-medium">Enter details to generate a store QR</p>
          </div>
        )}
      </div>
    </div>
  );
}