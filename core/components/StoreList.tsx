import { STORES } from '@/lib/data';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StoreList() {
  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Select a Store</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORES.map((store) => (
            <Link key={store.id} href={`/stores/${store.id}`}>
              <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500 transition-all">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{store.name}</h3>
                      <div className="flex items-center text-gray-300 text-sm mb-1">
                        <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                        {store.location}
                      </div>
                      <p className="text-gray-500 text-xs">{store.address}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="flex items-center bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold border border-yellow-500/50">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                        {store.rating}
                      </span>
                      <span className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}