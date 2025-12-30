'use client';

import { Tag, Map, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    price: number;
    originalPrice: number;
    aisle: string | null;
    description?: string;
}

export default function ProductGrid({ products, storeId }: { products: Product[], storeId: string }) {
    const { items, addItem, decrementItem } = useCart();

    const getQuantity = (productId: number) => {
        const cartItem = items.find(i => i.productId === productId);
        return cartItem?.quantity || 0;
    };

    const handleAdd = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        }, storeId);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {products.map((product) => {
                const savings = product.originalPrice - product.price;
                const discountPercent = Math.round((savings / product.originalPrice) * 100);
                const quantity = getQuantity(product.id);

                return (
                    <div key={product.id} className="group block h-full select-none">
                        <div className="glass-card rounded-2xl overflow-hidden relative h-full flex flex-col hover:border-primary/30 transition-all duration-300">

                            <Link href={`/product/${product.id}`}>
                                <div className="aspect-[4/4] bg-muted overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {discountPercent > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                                            {discountPercent}% OFF
                                        </div>
                                    )}

                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                                        {product.category}
                                    </div>
                                </div>
                            </Link>

                            <div className="p-3 flex flex-col flex-grow">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-bold text-sm md:text-base mb-1 leading-snug text-foreground line-clamp-2 min-h-[2.5em]">{product.name}</h3>
                                </Link>

                                {product.aisle && (
                                    <div className="mb-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                        <Map className="w-3 h-3 text-primary" />
                                        <span>Aisle {product.aisle}</span>
                                    </div>
                                )}

                                <div className="mt-auto flex items-end justify-between gap-2">
                                    <div className="flex flex-col">
                                        {discountPercent > 0 && (
                                            <div className="text-[10px] text-muted-foreground line-through decoration-red-500/50">₹{product.originalPrice.toLocaleString()}</div>
                                        )}
                                        <div className="text-base font-bold text-foreground">₹{product.price.toLocaleString()}</div>
                                    </div>

                                    {/* Swiggy/Zomato Style Button */}
                                    {quantity > 0 ? (
                                        <div className="flex items-center bg-primary rounded-xl overflow-hidden shadow-md">
                                            <button
                                                onClick={() => decrementItem(product.id)}
                                                className="w-8 h-9 flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors active:scale-95"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-bold text-primary-foreground text-sm">{quantity}</span>
                                            <button
                                                onClick={() => handleAdd(product)}
                                                className="w-8 h-9 flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors active:scale-95"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAdd(product)}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                        >
                                            ADD
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
