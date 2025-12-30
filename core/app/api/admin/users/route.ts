import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                phoneNumber: true,
                name: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { transactions: true }
                }
            }
        });

        // Calculate total spent per user (simplified - just count transactions)
        const usersWithStats = users.map(u => ({
            id: u.id,
            phone: u.phoneNumber,
            name: u.name || 'Anonymous',
            role: u.role,
            joinedAt: u.createdAt,
            transactionCount: u._count.transactions
        }));

        return NextResponse.json({ success: true, users: usersWithStats });
    } catch (error) {
        console.error('Users fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}
