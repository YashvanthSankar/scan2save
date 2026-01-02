'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
                return;
            }

            // Check if iOS
            const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            setIsIOS(isIOSDevice);

            // Listen for the install prompt event
            const handleBeforeInstall = (e: Event) => {
                e.preventDefault();
                console.log('[PWA] Install prompt captured!');
                setInstallPrompt(e as BeforeInstallPromptEvent);
            };

            // Listen for successful installation
            const handleAppInstalled = () => {
                console.log('[PWA] App was installed!');
                setIsInstalled(true);
                setInstallPrompt(null);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstall);
            window.addEventListener('appinstalled', handleAppInstalled);

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
                window.removeEventListener('appinstalled', handleAppInstalled);
            };
        }
    }, []);

    const triggerInstall = useCallback(async (): Promise<boolean> => {
        if (!installPrompt) {
            console.log('[PWA] No install prompt available');
            return false;
        }

        try {
            console.log('[PWA] Triggering install prompt...');
            await installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            console.log('[PWA] User choice:', outcome);

            if (outcome === 'accepted') {
                setIsInstalled(true);
                setInstallPrompt(null);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[PWA] Install error:', error);
            return false;
        }
    }, [installPrompt]);

    const canInstall = !!installPrompt && !isInstalled;

    return (
        <InstallContext.Provider value={{ installPrompt, isInstalled, isIOS, canInstall, triggerInstall }}>
            {children}
        </InstallContext.Provider>
    );
}
