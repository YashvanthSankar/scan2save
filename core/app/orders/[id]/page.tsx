import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle2, MapPin, Calendar, Hash, Store, CreditCard } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface InvoicePageProps {
    params: Promise<{ id: string }>;
}

async function getTransaction(id: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, phoneNumber: true }
                },
                store: {
                    select: { name: true, location: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true, category: true, imageUrl: true }
                        }
                    }
                }
            }
        });
        return transaction;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return null;
    }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    const { id } = await params;
    const transaction = await getTransaction(id);

    if (!transaction) {
        return notFound();
    }

    const subtotal = transaction.items.reduce((sum, item) => sum + (Number(item.priceAtPurchase) * item.quantity), 0);
    const tax = subtotal * 0.18;
    const total = Number(transaction.totalAmount);

    return (
        <div className="min-h-screen text-foreground p-6 md:p-12 relative font-sans">
            <Link href="/orders" className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
            </Link>

            <div className="max-w-2xl mx-auto">
                {/* Invoice Header */}
                <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl overflow-hidden shadow-lg">

                    {/* Top Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Tax Invoice</h1>
                                <p className="text-white/70 text-sm">Scan2Save Digital Receipt</p>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${transaction.isPaid ? 'bg-white/20' : 'bg-orange-500'}`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {transaction.isPaid ? 'Paid' : 'Pending'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-6 space-y-6">

                        {/* Order Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Hash className="w-4 h-4" />
                                <span>Order ID</span>
                            </div>
                            <div className="text-right font-mono text-foreground">{id.slice(0, 8).toUpperCase()}</div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Date</span>
                            </div>
                            <div className="text-right text-foreground">
                                {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                                <span>Store</span>
                            </div>
                            <div className="text-right text-foreground">{transaction.store?.name || 'Online'}</div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Location</span>
                            </div>
                            <div className="text-right text-foreground text-xs">{transaction.store?.location || 'N/A'}</div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Items List */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4">Items Purchased</h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
                                                <img
                                                    src={item.product.imageUrl || 'https://placehold.co/100'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.product.category} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-foreground">₹{(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Totals */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>GST (18%)</span>
                                <span>₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                                <span>Total Paid</span>
                                <span className="text-primary">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Payment Method</p>
                                <p className="text-xs text-muted-foreground">UPI / Digital Payment</p>
                            </div>
                        </div>

                        {/* Gate Pass */}
                        {transaction.gatePassToken && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                                <p className="text-sm font-bold text-emerald-500 mb-1">Exit Gate Pass</p>
                                <p className="font-mono text-lg text-foreground tracking-widest">{transaction.gatePassToken}</p>
                                <p className="text-xs text-muted-foreground mt-1">Show this at exit for verification</p>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="bg-muted/30 p-4 text-center border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            Thank you for shopping with Scan2Save!
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
