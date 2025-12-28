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
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <Link href="/profile" className="flex items-center text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
      </Link>

      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6 max-w-4xl">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            
            {/* Order Header */}
            <div className="bg-gray-800/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-800">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="block text-gray-500 text-xs uppercase">Order Placed</span>
                  <span className="text-gray-300">{order.date}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase">Total</span>
                  <span className="text-gray-300">₹{order.total.toLocaleString()}</span>
                </div>
                <div>
                   <span className="block text-gray-500 text-xs uppercase">Order ID</span>
                   <span className="text-gray-300">#{order.id}</span>
                </div>
              </div>
              
              <Link href={`/orders/${order.id}`} className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200">
                View Invoice
              </Link>
            </div>

            {/* Order Body */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{order.store}</h3>
                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {order.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {order.status}
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-2 h-2 bg-gray-700 rounded-full" />
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