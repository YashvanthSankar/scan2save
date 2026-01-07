# Scan2Save - Complete Project Documentation

> **Retail, Reimagined for the AI Era.**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Technical Architecture](#technical-architecture)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Features Breakdown](#features-breakdown)
10. [AI Recommendation Engine](#ai-recommendation-engine)
11. [Authentication Flow](#authentication-flow)
12. [User Flows](#user-flows)
13. [Admin Dashboard](#admin-dashboard)
14. [PWA Features](#pwa-features)
15. [Setup & Installation](#setup--installation)
16. [Environment Variables](#environment-variables)
17. [Deployment](#deployment)
18. [Testing](#testing)
19. [Security Considerations](#security-considerations)
20. [Future Roadmap](#future-roadmap)

---

## Executive Summary

**Scan2Save** is a Progressive Web Application (PWA) that transforms the traditional retail shopping experience by leveraging AI-powered personalization. The platform enables shoppers to:

- Scan a store's QR code to enter the digital store experience
- Receive hyper-personalized offers based on their purchase history
- Complete checkout seamlessly with digital payments (Scan & Go)
- Generate exit pass QR codes for store verification

For retailers, Scan2Save provides:
- Increased conversion through targeted discounts
- Real-time inventory-aware promotions
- Zero hardware integration costs
- Comprehensive analytics dashboard

---

## Problem Statement

Traditional retail marketing suffers from a critical flaw: **generalized offers for all customers**. This approach results in:

- Low conversion rates (typically 2-5%)
- Customer fatigue from irrelevant promotions
- Wasted marketing budget on untargeted campaigns
- Poor shopping experience

**Example:** A gym enthusiast entering a grocery store doesn't want biscuit offers — they want protein supplements and healthy snacks!

---

## Solution Overview

Scan2Save addresses this by implementing a **machine learning-powered recommendation engine** that analyzes:

1. **Purchase History** - What has the customer bought before?
2. **Category Affinities** - Which product categories do they prefer?
3. **Time-based Patterns** - When do they typically shop?
4. **Browsing Behavior** - What products have they viewed?

The system generates a **shopping persona** (e.g., "Gym Enthusiast", "Tech Lover", "Budget Conscious") and surfaces only relevant, high-conversion offers.

### Value Proposition

| For Shoppers | For Retailers |
|--------------|---------------|
| Hyper-personalized offers based on purchase history | Increased conversion through targeted discounts |
| Scan & Go checkout experience | Real-time inventory-aware promotions |
| No app download required (PWA) | Zero hardware integration costs |
| Digital receipts and order history | Comprehensive analytics and insights |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Next.js 16 (App Router) + React 19 + TailwindCSS 4                    │ │
│  │  • PWA with Service Worker                                             │ │
│  │  • Dark/Light Theme Support                                            │ │
│  │  • Responsive Mobile-First Design                                      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Next.js API Routes (Edge-ready)                                       │ │
│  │  /core/app/api/*                                                       │ │
│  │                                                                        │ │
│  │  Routes:                                                               │ │
│  │  • /api/auth/*        - Authentication endpoints                       │ │
│  │  • /api/stores/*      - Store management                               │ │
│  │  • /api/products/*    - Product catalog                                │ │
│  │  • /api/cart/*        - Shopping cart operations                       │ │
│  │  • /api/orders/*      - Order processing                               │ │
│  │  • /api/offers/*      - Offer management                               │ │
│  │  • /api/recommendations/* - AI recommendations                         │ │
│  │  • /api/admin/*       - Admin operations                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   Firebase          │   │   Supabase          │   │   AI Engine         │
│   (Authentication)  │   │   (PostgreSQL)      │   │   (Groq)            │
│                     │   │                     │   │                     │
│   • Phone OTP Auth  │   │   • User Data       │   │   • Persona Gen     │
│   • Session Mgmt    │   │   • Transactions    │   │   • Offer Ranking   │
│   • Token Verify    │   │   • Products        │   │   • Recommendations │
│                     │   │   • via Prisma ORM  │   │                     │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.10 | Full-stack React framework with App Router |
| **React** | 19.2.1 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **TailwindCSS** | 4.x | Utility-first CSS framework |

### Database & ORM
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database (hosted on Supabase) |
| **Prisma** | Type-safe ORM for database operations |
| **Supabase** | PostgreSQL hosting + Row Level Security |

### Authentication
| Technology | Purpose |
|------------|---------|
| **Firebase Auth** | Phone number OTP authentication |
| **Firebase Admin SDK** | Server-side token verification |

### AI & ML
| Technology | Purpose |
|------------|---------|
| **Groq LLM** | Fast inference for persona generation |
| **Google Gemini** | Alternative AI provider for recommendations |

### Additional Libraries
| Library | Purpose |
|---------|---------|
| `qrcode.react` | QR code generation |
| `@yudiel/react-qr-scanner` | Camera-based QR scanning |
| `jsqr` | QR code decoding from images |
| `lucide-react` | Icon library |
| `next-themes` | Dark/Light theme switching |
| `next-pwa` | Progressive Web App support |

---

## Project Structure

```
scan2save/
├── core/                           # Main Next.js Application
│   ├── app/                        # App Router (pages & API routes)
│   │   ├── api/                    # Backend API endpoints
│   │   │   ├── admin/              # Admin-only endpoints
│   │   │   │   ├── stats/          # Dashboard statistics
│   │   │   │   ├── transactions/   # Transaction management
│   │   │   │   ├── verify/         # Guard verification
│   │   │   │   └── users/          # User management
│   │   │   ├── auth/               # Authentication
│   │   │   │   ├── register/       # User registration
│   │   │   │   └── verify/         # Token verification
│   │   │   ├── cart/               # Shopping cart CRUD
│   │   │   ├── offers/             # Offer management
│   │   │   ├── orders/             # Order processing
│   │   │   ├── products/           # Product catalog
│   │   │   ├── recommendations/    # AI recommendations
│   │   │   ├── scan/               # QR scan processing
│   │   │   ├── stores/             # Store management
│   │   │   │   ├── [storeId]/      # Store-specific endpoints
│   │   │   │   │   └── products/   # Store inventory
│   │   │   │   └── nearby/         # Location-based stores
│   │   │   └── user/               # User profile
│   │   │       └── me/             # Current user data
│   │   │
│   │   ├── admin/                  # Admin Dashboard (protected)
│   │   │   ├── dashboard/          # Analytics overview
│   │   │   ├── generate-qr/        # QR code generator
│   │   │   ├── offers/             # Offer management
│   │   │   ├── products/           # Product management
│   │   │   ├── stores/             # Store management
│   │   │   ├── transactions/       # Transaction history
│   │   │   ├── users/              # User management
│   │   │   └── verify/             # Guard verification terminal
│   │   │
│   │   ├── dashboard/              # User dashboard
│   │   ├── store/[storeId]/        # Dynamic store pages
│   │   ├── product/[id]/           # Product detail pages
│   │   ├── scan/                   # QR scanning page
│   │   ├── cart/                   # Shopping cart
│   │   ├── checkout/               # Checkout flow
│   │   │   └── success/            # Post-payment confirmation
│   │   ├── orders/                 # Order history
│   │   │   └── [orderId]/          # Order details
│   │   ├── offers/                 # User's claimed offers
│   │   ├── profile/                # User profile
│   │   │   └── edit/               # Profile editing
│   │   ├── login/                  # Phone OTP login
│   │   ├── install/                # PWA installation guide
│   │   ├── for-shoppers/           # Landing page for shoppers
│   │   ├── for-retailers/          # Landing page for retailers
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page
│   │   ├── privacy/                # Privacy policy
│   │   ├── terms/                  # Terms of service
│   │   └── get-qrs/                # Public QR downloads
│   │
│   ├── components/                 # Reusable React components
│   │   ├── AddToCartButton.tsx     # Add to cart functionality
│   │   ├── Background.tsx          # Animated background
│   │   ├── FloatingCart.tsx        # Floating cart indicator
│   │   ├── GatePassQR.tsx          # Exit pass QR generator
│   │   ├── InstallBanner.tsx       # PWA install prompt
│   │   ├── LandingClient.tsx       # Landing page client component
│   │   ├── PersonalizedFeed.tsx    # AI-powered offer feed
│   │   ├── ProductGrid.tsx         # Product listing grid
│   │   ├── ShoppingRoute.tsx       # In-store navigation
│   │   ├── StoreFilters.tsx        # Product filtering
│   │   ├── StoreHeader.tsx         # Store page header
│   │   ├── StoreList.tsx           # Store listing
│   │   ├── StoreQRSection.tsx      # Store QR display
│   │   ├── ThemeProvider.tsx       # Theme context provider
│   │   └── ThemeToggle.tsx         # Dark/light mode toggle
│   │
│   ├── lib/                        # Utilities & configurations
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── firebase.ts             # Firebase Admin SDK
│   │   ├── firebaseClient.ts       # Firebase Client SDK
│   │   ├── firebaseAuth.ts         # Auth helper functions
│   │   ├── CartContext.tsx         # Cart state management
│   │   ├── InstallContext.tsx      # PWA install context
│   │   ├── data.ts                 # Data fetching utilities
│   │   └── supabaseClient.ts       # Supabase client
│   │
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema definition
│   │   └── seed.ts                 # Database seeding script
│   │
│   ├── services/                   # External service integrations
│   │   └── recommendation-engine/  # AI Recommendation Service
│   │       ├── index.ts            # Main export
│   │       ├── types.ts            # TypeScript interfaces
│   │       ├── GroqClient.ts       # Groq API client
│   │       └── GroqRecommender.ts  # Recommendation logic
│   │
│   ├── public/                     # Static assets
│   │   ├── manifest.json           # PWA manifest
│   │   ├── sw.js                   # Service worker
│   │   └── icons/                  # App icons
│   │
│   └── scripts/                    # Utility scripts
│       └── seed-data.ts            # Data seeding
│
├── screenshots/                    # App screenshots (1-10)
├── demo-video_SCAN2SAVE.mp4        # Demo video
├── README.md                       # Project overview
├── DOCUMENTATION.md                # This file
└── LICENSE                         # Proprietary license
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    User     │       │      Store      │       │    Product      │
├─────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)     │       │ id (PK)         │       │ id (PK)         │
│ phoneNumber │       │ storeId         │       │ name            │
│ name        │       │ name            │       │ category        │
│ role        │───┐   │ location        │   ┌───│ imageUrl        │
│ createdAt   │   │   │ lat, lng        │   │   │ barcode         │
└──────┬──────┘   │   │ isActive        │   │   └────────┬────────┘
       │          │   │ qrPayload       │   │            │
       │          │   └────────┬────────┘   │            │
       │          │            │            │            │
       │          └────────────┼────────────┘            │
       │                       │                         │
       ▼                       ▼                         ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Cart     │       │  StoreProduct   │       │  ActiveOffer    │
├─────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)     │       │ id (PK)         │       │ id (PK)         │
│ userId (FK) │       │ storeId (FK)    │       │ productId (FK)  │
│ storeId(FK) │       │ productId (FK)  │       │ title           │
│ updatedAt   │       │ price           │       │ discountPercent │
└──────┬──────┘       │ aisle           │       │ isDefault       │
       │              │ inStock         │       │ validUntil      │
       ▼              └─────────────────┘       │ category        │
┌─────────────┐                                 └────────┬────────┘
│  CartItem   │                                          │
├─────────────┤                                          │
│ id (PK)     │                                          │
│ cartId (FK) │                                          ▼
│ productId   │                                 ┌─────────────────┐
│ quantity    │                                 │PersonalizedFeed │
└─────────────┘                                 ├─────────────────┤
                                                │ id (PK)         │
┌─────────────┐       ┌─────────────────┐       │ userId (FK)     │
│ Transaction │       │TransactionItem  │       │ offerId (FK)    │
├─────────────┤       ├─────────────────┤       │ relevanceScore  │
│ id (PK)     │◄──────│ id (PK)         │       │ generatedAt     │
│ userId (FK) │       │ transactionId   │       └─────────────────┘
│ storeId(FK) │       │ productId (FK)  │
│ totalAmount │       │ quantity        │       ┌─────────────────┐
│ createdAt   │       │ priceAtPurchase │       │  ClaimedOffer   │
│ isPaid      │       └─────────────────┘       ├─────────────────┤
│ gatePassTkn │                                 │ id (PK)         │
│ isVerified  │                                 │ userId (FK)     │
│ verifiedAt  │                                 │ offerId (FK)    │
└─────────────┘                                 │ storeId (FK)    │
                                                │ claimedAt       │
                                                │ usedAt          │
                                                │ isUsed          │
                                                │ discountCode    │
                                                └─────────────────┘
```

### Model Definitions

#### User
```prisma
model User {
  id           String   @id @default(uuid())
  phoneNumber  String   @unique
  name         String?
  role         Role     @default(USER)  // USER | ADMIN
  createdAt    DateTime @default(now())
  
  transactions Transaction[]
  feed         PersonalizedFeed[]
  cart         Cart?
  claimedOffers ClaimedOffer[]
}
```

#### Store
```prisma
model Store {
  id        String   @id @default(uuid())
  storeId   String   @unique  // Human-readable ID (e.g., RELIANCE_MUM_01)
  name      String
  location  String
  lat       Float
  lng       Float
  isActive  Boolean  @default(true)
  qrPayload Json     // Embedded QR data structure
  
  products     StoreProduct[]
  transactions Transaction[]
  carts        Cart[]
  claimedOffers ClaimedOffer[]
}
```

#### Product & StoreProduct
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  category    String
  imageUrl    String?
  barcode     String?  @unique
  
  storeListings StoreProduct[]
  cartItems     CartItem[]
  transactionItems TransactionItem[]
  offers        ActiveOffer[]
}

model StoreProduct {
  id        Int     @id @default(autoincrement())
  storeId   String
  productId Int
  price     Decimal
  aisle     String?
  inStock   Boolean @default(true)
  
  @@unique([storeId, productId])
}
```

---

## API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register or login a user via phone number.

**Request:**
```json
{
  "phoneNumber": "+919696969696",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "phoneNumber": "+919696969696",
    "name": "John Doe",
    "role": "USER"
  },
  "isNewUser": false
}
```

#### `GET /api/auth/verify`
Verify Firebase ID token and return user data.

**Headers:** `Authorization: Bearer <firebase_token>`

---

### Store Endpoints

#### `GET /api/stores`
List all active stores.

**Response:**
```json
{
  "stores": [
    {
      "id": "uuid",
      "storeId": "RELIANCE_MUM_01",
      "name": "Reliance Fresh - Mumbai Central",
      "location": "234 Main Road, Mumbai",
      "lat": 19.0760,
      "lng": 72.8777
    }
  ]
}
```

#### `GET /api/stores/[storeId]`
Get store details by ID.

#### `GET /api/stores/[storeId]/products`
Get store inventory with pricing.

**Query Parameters:**
- `category` - Filter by category
- `search` - Search term
- `inStock` - Boolean filter

---

### Cart Endpoints

#### `GET /api/cart?userId=<userId>`
Get user's current cart.

#### `POST /api/cart`
Add item to cart.

**Request:**
```json
{
  "userId": "user-uuid",
  "storeId": "store-uuid",
  "productId": 123,
  "quantity": 2
}
```

#### `PUT /api/cart`
Update cart item quantity.

#### `DELETE /api/cart?itemId=<itemId>`
Remove item from cart.

---

### Order Endpoints

#### `POST /api/orders`
Create a new order from cart.

**Request:**
```json
{
  "userId": "user-uuid",
  "storeId": "store-uuid",
  "paymentMethod": "UPI"
}
```

**Response:**
```json
{
  "orderId": "order-uuid",
  "gatePassToken": "ABC123XYZ",
  "totalAmount": 1299.00
}
```

#### `GET /api/orders?userId=<userId>`
Get user's order history.

#### `GET /api/orders/status?token=<gatePassToken>`
Check order verification status.

---

### Recommendation Endpoints

#### `GET /api/recommendations?userId=<userId>&storeId=<storeId>`
Get personalized offer recommendations.

**Response:**
```json
{
  "offers": [
    {
      "id": 1,
      "title": "20% off Protein Powder",
      "discountPercentage": 20,
      "relevanceScore": 0.95,
      "product": {
        "id": 45,
        "name": "Whey Protein 1kg",
        "category": "Health & Fitness"
      }
    }
  ]
}
```

---

### Admin Endpoints

#### `GET /api/admin/stats`
Get dashboard statistics.

**Response:**
```json
{
  "totalUsers": 1250,
  "totalOrders": 3400,
  "totalRevenue": 450000,
  "todayOrders": 45,
  "conversionRate": 12.5
}
```

#### `POST /api/admin/verify`
Verify a gate pass token (guard terminal).

**Request:**
```json
{
  "gatePassToken": "ABC123XYZ"
}
```

---

## Features Breakdown

### 1. QR-Based Store Entry

**How it works:**
1. Each store has a unique QR code containing `storeId` and location data
2. Customer scans QR using phone camera or image upload
3. System validates store and redirects to store page
4. QR payload structure:
```json
{
  "type": "store_entry",
  "storeId": "RELIANCE_MUM_01",
  "lat": 19.0760,
  "lng": 72.8777
}
```

### 2. AI-Personalized Offers

**Recommendation Algorithm:**
1. **Analyze Purchase History** - Fetch all past transactions
2. **Calculate Category Affinity** - Score categories by frequency
3. **Generate Persona** - Use Groq/Gemini to create shopping persona
4. **Score Offers** - Match offers against persona preferences
5. **Rank & Return** - Return top 10 most relevant offers

### 3. Scan & Go Checkout

**Flow:**
1. Add products to cart while browsing store
2. Proceed to checkout → Select payment method
3. Payment simulated (development) or real UPI integration (production)
4. Generate unique `gatePassToken`
5. Display Exit QR code with token
6. Guard scans QR → System marks as verified

### 4. Shopping Route (In-Store Navigation)

**Features:**
- Shows aisle locations for cart items
- Optimized route through store
- Product availability indicators

---

## AI Recommendation Engine

Located in `/services/recommendation-engine/`

### Architecture

```
┌─────────────────────────────────────────────────────┐
│            GroqRecommender.ts                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. fetchUserHistory(userId)                        │
│     └── Get all transactions + items                │
│                                                     │
│  2. calculateCategoryAffinity()                     │
│     └── Score categories by purchase frequency      │
│                                                     │
│  3. generatePersona(history)                        │
│     └── Call Groq LLM to create shopping persona    │
│                                                     │
│  4. fetchActiveOffers(storeId)                      │
│     └── Get store's current promotions              │
│                                                     │
│  5. scoreOffers(offers, affinity, persona)          │
│     └── Calculate relevance score (0-1)             │
│                                                     │
│  6. rankAndReturn(scoredOffers, limit=10)           │
│     └── Sort by score, return top N                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Scoring Formula

```
relevanceScore = (
  categoryMatch * 0.4 +      // Does offer match preferred categories?
  personaFit * 0.3 +          // Does offer align with shopping persona?
  recencyBoost * 0.2 +        // Recently viewed products get boost
  discountValue * 0.1         // Higher discounts get slight preference
)
```

---

## Authentication Flow

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│  User   │         │   Frontend   │         │   Backend   │
└────┬────┘         └──────┬───────┘         └──────┬──────┘
     │                     │                        │
     │  Enter phone number │                        │
     │────────────────────>│                        │
     │                     │                        │
     │                     │  Initialize reCAPTCHA  │
     │                     │────────────────────────│
     │                     │                        │
     │                     │  signInWithPhoneNumber │
     │                     │──────────────────────> │ Firebase
     │                     │                        │
     │  Receive OTP (SMS)  │                        │
     │<────────────────────│                        │
     │                     │                        │
     │  Enter OTP          │                        │
     │────────────────────>│                        │
     │                     │                        │
     │                     │  Confirm OTP           │
     │                     │──────────────────────> │ Firebase
     │                     │                        │
     │                     │  Get ID Token          │
     │                     │<────────────────────── │
     │                     │                        │
     │                     │  POST /api/auth/register
     │                     │───────────────────────>│
     │                     │                        │
     │                     │  Verify Token (Admin SDK)
     │                     │                        │
     │                     │  Create/Get User in DB │
     │                     │<───────────────────────│
     │                     │                        │
     │  Logged In!         │                        │
     │<────────────────────│                        │
```

---

## User Flows

### Shopper Flow

```
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│   Landing    │────>│    Login     │────>│   Dashboard   │
│    Page      │     │  (Phone OTP) │     │               │
└──────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                                    ┌─────────────┴──────────────┐
                                    ▼                            ▼
                           ┌───────────────┐            ┌───────────────┐
                           │   Scan QR     │            │  View Orders  │
                           │  (Store Entry)│            │    History    │
                           └───────┬───────┘            └───────────────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │  Store Page   │
                           │ (Personalized │
                           │    Offers)    │
                           └───────┬───────┘
                                   │
                      ┌────────────┼────────────┐
                      ▼            ▼            ▼
              ┌───────────┐ ┌───────────┐ ┌───────────┐
              │  Browse   │ │   View    │ │  Claim    │
              │ Products  │ │  Offers   │ │  Offer    │
              └─────┬─────┘ └───────────┘ └───────────┘
                    │
                    ▼
              ┌───────────┐
              │ Add to    │
              │   Cart    │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │ Checkout  │
              │  (Pay)    │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │  Exit QR  │
              │  (Gate    │
              │   Pass)   │
              └───────────┘
```

### Admin Flow

```
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│   Landing    │────>│    Login     │────>│    Admin      │
│    Page      │     │(Admin Phone) │     │  Dashboard    │
└──────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
           ┌──────────┬──────────┬────────────────┼─────────┬──────────┐
           ▼          ▼          ▼                ▼         ▼          ▼
    ┌───────────┐ ┌────────┐ ┌────────┐    ┌──────────┐ ┌────────┐ ┌────────┐
    │  Manage   │ │ Manage │ │ Manage │    │  View    │ │Generate│ │ Verify │
    │  Stores   │ │Products│ │ Offers │    │Analytics │ │  QRs   │ │ GatePs │
    └───────────┘ └────────┘ └────────┘    └──────────┘ └────────┘ └────────┘
```

---

## Admin Dashboard

### Features

| Module | Description |
|--------|-------------|
| **Analytics** | Revenue, orders, user growth charts |
| **Store Management** | CRUD operations for stores |
| **Product Management** | Add/edit products, pricing, inventory |
| **Offer Management** | Create promotional offers, set validity |
| **QR Generator** | Generate store entry QR codes |
| **User Management** | View users, assign roles |
| **Transaction History** | View all orders, filter by store/date |
| **Guard Terminal** | Verify exit QR codes |

---

## PWA Features

### Capabilities

- **Installable** - Add to home screen on any device
- **Offline Support** - Cached assets for offline browsing
- **Push Notifications** - (Future: new offer alerts)
- **Fast Loading** - Service worker caching

### Manifest Configuration

```json
{
  "name": "Scan2Save",
  "short_name": "Scan2Save",
  "description": "AI-powered retail shopping experience",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL (Supabase account recommended)
- Firebase project with Phone Auth enabled

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/scan2save.git
cd scan2save/core

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

---

## Environment Variables

Create `.env` in `/core`:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="[PROJECT].firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="[PROJECT]"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="[PROJECT]"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@[PROJECT].iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Recommendation Engine
GROQ_API_KEY="gsk_..."

# Optional: Gemini AI
GOOGLE_AI_KEY="..."
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add all environment variables
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Deploy!

### Important Notes

- `prisma generate` runs automatically during build (configured in `package.json`)
- Ensure Supabase project is not paused (free tier auto-pauses)
- Firebase Phone Auth requires authorized domains setup

---

## Testing

### Test Credentials

| Role | Phone | OTP |
|------|-------|-----|
| **User** | `+91 9696969696` | `000000` |
| **Admin** | `+91 1111111111` | `111111` |

### Test Flow

1. **Login as User** → Browse stores → Add to cart → Checkout
2. **Login as Admin** → Generate QR → Manage products → View analytics

---

## Security Considerations

| Layer | Implementation |
|-------|----------------|
| **Authentication** | Firebase Phone Auth with verified tokens |
| **Authorization** | Role-based access (USER/ADMIN) |
| **Database** | Row Level Security (RLS) on Supabase |
| **API Protection** | Token verification on protected routes |
| **Data Validation** | Server-side input validation |
| **XSS Prevention** | React's built-in escaping |

---

## Future Roadmap

- [ ] Real-time push notifications for new offers
- [ ] Loyalty points and rewards system
- [ ] Social sharing of deals
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics with ML insights
- [ ] Native mobile apps (React Native)
- [ ] Barcode scanning for quick add-to-cart
- [ ] Voice-based product search
- [ ] AR product visualization
- [ ] Integration with major payment gateways

---

## License

⚠️ **Proprietary License - All Rights Reserved**

This project is **NOT open source**. See [LICENSE](LICENSE) for full terms.

---

## Author

Built with ❤️ by **Yashvanth S**

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" />
</p>
