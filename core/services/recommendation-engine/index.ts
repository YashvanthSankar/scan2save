/**
 * AI Recommendation Engine - Main Entry Point
 * 
 * This engine uses Groq AI (Llama 3) to analyze purchase patterns
 * and generate personalized offer recommendations.
 * 
 * Usage:
 * ```typescript
 * import { GroqRecommender } from '@/services/recommendation-engine';
 * 
 * const ai = new GroqRecommender();
 * const result = await ai.getAIRecommendations(user.purchaseHistory, offers, store);
 * ```
 */

// Main AI Recommender
export { GroqRecommender } from './GroqRecommender';
export { GroqClient, getGroqClient } from './GroqClient';

// Type exports
export * from './types';

// Default export
export { GroqRecommender as default } from './GroqRecommender';
