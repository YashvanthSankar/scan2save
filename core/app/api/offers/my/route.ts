
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie?.value) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const userId = session.userId;

        const claims = await prisma.claimedOffer.findMany({
            where: { userId: userId },
            include: {
                offer: {
                    include: {
                        product: true
                    }
                },
                store: true
            },
            orderBy: { claimedAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            offers: claims
        });

    } catch (error) {
        console.error('My Offers Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
    }
}
