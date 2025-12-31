'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Store,
  Users,
  QrCode,
  ArrowUpRight,
  Loader2,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  stores: number;
  users: number;
  transactions: number;
}

interface RecentStore {
  id: string;
  storeId: string;
  name: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentStores, setRecentStores] = useState<RecentStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentStores(data.recentStores);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl hidden sm:flex">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">Overview of your retail network.</p>
          </div>
        </div>
        <Link
          href="/admin/generate-qr"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          <QrCode className="w-4 h-4" />
          Generate Store QR
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Active Stores', value: stats?.stores ?? 0, icon: Store, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Registered Users', value: stats?.users ?? 0, icon: Users, gradient: 'from-indigo-500 to-violet-500' },
          { label: 'Total Transactions', value: stats?.transactions ?? 0, icon: ShoppingCart, gradient: 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => (
          <div
            key={i}
            className="premium-card p-5 md:p-6 group hover:border-primary/30 transition-all animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions - Mobile Only */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        <Link
          href="/admin/stores"
          className="premium-card p-4 flex flex-col items-center gap-2 text-center hover:border-primary/30 transition-all"
        >
          <Store className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Stores</span>
        </Link>
        <Link
          href="/admin/users"
          className="premium-card p-4 flex flex-col items-center gap-2 text-center hover:border-primary/30 transition-all"
        >
          <Users className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Users</span>
        </Link>
      </div>

      {/* Recent Stores */}
      <div className="premium-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-foreground">Recent Stores</h3>
          <Link href="/admin/stores" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/5">
          {recentStores.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No stores registered yet. <Link href="/admin/stores" className="text-primary">Add one now →</Link>
            </div>
          ) : (
            recentStores.map((store, index) => (
              <div
                key={store.id}
                className="p-4 flex items-center justify-between animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{store.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{store.location}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${store.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/store/${store.storeId}`}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-primary transition-colors ml-3"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Store Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentStores.map((store, index) => (
                <tr
                  key={store.id}
                  className="hover:bg-white/[0.02] transition-colors animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="px-6 py-4 font-bold text-foreground">{store.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{store.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${store.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/store/${store.storeId}`}
                      className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      View <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {recentStores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No stores registered yet. <Link href="/admin/stores" className="text-primary">Add one now →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}