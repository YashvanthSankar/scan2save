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
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function UserDashboard() {
  const router = useRouter();

  // Mock User Data
  const user = {
    name: "Yashvanth",
    totalSaved: 1250,
    points: 450
  };

  return (
    <div className="min-h-screen text-foreground font-sans pb-32 overflow-x-hidden selection:bg-emerald-500/30">



      {/* --- HEADER --- */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-end">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide">Good Evening,</p>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            {user.name}
          </h1>
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="relative z-10 px-4 grid grid-cols-2 gap-3">

        {/* 1. Total Saved (Large Card - Spans 2 cols) */}
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
              <h2 className="text-4xl font-bold text-foreground tracking-tight">₹{user.totalSaved}</h2>
              <p className="text-emerald-400 text-sm font-medium mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12% this month</span>
              </p>
            </div>

            {/* Sparkline Visual (CSS-based) */}
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

        {/* 2. Points (Small Card) */}
        <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/20 blur-2xl rounded-full group-hover:bg-emerald-500/30 transition-colors" />
          <div className="p-2 w-fit bg-emerald-500/10 rounded-xl mb-2">
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold">Rewards</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{user.points} pts</p>
          </div>
        </div>

        {/* 3. Wallet / Voucher (Small Card) */}
        <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-36 relative overflow-hidden hover:border-purple-500/30 transition-colors">
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-purple-500/20 blur-2xl rounded-full" />
          <div className="p-2 w-fit bg-purple-500/10 rounded-xl mb-2">
            <Wallet className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-muted-foreground text-xs font-semibold">Vouchers</span>
            <p className="text-xl font-bold text-foreground mt-0.5">2 Active</p>
          </div>
        </div>

      </div>

      {/* --- RECENT TRANSACTIONS (Pill Rows) --- */}
      <div className="relative z-10 px-6 mt-8">
        <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          Recent Activity
          <div className="h-[1px] flex-1 bg-border" />
        </h3>

        <div className="space-y-3">
          {[
            { store: 'Starbucks', loc: 'Indiranagar', time: '2h ago', amount: '₹140', icon: '☕' },
            { store: 'FreshMart', loc: 'Koramangala', time: 'Yesterday', amount: '₹1,240', icon: '🛒' },
            { store: 'Amazon Pay', loc: 'Online', time: '2 days ago', amount: '₹890', icon: '📦' },
          ].map((item, i) => (
            <div key={i} className="group flex items-center justify-between p-1 pr-4 rounded-2xl bg-card/40 border border-border hover:bg-card/60 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.store}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.loc}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-sm text-foreground">{item.amount}</span>
                <span className="text-[10px] text-emerald-500 font-medium">Saved 10%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FLOATING ACTION BUTTON (LENS STYLE) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Link
          href="/scan"
          className="group relative flex items-center justify-center w-20 h-20 bg-secondary rounded-full border border-border shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95"
        >
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-glow" />

          {/* Lens Body */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-background flex items-center justify-center relative overflow-hidden shadow-inner">
            {/* Lens Flare Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full" />

            {/* Icon */}
            <QrCode className="w-8 h-8 text-foreground z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

            {/* Inner Ring */}
            <div className="absolute inset-2 border border-white/20 rounded-full" />
          </div>

          {/* Label (Optional tooltip or text below) */}
          <div className="absolute -bottom-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            Scan
          </div>
        </Link>
      </div>

    </div>
  );
}