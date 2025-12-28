'use client';

import Link from 'next/link';
import { 
  QrCode, 
  History, 
  TrendingUp, 
  MapPin, 
  ChevronRight,
  LogOut,
  UploadCloud,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();

  // Mock User Data (In real app, fetch from API)
  const user = {
    name: "Yashvanth",
    totalSaved: 1250,
    points: 450
  };

  const handleLogout = async () => {
    // Clear cookies/session logic
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* 1. Header & Stats */}
      <div className="bg-slate-900 pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-2xl shadow-black/50 border-b border-slate-800 relative overflow-hidden">
        
        {/* Background Blob */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold">{user.name}</h1>
          </div>
          <div className="flex gap-3">
            {/* Profile Link */}
            <Link 
              href="/profile"
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <User size={20} />
            </Link>
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg border border-white/10 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-white/10">
            <TrendingUp size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Total Savings</p>
            <h2 className="text-4xl font-bold text-white">₹{user.totalSaved}</h2>
            <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
              <span>💎 {user.points} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Actions */}
      <div className="px-6 -mt-8 relative z-20 space-y-4">
        
        {/* Primary: SCAN TO SHOP */}
        <Link 
          href="/scan" 
          className="group bg-white text-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-between hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-xl group-hover:bg-indigo-200 transition-colors text-indigo-600">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Scan Store QR</h3>
              <p className="text-slate-500 text-sm">Check-in to start shopping</p>
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          </div>
        </Link>

      </div>

      {/* 3. Recent Activity */}
      <div className="px-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Recent Visits
        </h3>

        <div className="space-y-3">
          {[
            { store: 'Reliance Smart', loc: 'Bandra West', date: 'Yesterday', saved: 45 },
            { store: 'DMart HSR', loc: 'Bangalore', date: '2 days ago', saved: 120 },
            { store: 'Local Kirana', loc: 'Indiranagar', date: 'Last Week', saved: 12 },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex justify-between items-center hover:bg-slate-900/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2.5 rounded-lg text-slate-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.store}</h4>
                  <p className="text-slate-500 text-xs">{item.date} • {item.loc}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-emerald-400 font-bold text-sm">+₹{item.saved}</span>
                <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Saved</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}