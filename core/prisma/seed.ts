import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create a dummy Store first (Prices need a store!)
  const store = await prisma.store.upsert({
    where: { storeId: 'DEMO_STORE_01' },
    update: {},
    create: {
      storeId: 'DEMO_STORE_01',
      name: 'SuperMart Downtown',
      location: '123 Main St, City Center',
      lat: 12.9716,
      lng: 77.5946,
      qrPayload: {}, // Empty JSON for now
      isActive: true,
    },
  })

  // 2. Create Products (WITHOUT PRICE)
  // We use 'upsert' to prevent errors if you run seed twice
  const milk = await prisma.product.create({
    data: {
      name: 'Whole Milk',
      category: 'Dairy',
      imageUrl: '/images/milk.jpg',
      // price: 3.99,  <--- DELETE THIS LINE from your old code
    },
  })

  const bread = await prisma.product.create({
    data: {
      name: 'Sourdough Bread',
      category: 'Bakery',
      imageUrl: '/images/bread.jpg',
    },
  })

  // 3. Add Prices (Link Product + Store)
  await prisma.storeProduct.createMany({
    data: [
      {
        storeId: store.id,
        productId: milk.id,
        price: 3.99, // <--- Price goes here now!
        inStock: true,
      },
      {
        storeId: store.id,
        productId: bread.id,
        price: 5.49,
        inStock: true,
      }
    ],
    skipDuplicates: true, // Safety check
  })

  // 4. Create your Admin User
  const admin = await prisma.user.upsert({
    where: { phoneNumber: '+911111111111' },
    update: { role: Role.ADMIN },
    create: {
      phoneNumber: '+911111111111',
      role: Role.ADMIN,
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })