import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
      .from('stores')
      .select('id')
      .eq('store_id', storeId)
      .single();

    if (storeError) throw storeError;

    const { data: userPersonas, error: personaError } = await supabase
      .from('user_personas')
      .select('*')
      .eq('user_id', userId)
      .order('confidence_score', { ascending: false });

    if (personaError) throw personaError;

    const { data: userTransactions, error: transactionsError } = await supabase
      .from('transactions')
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
      .eq('user_id', userId)
      .eq('store_id', store.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) throw transactionsError;

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

    let offersQuery = supabase
      .from('active_offers')
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
      .eq('store_id', store.id)
      .eq('is_active', true)
      .eq('store_products.store_id', store.id)
      .gt('valid_until', new Date().toISOString())
      .order('discount_percentage', { ascending: false })
      .limit(20);

    const { data: offers, error: offersError } = await offersQuery;

    if (offersError) throw offersError;

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

    scoredOffers.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const recommendations = scoredOffers.slice(0, 10);

    for (const rec of recommendations) {
      await supabase.from('personalized_feeds').insert({
        user_id: userId,
        offer_id: rec.id,
        store_id: store.id,
        relevance_score: rec.relevanceScore,
      });
    }

    return NextResponse.json({
      success: true,
      recommendations,
      userPersonas: userPersonas.map((p) => ({
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
