'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, CreditCard, Minus, Plus, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import ShoppingRoute from '@/components/ShoppingRoute';

export default function CartPage() {
  const { items, removeItem, addItem, decrementItem, totalItems, totalAmount, loading } = useCart();

  const tax = totalAmount * 0.18;
  const total = totalAmount + tax;

  const continueShoppingLink = items.length > 0 && items[0].storeId ? `/store/${items[0].storeId}` : '/dashboard';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
          <p className="text-muted-foreground text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="premium-card p-12 max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-3xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Start shopping to add items to your cart.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-6 md:p-12 font-sans relative pb-32">
      {/* Header */}
      <Link href={continueShoppingLink} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Continue Shopping
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-muted-foreground text-sm">{totalItems} items ready for checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shopping Route Navigation */}
        <div className="lg:col-span-2">
          <ShoppingRoute items={items} />
        </div>

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="premium-card flex gap-4 p-4 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              {/* Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                <img
                  src={item.image || `https://placehold.co/200x200/1e293b/ffffff?text=${encodeURIComponent(item.name.substring(0, 2))}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{item.name}</h3>
                    {(item as any).discountLabel && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full mt-1.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        {(item as any).discountLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {(item as any).originalPrice > item.price && (
                      <p className="text-xs text-muted-foreground line-through decoration-rose-500/50">
                        ₹{((item as any).originalPrice * item.quantity).toLocaleString()}
                      </p>
                    )}
                    <p className="font-bold text-lg text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gradient-to-r from-indigo-600/10 to-violet-600/10 rounded-xl border border-indigo-500/20">
                    <button
                      onClick={() => decrementItem(item.productId)}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-l-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => addItem({ id: item.productId, name: item.name, price: item.price, image: item.image }, item.storeId || '')}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-r-xl transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="premium-card p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-foreground font-medium">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span className="text-foreground font-medium">₹{tax.toLocaleString()}</span>
              </div>

              <div className="divider" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="gradient-text">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] hover:bg-right text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <CreditCard className="w-5 h-5" />
              <span>Checkout ₹{total.toLocaleString()}</span>
            </Link>

            {/* Trust Badge */}
            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Secure Payment Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}