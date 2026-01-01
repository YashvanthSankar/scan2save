import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error: productError } = await supabase
      .from('Product')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) throw productError;

    const { data: storeProducts, error: spError } = await supabase
      .from('StoreProduct')
      .select(`
        price,
        original_price,
        aisle,
        in_stock,
        store:stores (
          id,
          storeId,
          name,
          location
        )
      `)
      .eq('productId', id);

    if (spError) throw spError;

    const productWithPricing = {
      ...product,
      stores: storeProducts.map((sp: any) => ({
        storeId: sp.store.storeId,
        storeName: sp.store.name,
        storeLocation: sp.store.location,
        price: parseFloat(sp.price),
        originalPrice: parseFloat(sp.original_price),
        aisle: sp.aisle,
        inStock: sp.in_stock,
      })),
    };

    const response = NextResponse.json({ success: true, product: productWithPricing });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
