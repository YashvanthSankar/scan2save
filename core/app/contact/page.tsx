'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, Send, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Open mailto with pre-filled data
        const mailtoLink = `mailto:scan2save@yashvanth.com?subject=${encodeURIComponent(formData.subject || 'Contact from Website')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;

        setSubmitted(true);
        setLoading(false);
    };

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
                <div className="container mx-auto max-w-5xl">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 mb-6">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Have a question, feedback, or want to partner with us? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            <div className="premium-card p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-bold">Email Us</h3>
                                </div>
                                <a href="mailto:scan2save@yashvanth.com" className="text-primary text-sm hover:underline">
                                    scan2save@yashvanth.com
                                </a>
                            </div>

                            <div className="premium-card p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold">Location</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">India</p>
                            </div>

                            <div className="premium-card p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h3 className="font-bold">Response Time</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Within 24 hours</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2">
                            {submitted ? (
                                <div className="premium-card p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-6">
                                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Your email client should open shortly. We'll get back to you soon.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="premium-card p-6 space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-premium w-full"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-premium w-full"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input-premium w-full"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-premium w-full resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-transform disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
