'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle2, ShoppingBag, Loader2, ChevronRight, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  store: string;
  total: number;
  status: 'isPaid' | 'isVerified' | 'pending';
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();

        if (data.success && data.orders) {
          const mappedOrders: Order[] = data.orders.map((t: any) => ({
            id: t.id,
            date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            store: t.store || 'Unknown Store',
            total: t.total,
            status: t.isPaid ? (t.isVerified ? 'isVerified' : 'isPaid') : 'pending',
            items: t.items?.map((item: any) => ({
              name: item.name || 'Product',
              quantity: item.quantity || 1,
              price: item.price || 0
            })) || []
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'isVerified':
        return {
          label: 'Completed',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: CheckCircle2,
          dotColor: 'bg-emerald-400'
        };
      case 'isPaid':
        return {
          label: 'Paid',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: Package,
          dotColor: 'bg-blue-400'
        };
      default:
        return {
          label: 'Pending',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: Clock,
          dotColor: 'bg-amber-400'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-6 md:p-12 relative pb-24">
      {/* Header */}
      <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground text-sm">{orders.length} orders placed</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="premium-card text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted/50 rounded-3xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground text-sm mb-8">Start shopping to see your order history here.</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Scan a Store QR
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {orders.map((order, index) => {
            const statusInfo = getStatusDisplay(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="premium-card overflow-hidden animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                {/* Order Header */}
                <div className="bg-white/[0.02] p-4 md:p-5 flex flex-wrap justify-between items-center gap-4 border-b border-white/5">
                  <div className="flex flex-wrap gap-4 md:gap-8 text-sm">
                    <div>
                      <span className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Order Placed</span>
                      <span className="text-foreground font-medium">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Total</span>
                      <span className="text-foreground font-bold">₹{order.total.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Order ID</span>
                      <span className="text-foreground font-mono text-xs">#{order.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20"
                  >
                    <Receipt className="w-4 h-4" />
                    <span className="hidden sm:inline">View Invoice</span>
                  </Link>
                </div>

                {/* Order Body */}
                <div className="p-4 md:p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-foreground">{order.store}</h3>
                    <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border ${statusInfo.color}`}>
                      <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`} />
                      <StatusIcon className="w-4 h-4" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary/50 to-violet-500/50 rounded-full" />
                          <span className="text-foreground">{item.name}</span>
                          {item.quantity > 1 && <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">×{item.quantity}</span>}
                        </div>
                        <span className="text-foreground font-medium">₹{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-5 mt-2">+ {order.items.length - 3} more items</p>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}