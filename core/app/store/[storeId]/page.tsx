import { STORES, PRODUCTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Star, 
  Clock, 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowRight,
  Tag,
  Map,
  X
} from 'lucide-react';
import Link from 'next/link';

// Define Props for Next.js 15 Page
interface StorePageProps {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StoreFront({ params, searchParams }: StorePageProps) {
  
  // 1. Await params & searchParams (Next.js 15 requirement)
  const { storeId } = await params;
  const { q, category } = await searchParams; // Get query (q) and category from URL

  // 2. Fetch Store Data
  const store = STORES.find((s) => s.id === storeId);
  if (!store) return notFound();

  // 3. Filter Products Logic
  let storeProducts = PRODUCTS.filter((p) => p.storeId === storeId);

  // Filter by Category
  if (category && typeof category === 'string') {
    storeProducts = storeProducts.filter(p => p.category === category);
  }

  // Filter by Search Query
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    storeProducts = storeProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }

  // 4. Extract unique categories for filter pills
  const allStoreProducts = PRODUCTS.filter((p) => p.storeId === storeId);
  const categories = Array.from(new Set(allStoreProducts.map(p => p.category)));

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[250px] w-full group overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        {/* <div className="absolute inset-0">
            <img 
                src={store.image} 
                alt={store.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            {/* Darker gradient for better text readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" /> */}
        {/* </div> */}

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="container mx-auto">
             
             {/* Verified Badge */}
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-blue-900/20">
                <ShieldCheck className="w-3 h-3" /> Verified Partner
             </div>

             <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">{store.name}</h1>
             
             <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-slate-300">
                <div className="flex items-center text-white bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" /> 
                    <span className="font-bold mr-1">{store.rating}</span> 
                    <span className="text-slate-400 text-xs ml-1">(1.2k)</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-indigo-400 mr-2" /> 
                    {store.location}
                </div>
                <div className="flex items-center text-emerald-400">
                    <Clock className="w-5 h-5 mr-2" /> 
                    Open Now • Closes 10 PM
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 py-4 shadow-2xl">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Functional Categories Scroll */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* 'All Items' clears the category param */}
                <Link 
                    href={`/stores/${storeId}${q ? `?q=${q}` : ''}`}
                    className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors border ${
                        !category 
                        ? 'bg-white text-black border-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                >
                    All Items
                </Link>
                
                {categories.map(cat => (
                    <Link 
                        key={cat} 
                        href={`/stores/${storeId}?category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ''}`}
                        className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                            category === cat
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
                        }`}
                    >
                        {cat}
                    </Link>
                ))}
            </div>

            {/* Functional Search Form */}
            <form action={`/stores/${storeId}`} className="relative w-full md:w-64 group">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                <input 
                    name="q"
                    defaultValue={typeof q === 'string' ? q : ''}
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
                {/* Hidden input to preserve category when searching */}
                {category && <input type="hidden" name="category" value={category as string} />}
            </form>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                Inventory <span className="text-slate-500 text-sm font-normal">({storeProducts.length} items found)</span>
            </h2>
            
            {/* Active Filters Display */}
            {(q || category) && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Filters:</span>
                    {category && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1">
                            {category}
                        </span>
                    )}
                    {q && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 flex items-center gap-1">
                            "{q}"
                        </span>
                    )}
                    <Link href={`/stores/${storeId}`} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 ml-2">
                        <X className="w-3 h-3" /> Clear
                    </Link>
                </div>
            )}
        </div>
        
        {storeProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-slate-400">Try adjusting your search or filters.</p>
                <Link href={`/stores/${storeId}`} className="mt-6 inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                    View All Products
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {storeProducts.map((product) => {
                // Calculate Savings
                const savings = product.originalPrice - product.price;
                const discountPercent = Math.round((savings / product.originalPrice) * 100);

                return (
                <Link key={product.id} href={`/products/${product.id}`} className="group block h-full">
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative h-full flex flex-col">
                    
                    {/* Image Area */}
                    <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {/* Floating Badge: Discount */}
                    {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {discountPercent}% OFF
                        </div>
                    )}

                    {/* Floating Badge: Category */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded border border-white/10">
                        {product.category}
                    </div>
                    </div>
                    
                    {/* Details Area */}
                    <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 h-8">{product.description}</p>
                    
                    {/* Physical Location Helper */}
                    <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-800/50">
                        <Map className="w-3 h-3 text-emerald-400" />
                        <span>Aisle: <span className="text-slate-300 font-medium">{product.aisle || "General"}</span></span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-end justify-between">
                        <div>
                            <div className="text-xs text-slate-500 line-through mb-0.5">₹{product.originalPrice.toLocaleString()}</div>
                            <div className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</div>
                        </div>
                        <div className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                    </div>
                </div>
                </Link>
            )})}
            </div>
        )}
      </div>
    </div>
  );
}