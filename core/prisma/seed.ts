import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: { name: 'Whole Milk', category: 'Dairy', price: 3.99, imageUrl: '/images/milk.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Sourdough Bread', category: 'Bakery', price: 5.49, imageUrl: '/images/bread.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Organic Bananas', category: 'Produce', price: 0.99, imageUrl: '/images/bananas.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Cheddar Cheese', category: 'Dairy', price: 6.99, imageUrl: '/images/cheese.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Tomato Sauce', category: 'Pantry', price: 2.49, imageUrl: '/images/sauce.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Pasta', category: 'Pantry', price: 1.99, imageUrl: '/images/pasta.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Diapers (Size 4)', category: 'Baby', price: 24.99, imageUrl: '/images/diapers.jpg' },
    }),
    prisma.product.create({
      data: { name: 'Baby Wipes', category: 'Baby', price: 4.99, imageUrl: '/images/wipes.jpg' },
    }),
  ])

  console.log(`Created ${products.length} products`)

  // 2. Create Active Offers
  const offers = await Promise.all([
    prisma.activeOffer.create({
      data: {
        productId: products[0].id, // Milk
        title: '10% Off Fresh Milk',
        discountPercentage: 10,
        isDefault: true,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      },
    }),
    prisma.activeOffer.create({
      data: {
        productId: products[2].id, // Bananas
        title: 'Buy 1 Get 1 Free on Bananas',
        discountPercentage: 50,
        isDefault: true,
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.activeOffer.create({
      data: {
        productId: products[6].id, // Diapers
        title: '$5 Off Diapers',
        discountPercentage: 20,
        isDefault: false, // Targeted offer!
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
  ])

  console.log(`Created ${offers.length} offers`)

  // 3. Create a Test User
  const user = await prisma.user.upsert({
    where: { phoneNumber: '1234567890' },
    update: {},
    create: {
      phoneNumber: '1234567890',
    },
  })

  console.log(`Created test user: ${user.phoneNumber}`)
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
