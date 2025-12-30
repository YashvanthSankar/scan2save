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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 max-w-md mb-8">
          Your order #8842 has been placed successfully. You will receive an email confirmation shortly.
        </p>
        <Link href="/" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
              <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-bold">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                  <span>Qty: {item.quantity}</span>
                  <button className="text-red-400 hover:text-red-300 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
              <p className="text-gray-400">Your cart is empty.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-800 my-4" />
            <div className="flex justify-between text-white text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all opacity-80 cursor-not-allowed"
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