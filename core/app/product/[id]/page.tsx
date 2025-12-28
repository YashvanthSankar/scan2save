import { PRODUCTS, STORES } from '@/lib/data'; 
import { notFound } from 'next/navigation';
import { ShoppingCart, ArrowLeft, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';

// 1. Async Component + Promise Type
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Await params
  const { id } = await params;

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return notFound();
  }

  // Find the store name for this product
  const store = STORES.find(s => s.id === product.storeId);

  // Calculate Discount Percentage
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    // ... (The rest of your JSX remains exactly the same)
    <div className="min-h-screen bg-black text-white p-8">
      <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
      </Link>
      
      {/* ... keeping the rest of the UI the same ... */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="rounded-2xl overflow-hidden bg-gray-900 h-[500px] border border-gray-800">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <span className="text-blue-400 text-sm font-medium tracking-wider uppercase bg-blue-500/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-4xl font-bold mt-4">{product.name}</h1>
          </div>
          
          <p className="text-gray-400 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString()}</span>
               <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
               <span className="text-green-400 text-sm font-bold px-2 py-1 bg-green-500/10 rounded">
                 {discount}% OFF
               </span>
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col gap-2">
            <div className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-red-400 mt-1" />
                <div>
                    <span className="block font-semibold text-white">Available at: {store?.name}</span>
                    <span className="block text-gray-500">{store?.location}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 border-t border-gray-800 pt-2 mt-1">
                <Tag className="w-4 h-4 text-yellow-400" />
                <span>Exact Location: <span className="text-white font-medium">{product.aisle}</span></span>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}