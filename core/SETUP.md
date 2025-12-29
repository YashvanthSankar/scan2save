# Scan2Save - Complete Setup Guide

## Overview
Scan2Save is an AI-powered personalized shopping platform that analyzes customer purchase history to provide targeted offers, increasing conversion rates in retail stores.

## Problem Statement
Traditional retail marketing shows generalized offers to all customers, resulting in low conversion rates. A gym enthusiast entering a store doesn't want biscuit offers - they want protein supplements!

## Solution
Scan2Save generates unique QR codes for each store. When customers scan:
1. They log in via phone OTP (Firebase Auth)
2. System analyzes their purchase history at that specific store
3. AI generates personalized offers based on their shopping persona (e.g., "Gym Freak", "Health Conscious")
4. Customer sees only relevant, high-conversion offers

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: Firebase Phone Auth
- **QR Generation**: qrcode.react
- **QR Scanning**: jsqr, @yudiel/react-qr-scanner

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Supabase account ([signup here](https://supabase.com))
- Firebase project with Phone Auth enabled

### 2. Supabase Setup

#### A. Create Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - Name: `scan2save`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait for project to provision (~2 minutes)

#### B. Get API Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### C. Database Setup
The database schema and seed data are already applied via migrations. If you need to reset:

```bash
# In Supabase dashboard, go to SQL Editor and run:
# (This will drop and recreate all tables)
```

### 3. Firebase Setup

#### A. Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it `scan2save` and follow the wizard

#### B. Enable Phone Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Phone** provider
3. Add test phone numbers (for development):
   - Phone: `+919696969696` → Code: `000000` (Admin)
   - Phone: `+918888888888` → Code: `000000` (User)

#### C. Get Firebase Credentials
1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file - you'll need:
   - `project_id`
   - `client_email`
   - `private_key`

#### D. Web App Configuration
1. In Project Settings → **General** → **Your apps**
2. Click Web icon (</>) to add web app
3. Copy the Firebase config (already in `lib/firebaseClient.ts`)

### 4. Environment Variables

Create `.env.local` in the `core` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Firebase Admin SDK (for backend verification)
FIREBASE_PROJECT_ID=scan2save-a64d8
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"

# Optional: For custom API URL (default is http://localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Installation

```bash
cd core
npm install
npm run dev
```

The app will be running at `http://localhost:3000`

---

## Testing the Application

### Test Accounts
1. **Admin User**
   - Phone: `+919696969696`
   - OTP: `000000`
   - Access: Admin panel at `/admin/dashboard`

2. **Regular User**
   - Phone: `+918888888888`
   - OTP: `000000`
   - Access: User dashboard and store shopping

### Test Flow
1. **Generate Store QR Code**
   - Login as admin (`+919696969696`)
   - Go to `/admin/generate-qr`
   - Select "Reliance Digital" or "Croma Electronics"
   - Download the QR code PNG

2. **Customer Shopping Experience**
   - Go to homepage `/`
   - Upload the QR code screenshot
   - Login with `+918888888888`
   - See personalized offers based on "Gym Freak" persona
   - Browse products, add to cart
   - Complete checkout

3. **Admin Management**
   - View dashboard analytics
   - Manage stores and products
   - Generate new QR codes
   - View user personas and purchase history

---

## Database Schema

### Key Tables
- `users` - Customer accounts with roles (USER/ADMIN)
- `stores` - Physical retail locations
- `products` - Global product catalog
- `store_products` - Store-specific inventory and pricing
- `user_personas` - AI-generated shopping personas
- `active_offers` - Current promotional offers
- `personalized_feeds` - User-specific recommendations
- `transactions` - Purchase history
- `carts` - Shopping cart management

### AI Recommendation Logic
Located in `/api/recommendations/route.ts`:
1. Fetches user's purchase history
2. Analyzes category frequency
3. Combines with persona preferences
4. Scores offers by relevance (0-1)
5. Returns top 10 personalized offers

---

## API Routes

### Public Routes
- `GET /api/stores` - List all stores
- `GET /api/stores/[storeId]` - Get store details
- `GET /api/stores/[storeId]/products` - Get store inventory
- `GET /api/products/[id]` - Get product details

### Protected Routes (Require Auth)
- `GET /api/recommendations?userId=&storeId=` - Get personalized offers
- `GET /api/cart?userId=` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart?itemId=` - Remove from cart

---

## Project Structure

```
core/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/      # Analytics dashboard
│   │   ├── stores/         # Store management
│   │   ├── generate-qr/    # QR code generator
│   │   └── verify/         # Security guard verification
│   ├── api/                # Backend API routes
│   │   ├── stores/         # Store endpoints
│   │   ├── products/       # Product endpoints
│   │   ├── recommendations/ # AI recommendation engine
│   │   ├── cart/           # Shopping cart
│   │   └── auth/           # Authentication
│   ├── store/[storeId]/    # Store frontend
│   ├── product/[id]/       # Product details
│   ├── dashboard/          # User dashboard
│   ├── scan/               # QR scanner
│   └── login/              # Phone auth
├── lib/
│   ├── firebase.ts         # Firebase Admin SDK
│   ├── firebaseClient.ts   # Firebase Client SDK
│   └── firebaseAuth.ts     # Auth helpers
└── prisma/
    └── schema.prisma       # Database schema (for reference)
```

---

## Key Features Implemented

### 1. QR-Based Store Entry
- Unique QR codes per store with embedded store_id
- Mobile-friendly scanner with file upload fallback
- Location verification (lat/lng in QR payload)

### 2. AI-Powered Recommendations
- Purchase history analysis
- Multi-persona support (Tech Enthusiast, Fitness Conscious, etc.)
- Relevance scoring algorithm
- Category-based filtering

### 3. Admin Features
- Store management (CRUD operations)
- QR code generation with visual preview
- User persona viewing
- Analytics dashboard
- Security guard verification system

### 4. User Features
- Phone OTP authentication
- Personalized offer feed
- Product browsing with search/filter
- Shopping cart
- Order history
- Purchase tracking

### 5. Security
- Row Level Security (RLS) on all tables
- Firebase Auth integration
- Session-based access control
- Admin role verification
- Secure API endpoints

---

## Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Production
Make sure to add ALL environment variables from `.env.local` to your Vercel project settings.

---

## Troubleshooting

### "ReCAPTCHA already rendered" Error
This is normal in development due to React Strict Mode. It doesn't affect production.

### "No products found"
Make sure migrations have been applied to Supabase. Check SQL Editor for table existence.

### Firebase Auth Not Working
1. Verify test phone numbers are added in Firebase Console
2. Check that Firebase config in `lib/firebaseClient.ts` matches your project
3. Ensure `.env.local` has correct Firebase Admin credentials

### API Routes Returning 500
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is not paused (free tier auto-pauses after inactivity)
3. Check browser console for detailed error messages

---

## Future Enhancements
- [ ] Real-time notifications for new offers
- [ ] Loyalty points system
- [ ] Social sharing of deals
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Barcode scanning for add-to-cart
- [ ] Voice-based product search

---

## Support
For issues, contact: your-email@example.com

## License
MIT
