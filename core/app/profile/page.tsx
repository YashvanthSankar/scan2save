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
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">{user.phone}</p>
            <p className="text-xs text-muted-foreground mt-1">Member since {user.memberSince}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl shadow-sm">
            <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-emerald-500">₹1,730</p>
          </div>
          <div className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl shadow-sm">
            <p className="text-muted-foreground text-xs uppercase font-bold mb-1">Trips</p>
            <p className="text-2xl font-bold text-primary">14</p>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Order History
          </h3>

          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-card/40 backdrop-blur-md border border-border p-4 rounded-2xl flex items-center justify-between group hover:bg-muted/50 transition-colors cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.store}</h4>
                    <p className="text-muted-foreground text-xs">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">₹{item.total}</p>
                  <p className="text-xs text-muted-foreground">{item.items} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Links */}
        <div className="pt-4 border-t border-border space-y-2">
          <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span>App Settings</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <div className="flex items-center gap-3">
              <Receipt size={20} />
              <span>Tax Invoices</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>

      </div>
    </div>
  );
}