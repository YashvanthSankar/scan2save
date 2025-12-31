import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle2, MapPin, Calendar, Hash, Store, CreditCard, Sparkles, Receipt } from 'lucide-react';
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
        <div className="min-h-screen text-foreground p-6 md:p-12 relative font-sans pb-24">
            <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Orders
            </Link>

            <div className="max-w-2xl mx-auto">
                {/* Invoice Card */}
                <div className="premium-card overflow-hidden">

                    {/* Header Gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-8 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                                  radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                            }} />
                        </div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Receipt className="w-6 h-6" />
                                    <span className="text-white/70 text-sm font-medium">Scan2Save</span>
                                </div>
                                <h1 className="text-3xl font-bold mb-1">Tax Invoice</h1>
                                <p className="text-white/70 text-sm">Digital Receipt</p>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${transaction.isPaid ? 'bg-white/20 backdrop-blur-sm' : 'bg-amber-500'}`}>
                                <div className={`w-2 h-2 rounded-full ${transaction.isPaid ? 'bg-emerald-400' : 'bg-white'} animate-pulse`} />
                                {transaction.isPaid ? 'Paid' : 'Pending'}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-6 md:p-8 space-y-6">

                        {/* Order Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Hash className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Order ID</span>
                                    <span className="font-mono text-sm text-foreground">{id.slice(0, 8).toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Date</span>
                                    <span className="text-sm text-foreground">
                                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                    <Store className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Store</span>
                                    <span className="text-sm text-foreground">{transaction.store?.name || 'Online'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Location</span>
                                    <span className="text-sm text-foreground truncate">{transaction.store?.location || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="divider" />

                        {/* Items List */}
                        <div>
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Items Purchased
                            </h3>
                            <div className="space-y-3">
                                {transaction.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-white/5">
                                                <img
                                                    src={item.product.imageUrl || 'https://placehold.co/100'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.product.category} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-foreground">₹{(Number(item.priceAtPurchase) * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="divider" />

                        {/* Totals */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>GST (18%)</span>
                                <span className="text-foreground">₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="divider" />
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span>Total Paid</span>
                                <span className="gradient-text">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-4 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Payment Method</p>
                                <p className="text-xs text-muted-foreground">UPI / Digital Payment</p>
                            </div>
                        </div>

                        {/* Gate Pass */}
                        {transaction.gatePassToken && (
                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <p className="text-sm font-bold text-emerald-400">Exit Gate Pass</p>
                                </div>
                                <p className="font-mono text-3xl font-bold text-foreground tracking-[0.3em] mb-2">{transaction.gatePassToken}</p>
                                <p className="text-xs text-muted-foreground">Show this at exit for verification</p>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="bg-white/[0.02] p-5 text-center border-t border-white/5">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Thank you for shopping with Scan2Save!
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
