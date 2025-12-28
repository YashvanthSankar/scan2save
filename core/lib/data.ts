// lib/data.ts

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