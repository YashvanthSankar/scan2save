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
  Smartphone,
  ChevronRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-primary/30 overflow-x-hidden relative">

      {/* 1. NAVIGATION */}
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Scan<span className="gradient-text">2Save</span>
            </span>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="relative pt-32 sm:pt-40 pb-20 px-6 max-w-7xl mx-auto z-10 flex flex-col items-center justify-center min-h-[85vh]">

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up opacity-0 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Retail 2.0</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 animate-fade-in-up delay-100 opacity-0">
            Shopping intelligence, <br />
            <span className="gradient-text">
              reimagined for you.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200 opacity-0">
            Scan2Save transforms physical retail with adaptive AI. We analyze purchasing behavior in real-time to deliver hyper-personalized offers, eliminating noise and maximizing value.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 opacity-0">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] hover:bg-right text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 group"
            >
              <Smartphone className="w-5 h-5" />
              <span>Start Scanning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm animate-fade-in delay-500 opacity-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bank-grade Security</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9 Rating</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span>Instant Savings</span>
            </div>
          </div>
        </div>

      </main>

      {/* 3. FEATURES GRID */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for the <span className="gradient-text">future of retail</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology that puts you in control of your shopping experience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Predictive Engines",
              desc: "Our models predict user intent before they search, reducing friction and increasing conversion rates.",
              icon: Globe,
              gradient: "from-indigo-500 to-cyan-500",
              iconBg: "bg-indigo-500/10",
              iconColor: "text-indigo-400"
            },
            {
              title: "Dynamic Discounting",
              desc: "Real-time generation of discount codes based on inventory levels and user loyalty scores.",
              icon: Sparkles,
              gradient: "from-violet-500 to-pink-500",
              iconBg: "bg-violet-500/10",
              iconColor: "text-violet-400"
            },
            {
              title: "Seamless Integration",
              desc: "Drop-in SDKs for merchants to integrate directly with existing POS systems.",
              icon: ShieldCheck,
              gradient: "from-emerald-500 to-teal-500",
              iconBg: "bg-emerald-500/10",
              iconColor: "text-emerald-400"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group premium-card p-8 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: 'forwards' }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.desc}
              </p>

              {/* Learn More Link */}
              <div className="mt-6 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium">Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="premium-card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "₹2Cr+", label: "Savings Generated" },
                { value: "500+", label: "Partner Stores" },
                { value: "4.9★", label: "App Rating" }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="premium-card p-12 md:p-16 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your <span className="gradient-text">shopping experience?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of smart shoppers who save money every day with Scan2Save.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-[#030712]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/50 to-violet-600/50 rounded-lg flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-white/70" />
            </div>
            <span className="font-bold text-muted-foreground">Scan2Save © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
            <Link href="/get-qrs" className="text-indigo-400 hover:text-indigo-300 transition-colors">[Dev]</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}