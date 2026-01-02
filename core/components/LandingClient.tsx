'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';
import { useInstall } from '@/lib/InstallContext';

interface LandingNavProps {
    children: React.ReactNode;
}

/**
 * Client-side navigation component for the landing page.
 * Handles scroll detection, mobile menu state, and install button.
 */
export function LandingNav({ children }: LandingNavProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { canInstall, triggerInstall, isInstalled } = useInstall();
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleInstall = async () => {
        if (canInstall) {
            setIsInstalling(true);
            await triggerInstall();
            setIsInstalling(false);
        }
    };

    // Don't show install button if already installed
    const showInstallButton = !isInstalled;

    return (
        <nav className={`
      fixed top-4 left-1/2 -translate-x-1/2 z-50 
      transition-all duration-500 ease-out
      w-[95%] sm:w-[90%] max-w-5xl 
      rounded-2xl
      ${scrolled
                ? 'bg-[#0a0f1a]/80 backdrop-blur-xl border border-white/[0.08] py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : 'bg-transparent border border-transparent py-4'
            }
    `}>
            <div className="px-6 flex justify-between items-center">
                {children}

                {/* Nav Actions */}
                <div className="flex items-center gap-3">
                    {/* Install Button - Always visible, triggers install or goes to install page */}
                    {showInstallButton && (
                        canInstall ? (
                            // If install prompt is available, trigger it directly
                            <button
                                onClick={handleInstall}
                                disabled={isInstalling}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                            >
                                {isInstalling ? (
                                    <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                <span>Install</span>
                            </button>
                        ) : (
                            // Otherwise, link to install page
                            <Link
                                href="/install"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium transition-all hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span>Install</span>
                            </Link>
                        )
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 md:hidden animate-fade-in-up">
                    <div className="premium-card p-4 space-y-2 bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10">
                        {[
                            { label: 'Features', href: '/#features' },
                            { label: 'About', href: '/about' },
                            { label: 'Contact', href: '/contact' }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="block px-4 py-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Install button in mobile menu - Always visible */}
                        {showInstallButton && (
                            canInstall ? (
                                <button
                                    onClick={() => {
                                        handleInstall();
                                        setMobileMenuOpen(false);
                                    }}
                                    disabled={isInstalling}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Install App
                                </button>
                            ) : (
                                <Link
                                    href="/install"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Download className="w-4 h-4" />
                                    Install App
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
