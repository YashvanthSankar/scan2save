'use client';

import { ChevronRight } from 'lucide-react';
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
        <div className="sticky top-[72px] md:top-[116px] z-40 bg-background/95 backdrop-blur-xl border-b border-border py-2 mb-6 shadow-sm transition-all">
            <div className="container mx-auto px-4 flex items-center justify-between gap-4">

                {/* Mobile Dropdown (Visible mainly on small screens) */}
                <div className="md:hidden w-full">
                    <div className="relative">
                        <select
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full appearance-none bg-muted/50 border border-border text-foreground px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
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

                {/* Desktop/Tablet Horizontal Scroll (Hidden on small mobile) */}
                <div className="hidden md:flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <Link
                        href={`/store/${storeId}${q ? `?q=${q}` : ''}`}
                        className={`px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-colors border ${!activeCategory
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        All
                    </Link>

                    {categories.map((cat: string) => (
                        <Link
                            key={cat}
                            href={`/store/${storeId}?category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ''}`}
                            className={`px-4 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${activeCategory === cat
                                ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                                : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
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
