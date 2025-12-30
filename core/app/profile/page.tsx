'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Settings,
  ShoppingBag,
  Clock,
  ChevronRight,
  Receipt,
  Loader2,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Types matching API response
interface UserProfile {
  name: string;
  phone: string;
  memberSince: string;
  role: string;
}

interface UserStats {
  totalSaved: number;
  totalSpent: number;
  points: number;
  voucherCount: number;
}

interface Transaction {
  id: string;
  store: string;
  date: string;
  items: number;
  total: number;
  status: string;
}

// Inline Theme Toggle Row Component
function ThemeToggleRow() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
    >
      <div className="flex items-center gap-3">
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
        <span>Theme</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm capitalize">{theme}</span>
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-primary' : 'bg-muted'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>
    </button>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.status === 401 || res.status === 404) {
          // If user invalid, allow UI to render with null user so they can see Logout button
          // Or we could auto-logout. Let's auto-logout for 401, but show UI for 404 for debugging or just render a 'Guest' state.
          if (res.status === 404) {
            setUser({ name: 'Guest (Invalid Session)', phone: 'Please Logout', memberSince: new Date().toISOString(), role: 'GUEST' });
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setStats(data.stats);
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Allow rendering even if user is null (handle safely below) or use the fallback set above
  const displayUser = user || { name: 'Guest', phone: '', memberSince: new Date().toISOString(), role: 'GUEST' };

  return (
    <div className="min-h-screen text-foreground font-sans pb-24 relative">

      {/* Header */}
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
        <Link href="/dashboard" className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="p-6 space-y-6">

        {/* User Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl shadow-indigo-500/20 text-white">
            {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : <User />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{displayUser.name || 'User'}</h2>
            <p className="text-muted-foreground">{displayUser.phone}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(displayUser.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl shadow-sm">
            <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-emerald-500">₹{stats?.totalSaved?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl shadow-sm">
            <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Points</p>
            <p className="text-2xl font-bold text-primary">{stats?.points?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h3>

          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
              No recent activity found.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl flex items-center justify-between group hover:bg-muted/50 transition-colors cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.store}</h4>
                      <p className="text-muted-foreground text-xs">
                        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        {' • '}
                        {new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{item.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.items} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Links */}
        <div className="pt-4 border-t border-border space-y-2">
          {/* Theme Toggle */}
          <ThemeToggleRow />

          {/* LOGOUT BUTTON */}
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-500/10 transition-colors text-red-500"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold">Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}