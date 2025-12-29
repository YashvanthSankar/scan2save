/*
  # Scan2Save Database Schema

  ## Overview
  Complete database schema for the Scan2Save personalized shopping platform.
  This system enables QR-based store check-ins with AI-driven personalized offers.

  ## Tables Created
  
  ### 1. users
  - `id` (uuid, primary key)
  - `phone_number` (text, unique) - User's phone for authentication
  - `name` (text) - Optional user name
  - `role` (text) - Either 'USER' or 'ADMIN'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. stores
  - `id` (uuid, primary key)
  - `store_id` (text, unique) - Human-readable ID (e.g., RELIANCE_MUM_01)
  - `name` (text) - Store name
  - `location` (text) - City/area
  - `address` (text) - Full address
  - `lat` (numeric) - Latitude for check-in verification
  - `lng` (numeric) - Longitude
  - `image_url` (text) - Store banner image
  - `rating` (numeric) - Average rating
  - `is_active` (boolean) - Store operational status
  - `created_at` (timestamptz)

  ### 3. products
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `category` (text) - Product category (e.g., Electronics, Groceries)
  - `description` (text) - Product description
  - `image_url` (text) - Product image
  - `barcode` (text, unique) - EAN/UPC code
  - `created_at` (timestamptz)

  ### 4. store_products
  - Links products to stores with store-specific pricing
  - `id` (uuid, primary key)
  - `store_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `price` (numeric) - Current price at this store
  - `original_price` (numeric) - Original price for discount calculation
  - `aisle` (text) - Physical location in store
  - `in_stock` (boolean)
  - `created_at` (timestamptz)

  ### 5. transactions
  - Purchase records with gate pass functionality
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `store_id` (uuid, foreign key)
  - `total_amount` (numeric)
  - `is_paid` (boolean)
  - `gate_pass_token` (text, unique) - For exit verification
  - `is_verified` (boolean) - Guard verified
  - `verified_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. transaction_items
  - Individual items in a transaction
  - `id` (uuid, primary key)
  - `transaction_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `quantity` (integer)
  - `price_at_purchase` (numeric)

  ### 7. user_personas
  - AI-generated user shopping personas
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `persona_type` (text) - e.g., 'Gym Enthusiast', 'Health Conscious'
  - `confidence_score` (numeric) - AI confidence (0-1)
  - `preferences` (jsonb) - Detailed preferences
  - `updated_at` (timestamptz)

  ### 8. active_offers
  - Current promotional offers
  - `id` (uuid, primary key)
  - `store_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `title` (text)
  - `discount_percentage` (integer)
  - `valid_until` (timestamptz)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 9. personalized_feeds
  - User-specific offer recommendations
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `offer_id` (uuid, foreign key)
  - `store_id` (uuid, foreign key)
  - `relevance_score` (numeric) - AI relevance score (0-1)
  - `generated_at` (timestamptz)

  ### 10. carts
  - Shopping cart management
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key, unique)
  - `store_id` (uuid, foreign key)
  - `updated_at` (timestamptz)

  ### 11. cart_items
  - Items in shopping cart
  - `id` (uuid, primary key)
  - `cart_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `quantity` (integer)
  - `added_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Admins have full access
  - Public read access for stores and products

  ## Important Notes
  - All monetary values use numeric type for precision
  - Timestamps use timestamptz for timezone awareness
  - UUIDs ensure globally unique identifiers
  - Indexes added for performance on foreign keys and common queries
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number text UNIQUE NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. STORES TABLE
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id text UNIQUE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  image_url text,
  rating numeric DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  image_url text,
  barcode text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 4. STORE_PRODUCTS TABLE (Price varies by store)
CREATE TABLE IF NOT EXISTS store_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price numeric NOT NULL CHECK (price >= 0),
  original_price numeric NOT NULL CHECK (original_price >= 0),
  aisle text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, product_id)
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  is_paid boolean DEFAULT false,
  gate_pass_token text UNIQUE,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 6. TRANSACTION_ITEMS TABLE
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL CHECK (price_at_purchase >= 0)
);

-- 7. USER_PERSONAS TABLE (AI-Generated)
CREATE TABLE IF NOT EXISTS user_personas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona_type text NOT NULL,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  preferences jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, persona_type)
);

-- 8. ACTIVE_OFFERS TABLE
CREATE TABLE IF NOT EXISTS active_offers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title text NOT NULL,
  discount_percentage integer CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  valid_until timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 9. PERSONALIZED_FEEDS TABLE
CREATE TABLE IF NOT EXISTS personalized_feeds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offer_id uuid NOT NULL REFERENCES active_offers(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
  generated_at timestamptz DEFAULT now()
);

-- 10. CARTS TABLE
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now()
);

-- 11. CART_ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  added_at timestamptz DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

-- CREATE INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_store_products_store_id ON store_products(store_id);
CREATE INDEX IF NOT EXISTS idx_store_products_product_id ON store_products(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_store_id ON transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_personalized_feeds_user_id ON personalized_feeds(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_feeds_store_id ON personalized_feeds(store_id);
CREATE INDEX IF NOT EXISTS idx_active_offers_store_id ON active_offers(store_id);
CREATE INDEX IF NOT EXISTS idx_user_personas_user_id ON user_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Users: Can read own data, admins can read all
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = id::text OR 
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
  );

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Stores: Public read, admin write
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage stores"
  ON stores FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN'));

-- Products: Public read, admin write
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN'));

-- Store Products: Public read, admin write
CREATE POLICY "Anyone can view store inventory"
  ON store_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage inventory"
  ON store_products FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN'));

-- Transactions: Users see own, admins see all
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    user_id::text = auth.uid()::text OR 
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
  );

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- Transaction Items: Access through parent transaction
CREATE POLICY "Users can view own transaction items"
  ON transaction_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE id = transaction_id 
      AND (user_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN'))
    )
  );

CREATE POLICY "Users can create transaction items"
  ON transaction_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE id = transaction_id 
      AND user_id::text = auth.uid()::text
    )
  );

-- User Personas: Private to user
CREATE POLICY "Users can view own personas"
  ON user_personas FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "System can manage personas"
  ON user_personas FOR ALL
  TO authenticated
  USING (
    user_id::text = auth.uid()::text OR 
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
  );

-- Active Offers: Public read, admin write
CREATE POLICY "Anyone can view active offers"
  ON active_offers FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage offers"
  ON active_offers FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN'));

-- Personalized Feeds: Private to user
CREATE POLICY "Users can view own feed"
  ON personalized_feeds FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "System can create feeds"
  ON personalized_feeds FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

-- Carts: Users see own only
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  TO authenticated
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- Cart Items: Access through parent cart
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE id = cart_id 
      AND user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE id = cart_id 
      AND user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE id = cart_id 
      AND user_id::text = auth.uid()::text
    )
  );

-- FUNCTION: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS: Auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_personas_updated_at BEFORE UPDATE ON user_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();