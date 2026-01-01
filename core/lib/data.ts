// lib/data.ts
import { prisma } from '@/lib/prisma';


export const STORES = [
  {
    id: "store_reliance_mumbai",
    name: "Reliance Digital",
    location: "Mumbai, Maharashtra",
    address: "Phoenix Market City, Kurla West, Mumbai",
    image: "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800&q=80",
    rating: 4.5,
  },
  {
    id: "store_croma_bangalore",
    name: "Croma Electronics",
    location: "Bangalore, Karnataka",
    address: "100 Feet Rd, Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1581440861184-8e5c43d874c9?w=800&q=80",
    rating: 4.2,
  }
];

export const PRODUCTS = [
  // ==========================================
  // RELIANCE DIGITAL (MUMBAI) INVENTORY
  // ==========================================
  {
    id: "r1",
    storeId: "store_reliance_mumbai",
    name: "Sony Bravia 55' 4K Google TV",
    price: 57990,
    originalPrice: 92090,
    description: "Model K-55S25BM2. 4K Ultra HD Smart LED Google TV with Dolby Audio. Features X1 4K Processor for real-world detail and texture.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
    category: "Televisions",
    aisle: "Wall Section B, Row 1"
  },
  {
    id: "r2",
    storeId: "store_reliance_mumbai",
    name: "Apple iPhone 15 Pro Max (256GB)",
    price: 134900,
    originalPrice: 159900,
    description: "Black Titanium finish. Features the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    image: "https://images.unsplash.com/photo-1696248612959-1c97a8277258?w=500&q=80",
    category: "Mobiles",
    aisle: "Apple Zone, Table 2"
  },
  {
    id: "r3",
    storeId: "store_reliance_mumbai",
    name: "Samsung 6.5kg Top Load Washer",
    price: 15990,
    originalPrice: 21000,
    description: "Fully automatic top load washing machine with Diamond Drum and Center Jet technology for powerful washing.",
    image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80",
    category: "Home Appliances",
    aisle: "Aisle 4, Large Appliances"
  },
  {
    id: "r4",
    storeId: "store_reliance_mumbai",
    name: "Sony WH-1000XM5 Headphones",
    price: 26990,
    originalPrice: 34990,
    description: "Industry-leading noise cancellation, 30-hour battery life, and crystal clear hands-free calling.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
    category: "Audio",
    aisle: "Aisle 2, Shelf C"
  },
  {
    id: "r5",
    storeId: "store_reliance_mumbai",
    name: "Whirlpool 265L Double Door Fridge",
    price: 26490,
    originalPrice: 33150,
    description: "Convertible 5-in-1 modes, IntelliSense Inverter technology. Keeps vegetables fresh for up to 15 days.",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80",
    category: "Home Appliances",
    aisle: "Aisle 5, Bay 2"
  },

  // ==========================================
  // CROMA (BANGALORE) INVENTORY
  // ==========================================
  {
    id: "c1",
    storeId: "store_croma_bangalore",
    name: "MacBook Air M2 (Midnight)",
    price: 89990,
    originalPrice: 114900,
    description: "Supercharged by M2 chip. 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD. Up to 18 hours of battery life.",
    image: "https://images.unsplash.com/photo-1661961111184-11317b40adb2?w=500&q=80",
    category: "Laptops",
    aisle: "Laptop Station, Row 1"
  },
  {
    id: "c2",
    storeId: "store_croma_bangalore",
    name: "Dyson V8 Absolute Vacuum",
    price: 29900,
    originalPrice: 43900,
    description: "Cord-free vacuum cleaner. Powerful suction for versatile cleaning. Up to 40 minutes of run time.",
    image: "https://images.unsplash.com/photo-1558317374-a3545eca640e?w=500&q=80",
    category: "Home Appliances",
    aisle: "Aisle 3, Cleaning Section"
  },
  {
    id: "c3",
    storeId: "store_croma_bangalore",
    name: "OnePlus 12R (16GB RAM)",
    price: 45999,
    originalPrice: 49999,
    description: "Cool Blue color. Snapdragon 8 Gen 2 processor, 120Hz ProXDR display, and massive 5500mAh battery.",
    image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&q=80",
    category: "Mobiles",
    aisle: "Mobile Section, Counter 4"
  },
  {
    id: "c4",
    storeId: "store_croma_bangalore",
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 9999,
    originalPrice: 14999,
    description: "IP67 waterproof and dustproof. Delivers powerful JBL Original Pro Sound with deep bass.",
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500&q=80",
    category: "Audio",
    aisle: "Aisle 1, Shelf A"
  },
  {
    id: "c5",
    storeId: "store_croma_bangalore",
    name: "Dell XPS 13 Plus",
    price: 154990,
    originalPrice: 195000,
    description: "13.4-inch OLED Touch Display. 12th Gen Intel Core i7, 16GB RAM, 1TB SSD. The futuristic design you need.",
    image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&q=80",
    category: "Laptops",
    aisle: "Laptop Station, Row 3"
  }
];

