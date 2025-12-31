import Link from 'next/link';
import { ArrowLeft, Target, Zap, Heart, Users, Globe, Sparkles, QrCode } from 'lucide-react';

export const metadata = {
    title: 'About Us | Scan2Save',
    description: 'Learn about Scan2Save - our mission to transform retail with AI-powered shopping experiences.',
};

const values = [
    {
        icon: Zap,
        title: 'Speed First',
        description: 'We believe shopping should be fast. Skip the queues, grab what you need, and go.',
        color: 'from-amber-500/20 to-orange-500/20',
        iconColor: 'text-amber-400'
    },
    {
        icon: Heart,
        title: 'Customer Delight',
        description: 'Every feature we build starts with one question: How does this make shopping more delightful?',
        color: 'from-rose-500/20 to-pink-500/20',
        iconColor: 'text-rose-400'
    },
    {
        icon: Target,
        title: 'Smart Personalization',
        description: 'AI that understands you, not just your data. Offers that actually matter to you.',
        color: 'from-indigo-500/20 to-violet-500/20',
        iconColor: 'text-primary'
    },
    {
        icon: Users,
        title: 'Partner Success',
        description: 'When our retail partners grow, we grow. Your success is our north star.',
        color: 'from-emerald-500/20 to-teal-500/20',
        iconColor: 'text-emerald-400'
    }
];

const timeline = [
    { year: '2024', event: 'Scan2Save founded with a vision to transform retail' },
    { year: '2024', event: 'Launched AI-powered personalization engine' },
    { year: '2024', event: 'Onboarded first 100+ retail partners' },
    { year: '2025', event: 'Expanding across major Indian cities' }
];

export default function AboutPage() {
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

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 mb-8">
                        <QrCode className="w-10 h-10 text-primary" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        Reimagining <span className="gradient-text">Retail</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We're building the future of shopping—where technology serves people,
                        not the other way around. Scan, shop, and save—it's that simple.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6 border-y border-white/5 bg-white/[0.01]">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                                <Globe className="w-3 h-3" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl font-bold mb-6">
                                Making Every Store <span className="gradient-text">Smarter</span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We believe every business, from neighborhood kirana stores to large supermarkets,
                                deserves access to world-class technology. That's why we built Scan2Save—a platform
                                that brings AI-powered personalization to any retail space.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                No expensive hardware. No complex integrations. Just print a QR code and
                                transform your store into a smart shopping destination.
                            </p>
                        </div>
                        <div className="premium-card p-8 text-center">
                            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                            <div className="text-5xl font-bold gradient-text mb-2">500+</div>
                            <div className="text-muted-foreground">Partner Stores</div>
                            <div className="h-px bg-white/10 my-6" />
                            <div className="text-5xl font-bold gradient-text mb-2">2M+</div>
                            <div className="text-muted-foreground">Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What We <span className="gradient-text">Stand For</span></h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Our values guide every decision we make, from product design to partner relationships.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {values.map((value) => (
                            <div key={value.title} className="premium-card p-6 group hover:border-white/20 transition-all">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <value.icon className={`w-6 h-6 ${value.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our <span className="gradient-text">Journey</span></h2>
                    </div>

                    <div className="space-y-6">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-16 text-right">
                                    <span className="text-sm font-bold text-primary">{item.year}</span>
                                </div>
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    {index < timeline.length - 1 && (
                                        <div className="absolute top-3 left-1.5 w-px h-12 bg-white/10" />
                                    )}
                                </div>
                                <div className="flex-1 pb-6">
                                    <p className="text-foreground">{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
                    <p className="text-muted-foreground mb-8">
                        Whether you're a shopper looking for deals or a retailer looking to grow,
                        we'd love to have you with us.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/for-shoppers"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
                        >
                            Start Shopping
                        </Link>
                        <Link
                            href="/for-retailers"
                            className="px-8 py-4 rounded-xl font-medium text-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Partner With Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    © 2024 Scan2Save. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
