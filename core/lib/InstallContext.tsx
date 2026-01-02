'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Store the prompt globally so it persists across component re-renders
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface InstallContextType {
    installPrompt: BeforeInstallPromptEvent | null;
    isInstalled: boolean;
    isIOS: boolean;
    canInstall: boolean;
    triggerInstall: () => Promise<boolean>;
}

const InstallContext = createContext<InstallContextType>({
    installPrompt: null,
    isInstalled: false,
    isIOS: false,
    canInstall: false,
    triggerInstall: async () => false,
});

export function useInstall() {
    return useContext(InstallContext);
}

export function InstallProvider({ children }: { children: React.ReactNode }) {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(deferredPrompt);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;

        if (isStandalone) {
            console.log('[PWA] App is already installed (standalone mode)');
            setIsInstalled(true);
            setIsReady(true);
            return;
        }

        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);
        console.log('[PWA] Is iOS device:', isIOSDevice);

        // If we already have a deferred prompt from before, use it
        if (deferredPrompt) {
            console.log('[PWA] Using existing deferred prompt');
            setInstallPrompt(deferredPrompt);
        }

        // Listen for the install prompt event
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            console.log('[PWA] ✅ beforeinstallprompt event captured!');
            deferredPrompt = e as BeforeInstallPromptEvent;
            setInstallPrompt(deferredPrompt);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            console.log('[PWA] ✅ App was installed successfully!');
            setIsInstalled(true);
            setInstallPrompt(null);
            deferredPrompt = null;
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Check if service worker is registered
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                console.log('[PWA] Service worker registered:', !!reg);
            });
        }

        setIsReady(true);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const triggerInstall = useCallback(async (): Promise<boolean> => {
        const prompt = installPrompt || deferredPrompt;

        if (!prompt) {
            console.log('[PWA] ❌ No install prompt available');
            console.log('[PWA] This could be because:');
            console.log('  - Site is not served over HTTPS (required for mobile)');
            console.log('  - PWA criteria not met (manifest, service worker, etc.)');
            console.log('  - Browser already has the app installed');
            console.log('  - User dismissed the prompt before');
            return false;
        }

        try {
            console.log('[PWA] Triggering install prompt...');
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            console.log('[PWA] User choice:', outcome);

            if (outcome === 'accepted') {
                setIsInstalled(true);
                setInstallPrompt(null);
                deferredPrompt = null;
                return true;
            }
            return false;
        } catch (error) {
            console.error('[PWA] Install error:', error);
            return false;
        }
    }, [installPrompt]);

    const canInstall = !!(installPrompt || deferredPrompt) && !isInstalled;

    return (
        <InstallContext.Provider value={{
            installPrompt: installPrompt || deferredPrompt,
            isInstalled,
            isIOS,
            canInstall,
            triggerInstall
        }}>
            {children}
        </InstallContext.Provider>
    );
}
