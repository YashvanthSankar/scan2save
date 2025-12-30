'use client';

import { Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';

interface AddToCartButtonProps {
    product: {
        id: number;
        name: string;
        price: number;
        image?: string;
    };
    storeId: string;
}

export default function AddToCartButton({ product, storeId }: AddToCartButtonProps) {
    const { items, addItem, decrementItem } = useCart();
    const [adding, setAdding] = useState(false);

    const cartItem = items.find(i => i.productId === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = async () => {
        setAdding(true);
        await addItem(product, storeId);
        setTimeout(() => setAdding(false), 500);
    };

    if (quantity > 0) {
        return (
            <div className="flex items-center gap-1 bg-primary rounded-xl overflow-hidden">
                <button
                    onClick={() => decrementItem(product.id)}
                    className="w-12 h-12 flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors active:scale-95"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <span className="w-8 text-center font-bold text-primary-foreground text-lg">{quantity}</span>
                <button
                    onClick={handleAdd}
                    className="w-12 h-12 flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 disabled:opacity-70"
        >
            {adding ? (
                <>
                    <Check className="w-5 h-5" />
                    Added!
                </>
            ) : (
                <>
                    <Plus className="w-5 h-5" />
                    Add to Cart
                </>
            )}
        </button>
    );
}
