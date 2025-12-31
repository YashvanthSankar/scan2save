'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingCart() {
    const { totalItems, totalAmount } = useCart();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (totalItems > 0 && pathname !== '/cart' && pathname !== '/checkout') {
            setIsVisible(true);
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 400);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [totalItems, pathname]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-fade-in-up md:left-auto md:right-6 md:w-auto">
            <Link
                href="/cart"
                className={`
                    group flex items-center justify-between gap-4 
                    bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 
                    hover:from-indigo-500 hover:via-indigo-400 hover:to-violet-500
                    text-white p-4 md:px-6 md:py-4 rounded-2xl 
                    shadow-[0_8px_32px_rgba(99,102,241,0.4)]
                    hover:shadow-[0_12px_40px_rgba(99,102,241,0.5)]
                    transition-all duration-300 
                    transform hover:scale-[1.02] active:scale-[0.98]
                    ${animate ? 'scale-105' : ''}
                    relative overflow-hidden
                `}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {/* Cart Icon with Badge */}
                <div className="relative flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div className={`
                            absolute -top-2 -right-2 
                            bg-white text-indigo-600 
                            text-[11px] font-bold 
                            min-w-[20px] h-5 
                            flex items-center justify-center 
                            rounded-full px-1
                            shadow-lg
                            ${animate ? 'animate-bounce-subtle' : ''}
                        `}>
                            {totalItems}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-xs text-white/70 font-medium">Your Cart</p>
                        <p className="font-bold text-sm">{totalItems} items</p>
                    </div>
                </div>

                {/* Amount & Arrow */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] text-white/60 uppercase tracking-wider font-medium md:hidden">Total</p>
                        <p className="font-bold text-lg">₹{totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
