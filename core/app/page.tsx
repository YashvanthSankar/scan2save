'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ScanLine,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle'; // Kept locally if needed, but navigation link handles flow

// Custom background styles (could be in globals.css, but inline for encapsulation)


export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-primary/30 overflow-x-hidden relative">

      {/* 0. BACKGROUND - Global in layout.tsx */}

      {/* 1. NAVIGATION */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] sm:w-[90%] max-w-5xl rounded-full border ${scrolled ? 'bg-background/80 backdrop-blur-xl border-border py-3 shadow-2xl' : 'bg-transparent border-transparent py-4'}`}>
        <div className="px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Scan2Save</span>
          </div>

          {/* Spacer */}
          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </Link>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto z-10 flex flex-col items-center justify-center min-h-[80vh]">

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up opacity-0">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Retail 2.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 animate-fade-in-up delay-100 opacity-0">
            Shopping intelligence, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              reimagined for you.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200 opacity-0">
            Scan2Save transforms physical retail with adaptative AI. We analyze purchasing behavior in real-time to deliver hyper-personalized offers, eliminating noise and maximizing value.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 opacity-0">
            <Link
              href="/scan"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
            >
              <Smartphone className="w-5 h-5" />
              Launch Scanner
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-secondary border border-border hover:bg-secondary/80 text-secondary-foreground rounded-full font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      {/* 4. FEATURES GRID */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Predictive Engines",
              desc: "Our models predict user intent before they search, reducing friction and increasing conversion.",
              icon: Globe
            },
            {
              title: "Dynamic Discounting",
              desc: "Real-time generating of discount codes based on inventory levels and user loyalty scores.",
              icon: Sparkles
            },
            {
              title: "Seamless Integration",
              desc: "Drop-in SDKs for merchants to integrate directly with existing POS systems without hardware upgrades.",
              icon: ShieldCheck
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/20 transition-all hover:-translate-y-1 duration-300 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 border-t border-border py-12 px-6 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-slate-600" />
            <span className="font-bold text-slate-500">Scan2Save © {new Date().getFullYear}</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
            <Link href="/get-qrs" className="text-indigo-500 hover:text-indigo-400">[Dev Tools]</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}