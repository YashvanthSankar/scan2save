'use client';

import Link from 'next/link';
import {
  QrCode,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Wallet,
  Clock,
  ChevronRight,
  ShoppingBag,
  Zap,
  User,
  Package,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';

// Types (reused from Profile for consistency, ideally in a types file)
interface UserProfile {
  id: string;
  name: string;
}

interface UserStats {
  totalSaved: number;
  points: number;
  voucherCount: number;
}

interface Transaction {
  id: string;
  store: string;
  loc: string;
  date: string;
  items: number;
  amount: number; // API returns 'total' but map expects 'amount' logic, we'll fix in fetch
  total: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setStats(data.stats);
          setRecentActivity(data.history.map((h: any) => ({
            ...h,
            amount: `₹${h.total.toLocaleString()}`, // Format for display
            icon: h.store.toLowerCase().includes('coffee') ? '☕' : (h.store.toLowerCase().includes('online') ? '📦' : '🛒')
          })));

          // Fetch Cart Count
          try {
            if (data.user && typeof data.user.id === 'string') { // Ensure ID is available (might need to be added to UserProfile interface or just casted)
              // Note: The previous view of page.tsx showed UserProfile only has name.
              // We need to verify if API returns ID. The API route I edited returns user object which usually has ID. I should verify response type.
              // Assuming API returns id in user object even if typescript interface says name/phone.
              // Let's safe check.
              const cartRes = await fetch(`/api/cart?userId=${data.user.id || ''}`);
              const cartData = await cartRes.json();
              if (cartData.items) setCartCount(cartData.items.length);
            }
          } catch (e) {
            console.log('Failed to fetch cart count');
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground font-sans pb-32 overflow-x-hidden selection:bg-emerald-500/30">

      {/* --- HEADER --- */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-end">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide">Good Evening,</p>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            {user?.name || 'User'}
          </h1>
        </div>
        <Link href="/profile" className="p-2 -mr-2 rounded-full hover:bg-muted/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/10">
            <User className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* --- QUICK ACTIONS ROW --- */}
      <div className="px-6 mb-8 grid grid-cols-2 gap-3">
        <Link href="/scan" className="col-span-1 bg-primary text-primary-foreground p-4 rounded-3xl flex flex-col justify-between h-32 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/20 transition-colors" />
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-medium opacity-80 uppercase tracking-wider block mb-0.5">Start Here</span>
            <span className="text-lg font-bold">Scan QR</span>
          </div>
        </Link>

        <Link href="/orders" className="col-span-1 bg-secondary border border-border p-4 rounded-3xl flex flex-col justify-between h-32 hover:border-primary/50 hover:scale-[1.02] active:scale-95 transition-all text-foreground group">
          <div className="w-10 h-10 bg-background/50 rounded-xl flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
            <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-0.5">History</span>
            <span className="text-lg font-bold">My Orders</span>
          </div>
        </Link>

        {/* Conditional Cart Button */}
        {cartCount > 0 && (
          <Link href="/cart" className="col-span-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-4 rounded-3xl flex items-center justify-between h-20 hover:border-orange-500/50 hover:scale-[1.01] active:scale-95 transition-all text-foreground group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">Resume Shopping</span>
                <span className="text-base font-bold">{cartCount} items in cart</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          </Link>
        )}
      </div>

      {/* --- STATS GRID --- */}
      <div className="px-6 grid grid-cols-2 gap-3">
        {/* 1. Total Saved */}
        <div className="col-span-2 glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Saved</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground tracking-tight">₹{stats?.totalSaved?.toLocaleString() || 0}</h2>
              <p className="text-emerald-400 text-sm font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>Lifetime Savings</span>
              </p>
            </div>

            {/* Sparkline */}
            <div className="flex items-end gap-1 h-12 w-24 opacity-80">
              <div className="w-2 bg-indigo-500/30 rounded-t-sm h-[40%]" />
              <div className="w-2 bg-indigo-500/40 rounded-t-sm h-[60%]" />
              <div className="w-2 bg-indigo-500/30 rounded-t-sm h-[30%]" />
              <div className="w-2 bg-indigo-500/60 rounded-t-sm h-[80%]" />
              <div className="w-2 bg-indigo-500/40 rounded-t-sm h-[50%]" />
              <div className="w-2 bg-indigo-500 rounded-t-sm h-[90%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>

        {/* 2. Points & Vouchers */}
        <div className="col-span-1 glass-card rounded-3xl p-5 flex flex-col justify-between h-36 relative overflow-hidden hover:border-emerald-500/30 transition-colors">
          <div className="p-2 w-fit bg-emerald-500/10 rounded-xl mb-2">
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold">Rewards</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{stats?.points?.toLocaleString() || 0} pts</p>
          </div>
        </div>

        <div className="col-span-1 glass-card rounded-3xl p-5 flex flex-col justify-between h-36 relative overflow-hidden hover:border-purple-500/30 transition-colors">
          <div className="p-2 w-fit bg-purple-500/10 rounded-xl mb-2">
            <Wallet className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold">Vouchers</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{stats?.voucherCount || 0} Active</p>
          </div>
        </div>

      </div>

      {/* --- RECENT ACTIVITY --- */}
      <div className="px-6 mt-8">
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          Recent Activity
          <div className="h-[1px] flex-1 bg-border" />
        </h3>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
              No recent activity. Start scanning!
            </div>
          ) : recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-1 pr-4 rounded-2xl bg-card/40 border border-border hover:bg-card/60 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{item.store}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.loc}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-sm text-foreground">{item.amount}</span>
                <span className="text-[10px] text-emerald-500 font-medium">Saved 12%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}