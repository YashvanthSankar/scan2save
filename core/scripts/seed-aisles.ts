// Script to seed aisle data for existing stores
// Run with: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-aisles.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample aisle mappings by category
const aisleByCategory: Record<string, string> = {
    'Dairy': 'A1',
    'Beverages': 'A2',
    'Snacks': 'A3',
    'Bakery': 'A4',
    'Fruits': 'B1',
    'Vegetables': 'B2',
    'Frozen': 'C1',
    'Meat': 'C2',
    'Seafood': 'C3',
    'Pantry': 'D1',
    'Grains': 'D2',
    'Condiments': 'D3',
    'Hygiene': 'E1',
    'Cleaning': 'E2',
    'Personal Care': 'E3',
    'Electronics': 'F1',
    'Stationery': 'F2',
};

async function seedAisles() {
    console.log('🏬 Seeding aisle data for store products...\n');

    try {
        // Get all store products with their product category
        const storeProducts = await prisma.storeProduct.findMany({
            include: {
                product: {
                    select: {
                        category: true,
                        name: true
                    }
                },
                store: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log(`Found ${storeProducts.length} store products to update.\n`);

        let updated = 0;
        for (const sp of storeProducts) {
            // Get aisle based on category, or generate a default
            const category = sp.product.category;
            let aisle = aisleByCategory[category];

            if (!aisle) {
                // Generate a default aisle based on first letter of category
                const firstLetter = category.charAt(0).toUpperCase();
                const index = (sp.productId % 5) + 1;
                aisle = `${firstLetter}${index}`;
            }

            // Update the store product
            await prisma.storeProduct.update({
                where: { id: sp.id },
                data: { aisle }
            });

            console.log(`✓ ${sp.store.name} - ${sp.product.name}: ${aisle}`);
            updated++;
        }

        console.log(`\n✅ Successfully updated ${updated} products with aisle data!`);

    } catch (error) {
        console.error('❌ Error seeding aisles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAisles();
