import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, CreditCard, Scale, Ban, RefreshCw } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | Scan2Save',
    description: 'Read the terms and conditions for using Scan2Save services.',
};

export default function TermsOfServicePage() {
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
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                        <p className="text-muted-foreground">Last updated: December 31, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Acceptance of Terms</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>By accessing or using Scan2Save, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Description of Services</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>Scan2Save provides:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>QR code scanning for store entry and personalized offers</li>
                                    <li>AI-powered shopping recommendations</li>
                                    <li>Digital cart management and checkout</li>
                                    <li>Order history and gate pass verification</li>
                                    <li>Retail partner dashboard and analytics</li>
                                </ul>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">User Responsibilities</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>As a user, you agree to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide accurate and complete information</li>
                                    <li>Maintain the security of your account credentials</li>
                                    <li>Use the service only for lawful purposes</li>
                                    <li>Not attempt to interfere with or disrupt the service</li>
                                    <li>Not share or transfer your gate pass to others</li>
                                </ul>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Payments & Transactions</h2>
                            </div>
                            <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                                <p>All payments are processed through secure payment gateways. By making a purchase:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>You authorize us to charge your selected payment method</li>
                                    <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                                    <li>Prices are subject to change without notice</li>
                                    <li>Refunds are subject to individual store policies</li>
                                </ul>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Intellectual Property</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>All content, features, and functionality of Scan2Save, including but not limited to text, graphics, logos, and software, are owned by Scan2Save and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Ban className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Limitation of Liability</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>Scan2Save and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you in the past 12 months.</p>
                            </div>
                        </section>

                        <section className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <RefreshCw className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Termination</h2>
                            </div>
                            <div className="text-muted-foreground text-sm leading-relaxed">
                                <p>We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the service will immediately cease. You may also delete your account at any time by contacting our support team.</p>
                            </div>
                        </section>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 text-center text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            View Privacy Policy →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
