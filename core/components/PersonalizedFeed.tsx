'use client';

import { useEffect, useState } from 'react';
import {
    Sparkles,
    Tag,
    ShoppingBag,
    Loader2,
    TrendingUp,
    CheckCircle,
    Clock,
    Gift,
    Ticket,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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

export default function PersonalizedFeed({ storeId }: { storeId: string }) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState<string>('');
    const [claimedOffers, setClaimedOffers] = useState<Record<number, string>>({});
    const [claiming, setClaiming] = useState<number | null>(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                // In a real app we'd maintain session, for this demo we assume user 1
                const res = await fetch('/api/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        qrPayload: { storeId: storeId, timestamp: Date.now(), name: 'Store' },
                        userId: "user-1", // Demo User
                    })
                });

                const data = await res.json();
                if (data.success) {
                    setOffers(data.offers);
                    setPersona(data.persona);
                }
            } catch (err) {
                console.error("Failed to load offers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [storeId]);

    const handleClaim = (offerId: number) => {
        setClaiming(offerId);
        // Simulate API Claim for Demo
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
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900/30 rounded-3xl border border-slate-800">
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 blur-xl animate-pulse-glow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-indigo-400 animate-bounce" />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Curating Your Feed</h3>
                <p className="text-slate-400 text-xs text-center">
                    AI is analyzing matches for <span className="text-white">Active Store</span>
                </p>
            </div>
        );
    }

    if (offers.length === 0) return null;

    return (
        <div className="container mx-auto px-4 mt-8 animate-in slide-in-from-bottom-4">

            {/* --- PERSONA BANNER --- */}
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden group mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">AI Verified Match</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">
                        Offers for <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{persona}</span>
                    </h2>
                    <p className="text-slate-400 text-sm flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Matched based on your purchase history
                    </p>
                </div>
            </div>

            {/* --- OFFERS LIST (Horizontal Scroll) --- */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {offers.map((offer, index) => {
                    const isClaimed = !!claimedOffers[offer.id];
                    const discountCode = claimedOffers[offer.id];

                    return (
                        <div
                            key={offer.id}
                            className={`min-w-[280px] md:min-w-[320px] relative rounded-3xl overflow-hidden transition-all duration-300 snap-center ${isClaimed
                                ? 'bg-slate-900 border border-emerald-500/30'
                                : 'glass-card hover:border-indigo-500/30'
                                }`}
                        >
                            <div className="flex flex-col h-full">
                                {/* Image Area */}
                                <div className="h-32 relative">
                                    <img
                                        src={offer.product.imageUrl || `https://placehold.co/400x400/1e293b/ffffff?text=${encodeURIComponent(offer.product.name.substring(0, 2))}`}
                                        alt={offer.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                                    <div className="absolute top-2 left-2">
                                        <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                            {offer.discountPercentage}% OFF
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-4 pt-0 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight mb-1 truncate">{offer.title}</h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
                                                {offer.product.category}
                                            </span>
                                        </div>
                                        {offer.matchReason && !isClaimed && (
                                            <p className="text-xs text-indigo-300 leading-snug line-clamp-2 h-8">
                                                ✨ {offer.matchReason}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        {isClaimed ? (
                                            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-2 flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
                                                    <span className="font-mono text-emerald-400 font-bold text-sm truncate">{discountCode}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleClaim(offer.id)}
                                                disabled={claiming === offer.id}
                                                className="w-full bg-white text-black hover:bg-slate-200 active:scale-95 transition-all py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                                            >
                                                {claiming === offer.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingBag className="w-3 h-3" />}
                                                {claiming === offer.id ? 'CLAIMING...' : 'CLAIM OFFER'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
