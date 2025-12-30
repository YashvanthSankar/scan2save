/**
 * AI Recommendation Engine - Main Entry Point
 * 
 * This engine uses Google Gemini AI to analyze purchase patterns
 * and generate personalized offer recommendations.
 * 
 * Usage:
 * ```typescript
 * import { GeminiRecommender } from '@/services/recommendation-engine';
 * 
 * const ai = new GeminiRecommender();
 * const result = await ai.getAIRecommendations(user.purchaseHistory, offers, store);
 * ```
 */

// Main AI Recommender
export { GeminiRecommender } from './GeminiRecommender';
export { GeminiClient, getGeminiClient } from './GeminiClient';

// Type exports
export * from './types';

// Default export
export { GeminiRecommender as default } from './GeminiRecommender';
