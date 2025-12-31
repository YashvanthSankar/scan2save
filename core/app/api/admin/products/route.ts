import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET - Get all products for a store with location info
export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('storeId');

        if (!storeId) {
            return NextResponse.json({ success: false, error: 'Store ID required' }, { status: 400 });
        }

        // Find store by id or storeId
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { id: storeId },
                    { storeId: storeId }
                ]
            }
        });

        if (!store) {
            return NextResponse.json({ success: false, error: 'Store not found' }, { status: 404 });
        }

        const products = await prisma.storeProduct.findMany({
            where: { storeId: store.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: [
                { aisle: 'asc' },
                { product: { category: 'asc' } }
            ]
        });

        return NextResponse.json({
            success: true,
            store: { id: store.id, storeId: store.storeId, name: store.name },
            products: products.map(p => ({
                id: p.id,
                productId: p.product.id,
                name: p.product.name,
                category: p.product.category,
                image: p.product.imageUrl,
                price: Number(p.price),
                aisle: p.aisle,
                inStock: p.inStock
            }))
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

// PATCH - Update product location
export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { storeProductId, aisle, inStock } = body;

        if (!storeProductId) {
            return NextResponse.json({ success: false, error: 'Store product ID required' }, { status: 400 });
        }

        const updateData: { aisle?: string | null; inStock?: boolean } = {};

        if (aisle !== undefined) {
            updateData.aisle = aisle || null;
        }
        if (inStock !== undefined) {
            updateData.inStock = inStock;
        }

        const updated = await prisma.storeProduct.update({
            where: { id: storeProductId },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            product: {
                id: updated.id,
                aisle: updated.aisle,
                inStock: updated.inStock
            }
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

// POST - Bulk update aisles for multiple products
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { updates } = body; // Array of { storeProductId, aisle }

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json({ success: false, error: 'Updates array required' }, { status: 400 });
        }

        const results = await Promise.all(
            updates.map((update: { storeProductId: number; aisle: string }) =>
                prisma.storeProduct.update({
                    where: { id: update.storeProductId },
                    data: { aisle: update.aisle || null }
                })
            )
        );

        return NextResponse.json({
            success: true,
            updated: results.length
        });
    } catch (error) {
        console.error('Error bulk updating products:', error);
        return NextResponse.json({ success: false, error: 'Failed to bulk update products' }, { status: 500 });
    }
}
