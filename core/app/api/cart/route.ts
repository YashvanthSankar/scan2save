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

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id, store_id, items:cart_items(id, quantity, product:products(id, name, category, image_url))')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) throw cartError;

    if (!cart) {
      return NextResponse.json({ success: true, cart: null, items: [] });
    }

    const itemsWithPricing = await Promise.all(
      cart.items.map(async (item: any) => {
        const { data: storeProduct } = await supabase
          .from('store_products')
          .select('price, original_price')
          .eq('store_id', cart.store_id)
          .eq('product_id', item.product.id)
          .single();

        return {
          ...item,
          price: parseFloat(storeProduct?.price || 0),
          originalPrice: parseFloat(storeProduct?.original_price || 0),
        };
      })
    );

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        storeId: cart.store_id,
      },
      items: itemsWithPricing,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, storeId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId, store_id: storeId })
        .select()
        .single();

      if (createError) throw createError;
      cart = newCart;
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart!.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart!.id,
          product_id: productId,
          quantity: quantity,
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
