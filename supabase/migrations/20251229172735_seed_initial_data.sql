/*
  # Seed Initial Data for Scan2Save

  ## Data Being Added

  ### 1. Test Users
  - Admin user (+919696969696)
  - Regular test user (+918888888888)

  ### 2. Stores (2 stores)
  - Reliance Digital (Mumbai)
  - Croma Electronics (Bangalore)

  ### 3. Products (20+ products across categories)
  - Electronics (TVs, Phones, Laptops, Audio)
  - Home Appliances (Washers, Fridges, Vacuums)
  - Groceries & Health (for different personas)

  ### 4. Store Products (Inventory with pricing)
  - Different prices per store
  - Realistic discounts

  ### 5. Active Offers
  - Various promotional offers
  - Category-specific deals
*/

-- Insert Test Users
INSERT INTO users (id, phone_number, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', '+919696969696', 'Admin User', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000002', '+918888888888', 'Yashvanth S', 'USER')
ON CONFLICT (phone_number) DO NOTHING;

-- Insert Stores
INSERT INTO stores (id, store_id, name, location, address, lat, lng, image_url, rating) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'RELIANCE_MUM_01',
    'Reliance Digital',
    'Mumbai, Maharashtra',
    'Phoenix Market City, Kurla West, Mumbai - 400070',
    19.0760,
    72.8777,
    'https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800&q=80',
    4.5
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'CROMA_BLR_01',
    'Croma Electronics',
    'Bangalore, Karnataka',
    '100 Feet Rd, Indiranagar, Bangalore - 560038',
    12.9716,
    77.5946,
    'https://images.unsplash.com/photo-1581440861184-8e5c43d874c9?w=800&q=80',
    4.2
  )
ON CONFLICT (store_id) DO NOTHING;

-- Insert Products
INSERT INTO products (id, name, category, description, image_url, barcode) VALUES
  -- Electronics
  (
    '20000000-0000-0000-0000-000000000001',
    'Sony Bravia 55" 4K Google TV',
    'Televisions',
    'Model K-55S25BM2. 4K Ultra HD Smart LED Google TV with Dolby Audio. Features X1 4K Processor for real-world detail and texture.',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
    '8906064371670'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Apple iPhone 15 Pro Max (256GB)',
    'Mobiles',
    'Black Titanium finish. Features the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    'https://images.unsplash.com/photo-1696248612959-1c97a8277258?w=500&q=80',
    '0194253240120'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'MacBook Air M2 (Midnight)',
    'Laptops',
    'Supercharged by M2 chip. 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD. Up to 18 hours of battery life.',
    'https://images.unsplash.com/photo-1661961111184-11317b40adb2?w=500&q=80',
    '0194253400134'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Sony WH-1000XM5 Headphones',
    'Audio',
    'Industry-leading noise cancellation, 30-hour battery life, and crystal clear hands-free calling.',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',
    '4548736139947'
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'JBL Flip 6 Bluetooth Speaker',
    'Audio',
    'IP67 waterproof and dustproof. Delivers powerful JBL Original Pro Sound with deep bass.',
    'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500&q=80',
    '6925281982057'
  ),
  -- Home Appliances
  (
    '20000000-0000-0000-0000-000000000006',
    'Samsung 6.5kg Top Load Washer',
    'Home Appliances',
    'Fully automatic top load washing machine with Diamond Drum and Center Jet technology for powerful washing.',
    'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80',
    '8806092595569'
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Whirlpool 265L Double Door Fridge',
    'Home Appliances',
    'Convertible 5-in-1 modes, IntelliSense Inverter technology. Keeps vegetables fresh for up to 15 days.',
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80',
    '8901332001548'
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Dyson V8 Absolute Vacuum',
    'Home Appliances',
    'Cord-free vacuum cleaner. Powerful suction for versatile cleaning. Up to 40 minutes of run time.',
    'https://images.unsplash.com/photo-1558317374-a3545eca640e?w=500&q=80',
    '5025155030967'
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    'Dell XPS 13 Plus',
    'Laptops',
    '13.4-inch OLED Touch Display. 12th Gen Intel Core i7, 16GB RAM, 1TB SSD. The futuristic design you need.',
    'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&q=80',
    '5397184579626'
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    'OnePlus 12R (16GB RAM)',
    'Mobiles',
    'Cool Blue color. Snapdragon 8 Gen 2 processor, 120Hz ProXDR display, and massive 5500mAh battery.',
    'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&q=80',
    '6921815626350'
  ),
  -- Health & Fitness Products
  (
    '20000000-0000-0000-0000-000000000011',
    'Optimum Nutrition Gold Standard Whey (2lb)',
    'Health & Fitness',
    '24g Protein per serving. Double Rich Chocolate flavor. The world''s best-selling whey protein powder.',
    'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&q=80',
    '0748927022731'
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    'MyProtein Creatine Monohydrate (500g)',
    'Health & Fitness',
    'Pure creatine monohydrate. Increase physical performance during short bursts of high intensity exercise.',
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80',
    '5055534339039'
  ),
  (
    '20000000-0000-0000-0000-000000000013',
    'Fitbit Charge 6 Fitness Tracker',
    'Wearables',
    'Heart rate monitoring, GPS tracking, 7+ day battery life. Track your workouts and health metrics 24/7.',
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
    '0810038854625'
  ),
  (
    '20000000-0000-0000-0000-000000000014',
    'Yoga Mat - Premium Non-Slip',
    'Health & Fitness',
    '6mm thick, eco-friendly TPE material. Perfect grip for hot yoga and intense workouts.',
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
    '1234567890123'
  ),
  -- Groceries
  (
    '20000000-0000-0000-0000-000000000015',
    'Amul Gold Milk (1L)',
    'Groceries',
    'Full cream milk with 6% fat. Rich and creamy taste. Perfect for daily consumption.',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80',
    '8901150100011'
  ),
  (
    '20000000-0000-0000-0000-000000000016',
    'Coca-Cola Zero Sugar (750ml)',
    'Beverages',
    'Zero sugar, zero calories. Same great Coke taste. Perfect refreshment.',
    'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&q=80',
    '5449000214911'
  ),
  (
    '20000000-0000-0000-0000-000000000017',
    'Whole Wheat Bread (400g)',
    'Groceries',
    'Freshly baked whole wheat bread. Rich in fiber and nutrients. Stays soft for 3 days.',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    '8901234567890'
  ),
  (
    '20000000-0000-0000-0000-000000000018',
    'Kellogg''s Corn Flakes (875g)',
    'Groceries',
    'Classic corn flakes. High in iron and B-group vitamins. Quick and healthy breakfast.',
    'https://images.unsplash.com/photo-1600618538034-fc86e9a465d1?w=500&q=80',
    '8901499011718'
  ),
  (
    '20000000-0000-0000-0000-000000000019',
    'Organic Green Tea (100 Bags)',
    'Beverages',
    '100% natural green tea. Rich in antioxidants. Promotes metabolism and mental clarity.',
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80',
    '8906057950081'
  ),
  (
    '20000000-0000-0000-0000-000000000020',
    'Protein Bars - Mixed Berry (Pack of 6)',
    'Health & Fitness',
    '20g protein per bar. Low sugar, high fiber. Perfect post-workout snack.',
    'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&q=80',
    '0856697007025'
  )
