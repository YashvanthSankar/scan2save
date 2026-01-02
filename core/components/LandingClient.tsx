'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface LandingNavProps {
    children: React.ReactNode;
}

/**
 * Client-side navigation component for the landing page.
 * Handles scroll detection and mobile menu state.
 * Extracted as a client island to keep the rest of the landing page as server component.
 */
export function LandingNav({ children }: LandingNavProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors ml-3"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
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
                    </div>
                </div>
            )}
        </nav>
    );
}
