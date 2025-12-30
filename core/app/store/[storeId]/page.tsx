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
    X,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import PersonalizedFeed from '@/components/PersonalizedFeed';
import ProductGrid from '@/components/ProductGrid';
import StoreHeader from '@/components/StoreHeader';
import StoreFilters from '@/components/StoreFilters';

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
        <div className="min-h-screen text-foreground selection:bg-primary/30 font-sans pb-24 relative bg-background">

            {/* --- NEW HEADER --- */}
            <StoreHeader storeName={store.name} storeId={storeId} q={typeof q === 'string' ? q : undefined} category={typeof category === 'string' ? category : undefined} />

            {/* --- AI PERSONALIZED FEED (High Priority) --- */}
            {/* Moved to top for immediate engagement */}
            <div className="pt-4 pb-6">
                <PersonalizedFeed storeId={storeId} />
            </div>

            {/* --- CATEGORIES (Scroll + Dropdown) --- */}
            <StoreFilters
                categories={categories}
                storeId={storeId}
                q={typeof q === 'string' ? q : undefined}
                activeCategory={typeof category === 'string' ? category : undefined}
            />

            {/* --- PRODUCT GRID --- */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Explore Items
                    </h2>
                    {(q || category) && (
                        <Link href={`/store/${storeId}`} className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors bg-secondary px-2 py-1 rounded-full">
                            <X className="w-3 h-3" /> Clear Filters
                        </Link>
                    )}
                </div>

                {storeProducts.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border mx-auto max-w-md">
                        <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">No products found</h3>
                        <p className="text-sm text-muted-foreground mb-6">Try searching for something else.</p>
                        <Link href={`/store/${storeId}`} className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-primary/90">
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