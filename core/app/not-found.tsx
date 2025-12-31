'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft, Frown } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 text-foreground font-sans">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

            <div className="text-center relative z-10 max-w-md">
                {/* 404 Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 mb-8">
                    <Frown className="w-12 h-12 text-rose-400" />
                </div>

                {/* Error Code */}
                <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>

                {/* Message */}
                <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <Search className="w-4 h-4" />
                        Browse Stores
                    </Link>
                </div>

                {/* Back Link */}
                <button
                    onClick={() => typeof window !== 'undefined' && window.history.back()}
                    className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Go back to previous page
                </button>
            </div>
        </div>
    );
}
