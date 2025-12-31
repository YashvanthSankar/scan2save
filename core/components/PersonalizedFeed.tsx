'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Sparkles,
    ShoppingBag,
    Loader2,
    CheckCircle,
    Minus,
    Plus,
    Zap
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';

interface Offer {
    id: number;
    title: string;
    discountPercentage: number;
    relevanceScore: number;
    matchReason?: string;
    product: {
        id: number;
        name: string;
        imageUrl: string | null;
        category: string;
    };
}

interface CachedData {
    offers: Offer[];
    persona: string;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function PersonalizedFeed({ storeId }: { storeId: string }) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState<string>('');
    const [claimedOffers, setClaimedOffers] = useState<Record<number, string>>({});
    const [claiming, setClaiming] = useState<number | null>(null);
    const { items, addItem, decrementItem } = useCart();
    const hasFetched = useRef(false);

    useEffect(() => {
        // Prevent duplicate fetches in StrictMode or re-renders
        if (hasFetched.current) return;

        const cacheKey = `personalizedFeed_${storeId}`;

        const fetchOffers = async () => {
            // Check sessionStorage cache first
            try {
                const cachedStr = sessionStorage.getItem(cacheKey);
                if (cachedStr) {
                    const cached: CachedData = JSON.parse(cachedStr);
                    if (Date.now() - cached.timestamp < CACHE_DURATION) {
                        setOffers(cached.offers);
                        setPersona(cached.persona);
                        setLoading(false);
                        hasFetched.current = true;
                        return;
                    }
                }
            } catch (e) {
                // Ignore cache read errors
            }

            // Fetch from API
            try {
                const res = await fetch('/api/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        qrPayload: { storeId: storeId, timestamp: Date.now(), name: 'Store' },
                        userId: "00000000-0000-0000-0000-000000000002",
                    })
                });

                const data = await res.json();
                if (data.success) {
                    setOffers(data.offers);
                    setPersona(data.persona);

                    // Cache the response
                    try {
                        sessionStorage.setItem(cacheKey, JSON.stringify({
                            offers: data.offers,
                            persona: data.persona,
                            timestamp: Date.now()
                        }));
                    } catch (e) {
                        // Ignore cache write errors
                    }
                }
            } catch (err) {
                console.error("Failed to load offers", err);
            } finally {
                setLoading(false);
                hasFetched.current = true;
            }
        };

        fetchOffers();
    }, [storeId]);

    const handleClaim = (offerId: number) => {
        setClaiming(offerId);
        setTimeout(() => {
            setClaimedOffers(prev => ({
                ...prev,
                [offerId]: `SAVE-${offerId}-${Math.floor(Math.random() * 1000)}`
            }));
            setClaiming(null);
        }, 800);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <div className="premium-card flex flex-col items-center justify-center p-10">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-2xl animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce-subtle">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Curating Your Feed</h3>
                    <p className="text-muted-foreground text-sm text-center">
                        AI is analyzing personalized matches for you...
                    </p>
                </div>
            </div>
        );
    }

    if (offers.length === 0) return null;

    return (
        <div className="container mx-auto px-4 animate-fade-in">

            {/* Persona Banner */}
            <div className="premium-card p-6 relative overflow-hidden mb-6">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">AI Verified Match</span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Offers for <span className="gradient-text">{persona}</span>
                        </h2>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Based on your history</span>
                    </div>
                </div>
            </div>

            {/* Offers Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {offers.map((offer, index) => {
                    const isClaimed = !!claimedOffers[offer.id];
                    const cartItem = items.find(i => i.productId === offer.product.id);
                    const quantity = cartItem?.quantity || 0;

                    return (
                        <div
                            key={offer.id}
                            className={`
                                min-w-[280px] md:min-w-[300px] 
                                snap-center
                                premium-card overflow-hidden
                                transition-all duration-300
                                animate-fade-in-up opacity-0
                                ${isClaimed ? 'ring-1 ring-emerald-500/30' : ''}
                            `}
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                        >
                            {/* Image */}
                            <div className="h-36 relative overflow-hidden">
                                <img
                                    src={offer.product.imageUrl || `https://placehold.co/400x400/1e293b/ffffff?text=${encodeURIComponent(offer.product.name.substring(0, 2))}`}
                                    alt={offer.product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />

                                {/* Discount Badge */}
                                <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/30 flex items-center gap-1">
                                    <span className="animate-pulse">🔥</span>
                                    {offer.discountPercentage}% OFF
                                </div>

                                {/* Category */}
                                <div className="absolute bottom-3 right-3 text-[10px] font-medium text-white/80 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
                                    {offer.product.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-foreground leading-tight mb-2 line-clamp-1">
                                    {offer.title}
                                </h3>

                                {offer.matchReason && !isClaimed && (
                                    <p className="text-xs text-primary leading-snug line-clamp-2 mb-4 flex items-start gap-1.5">
                                        <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        {offer.matchReason}
                                    </p>
                                )}

                                {/* Action Button */}
                                <div className="mt-auto">
                                    {quantity > 0 ? (
                                        <div className="flex items-center bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-xl border border-indigo-500/30 overflow-hidden">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); decrementItem(offer.product.id); }}
                                                className="w-12 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 text-center font-bold text-white">{quantity}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addItem({
                                                        id: offer.product.id,
                                                        name: offer.product.name,
                                                        price: 0,
                                                        image: offer.product.imageUrl || undefined
                                                    }, storeId);
                                                }}
                                                className="w-12 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClaim(offer.id);
                                                addItem({
                                                    id: offer.product.id,
                                                    name: offer.product.name,
                                                    price: 0,
                                                    image: offer.product.imageUrl || undefined
                                                }, storeId);
                                            }}
                                            disabled={claiming === offer.id}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-70"
                                        >
                                            {claiming === offer.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
