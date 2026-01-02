'use client';

import Link from 'next/link';
import {
    Download,
    Smartphone,
    CheckCircle,
    AlertCircle,
    Share,
    ArrowLeft,
    Zap,
    Shield,
    Bell,
    Wifi,
    ScanLine,
    Loader2
} from 'lucide-react';
import { useInstall } from '@/lib/InstallContext';
import { useState } from 'react';

export default function InstallPage() {
    const { canInstall, isInstalled, isIOS, triggerInstall } = useInstall();
    const [isInstalling, setIsInstalling] = useState(false);
    const [installSuccess, setInstallSuccess] = useState(false);

    const handleInstallClick = async () => {
        setIsInstalling(true);
        const success = await triggerInstall();
        if (success) {
            setInstallSuccess(true);
        }
        setIsInstalling(false);
    };

    const features = [
        { icon: Zap, title: 'Lightning Fast', description: 'Instant load times, even offline' },
        { icon: Bell, title: 'Push Notifications', description: 'Get notified about deals & offers' },
        { icon: Wifi, title: 'Works Offline', description: 'Browse products without internet' },
        { icon: Shield, title: 'Secure & Private', description: 'Your data stays on your device' },
    ];

    return (
        <div className="min-h-screen text-foreground font-sans">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-2xl">
                    {/* App Icon & Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-2xl shadow-indigo-500/30">
                            <ScanLine className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-3">Install Scan2Save</h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Get the full app experience. Faster, offline-capable, and always just a tap away.
                        </p>
                    </div>

                    {/* Install Status Card */}
                    <div className="premium-card p-8 mb-8">
                        {isInstalled || installSuccess ? (
                            // Already Installed State
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    {installSuccess ? 'Successfully Installed!' : 'Already Installed'}
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Scan2Save is installed on your device. Open it from your home screen for the best experience.
                                </p>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                                >
                                    <Smartphone className="w-5 h-5" />
                                    Open Dashboard
                                </Link>
                            </div>
                        ) : isIOS ? (
                            // iOS Instructions
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                                    <Share className="w-8 h-8 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Install on iOS</h2>
                                <p className="text-muted-foreground mb-6">
                                    To install Scan2Save on your iPhone or iPad:
                                </p>
                                <div className="text-left max-w-sm mx-auto space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">1</div>
                                        <p className="text-muted-foreground">Tap the <strong className="text-foreground">Share</strong> button <Share className="w-4 h-4 inline text-blue-400" /> in Safari</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">2</div>
                                        <p className="text-muted-foreground">Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">3</div>
                                        <p className="text-muted-foreground">Tap <strong className="text-foreground">"Add"</strong> to install the app</p>
                                    </div>
                                </div>
                            </div>
                        ) : canInstall ? (
                            // Install Available State
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
                                    <Download className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Install</h2>
                                <p className="text-muted-foreground mb-6">
                                    Click the button below to add Scan2Save to your device.
                                </p>
                                <button
                                    onClick={handleInstallClick}
                                    disabled={isInstalling}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isInstalling ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Installing...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Install Now
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            // Browser Not Supported State
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
                                    <AlertCircle className="w-8 h-8 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Open in Chrome or Safari</h2>
                                <p className="text-muted-foreground mb-6">
                                    To install Scan2Save, please open this page in <strong className="text-foreground">Chrome</strong> (Android/Desktop) or <strong className="text-foreground">Safari</strong> (iOS).
                                    In-app browsers don't support installation.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.origin);
                                            alert('Link copied! Open it in Chrome or Safari.');
                                        }}
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-foreground rounded-xl font-medium hover:bg-white/10 transition-colors"
                                    >
                                        Copy Link
                                    </button>
                                    <Link
                                        href="/login"
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                                    >
                                        Continue in Browser
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-center mb-6">Why Install the App?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature) => (
                                <div key={feature.title} className="premium-card p-4 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mb-3">
                                        <feature.icon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-sm mb-1">{feature.title}</h4>
                                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-muted-foreground">
                        Scan2Save is a Progressive Web App (PWA). No app store download required.
                    </p>
                </div>
            </div>
        </div>
    );
}
