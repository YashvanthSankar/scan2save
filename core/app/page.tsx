'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ScanLine,
  Camera,
  BrainCircuit, // More tech-focused icon
  Layers,       // Represents curation/stacking
  Sparkles,     // Represents premium/value
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <ScanLine className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Scan2<span className="text-indigo-400">Save</span>
          </span>
        </div>
        <Link 
          href="/login"
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-slate-800"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-400">Next-Gen Recommendation Engine</span>
        </div>

        {/* PROFESSIONAL HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          Precision Savings. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
            Intelligently Curated.
          </span>
        </h1>
        
        {/* GENERALIZED STANDARD DESCRIPTION */}
        <p className="text-lg text-slate-400 max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Transform your shopping experience with our adaptive AI. We analyze purchasing patterns to eliminate irrelevant noise, delivering a tailored ecosystem of offers that resonate with your unique lifestyle.
        </p>

        {/* Interaction Zone */}
        <div className="w-full max-w-3xl flex justify-center animate-in fade-in scale-95 duration-700 delay-200">

          {/* Option 1: Live Scan */}
          <Link
            href="/scan"
            className="group relative flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-2xl shadow-indigo-900/20 hover:scale-[1.02] transition-all duration-300 border border-white/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Scan QR Code</h3>
            <p className="text-indigo-200 text-sm">Access your personalized dashboard</p>
          </Link>

        </div>

        {/* PROFESSIONAL FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            { 
              icon: BrainCircuit, 
              title: "Predictive Analytics", 
              desc: "Our algorithms leverage historical data to forecast your needs, ensuring high-relevance recommendations." 
            },
            { 
              icon: Layers, 
              title: "Curated Filtering", 
              desc: "We apply rigorous filtering layers to screen out generic ads, ensuring a premium, noise-free experience." 
            },
            { 
              icon: Sparkles, 
              title: "Value Optimization", 
              desc: "Unlock exclusive rewards and pricing tiers designed specifically for your spending segments." 
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <feature.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Scan2Save. Intelligent Retail Solutions.</p>
        <Link href="/get-qrs" className="text-xs text-slate-800 hover:text-slate-500 mt-2 block">
          [Dev: Get QR Codes]
        </Link>
      </footer>
    </div>
  );
}