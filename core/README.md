# Scan2Save - AI-Powered Personalized Shopping Platform

## Quick Start

### Test Credentials
- **Admin**: `+919696969696` / OTP: `000000`
- **User**: `+918888888888` / OTP: `000000`

### Installation
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## What is Scan2Save?

An intelligent retail solution that eliminates generic marketing noise by analyzing individual purchase history to deliver hyper-personalized offers at the point of entry.

**Problem**: Traditional retail shows identical offers to everyone → Low conversion rates
**Solution**: QR-based check-in → Purchase history analysis → Personalized offer feed → Higher conversions

---

## Complete Setup Guide

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Prerequisites
1. Supabase account (database)
2. Firebase project (phone authentication)
3. Node.js 18+

### Quick Configuration

1. **Supabase Setup**
   - Create project at supabase.com
   - Copy Project URL and anon key
   - Database migrations are auto-applied

2. **Firebase Setup**
   - Create project at console.firebase.google.com
   - Enable Phone Authentication
   - Add test numbers for development

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY=your_private_key
   ```

---

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Database**: PostgreSQL (Supabase)
- **Auth**: Firebase Phone Authentication
- **ORM**: Prisma (schema reference)
- **QR**: qrcode.react, jsqr

---

## Key Features

### For Customers
- QR code store entry
- Phone OTP authentication
- AI-generated shopping personas
- Personalized offer recommendations
- Smart product search & filtering
- Shopping cart with real-time pricing
- Purchase history tracking

### For Retailers (Admin Panel)
- Store management
- QR code generation
- Product inventory control
- User analytics dashboard
- Purchase pattern insights
- Security guard verification system

---

## Project Structure
```
core/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/             # Backend endpoints
│   ├── store/           # Store fronts
│   ├── offers/          # Personalized offers
│   ├── dashboard/       # User dashboard
│   └── login/           # Authentication
├── lib/
│   ├── firebase.ts      # Firebase Admin
│   └── firebaseAuth.ts  # Auth helpers
└── SETUP.md             # Detailed setup guide
```

---

## How It Works

1. **QR Generation**: Admin creates unique QR per store
2. **Customer Scan**: User scans QR at store entrance
3. **Authentication**: Phone OTP verification
4. **AI Analysis**: System analyzes purchase history
5. **Persona Detection**: AI identifies shopping profile
6. **Recommendation**: Relevant offers generated
7. **Shopping**: Browse products with personalized pricing
8. **Checkout**: Complete purchase & get exit QR
9. **Verification**: Guard scans exit QR to verify purchase

---

## Database Schema Highlights

- **users**: Customer accounts & roles
- **stores**: Physical locations with geolocation
- **products**: Global product catalog
- **store_products**: Store-specific pricing
- **user_personas**: AI shopping profiles
- **personalized_feeds**: User-specific recommendations
- **transactions**: Purchase history for AI training

All tables protected with Row Level Security (RLS)

---

## API Endpoints

### Public
- `GET /api/stores` - List stores
- `GET /api/stores/[id]/products` - Store inventory

### Authenticated
- `GET /api/recommendations` - Personalized offers
- `POST /api/cart` - Add to cart
- `POST /api/auth/login` - Verify phone OTP

---

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run linter
```

---

## License
MIT

---

For complete setup instructions, see [SETUP.md](./SETUP.md)