/**
 * Gemini AI Client for the Recommendation Engine
 * 
 * This module provides the interface to Google's Gemini API
 * for intelligent purchase pattern analysis and offer recommendations.
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface GeminiConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor(config: GeminiConfig) {
        if (!config.apiKey) {
            throw new Error('Gemini API key is required. Set GEMINI_API_KEY environment variable.');
        }

        this.genAI = new GoogleGenerativeAI(config.apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: config.model || 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: config.maxTokens || 1024,
                temperature: config.temperature || 0.7,
            }
        });
    }

    /**
     * Send a prompt to Gemini and get a response
     */
    async generate(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }

    /**
     * Generate JSON response (structured output)
     */
    async generateJSON<T>(prompt: string): Promise<T> {
        const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON, no markdown code blocks, no explanation.`;

        const response = await this.generate(jsonPrompt);

        // Clean response - remove any markdown formatting
        const cleanedResponse = response
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        try {
            return JSON.parse(cleanedResponse) as T;
        } catch (error) {
            console.error('Failed to parse Gemini JSON response:', cleanedResponse);
            throw new Error('Invalid JSON response from AI');
        }
    }
}

// Singleton instance for reuse
let geminiInstance: GeminiClient | null = null;

export function getGeminiClient(apiKey?: string): GeminiClient {
    if (!geminiInstance) {
        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }
        geminiInstance = new GeminiClient({ apiKey: key });
    }
    return geminiInstance;
}

export default GeminiClient;
