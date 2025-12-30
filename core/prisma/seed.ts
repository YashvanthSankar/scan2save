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

  // 1. Clean up existing data
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

  // 7. Create sample transactions for Gym Freak (from popular items)
  const popularItems = ['whole milk', 'beef', 'chicken', 'yogurt', 'tropical fruit']
  const purchasedProducts = dbProducts.filter(p =>
    popularItems.some(item => p.name.toLowerCase().includes(item))
  ).slice(0, 5)

  if (purchasedProducts.length > 0) {
    await prisma.transaction.create({
      data: {
        userId: gymFreak.id,
        storeId: freshMart.id,
        totalAmount: 500,
        isPaid: true,
        items: {
          create: purchasedProducts.map(p => ({
            productId: p.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            priceAtPurchase: generatePrice()
          }))
        }
      }
    })
    console.log(`📜 Created purchase history for Gym Freak`)
  }

  // 8. Create Active Offers
  const offerProducts = dbProducts.slice(0, 5) // First 5 products get offers
  for (const product of offerProducts) {
    await prisma.activeOffer.create({
      data: {
        title: `${Math.floor(Math.random() * 30) + 10}% OFF on ${product.name}`,
        productId: product.id,
        discountPercentage: Math.floor(Math.random() * 30) + 10,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: product.category
      }
    })
  }

  console.log(`🏷️ Created ${offerProducts.length} Active Offers`)
  console.log('✅ Seed completed successfully with Kaggle grocery data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })