'use client';

import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';
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
        return { label: 'Completed', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 };
      case 'isPaid':
        return { label: 'Paid - Awaiting Pickup', color: 'bg-blue-500/10 text-blue-500', icon: Package };
      default:
        return { label: 'Pending Payment', color: 'bg-orange-500/10 text-orange-500', icon: Clock };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-6 md:p-12 relative">
      <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">No Orders Yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Start shopping to see your order history here.</p>
          <Link href="/scan" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-primary/90">
            Scan a Store QR
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => {
            const statusInfo = getStatusDisplay(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/20 transition-colors">

                {/* Order Header */}
                <div className="bg-muted/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b border-border">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="block text-muted-foreground text-xs uppercase">Order Placed</span>
                      <span className="text-foreground">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs uppercase">Total</span>
                      <span className="text-foreground font-bold">₹{order.total.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs uppercase">Order ID</span>
                      <span className="text-foreground font-mono text-xs">#{order.id.slice(0, 8)}</span>
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
                    <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary/50 rounded-full" />
                          <span>{item.name}</span>
                          {item.quantity > 1 && <span className="text-xs">×{item.quantity}</span>}
                        </div>
                        <span className="text-foreground">₹{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-5">+ {order.items.length - 3} more items</p>
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