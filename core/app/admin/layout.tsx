'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  QrCode,
  Users,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Manage Stores', icon: Store, href: '/admin/stores' },
  { label: 'QR Generator', icon: QrCode, href: '/admin/generate-qr' },
  { label: 'Guard Verify', icon: ShieldCheck, href: '/admin/verify' },
  { label: 'Users', icon: Users, href: '/admin/users' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen text-foreground font-sans selection:bg-primary/30 relative">

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Scan<span className="gradient-text">2Save</span></span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-[65px] left-0 right-0 bg-[#030712] border-b border-white/5 animate-fade-in">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#030712]/95 backdrop-blur-xl hidden md:flex flex-col fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Scan<span className="gradient-text">2Save</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/20 text-foreground border border-indigo-500/30'
                  : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-primary/10'
                  }`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-8 px-4 pb-8 md:px-8 overflow-y-auto bg-[#030712] min-h-screen">
        {children}
      </main>
    </div>
  );
}