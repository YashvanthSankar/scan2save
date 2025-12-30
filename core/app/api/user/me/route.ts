import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/session';

// Use global prisma to avoid connection limits in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    console.log('API: /api/user/me called'); // DEBUG
    try {
        const session = await getSession();
        console.log('API: Session:', session); // DEBUG
        if (!session || !session.userId) {
            console.log('API: No session or userId');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5, // Get recent 5 for dashboard/profile summary
                    include: {
                        store: true,
                        items: true
                    }
                },
                claimedOffers: true
            }
        });

        if (!user) {
            console.log('API: User not found in DB for ID:', session.userId);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('API: User found:', user.id);

        // Calculate Stats
        // 1. Total Spend
        const totalSpent = user.transactions.reduce((sum, tx) => sum + Number(tx.totalAmount), 0);

        // 2. Points (Mock Logic: 10% of spend)
        const points = Math.floor(totalSpent * 0.1);

        // 3. Total Saved (Mock Logic: Random 5-15% of spend + sum of claimed offers if tracked)
        // For now, we'll estimate it as 12% of total spend for the demo if not explicitly tracked
        const totalSaved = Math.floor(totalSpent * 0.12);

        // 4. Format Transactions for UI
        const recentActivity = user.transactions.map(tx => ({
            id: tx.id,
            store: tx.store?.name || 'Unknown Store',
            loc: tx.store?.location || 'Online',
            date: tx.createdAt,
            items: tx.items.length,
            total: Number(tx.totalAmount),
            status: tx.isPaid ? 'Completed' : 'Pending'
        }));

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name || 'User',
                phone: user.phoneNumber,
                memberSince: user.createdAt,
                role: user.role
            },
            stats: {
                totalSaved,
                totalSpent,
                points,
                voucherCount: user.claimedOffers.filter(o => !o.isUsed).length
            },
            history: recentActivity
        });

    } catch (error) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
