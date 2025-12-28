import { STORES, PRODUCTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';

// 1. Change type to Promise
// 2. Make component 'async'
export default async function StoreFront({ params }: { params: Promise<{ storeId: string }> }) {
  
  // 3. Await the params before using them
  const { storeId } = await params;

  const store = STORES.find((s) => s.id === storeId);
  
  if (!store) return notFound();

  // Filter Products for this Store using the unwrapped storeId
  const storeProducts = PRODUCTS.filter((p) => p.storeId === storeId);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {/* Store Header Banner */}
      <div className="relative h-[300px] w-full">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover opacity-50" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-8">
          <div className="container mx-auto">
             <h1 className="text-5xl font-bold mb-2">{store.name}</h1>
             <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {store.location}</span>
                <span className="flex items-center text-yellow-400"><Star className="w-4 h-4 mr-1 fill-current" /> {store.rating} Rating</span>
             </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-4">Available Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all">
                <div className="aspect-square bg-gray-800 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3 h-10">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                    <span className="text-blue-400 text-sm font-medium group-hover:underline">View Details</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}