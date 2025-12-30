'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, CreditCard, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');

  // Hardcoded for demo - normally you'd use a Context or Redux here
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Sony WH-1000XM5",
      price: 26990,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
      quantity: 1
    }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Simulate processing
    setCheckoutStep('success');
  };

  if (checkoutStep === 'success') {
    return (
      <div className="min-h-screen text-foreground flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Your order #8842 has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-6 md:p-12 font-sans relative">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-card/40 backdrop-blur-md border border-border p-4 rounded-xl shadow-sm">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="font-bold text-foreground">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-muted-foreground text-sm">
                  <span>Qty: {item.quantity}</span>
                  <button className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center py-12 bg-card/40 rounded-xl border border-border">
              <p className="text-muted-foreground">Your cart is empty.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl h-fit shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-foreground">Order Summary</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-4" />
            <div className="flex justify-between text-foreground text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all opacity-80 cursor-not-allowed shadow-md"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pay ₹{total.toLocaleString()}
            </span>
            <span className="text-xs font-normal opacity-70">🚀 Payment Gateway Coming Soon!</span>
          </button>
        </div>
      </div>
    </div>
  );
}