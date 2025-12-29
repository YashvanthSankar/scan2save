import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) throw productError;

    const { data: storeProducts, error: spError } = await supabase
      .from('store_products')
      .select(`
        price,
        original_price,
        aisle,
        in_stock,
        store:stores (
          id,
          store_id,
          name,
          location
        )
      `)
      .eq('product_id', id);

    if (spError) throw spError;

    const productWithPricing = {
      ...product,
      stores: storeProducts.map((sp: any) => ({
        storeId: sp.store.store_id,
        storeName: sp.store.name,
        storeLocation: sp.store.location,
        price: parseFloat(sp.price),
        originalPrice: parseFloat(sp.original_price),
        aisle: sp.aisle,
        inStock: sp.in_stock,
      })),
    };

    return NextResponse.json({ success: true, product: productWithPricing });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
