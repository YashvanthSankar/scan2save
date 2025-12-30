import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Category mapping for Kaggle grocery items
const CATEGORY_MAP: Record<string, string> = {
  // Dairy
  'whole milk': 'Dairy',
  'butter': 'Dairy',
  'butter milk': 'Dairy',
  'cream cheese': 'Dairy',
  'curd': 'Dairy',
  'curd cheese': 'Dairy',
  'yogurt': 'Dairy',
  'cream': 'Dairy',
  'whipped/sour cream': 'Dairy',
  'UHT-milk': 'Dairy',
  'condensed milk': 'Dairy',

  // Meat & Poultry
  'beef': 'Meat & Poultry',
  'chicken': 'Meat & Poultry',
  'pork': 'Meat & Poultry',
  'ham': 'Meat & Poultry',
  'turkey': 'Meat & Poultry',
  'sausage': 'Meat & Poultry',
  'frankfurter': 'Meat & Poultry',
  'hamburger meat': 'Meat & Poultry',
  'meat': 'Meat & Poultry',
  'frozen chicken': 'Meat & Poultry',

  // Fruits & Vegetables
  'tropical fruit': 'Fruits & Vegetables',
  'citrus fruit': 'Fruits & Vegetables',
  'pip fruit': 'Fruits & Vegetables',
  'berries': 'Fruits & Vegetables',
  'grapes': 'Fruits & Vegetables',
  'other vegetables': 'Fruits & Vegetables',
  'root vegetables': 'Fruits & Vegetables',
  'onions': 'Fruits & Vegetables',
  'herbs': 'Fruits & Vegetables',
  'packaged fruit/vegetables': 'Fruits & Vegetables',

  // Beverages
  'bottled water': 'Beverages',
  'soda': 'Beverages',
  'coffee': 'Beverages',
  'bottled beer': 'Beverages',
  'canned beer': 'Beverages',
  'fruit/vegetable juice': 'Beverages',
  'beverages': 'Beverages',
  'misc. beverages': 'Beverages',
  'red/blush wine': 'Beverages',
  'white wine': 'Beverages',
  'sparkling wine': 'Beverages',
  'liquor': 'Beverages',

  // Bakery
  'rolls/buns': 'Bakery',
  'brown bread': 'Bakery',
  'white bread': 'Bakery',
  'pastry': 'Bakery',

  // Snacks & Sweets
  'chocolate': 'Snacks & Sweets',
  'candy': 'Snacks & Sweets',
  'specialty chocolate': 'Snacks & Sweets',
  'specialty bar': 'Snacks & Sweets',
  'ice cream': 'Snacks & Sweets',
  'dessert': 'Snacks & Sweets',

  // Frozen Foods
  'frozen vegetables': 'Frozen Foods',
  'frozen meals': 'Frozen Foods',
  'frozen potato products': 'Frozen Foods',
  'frozen dessert': 'Frozen Foods',
  'frozen fish': 'Frozen Foods',

  // Household
  'detergent': 'Household',
  'cleaner': 'Household',
  'dish cleaner': 'Household',
  'bathroom cleaner': 'Household',
  'shopping bags': 'Household',
  'newspapers': 'Household',

  // Default
  'fish': 'Seafood',
  'domestic eggs': 'Dairy',
  'pasta': 'Pantry',
  'flour': 'Pantry',
  'sugar': 'Pantry',
  'oil': 'Pantry',
  'salt': 'Pantry',
}

function getCategory(item: string): string {
  const normalized = item.toLowerCase().trim()
  return CATEGORY_MAP[normalized] || 'General'
}

function generatePrice(): number {
  // Random price between 20 and 800 INR
  return Math.floor(Math.random() * 780) + 20
}

