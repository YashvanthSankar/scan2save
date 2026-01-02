'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstall } from '@/lib/InstallContext';

/**
 * Install App Banner for the landing page.
 * Shows when the app can be installed (PWA prompt available).
 * Uses the global InstallContext to share the install prompt across pages.
 */
export function InstallBanner() {
    const { canInstall, triggerInstall, isInstalled } = useInstall();
    const [dismissed, setDismissed] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    // Check if user dismissed recently (within 24 hours) - client-side only
    const wasDismissed = typeof window !== 'undefined' && (() => {
        const dismissedAt = localStorage.getItem('install-banner-dismissed');
        return dismissedAt && Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000;
    })();

    const handleInstall = async () => {
        setIsInstalling(true);
        await triggerInstall();
        setIsInstalling(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('install-banner-dismissed', Date.now().toString());
        }
    };

    // Don't show if: already installed, dismissed, can't install, or was dismissed recently
    if (isInstalled || dismissed || !canInstall || wasDismissed) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm animate-fade-in-up">
            <div className="premium-card p-4 bg-[#0a0f1a]/95 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-black/50">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                        <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-sm mb-1">Install Scan2Save</h3>
                        <p className="text-xs text-muted-foreground mb-3">Add to home screen for faster access & offline use</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstall}
                                disabled={isInstalling}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg text-sm font-bold hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isInstalling ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                Install
                            </button>
                            <Link
                                href="/install"
                                className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
