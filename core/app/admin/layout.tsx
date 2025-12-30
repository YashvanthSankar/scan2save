import { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  QrCode,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen text-foreground font-sans selection:bg-primary/30 relative">

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/40 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Scan2<span className="text-primary">Save</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
            { label: 'Manage Stores', icon: Store, href: '/admin/stores' },
            { label: 'QR Generator', icon: QrCode, href: '/admin/generate-qr' },
            { label: 'Users', icon: Users, href: '/admin/users' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}