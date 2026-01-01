import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const storeId = searchParams.get('storeId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: store, error: storeError } = await supabase
      .from('Store')
      .select('id')
      .eq('storeId', storeId)
      .single();

    if (storeError) throw storeError;

    // OPTIMIZATION: Run these 3 queries in parallel instead of sequentially
    const [personasResult, transactionsResult, offersResult] = await Promise.all([
      // Query 1: User personas
      supabase
        .from('UserPersona')
        .select('*')
        .eq('userId', userId)
        .order('confidence_score', { ascending: false }),

      // Query 2: User transactions
      supabase
        .from('Transaction')
        .select(`
          id,
          total_amount,
          created_at,
          items:transaction_items (
            product:products (
              id,
              category
            )
          )
        `)
        .eq('userId', userId)
        .eq('storeId', store.id)
        .order('created_at', { ascending: false })
        .limit(10),

      // Query 3: Active offers
      supabase
        .from('ActiveOffer')
        .select(`
          id,
          title,
          discount_percentage,
          valid_until,
          product:products (
            id,
            name,
            category,
            description,
            image_url
          ),
          store_product:store_products!inner (
            price,
            original_price,
            aisle
          )
        `)
        .eq('storeId', store.id)
        .eq('is_active', true)
        .eq('store_products.storeId', store.id)
        .gt('valid_until', new Date().toISOString())
        .order('discount_percentage', { ascending: false })
        .limit(20)
    ]);

    if (personasResult.error) throw personasResult.error;
    if (transactionsResult.error) throw transactionsResult.error;
    if (offersResult.error) throw offersResult.error;

    const userPersonas = personasResult.data;
    const userTransactions = transactionsResult.data;
    const offers = offersResult.data;

    const categoryFrequency: { [key: string]: number } = {};
    userTransactions.forEach((transaction: any) => {
      transaction.items.forEach((item: any) => {
        const category = item.product.category;
        categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
      });
    });

    const personaCategories: string[] = [];
    userPersonas.forEach((persona: any) => {
      const prefs = persona.preferences as any;
      if (prefs.preferred_categories) {
        personaCategories.push(...prefs.preferred_categories);
      }
      if (prefs.interests) {
        prefs.interests.forEach((interest: string) => {
          if (interest.includes('fitness') || interest.includes('health')) {
            personaCategories.push('Health & Fitness', 'Wearables');
          }
          if (interest.includes('tech') || interest.includes('electronics')) {
            personaCategories.push('Electronics', 'Mobiles', 'Laptops', 'Audio');
          }
        });
      }
    });

    const relevantCategories = [
      ...Object.keys(categoryFrequency),
      ...personaCategories,
    ];

    const scoredOffers = offers.map((offer: any) => {
      let relevanceScore = 0.3;

      if (relevantCategories.includes(offer.product.category)) {
        relevanceScore += 0.4;
      }

      const categoryCount = categoryFrequency[offer.product.category] || 0;
      if (categoryCount > 0) {
        relevanceScore += Math.min(0.3, categoryCount * 0.1);
      }

      relevanceScore = Math.min(1.0, relevanceScore);

      return {
        ...offer,
        relevanceScore,
        price: parseFloat(offer.store_product[0]?.price || 0),
        originalPrice: parseFloat(offer.store_product[0]?.original_price || 0),
        aisle: offer.store_product[0]?.aisle,
      };
    });

    scoredOffers.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);

    const recommendations = scoredOffers.slice(0, 10);

    // OPTIMIZATION: Batch insert instead of N sequential inserts
    if (recommendations.length > 0) {
      const feedEntries = recommendations.map(rec => ({
        userId: userId,
        offerId: rec.id,
        storeId: store.id,
        relevance_score: rec.relevanceScore,
      }));

      // Use upsert to handle duplicates gracefully
      await supabase.from('PersonalizedFeed').upsert(feedEntries, {
        onConflict: 'userId,offerId,storeId',
        ignoreDuplicates: true
      });
    }

    return NextResponse.json({
      success: true,
      recommendations,
      userPersonas: userPersonas.map((p: any) => ({
        type: p.persona_type,
        confidence: p.confidence_score,
      })),
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
