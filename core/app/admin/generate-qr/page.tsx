'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, CheckCircle2, MapPin, Loader2, QrCode, Sparkles } from 'lucide-react';

interface Store {
  id: string;
  storeId: string;
  name: string;
  location: string;
}

export default function QRGeneratorPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch stores from API on mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/stores');
        const data = await res.json();
        if (data.stores && data.stores.length > 0) {
          setStores(data.stores);
          setSelectedStoreId(data.stores[0].storeId);
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Find the full store object based on selection
  const selectedStore = stores.find(s => s.storeId === selectedStoreId);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="premium-card p-12 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-muted/50 rounded-2xl flex items-center justify-center">
            <QrCode className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Stores Found</h2>
          <p className="text-muted-foreground text-sm">
            Add stores in the "Manage Stores" section first to generate QR codes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Generator</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and download official store entry codes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="premium-card p-6">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Select Target Store
            </label>

            <div className="space-y-2">
              {stores.map((store, index) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.storeId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group animate-fade-in-up opacity-0 ${selectedStoreId === store.storeId
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-indigo-500/30 hover:text-foreground'
                    }`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div>
                    <span className="font-bold block">{store.name}</span>
                    <span className={`text-xs flex items-center mt-1 ${selectedStoreId === store.storeId ? 'text-white/80' : 'text-muted-foreground'}`}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {store.location}
                    </span>
                    <span className={`text-[10px] font-mono mt-1 block ${selectedStoreId === store.storeId ? 'text-white/60' : 'text-muted-foreground/60'}`}>
                      ID: {store.storeId}
                    </span>
                  </div>
                  {selectedStoreId === store.storeId && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="premium-card p-6">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Raw JSON Payload
            </label>
            <div className="bg-[#030712] rounded-xl p-4 font-mono text-xs text-primary break-all border border-white/10 relative group">
              {qrPayload}
              <button
                onClick={copyPayload}
                className="absolute top-2 right-2 p-2 bg-white/5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-muted-foreground text-[10px] mt-2">
              This data is embedded inside the QR. The scanner uses "sid" to identify the store.
            </p>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="premium-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600" />

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Scan2Save Partner</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">{selectedStore?.name}</h2>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {selectedStore?.location}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-200 mb-6 shadow-xl">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrPayload}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-sm font-bold gradient-text uppercase tracking-widest mb-8">
            Scan to Enter Store
          </p>

          <button
            onClick={downloadQR}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            Download PNG
          </button>
        </div>

      </div>
    </div>
  );
}