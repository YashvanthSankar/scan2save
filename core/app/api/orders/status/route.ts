import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Check verification status of a transaction by gate pass token
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({
                success: false,
                error: 'Token required'
            }, { status: 400 });
        }

        const transaction = await prisma.transaction.findFirst({
            where: { gatePassToken: token },
            select: {
                id: true,
                isVerified: true,
                verifiedAt: true,
                isPaid: true
            }
        });

        if (!transaction) {
            return NextResponse.json({
                success: false,
                error: 'Transaction not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            verified: transaction.isVerified,
            verifiedAt: transaction.verifiedAt,
            isPaid: transaction.isPaid
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to check status'
        }, { status: 500 });
    }
}
