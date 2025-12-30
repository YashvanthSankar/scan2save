'use client';

import { Tag, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    const handleAddToCart = (product: Product) => {
        // TODO: Implement cart context
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {products.map((product) => {
                const savings = product.originalPrice - product.price;
                const discountPercent = Math.round((savings / product.originalPrice) * 100);

                return (
                    <div key={product.id} className="group block h-full">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 relative h-full flex flex-col">

                            <Link href={`/product/${product.id}`}>
                                <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {discountPercent > 0 && (
                                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {discountPercent}% OFF
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded border border-white/10">
                                        {product.category}
                                    </div>
                                </div>
                            </Link>

                            <div className="p-5 flex flex-col flex-grow">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                                </Link>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-4 h-8">{product.description || product.category}</p>

                                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-800/50">
                                    <Map className="w-3 h-3 text-emerald-400" />
                                    <span>Aisle: <span className="text-slate-300 font-medium">{product.aisle || "General"}</span></span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-end justify-between">
                                    <div>
                                        {discountPercent > 0 && (
                                            <div className="text-xs text-slate-500 line-through mb-0.5">₹{product.originalPrice.toLocaleString()}</div>
                                        )}
                                        <div className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
