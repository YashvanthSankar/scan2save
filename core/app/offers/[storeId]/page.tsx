import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, TrendingUp, Store, ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// OPTIMIZATION: Server Component for initial data fetching
// Moved from client-side useEffect to server-side data fetching

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

interface Persona {
  type: string;
  confidence: number;
}

async function getStoreInfo(storeId: string) {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stores/${storeId}`, {
      cache: 'force-cache', // Cache store info
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const data = await res.json();
    return data.success ? data.store : null;
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
}

async function getRecommendations(userId: string, storeId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/recommendations?userId=${userId}&storeId=${storeId}`, {
      cache: 'no-store' // Always get fresh recommendations
    });
    const data = await res.json();
    return data.success ? { recommendations: data.recommendations, personas: data.userPersonas || [] } : { recommendations: [], personas: [] };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { recommendations: [], personas: [] };
  }
}

interface PageProps {
  params: Promise<{ storeId: string }>;
}

export default async function PersonalizedOffersPage({ params }: PageProps) {
  const { storeId } = await params;

  const session = await getSession();
  const userId = session?.userId || '00000000-0000-0000-0000-000000000002';

  // OPTIMIZATION: Parallel fetch for store info and recommendations
  const [store, { recommendations, personas }] = await Promise.all([
    getStoreInfo(storeId),
    getRecommendations(userId, storeId)
  ]);

  const storeName = store?.name || 'Store';

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
              {personas.map((persona: Persona, i: number) => (
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
            {recommendations.map((offer: Offer, index: number) => {
              const savings = offer.originalPrice - offer.price;
              return (
                <Link key={offer.id} href={`/product/${offer.product.id}`} className="group">
                  <div className="bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border hover:border-blue-500/50 transition-all shadow-sm hover:shadow-lg relative">
                    {index < 3 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow-md">
                        <TrendingUp className="w-3 h-3" />
                        TOP PICK
                      </div>
                    )}
                    {/* OPTIMIZATION: Using next/image for optimized images */}
                    <div className="aspect-video bg-muted relative">
                      <Image
                        src={offer.product.image_url || 'https://placehold.co/600x400'}
                        alt={offer.product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
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
