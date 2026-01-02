'use client';

import Link from 'next/link';
import {
    Download,
    Smartphone,
    CheckCircle,
    Share,
    ArrowLeft,
    Zap,
    Shield,
    Bell,
    Wifi,
    ScanLine,
    Loader2,
    MoreVertical,
    Chrome
} from 'lucide-react';
import { useInstall } from '@/lib/InstallContext';
import { useState, useEffect } from 'react';

export default function InstallPage() {
    const { canInstall, isInstalled, isIOS, triggerInstall } = useInstall();
    const [isInstalling, setIsInstalling] = useState(false);
    const [installSuccess, setInstallSuccess] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        // Detect Android
        setIsAndroid(/Android/i.test(navigator.userAgent));
    }, []);

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
                        ) : canInstall ? (
                            // Install Available State - Browser supports direct install
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
                        ) : isIOS ? (
                            // iOS Instructions
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                                    <Share className="w-8 h-8 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Install on iOS</h2>
                                <p className="text-muted-foreground mb-6">
                                    Follow these steps in <strong className="text-foreground">Safari</strong>:
                                </p>
                                <div className="text-left max-w-sm mx-auto space-y-4">
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">1</div>
                                        <p className="text-muted-foreground">Tap the <strong className="text-foreground">Share</strong> button <Share className="w-4 h-4 inline text-blue-400" /> at the bottom of Safari</p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">2</div>
                                        <p className="text-muted-foreground">Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong></p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">3</div>
                                        <p className="text-muted-foreground">Tap <strong className="text-foreground">"Add"</strong> in the top right</p>
                                    </div>
                                </div>
                            </div>
                        ) : isAndroid ? (
                            // Android Chrome Instructions (when prompt not available)
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                                    <Chrome className="w-8 h-8 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Install on Android</h2>
                                <p className="text-muted-foreground mb-6">
                                    Follow these steps in <strong className="text-foreground">Chrome</strong>:
                                </p>
                                <div className="text-left max-w-sm mx-auto space-y-4">
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 font-bold text-sm">1</div>
                                        <p className="text-muted-foreground">Tap the <strong className="text-foreground">menu</strong> button <MoreVertical className="w-4 h-4 inline text-green-400" /> (three dots) in Chrome</p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 font-bold text-sm">2</div>
                                        <p className="text-muted-foreground">Tap <strong className="text-foreground">"Add to Home screen"</strong> or <strong className="text-foreground">"Install app"</strong></p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 font-bold text-sm">3</div>
                                        <p className="text-muted-foreground">Tap <strong className="text-foreground">"Install"</strong> to confirm</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-6">
                                    💡 Make sure you're using Chrome and the site is served over HTTPS
                                </p>
                            </div>
                        ) : (
                            // Desktop Instructions
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mb-4">
                                    <Chrome className="w-8 h-8 text-violet-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Install on Desktop</h2>
                                <p className="text-muted-foreground mb-6">
                                    Follow these steps in <strong className="text-foreground">Chrome</strong> or <strong className="text-foreground">Edge</strong>:
                                </p>
                                <div className="text-left max-w-sm mx-auto space-y-4">
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 font-bold text-sm">1</div>
                                        <p className="text-muted-foreground">Look for the <strong className="text-foreground">install icon</strong> <Download className="w-4 h-4 inline text-violet-400" /> in the address bar</p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 font-bold text-sm">2</div>
                                        <p className="text-muted-foreground">Or click <strong className="text-foreground">⋮ → Install Scan2Save</strong></p>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 bg-white/5 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 font-bold text-sm">3</div>
                                        <p className="text-muted-foreground">Click <strong className="text-foreground">"Install"</strong> to add to your desktop</p>
                                    </div>
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
