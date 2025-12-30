'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Store,
  Users,
  QrCode,
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  ShoppingCart
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your retail network.</p>
        </div>
        <Link
          href="/admin/generate-qr"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          <QrCode className="w-4 h-4" />
          Generate Store QR
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Stores', value: stats?.stores ?? 0, icon: Store, bg: 'bg-blue-500/10 text-blue-500' },
          { label: 'Registered Users', value: stats?.users ?? 0, icon: Users, bg: 'bg-indigo-500/10 text-indigo-500' },
          { label: 'Total Transactions', value: stats?.transactions ?? 0, icon: ShoppingCart, bg: 'bg-emerald-500/10 text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl hover:border-primary/20 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Stores Table */}
      <div className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-foreground">Recent Stores</h3>
          <Link href="/admin/stores" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Store Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentStores.map((store) => (
                <tr key={store.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{store.name}</td>
                  <td className="px-6 py-4">{store.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${store.isActive
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/store/${store.storeId}`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1">
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