'use client';

import { useEffect, useState } from 'react';
import { Tag, Sparkles, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Offer {
    id: number;
    title: string;
    discountPercentage: number;
    relevanceScore: number;
    product: {
        id: number;
        name: string;
        imageUrl: string | null;
        category: string;
    };
}

export default function PersonalizedFeed({ storeId }: { storeId: string }) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState<string>('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        qrPayload: {
                            storeId: storeId,
                            timestamp: Date.now(),
                            name: 'Store' // Placeholder
                        }
                    })
                });

                const data = await res.json();

                if (data.success) {
                    setOffers(data.offers);
                    setPersona(data.persona);
                } else {
                    // If not logged in or other error, mostly silent or show login prompt
                    if (res.status === 401) {
                        setError('Please login to see personalized deals');
                    }
                }
            } catch (err) {
                console.error("Failed to load offers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [storeId]);

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>;
    if (!offers.length && !error) return null; // No offers, hide section

    return (
        <div className="container mx-auto px-4 mt-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white leading-none">Just For You</h2>
                    {persona && (
                        <p className="text-xs text-indigo-400 mt-1 font-medium">
                            Curated based on your <span className="text-white bg-indigo-500/20 px-1 rounded">{persona}</span> needs
                        </p>
                    )}
                </div>
            </div>

            {error ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                    <p className="text-slate-400 mb-4">{error}</p>
                    <Link href={`/login?next=/store/${storeId}`} className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20">
                        Login / Signup
                    </Link>
                </div>
            ) : (
                /* Offers Horizontal Scroll */
                <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 snap-x [&::-webkit-scrollbar]:hidden">
                    {offers.map((offer) => (
                        <div key={offer.id} className="min-w-[280px] md:min-w-[320px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative snap-center shadow-xl hover:shadow-indigo-500/10 transition-shadow">
                            {/* Badge */}
                            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {offer.discountPercentage}% OFF
                            </div>

                            {/* Image Area */}
                            <div className="h-40 bg-slate-800 relative">
                                <img
                                    src={offer.product.imageUrl || `https://placehold.co/400x300?text=${encodeURIComponent(offer.product.name)}`}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="p-5 relative -mt-12">
                                <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 mb-3 border border-white/5">
                                    <h3 className="font-bold text-lg leading-tight mb-1">{offer.title}</h3>
                                    <p className="text-xs text-slate-400">Valid on {offer.product.name}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                                        {offer.product.category}
                                    </div>
                                    <button
                                        onClick={() => {
                                            // TODO: Add to cart via context
                                            alert(`Added ${offer.product.name} to cart with ${offer.discountPercentage}% off!`);
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                                    >
                                        <ShoppingBag className="w-3 h-3" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
