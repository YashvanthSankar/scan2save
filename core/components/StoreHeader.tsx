'use client';

import Link from 'next/link';
import { ArrowLeft, User, Search, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';

export default function StoreHeader({ storeName, storeId, q, category }: { storeName: string, storeId: string, q?: string, category?: string }) {
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* Left: Back & Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-foreground text-lg leading-tight truncate">{storeName}</h1>
                        <p className="text-xs text-muted-foreground truncate">Scan & Save Partner</p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Link href="/cart" className="relative p-2 rounded-full hover:bg-muted text-foreground transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border border-background">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Link href="/profile" className="p-2 rounded-full hover:bg-muted text-foreground transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-sm">
                            Y
                        </div>
                    </Link>

                    {/* More Menu */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-16 right-4 w-48 bg-popover border border-border rounded-xl shadow-xl z-50 p-1 animate-in slide-in-from-top-2 fade-in duration-200">
                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors text-foreground">
                        Store Info
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors text-foreground">
                        Report Issue
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                        Leave Store
                    </button>
                </div>
            )}

            {/* Mobile Search Bar (Integrated) */}
            <div className="container mx-auto px-4 pb-3">
                <form action={`/store/${storeId}`} className="relative w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                        name="q"
                        defaultValue={q || ''}
                        type="text"
                        placeholder={`Search in ${storeName}...`}
                        className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                    />
                    {category && <input type="hidden" name="category" value={category} />}
                </form>
            </div>
        </div>
    );
}
