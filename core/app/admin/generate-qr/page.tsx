'use client';

import { useState, useRef } from 'react';
import { STORES } from '@/lib/data';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, CheckCircle2, MapPin } from 'lucide-react';

export default function QRGeneratorPage() {
  const [selectedStoreId, setSelectedStoreId] = useState(STORES[0]?.id || "");
  const [copied, setCopied] = useState(false);

  // Find the full store object based on selection
  const selectedStore = STORES.find(s => s.id === selectedStoreId);

  // THE KEY LOGIC: This matches what your Scanner expects
  const qrPayload = JSON.stringify({
    app: 'scan2save',
    sid: selectedStoreId
  });

  // Function to download the SVG as a PNG
  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${selectedStore?.name.replace(/\s+/g, '_')}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Generate and download official store entry codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-4">Select Target Store</label>

            <div className="space-y-3">
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedStoreId === store.id
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                >
                  <div>
                    <span className="font-bold block">{store.name}</span>
                    <span className={`text-xs flex items-center mt-1 ${selectedStoreId === store.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {store.location}
                    </span>
                  </div>
                  {selectedStoreId === store.id && <CheckCircle2 className="w-5 h-5 text-primary-foreground" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl shadow-sm">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Raw JSON Payload</label>
            <div className="bg-muted rounded-lg p-3 font-mono text-xs text-primary break-all border border-border relative group">
              {qrPayload}
              <button
                onClick={copyPayload}
                className="absolute top-2 right-2 p-2 bg-background rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <p className="text-muted-foreground text-[10px] mt-2">
              This data is embedded inside the QR. The scanner uses "sid" to identify the store.
            </p>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="bg-card text-card-foreground p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden border border-border">

          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">{selectedStore?.name}</h2>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {selectedStore?.address}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrPayload}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-8">
            Scan to Enter
          </p>

          <button
            onClick={downloadQR}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PNG
          </button>
        </div>

      </div>
    </div>
  );
}