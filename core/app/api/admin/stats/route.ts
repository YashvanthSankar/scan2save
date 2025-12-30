import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch counts in parallel
        const [storeCount, userCount, transactionCount, recentStores] = await Promise.all([
            prisma.store.count({ where: { isActive: true } }),
            prisma.user.count(),
            prisma.transaction.count(),
            prisma.store.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    storeId: true,
                    name: true,
                    location: true,
                    isActive: true,
                    createdAt: true
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                stores: storeCount,
                users: userCount,
                transactions: transactionCount
            },
            recentStores
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}
