import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie, Users, Mail } from 'lucide-react';

// OPTIMIZATION: Static generation for content page
export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
    title: 'Privacy Policy | Scan2Save',
    description: 'Learn how Scan2Save collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
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
                <div className="container mx-auto max-w-3xl">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 mb-6">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: December 31, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Information We Collect</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>We collect information you provide directly to us, including:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Phone number for account creation and authentication</li>
                                    <li>Name and profile information you choose to provide</li>
                                    <li>Shopping preferences and purchase history</li>
                                    <li>Store visit data when you scan QR codes</li>
                                    <li>Device information and app usage analytics</li>
                                </ul>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">How We Use Your Information</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>We use the information we collect to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Personalize your shopping experience with AI-powered recommendations</li>
                                    <li>Process transactions and send related information</li>
                                    <li>Send promotional communications (with your consent)</li>
                                    <li>Detect, prevent, and address fraud or security issues</li>
                                </ul>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Information Sharing</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>We may share your information with:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Retail partners to fulfill your orders and provide offers</li>
                                    <li>Service providers who assist in our operations</li>
                                    <li>Legal authorities when required by law</li>
                                </ul>
                                <p className="mt-4">We do not sell your personal information to third parties.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Cookie className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Cookies & Tracking</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Data Security</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Contact Us</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>If you have questions about this Privacy Policy or your personal data, please contact us at:</p>
                                <a href="mailto:scan2save@yashvanth.com" className="text-primary hover:underline mt-2 inline-block">
                                    scan2save@yashvanth.com
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 text-center text-sm text-muted-foreground">
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            View Terms of Service →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
