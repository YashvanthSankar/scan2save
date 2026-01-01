
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getGroqClient } from '@/services/recommendation-engine/GroqClient';

// Use a global prisma instance to prevent connection exhaustion in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { qrPayload, userId } = body;

        // 1. Validate Input
        if (!qrPayload || !userId) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // OPTIMIZATION: Fetch user history and offers in parallel
        const [userTransactions, allOffers] = await Promise.all([
            // User Transaction History (Last 10)
            prisma.transaction.findMany({
                where: { userId: userId },
                include: {
                    items: {
                        include: { product: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            // All Valid Active Offers
            prisma.activeOffer.findMany({
                where: { validUntil: { gt: new Date() } },
                include: { product: true }
            })
        ]);

        const hasHistory = userTransactions.length > 0;
        let recommendedOffers: any[] = [];
        let persona = 'New Shopper';

        // 4. PERSONALIZATION LOGIC
        if (hasHistory) { // Try personalization if history exists
            try {
                // A. Prepare Context for AI
                const purchaseHistory = userTransactions.flatMap(tx => tx.items.map(i => i.product.name)).join(', ');
                const availableOffers = allOffers.map(o => ({ id: o.id, title: o.title, category: o.category }));

                // B. Call Groq
                const groq = getGroqClient();
                const prompt = `
                    User History: ${purchaseHistory}
                    Available Offers: ${JSON.stringify(availableOffers)}
                    
                    Task: Select the top 5 offers that best match the user's purchase history.
                    Return JSON: { "offerIds": [1, 2, 3], "persona": "e.g. Health Nut", "reason": "Why these match" }
                `;

                const aiResponse = await groq.generateJSON<{ offerIds: number[], persona: string, reason: string }>(prompt);

                // C. Filter Offers based on AI selection
                recommendedOffers = allOffers
                    .filter(o => aiResponse.offerIds.includes(o.id))
                    .map(o => ({
                        ...o,
                        relevanceScore: 100, // Top Score for AI picks
                        matchReason: aiResponse.reason
                    }));

                persona = aiResponse.persona || 'Loyal Customer';
                console.log(`✨ AI Personalization success for ${userId}: ${persona}`);

            } catch (error) {
                console.error("AI Recommendation Failed, falling back to basic logic", error);
                // Fallback to basic if AI fails is handled below (recommendedOffers will be empty)
            }
        }

        // 5. FALLBACK / GENERALIZED LOGIC
        // If no AI results (no history, no key, or error), use "Trending" / Default Logic
        if (recommendedOffers.length === 0) {
            persona = hasHistory ? 'Regular Shopper' : 'Trending Now'; // Branding for new users

            // Strategy: Show Default offers + High Discount offers
            recommendedOffers = allOffers
                .map(o => {
                    let score = 0;
                    if (o.isDefault) score += 50;
                    score += o.discountPercentage; // Higher discount = higher score
                    return { ...o, relevanceScore: score, matchReason: 'Trending Offer' };
                })
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, 5);
        }

        return NextResponse.json({
            success: true,
            store: qrPayload.name,
            persona: persona,
            offers: recommendedOffers
        });

    } catch (error) {
        console.error('Scan Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
