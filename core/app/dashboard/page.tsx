'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  MoreHorizontal, 
  Store,
  Wallet
} from 'lucide-react';

// --- Types for our Mock Data ---
type Offer = {
  id: number;
  product: string;
  store: string;
  originalPrice: number;
  discountPrice: number;
  expiry: string;
  discountPercent: number;
};

type Purchase = {
  id: string;
  date: string;
  store: string;
  total: number;
  saved: number;
  items: number;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [history, setHistory] = useState<Purchase[]>([]);

  // --- Simulate Data Fetching ---
  useEffect(() => {
    // In a real app, you would fetch from your API here
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay

        // Mock Offers
        setOffers([
          { id: 1, product: "Organic Brown Rice (5kg)", store: "More Supermarket", originalPrice: 650, discountPrice: 499, expiry: "Expires in 2 days", discountPercent: 23 },
          { id: 2, product: "Tata Tea Gold (500g)", store: "Reliance Fresh", originalPrice: 380, discountPrice: 299, expiry: "Expires today", discountPercent: 21 },
          { id: 3, product: "Aashirvaad Atta (10kg)", store: "DMart", originalPrice: 580, discountPrice: 450, expiry: "Expires in 5 days", discountPercent: 22 },
        ]);

        // Mock History
        setHistory([
          { id: "ORD-7782", date: "Today, 10:30 AM", store: "Reliance Smart", total: 1240, saved: 150, items: 8 },
          { id: "ORD-7781", date: "Yesterday", store: "Local Kirana", total: 450, saved: 30, items: 3 },
          { id: "ORD-7750", date: "24 Dec 2025", store: "DMart", total: 3400, saved: 420, items: 15 },
          { id: "ORD-7712", date: "20 Dec 2025", store: "More Supermarket", total: 890, saved: 90, items: 5 },
        ]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8 font-sans selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[25%] h-[25%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-indigo-400">Yashvanth</span>
            </h1>
            <p className="text-slate-400 mt-1">Here&apos;s what we found for you today.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Balance: ₹450</span>
             </button>
             <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                <Store className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Savings', value: '₹2,450', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Active Offers', value: '12 Available', icon: Tag, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
            { label: 'Shopping Trips', value: '8 this month', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personalized Offers (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                Personalized Offers
              </h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">View All</button>
            </div>

            {loading ? (
              // Loading Skeleton for Offers
              [1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-slate-900/50 rounded-2xl animate-pulse" />
              ))
            ) : offers.length > 0 ? (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="group bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {/* Fake Product Image */}
                    <div className="w-full sm:w-20 h-20 bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <ShoppingBag className="text-slate-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white truncate">{offer.product}</h3>
                          <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                            <Store className="w-3 h-3" /> {offer.store}
                          </p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                          {offer.discountPercent}% OFF
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-white">₹{offer.discountPrice}</span>
                          <span className="text-sm text-slate-500 line-through">₹{offer.originalPrice}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {offer.expiry}
                          </span>
                          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                            Claim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-400">No new offers right now.</p>
              </div>
            )}
          </div>

          {/* Right Column: Purchase History (1/3 width) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Recent Activity
              </h2>
              <button className="p-1 hover:bg-slate-800 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex justify-between items-center animate-pulse">
                      <div className="h-10 w-10 bg-slate-800 rounded-full" />
                      <div className="h-4 w-32 bg-slate-800 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-800/50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
                          {item.store}
                        </h4>
                        <span className="text-white font-bold">₹{item.total}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">{item.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 text-xs bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                            Saved ₹{item.saved}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {history.length === 0 && (
                     <div className="p-6 text-center text-slate-500 text-sm">
                        No recent transactions found.
                     </div>
                  )}

                  <button className="w-full py-3 text-center text-sm font-medium text-indigo-400 hover:bg-slate-800/80 transition-colors">
                    View Full History
                  </button>
                </div>
              )}
            </div>

            {/* Promo Card (Upsell) */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/20">
                <h3 className="font-bold text-lg mb-2">Scan & Win!</h3>
                <p className="text-indigo-100 text-sm mb-4">Upload your next bill within 24 hours to unlock a mystery reward.</p>
                <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                    Upload Bill Now
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}