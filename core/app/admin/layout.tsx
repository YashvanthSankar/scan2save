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
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Scan2<span className="text-indigo-400">Save</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Admin Panel</p>
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
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