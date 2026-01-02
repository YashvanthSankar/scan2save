import Link from 'next/link';
import {
    ArrowRight,
    BarChart3,
    Users,
    Zap,
    Shield,
    TrendingUp,
    Store,
    Brain,
    QrCode,
    CheckCircle,
    Sparkles,
    ArrowLeft,
    MessageSquare,
    Clock,
    Target
} from 'lucide-react';

// OPTIMIZATION: Static generation for content page
export const dynamic = 'force-static';
export const revalidate = 3600;

const features = [
    {
        icon: Brain,
        title: 'AI-Powered Personalization',
        description: 'Our ML engine analyzes shopping patterns to deliver hyper-targeted offers that convert 3x better than generic promotions.',
    },
    {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description: 'Track foot traffic, conversion rates, and customer behavior with our comprehensive analytics dashboard.',
    },
    {
        icon: QrCode,
        title: 'Seamless Integration',
        description: 'Deploy in minutes. Just generate QR codes and place them at your store entrance. No hardware required.',
    },
    {
        icon: Users,
        title: 'Customer Insights',
        description: 'Understand your customers like never before with detailed purchase history and preference mapping.',
    },
    {
        icon: TrendingUp,
        title: 'Boost Average Order Value',
        description: 'Smart upselling and cross-selling recommendations increase AOV by up to 25%.',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Bank-grade encryption, SOC 2 compliant, and GDPR ready. Your data is always safe.',
    },
];

const pricingPlans = [
    {
        name: 'Starter',
        price: 'Free',
        period: 'forever',
        description: 'Perfect for small stores testing the waters',
        features: [
            'Up to 100 products',
            '1 store location',
            'Basic analytics',
            'Email support',
            'Standard QR codes',
        ],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Professional',
        price: '₹4,999',
        period: '/month',
        description: 'For growing retail businesses',
        features: [
            'Unlimited products',
            'Up to 5 stores',
            'Advanced analytics',
            'AI personalization',
            'Priority support',
            'Custom branding',
            'API access',
        ],
        cta: 'Start 14-Day Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large chains and franchises',
        features: [
            'Unlimited everything',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
            'On-premise option',
            'White-label solution',
            'Advanced security',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

const stats = [
    { value: '500+', label: 'Partner Stores' },
    { value: '2M+', label: 'Transactions' },
    { value: '₹50Cr+', label: 'Savings Generated' },
    { value: '4.8★', label: 'Store Rating' },
];

export default function ForRetailersPage() {
    return (
        <div className="min-h-screen text-foreground font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/for-shoppers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            For Shoppers
                        </Link>
                        <Link href="/login" className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform">
                            Partner Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8">
                        <Store className="w-4 h-4" />
                        For Retail Partners
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                        Transform Your Store Into <br />
                        <span className="gradient-text">An AI-Powered Experience</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join 500+ retailers using Scan2Save to boost sales, understand customers better,
                        and eliminate checkout queues. Setup takes just 10 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#pricing"
                            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                        >
                            View Pricing
                            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#demo"
                            className="px-8 py-4 rounded-xl font-bold text-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Book a Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything You Need to <span className="gradient-text">Grow Your Business</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Powerful tools designed specifically for modern retail. No complex setup, no expensive hardware.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="premium-card p-6 group hover:border-indigo-500/30 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Get Started in <span className="gradient-text">3 Simple Steps</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: QrCode, title: 'Generate QR Codes', desc: 'Create unique QR codes for your store in our dashboard' },
                            { step: '02', icon: Target, title: 'Set Up Offers', desc: 'Add your products and configure personalized deals' },
                            { step: '03', icon: Zap, title: 'Go Live', desc: 'Print QR codes and start delighting customers instantly' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Simple, Transparent <span className="gradient-text">Pricing</span>
                        </h2>
                        <p className="text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {pricingPlans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`premium-card p-8 relative ${plan.popular ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105'
                                        : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="demo" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10" />

                <div className="container mx-auto max-w-3xl text-center relative z-10">
                    <div className="premium-card p-12">
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Store?</h2>
                        <p className="text-muted-foreground mb-8">
                            Join hundreds of retailers already growing with Scan2Save.
                            Get started in minutes with our free tier.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/admin/stores"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="mailto:scan2save@yashvanth.com"
                                className="px-8 py-4 rounded-xl font-bold text-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Schedule a Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    © 2024 Scan2Save. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
