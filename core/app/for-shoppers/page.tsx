import Link from 'next/link';
import {
    ArrowRight,
    ArrowLeft,
    Smartphone,
    Zap,
    Gift,
    Shield,
    Clock,
    Sparkles,
    CheckCircle,
    TrendingUp,
    Wallet,
    QrCode,
    ShoppingCart,
    Receipt,
    Award,
    Heart
} from 'lucide-react';

// OPTIMIZATION: Static generation for content page
export const dynamic = 'force-static';
export const revalidate = 3600;

const benefits = [
    {
        icon: Clock,
        title: 'Skip the Queue',
        description: 'Walk in, scan, shop, and leave. No more waiting in long billing lines ever again.',
        stat: '15 min',
        statLabel: 'saved per visit'
    },
    {
        icon: Gift,
        title: 'Personalized Deals',
        description: 'AI learns what you love and surfaces the best deals tailored just for you.',
        stat: '30%',
        statLabel: 'avg savings'
    },
    {
        icon: Wallet,
        title: 'Track Spending',
        description: 'Complete purchase history, budget insights, and smart recommendations.',
        stat: '100%',
        statLabel: 'transparent'
    },
    {
        icon: Award,
        title: 'Earn Rewards',
        description: 'Points on every purchase. Redeem for discounts, vouchers, and exclusive perks.',
        stat: '2x',
        statLabel: 'reward points'
    },
];

const howItWorks = [
    {
        step: 1,
        icon: QrCode,
        title: 'Scan QR Code',
        description: 'Scan the store QR code at the entrance to start your shopping session.',
    },
    {
        step: 2,
        icon: Sparkles,
        title: 'Get AI Offers',
        description: 'Instantly see personalized deals based on your shopping history.',
    },
    {
        step: 3,
        icon: ShoppingCart,
        title: 'Shop & Add to Cart',
        description: 'Browse products, add items to your digital cart as you shop.',
    },
    {
        step: 4,
        icon: Wallet,
        title: 'Pay Securely',
        description: 'Checkout in the app with your preferred payment method.',
    },
    {
        step: 5,
        icon: Receipt,
        title: 'Show Gate Pass',
        description: 'Flash your digital gate pass and walk out. No queues!',
    },
];

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Regular Shopper',
        avatar: '👩‍💼',
        quote: 'I used to spend 20 minutes just waiting to pay. Now I\'m in and out in 10 minutes total!',
    },
    {
        name: 'Rahul Mehta',
        role: 'Tech Enthusiast',
        avatar: '👨‍💻',
        quote: 'The AI recommendations are spot-on. It knew I needed protein bars before I did!',
    },
    {
        name: 'Anita Gupta',
        role: 'Busy Mom',
        avatar: '👩‍👧',
        quote: 'Shopping with kids is so much easier now. Quick checkout is a lifesaver.',
    },
];

const faqs = [
    {
        q: 'Is Scan2Save free to use?',
        a: 'Yes! The app is completely free for shoppers. No hidden fees or subscriptions.',
    },
    {
        q: 'Which stores support Scan2Save?',
        a: 'We\'re partnered with 500+ stores across major cities. Look for the Scan2Save QR code at store entrances.',
    },
    {
        q: 'How do I pay for my items?',
        a: 'Pay securely in the app using UPI, cards, or net banking. Your payment info is encrypted.',
    },
    {
        q: 'What if I have issues with my order?',
        a: 'Our support team is available 24/7. Reach out via the app or email support@scan2save.app.',
    },
];

export default function ForShoppersPage() {
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
                        <Link href="/for-retailers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            For Retailers
                        </Link>
                        <Link href="/login" className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
                        <Heart className="w-4 h-4" />
                        For Smart Shoppers
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                        Shop Smarter, <br />
                        <span className="gradient-text">Save More Time & Money</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                        Skip the billing queue, get personalized deals, and checkout in seconds.
                        Scan2Save transforms how you shop at your favorite stores.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105"
                        >
                            Start Shopping Now
                            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 rounded-xl font-bold text-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            See How It Works
                        </Link>
                    </div>

                    {/* App Preview Mockup */}
                    <div className="mt-16 flex justify-center">
                        <div className="relative">
                            <div className="w-64 h-[500px] bg-gradient-to-b from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a] rounded-[3rem] border border-white/10 shadow-2xl shadow-black/50 p-3">
                                <div className="w-full h-full bg-[#030712] rounded-[2.5rem] overflow-hidden relative">
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                                    <div className="pt-12 px-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl" />
                                            <div>
                                                <div className="text-xs text-white font-bold">FreshMart</div>
                                                <div className="text-[10px] text-muted-foreground">Scan2Save Partner</div>
                                            </div>
                                        </div>
                                        <div className="premium-card p-3 mb-3">
                                            <div className="text-[10px] text-emerald-400 mb-1">🔥 20% OFF</div>
                                            <div className="text-xs text-white font-medium">Organic Milk</div>
                                        </div>
                                        <div className="premium-card p-3 mb-3">
                                            <div className="text-[10px] text-amber-400 mb-1">⚡ Flash Sale</div>
                                            <div className="text-xs text-white font-medium">Fresh Vegetables</div>
                                        </div>
                                        <div className="premium-card p-3">
                                            <div className="text-[10px] text-indigo-400 mb-1">✨ For You</div>
                                            <div className="text-xs text-white font-medium">Protein Bars</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Why Shoppers <span className="gradient-text">Love Scan2Save</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of happy shoppers who've transformed their retail experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="premium-card p-6 text-center group hover:border-emerald-500/30 transition-all"
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{benefit.description}</p>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-2xl font-bold text-emerald-400">{benefit.stat}</div>
                                    <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            How <span className="gradient-text">Scan2Save</span> Works
                        </h2>
                        <p className="text-muted-foreground">Five simple steps to a smarter shopping experience.</p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/20 via-emerald-500/20 to-violet-500/20 -translate-y-1/2" />

                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                            {howItWorks.map((step) => (
                                <div key={step.step} className="text-center relative">
                                    <div className="relative inline-block mb-4 z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                            <step.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            What Shoppers <span className="gradient-text">Say</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="premium-card p-6">
                                <div className="text-4xl mb-4">{t.avatar}</div>
                                <p className="text-muted-foreground text-sm italic mb-4">"{t.quote}"</p>
                                <div>
                                    <div className="font-bold text-foreground">{t.name}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="premium-card p-6">
                                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                                <p className="text-sm text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10" />

                <div className="container mx-auto max-w-3xl text-center relative z-10">
                    <div className="premium-card p-12">
                        <Smartphone className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Ready to Shop Smarter?</h2>
                        <p className="text-muted-foreground mb-8">
                            Join thousands of shoppers saving time and money every day.
                            No app download needed—just scan and go!
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform"
                        >
                            <Zap className="w-5 h-5" />
                            Start Shopping Now
                        </Link>
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
