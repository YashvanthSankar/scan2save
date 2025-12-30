'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Clock, Store, ArrowRight, BrainCircuit, Loader2, ShoppingCart } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  discount_percentage: number;
  relevanceScore: number;
  product: {
    id: string;
    name: string;
    category: string;
    description: string;
    image_url: string;
  };
  price: number;
  originalPrice: number;
  aisle: string;
}

export default function PersonalizedOffersPage({ params }: { params: Promise<{ storeId: string }> }) {
  const [storeId, setStoreId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Offer[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = '00000000-0000-0000-0000-000000000002';

  useEffect(() => {
    params.then(({ storeId }) => {
      setStoreId(storeId);
      fetchRecommendations(storeId);
      fetchStoreInfo(storeId);
    });
  }, [params]);

  const fetchStoreInfo = async (id: string) => {
    try {
      const res = await fetch(`/api/stores/${id}`);
      const data = await res.json();
      if (data.success) setStoreName(data.store.name);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRecommendations = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/recommendations?userId=${userId}&storeId=${id}`);
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
        setPersonas(data.userPersonas || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-foreground text-lg font-medium">Analyzing your shopping profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground font-sans pb-24 relative">
      <div className="bg-gradient-to-br from-blue-900/20 to-secondary/20 pt-8 pb-16 px-6 rounded-b-3xl border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href={`/store/${storeId}`} className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm mb-6 transition-colors">
            <Store className="w-4 h-4" />
            Browse All Products
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4 border border-blue-500/20">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Your Personal Offers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based on your shopping history, we have curated these exclusive deals.
            </p>
          </div>
          {personas.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {personas.map((persona: any, i: number) => (
                <div key={i} className="bg-background/40 backdrop-blur-md border border-border px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <BrainCircuit className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-foreground">{persona.type}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(persona.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {recommendations.length === 0 ? (
          <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border p-12 text-center shadow-lg">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Building Your Profile</h3>
            <p className="text-muted-foreground mb-6">Make purchases to unlock personalized recommendations.</p>
            <Link href={`/store/${storeId}`} className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((offer, index) => {
              const savings = offer.originalPrice - offer.price;
              return (
                <Link key={offer.id} href={`/product/${offer.product.id}`} className="group">
                  <div className="bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border hover:border-blue-500/50 transition-all shadow-sm hover:shadow-lg">
                    {index < 3 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow-md">
                        <TrendingUp className="w-3 h-3" />
                        TOP PICK
                      </div>
                    )}
                    <div className="aspect-video bg-muted relative">
                      <img src={offer.product.image_url} alt={offer.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold text-blue-500 uppercase">{offer.product.category}</span>
                      <h3 className="font-bold text-lg mt-1 text-foreground">{offer.product.name}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{offer.product.description}</p>
                      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                        <div>
                          <div className="text-xs text-muted-foreground line-through">₹{offer.originalPrice.toLocaleString()}</div>
                          <div className="text-2xl font-bold text-foreground">₹{offer.price.toLocaleString()}</div>
                        </div>
                        <div className="bg-blue-600 p-3 rounded-full text-white shadow-md group-hover:bg-blue-500 transition-colors"><ArrowRight className="w-5 h-5" /></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
