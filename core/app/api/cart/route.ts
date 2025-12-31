
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        store: {
          select: {
            storeId: true // Get the slug, not the UUID
          }
        },
        items: {
          include: {
            product: true
          },
          orderBy: {
            id: 'desc'
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ success: true, cart: null, items: [] });
    }

    // Get all product IDs from cart
    const productIds = cart.items.map(item => item.productId);

    // Bulk fetch: Store products (1 query instead of N)
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: cart.storeId,
        productId: { in: productIds }
      },
      select: {
        productId: true,
        price: true
      }
    });
    const priceMap = new Map(storeProducts.map(sp => [sp.productId, parseFloat(sp.price?.toString() || '0')]));

    // Bulk fetch: Active offers (1 query instead of N)
    const offers = await prisma.activeOffer.findMany({
      where: {
        productId: { in: productIds },
        validUntil: { gt: new Date() }
      }
    });
    const offerMap = new Map(offers.map(o => [o.productId, o]));

    // Map items with pricing (no additional DB calls)
    const itemsWithPricing = cart.items.map((item) => {
      const originalPrice = priceMap.get(item.productId) || 0;
      const offer = offerMap.get(item.productId);

      let finalPrice = originalPrice;
      if (offer) {
        const discountMultiplier = (100 - offer.discountPercentage) / 100;
        finalPrice = Math.round(originalPrice * discountMultiplier);
      }

      return {
        id: item.id,
        storeId: cart.store?.storeId || cart.storeId,
        productId: item.product.id,
        name: item.product.name,
        price: finalPrice,
        originalPrice: originalPrice,
        quantity: item.quantity,
        image: item.product.imageUrl,
        discountLabel: offer ? `${offer.discountPercentage}% OFF` : null
      };
    });

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        storeId: cart.store?.storeId || cart.storeId,
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

    // 1. Get or Create Cart
    let cart = await prisma.cart.findUnique({
      where: { userId: userId }
    });

    if (!cart) {
      // Check if storeId is a slug or UUID
      let targetStoreId = storeId;
      const store = await prisma.store.findFirst({
        where: {
          OR: [
            { id: storeId },
            { storeId: storeId }
          ]
        }
      });

      if (store) {
        targetStoreId = store.id;
      } else {
        return NextResponse.json({ success: false, error: 'Invalid Store ID' }, { status: 400 });
      }

      // Create Cart
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          storeId: targetStoreId
        }
      });
    }

    // 2. Add or Update Item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        await prisma.cartItem.delete({
          where: { id: existingItem.id }
        });
      } else {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity }
        });
      }
    } else {
      if (quantity > 0) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId,
            quantity: quantity
          }
        });
      }
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

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
