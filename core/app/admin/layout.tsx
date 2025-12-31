import { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  QrCode,
  Users,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen text-foreground font-sans selection:bg-primary/30 relative">

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#030712]/95 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Scan<span className="gradient-text">2Save</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
            { label: 'Manage Stores', icon: Store, href: '/admin/stores' },
            { label: 'QR Generator', icon: QrCode, href: '/admin/generate-qr' },
            { label: 'Users', icon: Users, href: '/admin/users' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
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
      <main className="flex-1 p-8 overflow-y-auto bg-[#030712]">
        {children}
      </main>
    </div>
  );
}