async function main() {
  console.log('🌱 Starting seed with Kaggle dataset...')

  // 1. Clean up existing data (order matters for FK constraints!)
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.claimedOffer.deleteMany()
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.personalizedFeed.deleteMany()
  await prisma.activeOffer.deleteMany()
  await prisma.storeProduct.deleteMany()
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Stores
  const freshMart = await prisma.store.create({
    data: {
      name: 'FreshMart',
      storeId: 'freshmart-blr-01',
      location: 'Indiranagar, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      qrPayload: { storeId: 'freshmart-blr-01', name: 'FreshMart', location: 'Indiranagar', timestamp: Date.now() }
    }
  })

  const naturesBasket = await prisma.store.create({
    data: {
      name: "Nature's Basket",
      storeId: 'nb-blr-01',
      location: 'Koramangala, Bangalore',
      lat: 12.9352,
      lng: 77.6245,
      qrPayload: { storeId: 'nb-blr-01', name: "Nature's Basket", location: 'Koramangala', timestamp: Date.now() }
    }
  })

  console.log(`🏪 Created Stores: ${freshMart.name}, ${naturesBasket.name}`)

  // 3. Read Kaggle CSV and extract unique products
  const csvPath = path.join(__dirname, '../public/Groceries_dataset.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n').slice(1) // Skip header

  const uniqueItems = new Set<string>()
  lines.forEach(line => {
    const parts = line.split(',')
    if (parts.length >= 3) {
      const item = parts[2].trim().replace('\r', '')
      if (item && item !== 'itemDescription') {
        uniqueItems.add(item)
      }
    }
  })

  console.log(`📦 Found ${uniqueItems.size} unique products in Kaggle dataset`)

  // 4. Create Products and assign to both stores
  const productItems = Array.from(uniqueItems)
  const dbProducts: any[] = []

  for (const itemName of productItems) {
    const product = await prisma.product.create({
      data: {
        name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
        category: getCategory(itemName),
        imageUrl: `https://placehold.co/400x400?text=${encodeURIComponent(itemName)}`
      }
    })
    dbProducts.push(product)
  }

  console.log(`📦 Created ${dbProducts.length} products in database`)

  // 5. Assign products to both stores with different prices
  for (const product of dbProducts) {
    const basePrice = generatePrice()

    // FreshMart - standard price
    await prisma.storeProduct.create({
      data: {
        storeId: freshMart.id,
        productId: product.id,
        price: basePrice,
        inStock: Math.random() > 0.1 // 90% in stock
      }
    })

    // Nature's Basket - premium pricing (10-20% higher)
    await prisma.storeProduct.create({
      data: {
        storeId: naturesBasket.id,
        productId: product.id,
        price: Math.floor(basePrice * (1 + Math.random() * 0.2)),
        inStock: Math.random() > 0.15 // 85% in stock
      }
    })
  }

  console.log(`🏷️ Assigned products to both stores`)

  // 6. Create Users
  const gymFreak = await prisma.user.create({
    data: {
      id: "00000000-0000-0000-0000-000000000002", // Hardcoded ID for frontend demo matches
      phoneNumber: '+919696969696',
      name: 'Yashvanth User',
      role: 'USER'
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      phoneNumber: '+911111111111',
      name: 'Yashvanth Admin',
      role: 'ADMIN'
    }
  })

  console.log(`👥 Created Users: ${gymFreak.name} (User) & ${adminUser.name} (Admin)`)

  // 7. Create GYM-FOCUSED products manually (for AI testing)
  const gymProducts = await Promise.all([
    prisma.product.create({ data: { name: 'Whey Protein Powder', category: 'Health & Fitness', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Protein' } }),
    prisma.product.create({ data: { name: 'BCAA Amino Acids', category: 'Health & Fitness', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=BCAA' } }),
    prisma.product.create({ data: { name: 'Pre-Workout Energy', category: 'Health & Fitness', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=PreWorkout' } }),
    prisma.product.create({ data: { name: 'Greek Yogurt High Protein', category: 'Dairy', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Yogurt' } }),
    prisma.product.create({ data: { name: 'Chicken Breast Lean', category: 'Meat & Poultry', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Chicken' } }),
    prisma.product.create({ data: { name: 'Brown Rice Organic', category: 'Pantry', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Rice' } }),
    prisma.product.create({ data: { name: 'Oats Steel Cut', category: 'Pantry', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Oats' } }),
    prisma.product.create({ data: { name: 'Peanut Butter Natural', category: 'Pantry', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=PeanutButter' } }),
    prisma.product.create({ data: { name: 'Banana Fresh', category: 'Fruits & Vegetables', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Banana' } }),
    prisma.product.create({ data: { name: 'Eggs Free Range (12)', category: 'Dairy', imageUrl: 'https://placehold.co/400x400/1e293b/ffffff?text=Eggs' } }),
  ])

  // Assign gym products to stores
  for (const product of gymProducts) {
    await prisma.storeProduct.create({
      data: { storeId: freshMart.id, productId: product.id, price: generatePrice(), inStock: true }
    })
    await prisma.storeProduct.create({
      data: { storeId: naturesBasket.id, productId: product.id, price: generatePrice(), inStock: true }
    })
  }

  console.log(`💪 Created ${gymProducts.length} Gym-focused products`)

  // 8. Create RICH purchase history for AI (Multiple transactions over time)
  // Transaction 1: Protein-focused
  await prisma.transaction.create({
    data: {
      userId: gymFreak.id,
      storeId: freshMart.id,
      totalAmount: 2500,
      isPaid: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      items: {
        create: [
          { productId: gymProducts[0].id, quantity: 2, priceAtPurchase: 1200 }, // Whey Protein x2
          { productId: gymProducts[4].id, quantity: 3, priceAtPurchase: 350 },  // Chicken x3
          { productId: gymProducts[9].id, quantity: 2, priceAtPurchase: 180 },  // Eggs x2
        ]
      }
    }
  })

  // Transaction 2: Pre-workout & Energy
  await prisma.transaction.create({
    data: {
      userId: gymFreak.id,
      storeId: freshMart.id,
      totalAmount: 1800,
      isPaid: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      items: {
        create: [
          { productId: gymProducts[1].id, quantity: 1, priceAtPurchase: 900 },  // BCAA
          { productId: gymProducts[2].id, quantity: 1, priceAtPurchase: 750 },  // Pre-Workout
          { productId: gymProducts[8].id, quantity: 6, priceAtPurchase: 60 },   // Bananas
        ]
      }
    }
  })

  // Transaction 3: Meal Prep Staples
  await prisma.transaction.create({
    data: {
      userId: gymFreak.id,
      storeId: freshMart.id,
      totalAmount: 1200,
      isPaid: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      items: {
        create: [
          { productId: gymProducts[5].id, quantity: 2, priceAtPurchase: 200 },  // Brown Rice
          { productId: gymProducts[6].id, quantity: 2, priceAtPurchase: 250 },  // Oats
          { productId: gymProducts[7].id, quantity: 1, priceAtPurchase: 350 },  // Peanut Butter
          { productId: gymProducts[3].id, quantity: 4, priceAtPurchase: 120 },  // Greek Yogurt
        ]
      }
    }
  })

  console.log(`📜 Created 3 gym-focused purchase transactions for AI analysis`)

  // 9. Create TARGETED Active Offers (some matching gym lifestyle, some not)
  const offers = [
    { title: '25% OFF Whey Protein!', productId: gymProducts[0].id, discount: 25, category: 'Health & Fitness', isDefault: false },
    { title: 'Buy 2 Get 1 Free Chicken', productId: gymProducts[4].id, discount: 33, category: 'Meat & Poultry', isDefault: false },
    { title: 'New! Pre-Workout 20% OFF', productId: gymProducts[2].id, discount: 20, category: 'Health & Fitness', isDefault: false },
    { title: 'Organic Oats Sale', productId: gymProducts[6].id, discount: 15, category: 'Pantry', isDefault: false },
    { title: 'Fresh Eggs Deal', productId: gymProducts[9].id, discount: 10, category: 'Dairy', isDefault: false },
    // Some non-gym offers to test AI filtering
    { title: 'Chocolate 50% OFF', productId: dbProducts.find(p => p.name.toLowerCase().includes('chocolate'))?.id || dbProducts[0].id, discount: 50, category: 'Snacks & Sweets', isDefault: true },
    { title: 'Wine Weekend Special', productId: dbProducts.find(p => p.name.toLowerCase().includes('wine'))?.id || dbProducts[1].id, discount: 30, category: 'Beverages', isDefault: true },
    { title: 'Ice Cream Season', productId: dbProducts.find(p => p.name.toLowerCase().includes('ice cream'))?.id || dbProducts[2].id, discount: 40, category: 'Snacks & Sweets', isDefault: true },
  ]

  for (const offer of offers) {
    if (offer.productId) {
      await prisma.activeOffer.create({
        data: {
          title: offer.title,
          productId: offer.productId,
          discountPercentage: offer.discount,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
          category: offer.category,
          isDefault: offer.isDefault
        }
      })
    }
  }

  console.log(`🏷️ Created ${offers.length} Active Offers (gym-focused + general)`)
  console.log('✅ Seed completed with gym-focused AI testing data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })