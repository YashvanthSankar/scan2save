import Link from 'next/link';
import {
  QrCode,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  ChevronRight,
  ShoppingBag,
  Zap,
  User,
  Package,
  Sparkles,
  Clock
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getUserDashboardData } from '@/lib/data';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default async function UserDashboard() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/');
  }

  const data = await getUserDashboardData(session.userId);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load dashboard data.</p>
      </div>
    );
  }

  const { user, stats, history: recentActivity, cartCount } = data;
  const greeting = getGreeting();

  return (
    <div className="min-h-screen text-foreground font-sans pb-32 overflow-x-hidden selection:bg-primary/30">

      {/* --- HEADER --- */}
      <div className="relative z-10 px-6 pt-12 pb-8 flex justify-between items-end">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {greeting},
          </p>
          <h1 className="text-3xl font-bold gradient-text">
            {user?.name || 'User'}
          </h1>
        </div>
        <Link href="/profile" className="p-1 rounded-full hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 border border-white/10">
            <User className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* --- QUICK ACTIONS ROW --- */}
      <div className="px-6 mb-8 grid grid-cols-2 gap-4">
        {/* Scan QR - Primary Action */}
        <Link
          href="/scan"
          className="col-span-1 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white p-5 rounded-3xl flex flex-col justify-between h-36 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all group"
        >
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-colors" />

          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-semibold opacity-70 uppercase tracking-widest block mb-1">Start Here</span>
            <span className="text-lg font-bold">Scan QR</span>
          </div>
        </Link>

        {/* My Orders */}
        <Link
          href="/orders"
          className="col-span-1 premium-card p-5 flex flex-col justify-between h-36 hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
            <Package className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">History</span>
            <span className="text-lg font-bold text-foreground">My Orders</span>
          </div>
        </Link>

        {/* Conditional Cart Button */}
        {cartCount > 0 && (
          <Link
            href="/cart"
            className="col-span-2 premium-card p-5 flex items-center justify-between h-20 hover:scale-[1.01] active:scale-[0.99] transition-all group relative overflow-hidden"
          >
            {/* Gradient accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />

            <div className="flex items-center gap-4 pl-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Resume Shopping</span>
                <span className="text-base font-bold text-foreground">{cartCount} items in cart</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </Link>
        )}
      </div>

      {/* --- STATS GRID --- */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {/* 1. Total Saved - Hero Card */}
        <div className="col-span-2 premium-card p-6 relative overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Saved</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-1">
                ₹{stats?.totalSaved?.toLocaleString() || 0}
              </h2>
              <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                <span>Lifetime Savings</span>
              </p>
            </div>

            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-16 w-28 opacity-60 group-hover:opacity-100 transition-opacity">
              {[40, 60, 35, 80, 55, 95, 70].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-500/30 to-emerald-400/80 rounded-t-sm transition-all duration-300 group-hover:from-emerald-500/50 group-hover:to-emerald-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Points */}
        <div className="col-span-1 premium-card p-5 flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="p-2.5 w-fit bg-amber-500/10 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rewards</span>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.points?.toLocaleString() || 0} <span className="text-base text-muted-foreground">pts</span></p>
          </div>
        </div>

        {/* 3. Vouchers */}
        <div className="col-span-1 premium-card p-5 flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="p-2.5 w-fit bg-violet-500/10 rounded-xl border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
            <Wallet className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Vouchers</span>
            <p className="text-2xl font-bold text-foreground mt-1">{stats?.voucherCount || 0} <span className="text-base text-muted-foreground">Active</span></p>
          </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY --- */}
      <div className="px-6 mt-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="premium-card text-center py-10 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h4 className="font-bold text-foreground mb-2">No Activity Yet</h4>
              <p className="text-muted-foreground text-sm mb-6">Start scanning to see your shopping history here.</p>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <QrCode className="w-4 h-4" />
                Scan First QR
              </Link>
            </div>
          ) : recentActivity.map((item, i) => (
            <div
              key={i}
              className="premium-card flex items-center justify-between p-4 group hover:scale-[1.01] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-2xl border border-white/5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{item.store}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{item.loc}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-foreground">{item.formattedAmount}</span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Saved 12%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}