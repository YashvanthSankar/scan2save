/**
 * TypeScript Types for the AI Recommendation Engine
 * Scan2Save - Hyper-Personalized Offer Engine
 */

// ============ INPUT TYPES ============

export interface PurchaseHistoryItem {
    productId: number;
    productName: string;
    category: string;
    quantity: number;
    priceAtPurchase: number;
    purchasedAt: Date;
}

export interface UserProfile {
    userId: string;
    phoneNumber: string;
    name?: string;
    purchaseHistory: PurchaseHistoryItem[];
}

export interface ActiveOffer {
    id: number;
    title: string;
    productId: number;
    productName: string;
    productCategory: string;
    discountPercentage: number;
    category?: string; // Target category (for broad offers)
    isDefault: boolean;
    validUntil: Date;
}

export interface StoreContext {
    storeId: string;
    storeName: string;
    timestamp: number;
}

// ============ OUTPUT TYPES ============

export interface UserPersona {
    primaryCategory: string;
    secondaryCategories: string[];
    categoryScores: Record<string, number>;
    totalPurchases: number;
    averageSpend: number;
    personaLabel: string; // Human-readable: "Gym Enthusiast", "New Parent", etc.
}

export interface ScoredOffer extends ActiveOffer {
    relevanceScore: number;
    matchReason: string;
    isPersonalized: boolean;
}

export interface RecommendationResult {
    success: boolean;
    userId: string;
    store: StoreContext;
    persona: UserPersona;
    offers: ScoredOffer[];
    generatedAt: Date;
}

// ============ CONFIG TYPES ============

export interface EngineConfig {
    maxHistoryItems: number;       // How many past items to analyze
    topCategoriesCount: number;    // How many top categories to consider
    categoryMatchBoost: number;    // Score boost for category match
    primaryCategoryBoost: number;  // Extra boost for top category
    defaultOfferScore: number;     // Base score for default offers
    minRelevanceScore: number;     // Filter out offers below this
}

export const DEFAULT_CONFIG: EngineConfig = {
    maxHistoryItems: 50,
    topCategoriesCount: 3,
    categoryMatchBoost: 10,
    primaryCategoryBoost: 5,
    defaultOfferScore: 1,
    minRelevanceScore: 0
};
