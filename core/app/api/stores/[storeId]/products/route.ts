import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      .from('Store')
      .select('id')
      .eq('storeId', storeId)
      .single();

    if (storeError) throw storeError;

    let productsQuery = supabase
      .from('StoreProduct')
      .select(`
        id,
        price,
        aisle,
        inStock,
        product:Product (
          id,
          name,
          category,
          imageUrl,
          barcode
        )
      `)
      .eq('storeId', store.id)
      .eq('inStock', true);

    const { data: storeProducts, error } = await productsQuery;

    if (error) throw error;

    let products = storeProducts.map((sp: any) => ({
      id: sp.product.id,
      name: sp.product.name,
      category: sp.product.category,
      // description: sp.product.description,
      image: sp.product.imageUrl,
      barcode: sp.product.barcode,
      price: parseFloat(sp.price),
      originalPrice: parseFloat(sp.price), // Fallback since DB doesn't have it
      aisle: sp.aisle,
      storeId: storeId,
    }));

    if (category) {
      products = products.filter((p: any) => p.category === category);
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      products = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Revert detailed error for production
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
