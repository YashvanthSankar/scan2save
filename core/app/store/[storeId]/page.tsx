import { notFound } from 'next/navigation';
import {
    Search,
    Tag,
    X,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import PersonalizedFeed from '@/components/PersonalizedFeed';
import ProductGrid from '@/components/ProductGrid';
import StoreHeader from '@/components/StoreHeader';
import StoreFilters from '@/components/StoreFilters';
import { prisma } from '@/lib/prisma';

interface StorePageProps {
    params: Promise<{ storeId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// OPTIMIZATION: Single combined function to avoid duplicate store lookups
async function getStoreWithData(storeId: string, category?: string, query?: string) {
    try {
        // Single store lookup
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { storeId: storeId },
                    { id: storeId }
                ]
            },
            select: {
                id: true,
                storeId: true,
                name: true,
                location: true,
                isActive: true,
            }
        });

        if (!store) return null;

        // OPTIMIZATION: Fetch products and categories in parallel using the same store.id
        const [products, categoryProducts] = await Promise.all([
            prisma.storeProduct.findMany({
                where: {
                    storeId: store.id,
                    inStock: true,
                    ...(category && {
                        product: {
                            category: { equals: category, mode: 'insensitive' as const }
                        }
                    }),
                    ...(query && {
                        product: {
                            name: { contains: query, mode: 'insensitive' as const }
                        }
                    })
                },
                include: {
                    product: true
                },
                take: 50
            }),
            // Get all products for category extraction (lightweight query)
            prisma.storeProduct.findMany({
                where: {
                    storeId: store.id,
                    inStock: true
                },
                select: {
                    product: {
                        select: { category: true }
                    }
                },
                distinct: ['productId']
            })
        ]);

        const formattedProducts = products.map(sp => ({
            id: sp.product.id,
            name: sp.product.name,
            category: sp.product.category,
            image: sp.product.imageUrl || 'https://placehold.co/400',
            price: Number(sp.price),
            originalPrice: Number(sp.price) * 1.2,
            aisle: sp.aisle,
            inStock: sp.inStock
        }));

        const categories = [...new Set(categoryProducts.map(p => p.product.category))];

        return {
            store,
            products: formattedProducts,
            categories
        };
    } catch (error) {
        console.error('Error fetching store data:', error);
        return null;
    }
}

export default async function StoreFront({ params, searchParams }: StorePageProps) {
    const { storeId } = await params;
    const { q, category } = await searchParams;

    // OPTIMIZATION: Single database round-trip for all store data
    const data = await getStoreWithData(
        storeId,
        typeof category === 'string' ? category : undefined,
        typeof q === 'string' ? q : undefined
    );

    if (!data) return notFound();

    const { store, products: storeProducts, categories } = data;

    return (
        <div className="min-h-screen text-foreground selection:bg-primary/30 font-sans pb-32 relative">

            {/* Store Header */}
            <StoreHeader
                storeName={store.name}
                storeId={storeId}
                q={typeof q === 'string' ? q : undefined}
                category={typeof category === 'string' ? category : undefined}
            />

            {/* AI Personalized Feed */}
            <div className="pt-4 pb-6">
                <PersonalizedFeed storeId={storeId} />
            </div>

            {/* Category Filters */}
            <StoreFilters
                categories={categories}
                storeId={storeId}
                q={typeof q === 'string' ? q : undefined}
                activeCategory={typeof category === 'string' ? category : undefined}
            />

            {/* Product Grid */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Explore Items</h2>
                            <p className="text-xs text-muted-foreground">{storeProducts.length} products available</p>
                        </div>
                    </div>
                    {(q || category) && (
                        <Link
                            href={`/store/${storeId}`}
                            className="text-xs text-muted-foreground hover:text-rose-400 flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-rose-500/10 px-3 py-2 rounded-lg border border-white/10"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear Filters
                        </Link>
                    )}
                </div>

                {storeProducts.length === 0 ? (
                    <div className="premium-card text-center py-16 max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-3xl flex items-center justify-center">
                            <Search className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                        <p className="text-muted-foreground text-sm mb-8">Try searching for something else or browse all items.</p>
                        <Link
                            href={`/store/${storeId}`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            <Sparkles className="w-4 h-4" />
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