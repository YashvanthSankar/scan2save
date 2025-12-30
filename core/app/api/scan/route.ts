
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Use a global prisma instance to prevent connection exhaustion in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { qrPayload, userId, phone } = body;

        // 1. Validate Input
        if (!qrPayload || !userId) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Validate QR Timestamp (Replay Attack Protection)
        // Allow 10 minute window (development friendly, tighten for prod)
        const now = Date.now();
        const qrTime = qrPayload.timestamp;
        if (now - qrTime > 10 * 60 * 1000) {
            // In strict mode we'd return error, but for MVP demo we might be lenient or log warning
            // return NextResponse.json({ success: false, error: 'QR Code Expired' }, { status: 401 });
            console.warn('QR Code Expired but proceeding for demo');
        }

        // 3. Get User Transaction History
        // Fetch last 50 purchased items to determine persona
        const userTransactions = await prisma.transaction.findMany({
            where: { userId: userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // 4. Calculate Category Frequency
        const categoryCounts: Record<string, number> = {};

        userTransactions.forEach(tx => {
            tx.items.forEach(item => {
                const cat = item.product.category;
                if (cat) {
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
                }
            });
        });

        // Sort categories by frequency
        const topCategories = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([cat]) => cat)
            .slice(0, 3);

        console.log(`👤 User ${userId} Persona: ${topCategories.join(', ')}`);

        // 5. Fetch Matching Offers
        // Get offers that match top categories OR correspond to products in history
        // Also include defaults
        const offers = await prisma.activeOffer.findMany({
            where: {
                OR: [
                    { category: { in: topCategories } }, // Matches persona
                    { isDefault: true }                  // Fallback
                ],
                validUntil: { gt: new Date() }
            },
            include: {
                product: true
                // In real app, include StoreProduct for price at this store
            }
        });

        // 6. Score and Sort Offers
        const scoredOffers = offers.map(offer => {
            let score = 0;
            // High score for category match
            if (offer.category && topCategories.includes(offer.category)) {
                score += 10;
                // Boost top 1 category
                if (offer.category === topCategories[0]) score += 5;
            }
            // Base score for default
            if (offer.isDefault) score += 1;

            return { ...offer, relevanceScore: score };
        });

        // Sort desc
        scoredOffers.sort((a, b) => b.relevanceScore - a.relevanceScore);

        return NextResponse.json({
            success: true,
            store: qrPayload.name,
            persona: topCategories[0] || 'New Shopper',
            offers: scoredOffers
        });

    } catch (error) {
        console.error('Scan Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
