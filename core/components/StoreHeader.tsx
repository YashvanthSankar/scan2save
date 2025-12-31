'use client';

import Link from 'next/link';
import { ArrowLeft, User, Search, ShoppingCart, Menu, Sparkles, Store, X, Package } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default function StoreHeader({ storeName, storeId, q, category }: { storeName: string, storeId: string, q?: string, category?: string }) {
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(q || '');
    const router = useRouter();

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Navigate on debounced search change
    useEffect(() => {
        // Only navigate if the search query has changed from the initial value
        if (debouncedSearch !== (q || '')) {
            const params = new URLSearchParams();
            if (debouncedSearch) params.set('q', debouncedSearch);
            if (category) params.set('category', category);

            const queryString = params.toString();
            router.push(`/store/${storeId}${queryString ? `?${queryString}` : ''}`);
        }
    }, [debouncedSearch, storeId, category, router, q]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Slide-out Menu */}
            <div className={`
                fixed top-0 right-0 h-full w-64 bg-background border-l border-white/10 z-[70]
                transform transition-transform duration-300 ease-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <span className="font-bold text-foreground">Menu</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-2 space-y-1">
                    <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors text-foreground"
                    >
                        <ArrowLeft className="w-5 h-5 text-primary" />
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors text-foreground"
                    >
                        <Package className="w-5 h-5 text-primary" />
                        My Orders
                    </Link>
                </nav>
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">

                    {/* Left: Back & Title */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Link
                            href="/dashboard"
                            className="p-2.5 -ml-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-bold text-foreground text-lg leading-tight truncate">{storeName}</h1>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    <span>Scan2Save Partner</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/cart"
                            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background shadow-lg shadow-indigo-500/30">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/profile"
                            className="p-1 rounded-xl hover:scale-105 transition-transform"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-lg shadow-indigo-500/20">
                                <User className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="container mx-auto px-4 pb-4">
                    <div className="relative w-full group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none group-focus-within:bg-primary/20 transition-colors">
                            <Search className="w-4 h-4 text-primary" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search in ${storeName}...`}
                            className="input-premium w-full !pl-14 !pr-12 py-3.5 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
