import { notFound } from 'next/navigation';
import {
    MapPin,
    Star,
    Clock,
    ShieldCheck,
    Search,
    ArrowRight,
    Tag,
    Map,
    X
} from 'lucide-react';
import Link from 'next/link';
import PersonalizedFeed from '@/components/PersonalizedFeed';
import ProductGrid from '@/components/ProductGrid';

interface StorePageProps {
    params: Promise<{ storeId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getStoreData(storeId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/${storeId}`, {
        cache: 'no-store'
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.store;
}

async function getStoreProducts(storeId: string, category?: string, query?: string) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (query) params.set('q', query);

    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/stores/${storeId}/products${params.toString() ? '?' + params.toString() : ''}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
}

export default async function StoreFront({ params, searchParams }: StorePageProps) {
    const { storeId } = await params;
    const { q, category } = await searchParams;

    const store = await getStoreData(storeId);
    if (!store) return notFound();

    const storeProducts = await getStoreProducts(
        storeId,
        typeof category === 'string' ? category : undefined,
        typeof q === 'string' ? q : undefined
    );

    const allProducts = await getStoreProducts(storeId);
    const categories: string[] = Array.from(new Set(allProducts.map((p: any) => p.category)));

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
                                <MapPin className="w-5 h-5 text-blue-400 mr-2" />
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
                    {/* ... code kept ... */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {/* 'All Items' clears the category param */}
                        <Link
                            href={`/store/${storeId}${q ? `?q=${q}` : ''}`}
                            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors border ${!category
                                ? 'bg-white text-black border-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                                }`}
                        >
                            All Items
                        </Link>

                        {categories.map((cat: string) => (
                            <Link
                                key={cat}
                                href={`/store/${storeId}?category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ''}`}
                                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${category === cat
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>

                    {/* Functional Search Form */}
                    <form action={`/store/${storeId}`} className="relative w-full md:w-64 group">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                        <input
                            name="q"
                            defaultValue={typeof q === 'string' ? q : ''}
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                        />
                        {category && <input type="hidden" name="category" value={category as string} />}
                    </form>
                </div>
            </div>

            {/* --- PERSONALIZED FEED (NEW) --- */}
            <PersonalizedFeed storeId={storeId} />

            {/* --- PRODUCT GRID --- */}
            <div className="container mx-auto px-4 mt-8">
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-400" />
                        Inventory <span className="text-slate-500 text-sm font-normal">({storeProducts.length} items found)</span>
                    </h2>

                    {(q || category) && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Filters:</span>
                            {category && (
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 flex items-center gap-1">
                                    {category}
                                </span>
                            )}
                            {q && (
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 flex items-center gap-1">
                                    "{q}"
                                </span>
                            )}
                            <Link href={`/store/${storeId}`} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 ml-2">
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
                        <Link href={`/store/${storeId}`} className="mt-6 inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                            View All Products
                        </Link>
                    </div>
                ) : (
                    <ProductGrid products={storeProducts} storeId={storeId} />
                )}
            </div>
        </div>
    );
}