'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, CheckCircle2, Loader2, ShieldCheck, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

interface OrderResult {
    id: string;
    total: number;
    gatePassToken: string;
    store: string;
    itemCount: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalAmount, clearCart, loading } = useCart();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tax = totalAmount * 0.18;
    const total = totalAmount + tax;

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to create order');
            }

            setOrderResult(data.order);
            setSuccess(true);
            clearCart();

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    // Success State
    if (success && orderResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
                {/* Success Card */}
                <div className="premium-card p-10 max-w-md w-full animate-scale-in">
                    {/* Success Icon */}
                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce-subtle">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold mb-3 text-foreground">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-8">
                        Your order of {orderResult.itemCount} items from <span className="text-foreground font-medium">{orderResult.store}</span> has been placed.
                    </p>

                    {/* Gate Pass */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <p className="text-sm text-muted-foreground">Your Exit Gate Pass</p>
                        </div>
                        <p className="font-mono text-3xl font-bold text-foreground tracking-[0.3em] mb-2">
                            {orderResult.gatePassToken}
                        </p>
                        <p className="text-xs text-muted-foreground">Show this at the exit for verification</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={`/orders/${orderResult.id}`}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                        >
                            View Invoice
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/orders"
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                        >
                            All Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-foreground font-sans p-6 md:p-12 relative selection:bg-primary/30 pb-24">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Checkout</h1>
                        <p className="text-muted-foreground text-sm">Complete your purchase securely</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Order Preview */}
                <div className="space-y-6">
                    <div className="premium-card p-6">
                        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Order Summary
                        </h2>

                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                            {items.map((item, i) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-white/5">
                                            <img
                                                src={item.image || 'https://placehold.co/100'}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground">{item.name}</span>
                                            <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="divider my-4" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>GST (18%)</span>
                                <span className="text-foreground">₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="divider" />
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span>Total to Pay</span>
                                <span className="gradient-text">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-6">
                    <div className="premium-card p-6">
                        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Secure Payment
                        </h2>

                        {/* Payment Options */}
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-4 p-4 border border-primary/30 bg-primary/5 rounded-xl cursor-pointer transition-colors relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-primary accent-indigo-500" />
                                <div className="flex-1 relative z-10">
                                    <span className="block font-bold text-foreground">UPI / QR Code</span>
                                    <span className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
                                    UPI
                                </div>
                            </label>

                            <label className="flex items-center gap-4 p-4 border border-white/10 rounded-xl cursor-not-allowed opacity-50">
                                <input type="radio" name="payment" disabled className="w-5 h-5" />
                                <div className="flex-1">
                                    <span className="block font-bold text-foreground">Credit / Debit Card</span>
                                    <span className="text-xs text-muted-foreground">Unavailable in Demo</span>
                                </div>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing || items.length === 0}
                            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white px-6 py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group border border-white/10"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-left text-lg">Pay ₹{total.toLocaleString()}</span>
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Payments are 100% Secure & Encrypted</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
