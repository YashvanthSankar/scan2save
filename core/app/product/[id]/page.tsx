import { PRODUCTS, STORES } from '@/lib/data';
import { notFound } from 'next/navigation';
import { 
  ShoppingCart, 
  ArrowLeft, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  Star, 
  Truck,
  Check,
  Map,
  Store
} from 'lucide-react';
import Link from 'next/link';

// 1. Define params as a Promise for Next.js 15
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Await the params to get the ID
  const { id } = await params;

  // 3. Find Product
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return notFound();
  }

  // 4. Find the associated Store
  const store = STORES.find(s => s.id === product.storeId);

  // Calculate Discount
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/stores/${product.storeId}`} className="flex items-center text-slate-400 hover:text-white transition-colors group w-fit">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to {store?.name || "Store"}</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          
          {/* --- LEFT COLUMN: IMAGE --- */}
          <div className="space-y-6">
            <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative group">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1 w-fit">
                            <Tag className="w-3 h-3" /> {discount}% OFF
                        </span>
                    )}
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 w-fit">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: ShieldCheck, label: "Original", sub: "100% Authentic" },
                    { icon: Truck, label: "Fast Delivery", sub: "Within 24 Hours" },
                    { icon: Check, label: "Verified", sub: "Quality Check" },
                ].map((badge, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                        <badge.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                        <div className="font-bold text-sm text-white">{badge.label}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{badge.sub}</div>
                    </div>
                ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-2 flex items-center gap-2">
                <Link href={`/stores/${store?.id}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    {store?.name}
                </Link>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.8 (320 reviews)
                </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{product.name}</h1>

            {/* Price Block */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl mb-8">
                <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold