import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Verify a gate pass token
export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'No token provided'
            }, { status: 400 });
        }

        // Find the transaction with this gate pass token
        const transaction = await prisma.transaction.findFirst({
            where: { gatePassToken: token },
            include: {
                user: {
                    select: { name: true, phoneNumber: true }
                },
                store: {
                    select: { name: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true, category: true }
                        }
                    }
                }
            }
        });

        if (!transaction) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'Invalid or expired gate pass'
            });
        }

        if (!transaction.isPaid) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'Payment not completed'
            });
        }

        if (transaction.isVerified) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'Gate pass already used',
                verifiedAt: transaction.verifiedAt
            });
        }

        // Mark as verified
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                isVerified: true,
                verifiedAt: new Date()
            }
        });

        // Return success with transaction details
        return NextResponse.json({
            success: true,
            valid: true,
            transaction: {
                id: transaction.id,
                customer: {
                    name: transaction.user?.name || 'Customer',
                    phone: transaction.user?.phoneNumber
                },
                store: transaction.store?.name,
                total: Number(transaction.totalAmount),
                items: transaction.items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    category: item.product.category
                })),
                paidAt: transaction.createdAt,
                verifiedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json({
            success: false,
            valid: false,
            message: 'Verification failed'
        }, { status: 500 });
    }
}
