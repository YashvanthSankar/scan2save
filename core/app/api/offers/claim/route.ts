
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { offerId, storeId } = body;

        // 1. Get userId from session
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie?.value) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        const userId = session.userId;

        if (!offerId || !storeId) {
            return NextResponse.json({ success: false, error: 'Missing Data' }, { status: 400 });
        }

        // 2. Check if already claimed
        const existingClaim = await prisma.claimedOffer.findFirst({
            where: {
                userId: userId,
                offerId: offerId,
                storeId: storeId
            }
        });

        if (existingClaim) {
            return NextResponse.json({
                success: true,
                message: 'Already claimed',
                discountCode: existingClaim.discountCode
            });
        }

        // 3. Create Claim
        const newClaim = await prisma.claimedOffer.create({
            data: {
                userId: userId,
                offerId: offerId,
                storeId: storeId,
                discountCode: `SAVE-${offerId}-${Math.floor(Math.random() * 10000)}`
            }
        });

        return NextResponse.json({
            success: true,
            discountCode: newClaim.discountCode
        });

    } catch (error) {
        console.error('Claim Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to claim offer' }, { status: 500 });
    }
}
