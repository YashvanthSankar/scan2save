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
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 mt-1">Overview of your retail network.</p>
        </div>
        <Link
          href="/admin/generate-qr"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
        >
          <QrCode className="w-4 h-4" />
          Generate Store QR
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Stores', value: stats?.stores ?? 0, icon: Store, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Registered Users', value: stats?.users ?? 0, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Total Transactions', value: stats?.transactions ?? 0, icon: ShoppingCart, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Stores Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Stores</h3>
          <Link href="/admin/stores" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Store Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{store.name}</td>
                  <td className="px-6 py-4">{store.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${store.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                      {store.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/store/${store.storeId}`} className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
                      View <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {recentStores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No stores registered yet. <Link href="/admin/stores" className="text-indigo-400">Add one now →</Link>
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