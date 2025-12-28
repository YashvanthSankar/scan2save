'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  ShoppingBag, 
  Clock, 
  ChevronRight,
  Receipt
} from 'lucide-react';

export default function ProfilePage() {
  // Mock Data
  const user = {
    name: "Yashvanth S",
    phone: "+91 98765 43210",
    memberSince: "Dec 2024"
  };

  const history = [
    { id: 'TXN_882', store: 'Reliance Smart', date: 'Today, 10:30 AM', items: 4, total: 450, status: 'Completed' },
    { id: 'TXN_119', store: 'DMart HSR', date: 'Yesterday, 6:15 PM', items: 12, total: 1240, status: 'Completed' },
    { id: 'TXN_002', store: 'Nilgiris', date: '22 Dec, 9:00 AM', items: 1, total: 40, status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      
      {/* Header */}
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10 border-b border-white/5">
        <Link href="/dashboard" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">My Profile</h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* User Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl shadow-indigo-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-slate-400">{user.phone}</p>
            <p className="text-xs text-slate-500 mt-1">Member since {user.memberSince}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-slate-400 text-xs uppercase font-bold mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-emerald-400">₹1,730</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
             <p className="text-slate-400 text-xs uppercase font-bold mb-1">Trips</p>
             <p className="text-2xl font-bold text-indigo-400">14</p>
          </div>
        </div>

        {/* Transaction History */}
        <div>
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Clock className="w-5 h-5 text-indigo-400" />
             Order History
           </h3>
           
           <div className="space-y-3">
             {history.map((item) => (
               <div key={item.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-900 transition-colors cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="bg-slate-800 p-3 rounded-xl text-slate-400 group-hover:text-white transition-colors">
                     <ShoppingBag size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-white">{item.store}</h4>
                     <p className="text-slate-500 text-xs">{item.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-white">₹{item.total}</p>
                   <p className="text-xs text-slate-500">{item.items} items</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Settings Links */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
           <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-900 transition-colors text-slate-300 hover:text-white">
              <div className="flex items-center gap-3">
                <Settings size={20} />
                <span>App Settings</span>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
           </button>
           <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-900 transition-colors text-slate-300 hover:text-white">
              <div className="flex items-center gap-3">
                <Receipt size={20} />
                <span>Tax Invoices</span>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
           </button>
        </div>

      </div>
    </div>
  );
}