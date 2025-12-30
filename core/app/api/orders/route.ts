import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// POST: Create a new order/transaction from cart
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie?.value) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let session;
        try {
            session = JSON.parse(sessionCookie.value);
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const userId = session.userId;
        if (!userId) {
            return NextResponse.json({ success: false, error: 'No user ID in session' }, { status: 401 });
        }

        // Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                store: true
            }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
        }

        // Calculate total
        const storeProducts = await prisma.storeProduct.findMany({
            where: {
                storeId: cart.storeId,
                productId: { in: cart.items.map(i => i.productId) }
            }
        });

        const priceMap = new Map(storeProducts.map(sp => [sp.productId, Number(sp.price)]));

        let totalAmount = 0;
        const transactionItems = cart.items.map(item => {
            const price = priceMap.get(item.productId) || 0;
            totalAmount += price * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: price
            };
        });

        // Add 18% tax
        totalAmount = totalAmount * 1.18;

        // Generate gate pass token
        const gatePassToken = `GP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create transaction
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                storeId: cart.storeId,
                totalAmount,
                isPaid: true,
                gatePassToken,
                items: {
                    create: transactionItems
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                store: true
            }
        });

        // Clear the cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        return NextResponse.json({
            success: true,
            order: {
                id: transaction.id,
                total: Number(transaction.totalAmount),
                gatePassToken: transaction.gatePassToken,
                store: transaction.store?.name,
                itemCount: transaction.items.length,
                createdAt: transaction.createdAt
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }
}

// GET: Get user's orders
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie?.value) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let session;
        try {
            session = JSON.parse(sessionCookie.value);
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
        }

        const userId = session.userId;

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                store: {
                    select: { name: true, location: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true, category: true }
                        }
                    }
                }
            }
        });

        const orders = transactions.map(t => ({
            id: t.id,
            date: t.createdAt,
            store: t.store?.name || 'Unknown Store',
            location: t.store?.location || '',
            total: Number(t.totalAmount),
            isPaid: t.isPaid,
            isVerified: t.isVerified,
            gatePassToken: t.gatePassToken,
            items: t.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.priceAtPurchase),
                image: item.product.imageUrl,
                category: item.product.category
            }))
        }));

        return NextResponse.json({ success: true, orders });

    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}
