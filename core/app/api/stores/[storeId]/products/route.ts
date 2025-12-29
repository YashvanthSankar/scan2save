import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('store_id', storeId)
      .single();

    if (storeError) throw storeError;

    let productsQuery = supabase
      .from('store_products')
      .select(`
        id,
        price,
        original_price,
        aisle,
        in_stock,
        product:products (
          id,
          name,
          category,
          description,
          image_url,
          barcode
        )
      `)
      .eq('store_id', store.id)
      .eq('in_stock', true);

    const { data: storeProducts, error } = await productsQuery;

    if (error) throw error;

    let products = storeProducts.map((sp: any) => ({
      id: sp.product.id,
      name: sp.product.name,
      category: sp.product.category,
      description: sp.product.description,
      image: sp.product.image_url,
      barcode: sp.product.barcode,
      price: parseFloat(sp.price),
      originalPrice: parseFloat(sp.original_price),
      aisle: sp.aisle,
      storeId: storeId,
    }));

    if (category) {
      products = products.filter((p: any) => p.category === category);
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
