'use client';

import { Tag, Map, Minus, Plus, ShoppingCart } from 'lucide-react';
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => {
                const savings = product.originalPrice - product.price;
                const discountPercent = Math.round((savings / product.originalPrice) * 100);
                const quantity = getQuantity(product.id);

                return (
                    <div
                        key={product.id}
                        className="group block h-full select-none animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                    >
                        <div className="premium-card h-full flex flex-col">
                            {/* Image Container */}
                            <Link href={`/product/${product.id}`} className="block">
                                <div className="aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden relative rounded-t-[1.25rem]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Discount Badge */}
                                    {discountPercent > 0 && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/30 flex items-center gap-1">
                                            <span className="animate-pulse">🔥</span>
                                            {discountPercent}% OFF
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-lg border border-white/10">
                                        {product.category}
                                    </div>
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-bold text-sm md:text-base mb-1.5 leading-snug text-foreground line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Aisle Info */}
                                {product.aisle && (
                                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                                            <Map className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="font-medium">Aisle {product.aisle}</span>
                                    </div>
                                )}

                                {/* Price & Add Button */}
                                <div className="mt-auto flex items-end justify-between gap-2">
                                    <div className="flex flex-col">
                                        {discountPercent > 0 && (
                                            <div className="text-[10px] text-muted-foreground line-through decoration-rose-500/60">
                                                ₹{product.originalPrice.toLocaleString()}
                                            </div>
                                        )}
                                        <div className="text-lg font-bold text-foreground">
                                            ₹{product.price.toLocaleString()}
                                        </div>
                                        {discountPercent > 0 && (
                                            <div className="text-[9px] text-emerald-400 font-medium">
                                                Save ₹{savings.toLocaleString()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity Controls */}
                                    {quantity > 0 ? (
                                        <div className="flex items-center bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/25">
                                            <button
                                                onClick={() => decrementItem(product.id)}
                                                className="w-9 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-7 text-center font-bold text-white text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleAdd(product)}
                                                className="w-9 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAdd(product)}
                                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white h-10 px-5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-1.5 group/btn"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
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