export async function getUserDashboardData(userId: string) {
  try {
    // OPTIMIZATION: Run user data and cart queries in parallel
    const [user, cart] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          createdAt: true,
          role: true,
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              totalAmount: true,
              isPaid: true,
              createdAt: true,
              store: {
                select: { name: true, location: true }
              },
              _count: { select: { items: true } }
            }
          },
          claimedOffers: {
            where: { isUsed: false },
            select: { id: true }
          },
          _count: {
            select: { transactions: true }
          }
        }
      }),
      prisma.cart.findUnique({
        where: { userId },
        select: {
          _count: { select: { items: true } }
        }
      })
    ]);

    if (!user) return null;

    // Calculate Stats from transactions
    const totalSpent = user.transactions.reduce((sum, tx) => sum + Number(tx.totalAmount), 0);
    const points = Math.floor(totalSpent * 0.1);
    const totalSaved = Math.floor(totalSpent * 0.12);

    const recentActivity = user.transactions.map(tx => ({
      id: tx.id,
      store: tx.store?.name || 'Unknown Store',
      loc: tx.store?.location || 'Online',
      date: tx.createdAt.toISOString(),
      items: tx._count.items,
      total: Number(tx.totalAmount),
      status: tx.isPaid ? 'Completed' : 'Pending',
      formattedAmount: `₹${Number(tx.totalAmount).toLocaleString()}`,
      icon: (tx.store?.name || '').toLowerCase().includes('coffee') ? '☕' : ((tx.store?.name || '').toLowerCase().includes('online') ? '📦' : '🛒')
    }));

    return {
      user: {
        id: user.id,
        name: user.name || 'User',
        phone: user.phoneNumber,
        memberSince: user.createdAt,
        role: user.role
      },
      stats: {
        totalSaved,
        totalSpent,
        points,
        voucherCount: user.claimedOffers.length
      },
      history: recentActivity,
      cartCount: cart?._count.items || 0
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return null;
  }
}

export async function getUserOrders(userId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        store: {
          select: { name: true, location: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, imageUrl: true, category: true }
            }
          }
        }
      }
    });

    return transactions.map(t => ({
      id: t.id,
      date: t.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      store: t.store?.name || 'Unknown Store',
      location: t.store?.location || '',
      total: Number(t.totalAmount),
      status: t.isPaid ? (t.isVerified ? 'isVerified' : 'isPaid') : ('pending' as 'isPaid' | 'isVerified' | 'pending'),
      gatePassToken: t.gatePassToken,
      items: t.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.priceAtPurchase),
        image: item.product.imageUrl,
        category: item.product.category
      }))
    }));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function getUserProfile(userId: string) {
  try {
    // OPTIMIZATION: Use select for specific fields, _count for items
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        phoneNumber: true,
        createdAt: true,
        role: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            totalAmount: true,
            isPaid: true,
            createdAt: true,
            store: { select: { name: true } },
            _count: { select: { items: true } }
          }
        },
        claimedOffers: {
          where: { isUsed: false },
          select: { id: true }
        }
      }
    });

    if (!user) return null;

    // Calculate Stats
    const totalSpent = user.transactions.reduce((sum, tx) => sum + Number(tx.totalAmount), 0);
    const points = Math.floor(totalSpent * 0.1);
    const totalSaved = Math.floor(totalSpent * 0.12);

    const history = user.transactions.map(tx => ({
      id: tx.id,
      store: tx.store?.name || 'Unknown Store',
      date: tx.createdAt.toISOString(),
      items: tx._count.items,
      total: Number(tx.totalAmount),
      status: tx.isPaid ? 'Completed' : 'Pending'
    }));

    return {
      user: {
        name: user.name || 'User',
        phone: user.phoneNumber,
        memberSince: user.createdAt.toISOString(),
        role: user.role
      },
      stats: {
        totalSaved,
        totalSpent,
        points,
        voucherCount: user.claimedOffers.length
      },
      history
    };
  } catch (error) {
    console.error("Failed to load profile", error);
    return null;
  }
}

export async function getAdminStats(userId: string) {
  try {
    // Verify Admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') return null;

    // Fetch counts in parallel
    const [storeCount, userCount, transactionCount, recentStores] = await Promise.all([
      prisma.store.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.store.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          storeId: true,
          name: true,
          location: true,
          isActive: true,
          createdAt: true
        }
      })
    ]);

    return {
      stats: {
        stores: storeCount,
        users: userCount,
        transactions: transactionCount
      },
      recentStores: recentStores.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString()
      }))
    };
  } catch (error) {
    console.error('Failed to fetch admin stats', error);
    return null;
  }
}

export async function getAdminStores(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') return null;

    const stores = await prisma.store.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        storeId: true,
        name: true,
        location: true,
        lat: true,
        lng: true,
        isActive: true
      }
    });
    return stores;
  } catch (error) {
    console.error('Failed to fetch admin stores', error);
    return [];
  }
}

export async function getAdminUsers(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') return null;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    return users.map(u => ({
      id: u.id,
      name: u.name,
      phone: u.phoneNumber,
      role: u.role,
      joinedAt: u.createdAt.toISOString(),
      transactionCount: u._count.transactions
    }));
  } catch (error) {
    console.error('Failed to fetch admin users', error);
    return [];
  }
}