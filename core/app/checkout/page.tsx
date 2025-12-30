'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, CheckCircle2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
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

    // Auto-redirect if empty (basic guard, though middleware handles auth)
    if (!loading && items.length === 0 && !success) {
        // In a real app we might redirect, but here just show empty message
    }

    const tax = totalAmount * 0.18;
    const total = totalAmount + tax;

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            // Simulate payment gateway delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create order via API
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

    if (success && orderResult) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">Payment Successful!</h1>
                <p className="text-muted-foreground max-w-md mb-4">
                    Your order of {orderResult.itemCount} items from {orderResult.store} has been placed.
                </p>

                {/* Gate Pass */}
                <div className="bg-card/40 border border-emerald-500/30 rounded-2xl p-6 mb-8 max-w-sm w-full">
                    <p className="text-sm text-muted-foreground mb-2">Your Exit Gate Pass</p>
                    <p className="font-mono text-2xl font-bold text-foreground tracking-widest mb-2">
                        {orderResult.gatePassToken}
                    </p>
                    <p className="text-xs text-muted-foreground">Show this at the exit for verification</p>
                </div>

                <div className="flex gap-4">
                    <Link href={`/orders/${orderResult.id}`} className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95">
                        View Invoice
                    </Link>
                    <Link href="/orders" className="bg-muted text-foreground px-6 py-3 rounded-full font-bold hover:bg-muted/80 transition-all">
                        All Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12 relative selection:bg-indigo-500/30">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-primary" />
                    Checkout
                </h1>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Order Preview */}
                <div className="space-y-6">
                    <div className="bg-card/40 border border-border rounded-3xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-muted rounded-md overflow-hidden">
                                            <img src={item.image || 'https://placehold.co/100'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground">{item.name}</span>
                                            <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-border my-4" />
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (18%)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-foreground text-xl font-bold pt-2 border-t border-border">
                                <span>Total to Pay</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-6">
                    <div className="bg-card/40 border border-border rounded-3xl p-6 shadow-sm">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Secure Payment
                        </h2>

                        {/* Mock Payment Options */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-4 p-4 border border-primary/50 bg-primary/5 rounded-xl cursor-pointer transition-colors relative overflow-hidden">
                                <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-primary accent-primary" />
                                <div className="flex-1">
                                    <span className="block font-bold">UPI / QR Code</span>
                                    <span className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-black">UPI</div>
                            </label>
                            <label className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-not-allowed opacity-50">
                                <input type="radio" name="payment" disabled className="w-5 h-5" />
                                <div className="flex-1">
                                    <span className="block font-bold">Credit / Debit Card</span>
                                    <span className="text-xs text-muted-foreground">Unavailable in Demo</span>
                                </div>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={processing || items.length === 0}
                            className="w-full mt-8 bg-black text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-left">Pay ₹{total.toLocaleString()}</span>
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Payments are 100% Secure
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
