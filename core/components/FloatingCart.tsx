'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FloatingCart() {
    const { totalItems } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (totalItems > 0) {
            setIsVisible(true);
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300); // Reset animation class
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [totalItems]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
            <Link
                href="/cart"
                className={`group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105 ${animate ? 'scale-110' : ''}`}
            >
                <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-indigo-600">
                        {totalItems}
                    </div>
                </div>
                <span className="font-bold pr-1 hidden group-hover:inline-block transition-all max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">
                    View Cart
                </span>
            </Link>
        </div>
    );
}
