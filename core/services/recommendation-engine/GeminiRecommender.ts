/**
 * GeminiRecommender - LLM-Powered Recommendation Engine
 * 
 * Uses Google Gemini AI to:
 * 1. Analyze purchase patterns with natural language understanding
 * 2. Generate personalized persona descriptions
 * 3. Match offers with intelligent reasoning
 * 4. Provide human-readable explanations for recommendations
 */

import { GeminiClient, getGeminiClient } from './GeminiClient';
import {
    PurchaseHistoryItem,
    ActiveOffer,
    UserPersona,
    ScoredOffer,
    StoreContext
} from './types';

// AI Response Types
interface AIPersonaAnalysis {
    personaLabel: string;
    primaryCategory: string;
    secondaryCategories: string[];
    shoppingPattern: string;
    insights: string[];
}

interface AIOfferRecommendation {
    offerId: number;
    relevanceScore: number;
    reasoning: string;
    isPersonalized: boolean;
}

interface AIRecommendationResponse {
    persona: AIPersonaAnalysis;
    recommendations: AIOfferRecommendation[];
    summary: string;
}

export class GeminiRecommender {
    private client: GeminiClient;

    constructor(apiKey?: string) {
        this.client = getGeminiClient(apiKey);
    }

    /**
     * Analyze user persona using AI
     */
    async analyzePersonaWithAI(history: PurchaseHistoryItem[]): Promise<UserPersona> {
        if (!history.length) {
            return {
                primaryCategory: 'General',
                secondaryCategories: [],
                categoryScores: {},
                totalPurchases: 0,
                averageSpend: 0,
                personaLabel: 'New Shopper'
            };
        }

        // Prepare purchase summary for AI
        const purchaseSummary = history.slice(0, 20).map(item => ({
            product: item.productName,
            category: item.category,
            quantity: item.quantity,
            price: item.priceAtPurchase
        }));

        const prompt = `You are a retail analytics AI. Analyze this customer's purchase history and determine their shopping persona.

PURCHASE HISTORY:
${JSON.stringify(purchaseSummary, null, 2)}

Analyze the patterns and respond with:
{
  "personaLabel": "A creative, descriptive persona name (e.g., 'Health-Conscious Athlete', 'Busy Parent', 'Gourmet Home Chef')",
  "primaryCategory": "The main product category they buy most",
  "secondaryCategories": ["Other categories they show interest in"],
  "shoppingPattern": "A brief description of their shopping habits",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"]
}`;

        try {
            const analysis = await this.client.generateJSON<AIPersonaAnalysis>(prompt);

            // Calculate category scores from history
            const categoryScores: Record<string, number> = {};
            let totalSpend = 0;

            history.forEach(item => {
                const cat = item.category || 'Uncategorized';
                categoryScores[cat] = (categoryScores[cat] || 0) + item.quantity;
                totalSpend += item.priceAtPurchase * item.quantity;
            });

            return {
                primaryCategory: analysis.primaryCategory,
                secondaryCategories: analysis.secondaryCategories,
                categoryScores,
                totalPurchases: history.length,
                averageSpend: totalSpend / history.length,
                personaLabel: analysis.personaLabel
            };
        } catch (error) {
            console.error('AI persona analysis failed, falling back to rule-based:', error);
            // Fallback to simple analysis
            return this.fallbackPersonaAnalysis(history);
        }
    }

    /**
     * Get AI-powered offer recommendations with reasoning
     */
    async getAIRecommendations(
        history: PurchaseHistoryItem[],
        offers: ActiveOffer[],
        store: StoreContext
    ): Promise<{ persona: UserPersona; offers: ScoredOffer[]; aiSummary: string }> {

        const purchaseSummary = history.slice(0, 15).map(item => ({
            product: item.productName,
            category: item.category,
            quantity: item.quantity
        }));

        const offerSummary = offers.map(offer => ({
            id: offer.id,
            title: offer.title,
            product: offer.productName,
            category: offer.category || offer.productCategory,
            discount: offer.discountPercentage
        }));

        const prompt = `You are an AI shopping assistant for ${store.storeName}. 
        
Analyze this customer's purchase history and recommend the most relevant offers.

CUSTOMER PURCHASE HISTORY:
${JSON.stringify(purchaseSummary, null, 2)}

AVAILABLE OFFERS:
${JSON.stringify(offerSummary, null, 2)}

Provide personalized recommendations:
{
  "persona": {
    "personaLabel": "Creative persona name based on their shopping",
    "primaryCategory": "Their main interest category",
    "secondaryCategories": ["Other interests"],
    "shoppingPattern": "Brief pattern description",
    "insights": ["Insight 1", "Insight 2"]
  },
  "recommendations": [
    {
      "offerId": <offer id number>,
      "relevanceScore": <1-100 score>,
      "reasoning": "Why this offer is perfect for them",
      "isPersonalized": true
    }
  ],
  "summary": "A friendly 1-2 sentence summary of why these offers were selected"
}

Order recommendations by relevance. Include at least 3 offers if available.`;

        try {
            const response = await this.client.generateJSON<AIRecommendationResponse>(prompt);

            // Build persona from AI response
            const categoryScores: Record<string, number> = {};
            history.forEach(item => {
                const cat = item.category || 'Uncategorized';
                categoryScores[cat] = (categoryScores[cat] || 0) + item.quantity;
            });

            const persona: UserPersona = {
                primaryCategory: response.persona.primaryCategory,
                secondaryCategories: response.persona.secondaryCategories,
                categoryScores,
                totalPurchases: history.length,
                averageSpend: history.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0) / Math.max(history.length, 1),
                personaLabel: response.persona.personaLabel
            };

            // Map AI recommendations to ScoredOffers
            const scoredOffers: ScoredOffer[] = response.recommendations
                .map(rec => {
                    const offer = offers.find(o => o.id === rec.offerId);
                    if (!offer) return null;

                    return {
                        ...offer,
                        relevanceScore: rec.relevanceScore,
                        matchReason: rec.reasoning,
                        isPersonalized: rec.isPersonalized
                    };
                })
                .filter((o): o is ScoredOffer => o !== null);

            return {
                persona,
                offers: scoredOffers,
                aiSummary: response.summary
            };

        } catch (error) {
            console.error('AI recommendation failed:', error);
            throw error;
        }
    }

    /**
     * Fallback rule-based analysis when AI fails
     */
    private fallbackPersonaAnalysis(history: PurchaseHistoryItem[]): UserPersona {
        const categoryScores: Record<string, number> = {};
        let totalSpend = 0;

        history.forEach(item => {
            const cat = item.category || 'Uncategorized';
            categoryScores[cat] = (categoryScores[cat] || 0) + item.quantity;
            totalSpend += item.priceAtPurchase * item.quantity;
        });

        const sortedCategories = Object.entries(categoryScores)
            .sort(([, a], [, b]) => b - a)
            .map(([cat]) => cat);

        return {
            primaryCategory: sortedCategories[0] || 'General',
            secondaryCategories: sortedCategories.slice(1, 3),
            categoryScores,
            totalPurchases: history.length,
            averageSpend: totalSpend / history.length,
            personaLabel: 'Smart Shopper'
        };
    }
}

export default GeminiRecommender;
