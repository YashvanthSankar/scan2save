'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-8842",
      date: "Dec 28, 2025",
      store: "Reliance Digital",
      total: 26990,
      status: "Processing",
      items: ["Sony WH-1000XM5"]
    },
    {
      id: "ORD-7731",
      date: "Dec 15, 2025",
      store: "Croma Electronics",
      total: 89990,
      status: "Delivered",
      items: ["MacBook Air M2", "Laptop Sleeve"]
    }
  ];

  return (
    <div className="min-h-screen text-foreground p-6 md:p-12 relative">
      <Link href="/profile" className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
      </Link>

      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6 max-w-4xl">
        {orders.map((order) => (
          <div key={order.id} className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm">

            {/* Order Header */}
            <div className="bg-muted/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-border">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs uppercase">Order Placed</span>
                  <span className="text-foreground">{order.date}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase">Total</span>
                  <span className="text-foreground">₹{order.total.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs uppercase">Order ID</span>
                  <span className="text-foreground">#{order.id}</span>
                </div>
              </div>

              <Link href={`/orders/${order.id}`} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                View Invoice
              </Link>
            </div>

            {/* Order Body */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-foreground">{order.store}</h3>
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                  {order.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {order.status}
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}