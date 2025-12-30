/**
 * AI Client for the Recommendation Engine (Powered by Groq)
 * 
 * Replaced Gemini with Groq for faster inference.
 */

// import { GoogleGenerativeAI } from '@google/generative-ai'; // Removed

export interface AIConfig {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

export class GroqClient {
    private apiKey: string;
    private model: string;
    private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

    constructor(config: AIConfig) {
        if (!config.apiKey) {
            throw new Error('Groq API key is required. Set GROQ_API_KEY environment variable.');
        }

        this.apiKey = config.apiKey;
        // Map old gemini models to groq models if necessary, or default to a supported model
        // Using llama-3.3-70b-versatile which is the current reliable standard on Groq
        this.model = config.model?.includes('gemini') ? 'llama-3.3-70b-versatile' : (config.model || 'llama-3.3-70b-versatile');
    }

    /**
     * Send a prompt to Groq and get a response
     */
    async generate(prompt: string): Promise<string> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: this.model,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('AI API Error:', error);
            throw new Error('Failed to get AI response');
        }
    }

    /**
     * Generate JSON response (structured output)
     */
    async generateJSON<T>(prompt: string): Promise<T> {
        const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON, no markdown code blocks, no explanation, no prologue. Start the response with { and end with }.`;

        const response = await this.generate(jsonPrompt);

        // Clean response - remove any markdown formatting
        const cleanedResponse = response
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        try {
            return JSON.parse(cleanedResponse) as T;
        } catch (error) {
            console.error('Failed to parse AI JSON response:', cleanedResponse);
            // Attempt to find JSON object if mixed with text
            const match = cleanedResponse.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    return JSON.parse(match[0]) as T;
                } catch (e) {
                    throw new Error('Invalid JSON response from AI');
                }
            }
            throw new Error('Invalid JSON response from AI');
        }
    }
}

// Singleton instance for reuse
let groqInstance: GroqClient | null = null;

export function getGroqClient(apiKey?: string): GroqClient {
    if (!groqInstance) {
        // Prefer explicit key, then GROQ env, then fall back to GEMINI env (renamed)
        const key = apiKey || process.env.GROQ_API_KEY;

        if (!key) {
            throw new Error('GROQ_API_KEY environment variable is not set. Please add it to your .env file.');
        }
        groqInstance = new GroqClient({ apiKey: key });
    }
    return groqInstance;
}

export default GroqClient;
