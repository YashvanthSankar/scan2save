'use client'; 

import { STORES } from '@/lib/data';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, ScanLine } from 'lucide-react';

export default function StoreQRSection() {
  return (
    <section className="py-16 bg-gray-950 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-10">
          <ScanLine className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold">Scan & Shop</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12">
          {STORES.map((store) => {
            // FIX: Generate a JSON string to match the Landing Page logic
            const qrData = JSON.stringify({
              app: 'scan2save',
              sid: store.id
            });

            return (
              <div key={store.id} className="bg-white p-6 rounded-2xl text-center shadow-2xl shadow-blue-900/20 transform hover:-translate-y-2 transition-transform duration-300">
                
                {/* The QR Code */}
                <div className="bg-white p-2 rounded-lg border-2 border-dashed border-gray-300 mb-4 inline-block">
                  <QRCodeSVG 
                    value={qrData} // Contains: {"app":"scan2save","sid":"store_id"}
                    size={180}
                    level="H"
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>

                <h3 className="text-black font-bold text-xl mb-1">{store.name}</h3>
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {store.location}
                </div>
                
                <p className="text-xs text-gray-400 mt-4 max-w-[200px] mx-auto">
                  Take a screenshot and upload to the homepage to enter
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}