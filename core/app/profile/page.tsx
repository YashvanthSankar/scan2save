import Link from 'next/link';
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getUserProfile } from '@/lib/data';
import LogoutButton from './LogoutButton';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const data = await getUserProfile(session.userId);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load profile.</p>
      </div>
    );
  }

  const { user, stats, history } = data;

  return (
    <div className="min-h-screen text-foreground font-sans pb-24 relative">

      {/* Header */}
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-xl z-10 border-b border-white/5">
        <Link href="/dashboard" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-muted-foreground hover:text-foreground transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="p-6 space-y-6">

        {/* User Card */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-violet-500/30">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
              </div>
              {/* Status dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-background flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground truncate">{user.name || 'User'}</h2>
              <p className="text-muted-foreground text-sm">{user.phone}</p>
              <div className="flex items-center gap-2 mt-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-muted-foreground">
                  Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="premium-card p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total Savings</p>
              </div>
              <p className="text-3xl font-bold text-emerald-400">₹{stats?.totalSaved?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="premium-card p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Points</p>
              </div>
              <p className="text-3xl font-bold gradient-text">{stats?.points?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          {history.length === 0 ? (
            <div className="premium-card text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No recent activity found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <Link
                  key={item.id}
                  href={`/orders/${item.id}`}
                  className="premium-card flex items-center justify-between p-4 group hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                      <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{item.total.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.items} items</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}