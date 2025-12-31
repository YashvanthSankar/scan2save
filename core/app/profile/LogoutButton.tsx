'use client';

import { LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    return (
        <div className="pt-4 border-t border-white/5 space-y-1">
            <button
                onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/login';
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-rose-500/10 transition-colors text-rose-400 group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-bold">Log Out</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
