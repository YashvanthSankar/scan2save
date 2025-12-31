'use client';

import { ChevronRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StoreFiltersProps {
    categories: string[];
    storeId: string;
    q?: string;
    activeCategory?: string;
}

export default function StoreFilters({ categories, storeId, q, activeCategory }: StoreFiltersProps) {
    const router = useRouter();

    const handleCategoryChange = (val: string) => {
        const url = val
            ? `/store/${storeId}?category=${encodeURIComponent(val)}${q ? `&q=${q}` : ''}`
            : `/store/${storeId}${q ? `?q=${q}` : ''}`;
        router.push(url);
    };

    return (
        <div className="sticky top-[130px] md:top-[140px] z-40 bg-background/95 backdrop-blur-xl border-b border-white/5 py-3 mb-6">
            <div className="container mx-auto px-4 flex items-center justify-between gap-4">

                {/* Mobile Dropdown */}
                <div className="md:hidden w-full">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none">
                            <LayoutGrid className="w-4 h-4 text-primary" />
                        </div>
                        <select
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full appearance-none input-premium pl-14 pr-10 py-3"
                            value={activeCategory || ""}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Desktop/Tablet Horizontal Scroll */}
                <div className="hidden md:flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <Link
                        href={`/store/${storeId}${q ? `?q=${q}` : ''}`}
                        className={`px-5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${!activeCategory
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                            }`}
                    >
                        All Items
                    </Link>

                    {categories.map((cat: string) => (
                        <Link
                            key={cat}
                            href={`/store/${storeId}?category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ''}`}
                            className={`px-5 py-2 rounded-xl text-xs whitespace-nowrap transition-all font-medium ${activeCategory === cat
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                                }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
