# AI Recommendation Engine

A Gemini AI-powered recommendation engine for the Scan2Save platform.

## Architecture

```
services/recommendation-engine/
├── types.ts              # TypeScript interfaces
├── GeminiClient.ts       # Gemini API wrapper
├── GeminiRecommender.ts  # Main AI recommendation logic
└── index.ts              # Exports
```

## Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env`:
```bash
GEMINI_API_KEY=your-api-key-here
```

## Usage

```typescript
import { GeminiRecommender } from '../services/recommendation-engine';

const ai = new GeminiRecommender();

// Full AI recommendations with reasoning
const result = await ai.getAIRecommendations(
  purchaseHistory,  // User's past purchases
  activeOffers,     // Available offers
  storeContext      // Current store info
);

// result.persona.personaLabel → "Health-Conscious Athlete"
// result.offers → Sorted by AI-determined relevance
// result.aiSummary → "Based on your fitness purchases..."
```

## How It Works

1. **Purchase Analysis**: Sends purchase history to Gemini
2. **Persona Generation**: AI creates a descriptive persona label
3. **Offer Matching**: AI scores each offer with reasoning
4. **Summary**: Human-readable explanation of recommendations

## Response Example

```json
{
  "persona": {
    "personaLabel": "Health-Conscious Athlete",
    "primaryCategory": "Health & Fitness",
    "shoppingPattern": "Regular supplement buyer",
    "insights": ["Prefers premium brands", "Buys weekly"]
  },
  "offers": [
    {
      "title": "20% OFF Whey Protein",
      "relevanceScore": 95,
      "reasoning": "Perfect match for your fitness routine"
    }
  ],
  "aiSummary": "Selected protein and supplement deals based on your fitness-focused shopping history."
}
```