ON CONFLICT (barcode) DO NOTHING;

-- Insert Store Products (Reliance Digital - Mumbai)
INSERT INTO store_products (store_id, product_id, price, original_price, aisle, in_stock) VALUES
  -- Reliance Digital Electronics
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 57990, 92090, 'Wall Section B, Row 1', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 134900, 159900, 'Apple Zone, Table 2', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 26990, 34990, 'Audio Section, Shelf C', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 9999, 14999, 'Audio Section, Shelf A', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 15990, 21000, 'Appliances, Aisle 4', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007', 26490, 33150, 'Appliances, Bay 2', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 45999, 49999, 'Mobile Section, Counter 4', true),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 14999, 19999, 'Wearables, Display 3', true)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- Insert Store Products (Croma - Bangalore)
INSERT INTO store_products (store_id, product_id, price, original_price, aisle, in_stock) VALUES
  -- Croma Electronics
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 89990, 114900, 'Laptop Station, Row 1', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009', 154990, 195000, 'Laptop Station, Row 3', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', 29900, 43900, 'Cleaning, Aisle 3', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010', 45999, 49999, 'Mobile Section, Counter 4', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005', 9999, 14999, 'Audio, Aisle 1, Shelf A', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011', 4999, 6499, 'Health, Aisle 7', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000012', 1499, 1999, 'Health, Aisle 7', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000013', 14499, 19999, 'Wearables, Counter 2', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000014', 1299, 2499, 'Sports, Aisle 8', true),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000020', 899, 1299, 'Health, Aisle 7', true)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- Insert Active Offers (Reliance Digital)
INSERT INTO active_offers (store_id, product_id, title, discount_percentage, valid_until, is_active) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Big Screen Bonanza - 37% OFF on Sony Bravia',
    37,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'iPhone 15 Pro Max - Limited Stock',
    16,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004',
    'Premium Audio Sale - Sony XM5',
    23,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000007',
    'Home Appliance Festival',
    20,
    '2025-12-31 23:59:59',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert Active Offers (Croma - Bangalore)
INSERT INTO active_offers (store_id, product_id, title, discount_percentage, valid_until, is_active) VALUES
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000003',
    'MacBook Air M2 - Student Discount',
    22,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000011',
    'Fitness Essentials - Whey Protein',
    23,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000012',
    'Gym Freak Special - Creatine',
    25,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000013',
    'Track Your Fitness - Fitbit Charge 6',
    27,
    '2025-12-31 23:59:59',
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000020',
    'Post-Workout Protein Bars',
    31,
    '2025-12-31 23:59:59',
    true
  )
ON CONFLICT DO NOTHING;

-- Insert Sample User Personas (for demo user)
INSERT INTO user_personas (user_id, persona_type, confidence_score, preferences) VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    'Tech Enthusiast',
    0.85,
    '{"interests": ["electronics", "gadgets", "smartphones", "laptops"], "price_sensitivity": "medium", "brand_preference": ["Apple", "Sony", "Samsung"]}'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Fitness Conscious',
    0.72,
    '{"interests": ["health", "fitness", "supplements", "workout_gear"], "price_sensitivity": "low", "preferred_categories": ["Health & Fitness", "Wearables"]}'
  )
ON CONFLICT (user_id, persona_type) DO NOTHING;