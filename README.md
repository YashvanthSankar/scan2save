# Scan2Save

**Retail, Reimagined for the AI Era.**

> Walk into any store, scan the QR, and unlock personalized offers designed just for you.

Scan2Save transforms physical retail with adaptive intelligence. Our ML-powered recommendation engine learns shopper preferences in real-time, surfacing offers that actually matter while they browse. Checkout happens in seconds, not minutes.

**This is shopping, evolved.**

---

## Core Value Proposition

| For Shoppers | For Retailers |
|--------------|---------------|
| Hyper-personalized offers based on purchase history | Increased conversion through targeted discounts |
| Scan & Go checkout experience | Real-time inventory-aware promotions |
| No app download required (PWA) | Zero hardware integration costs |

---

## Demo

### Video Walkthrough

▶️ **[Watch the Full Demo](./scan2save%20-%20demo.mp4)**

> A complete walkthrough of the Scan2Save experience — from scanning the store QR to checkout.

---

### App Screenshots

<details open>
<summary><strong>Click to view the complete user journey</strong></summary>

<br/>

| Step | Screenshot | Description |
|:----:|:----------:|:------------|
| **1** | <img src="./screenshots/1_ss.jpeg" width="280"/> | **Landing Page**|
| **2** | <img src="./screenshots/2_ss.jpeg" width="280"/> | **Install Pop up** |
| **3** | <img src="./screenshots/3_ss.jpeg" width="280"/> | **Install Button** |
| **4** | <img src="./screenshots/4_ss.jpeg" width="280"/> | **User Dashboard** |
| **5** | <img src="./screenshots/5_ss.jpeg" width="280"/> | **Store Page** |
| **6** | <img src="./screenshots/6_ss.jpeg" width="280"/> | **Shopping Route** |
| **7** | <img src="./screenshots/7_ss.jpeg" width="280"/> | **Checkout Page** |
| **8** | <img src="./screenshots/8_ss.jpeg" width="280"/> | **Payment Simulation** |
| **9** | <img src="./screenshots/9_ss.jpeg" width="280"/> | **Payment Success** |
| **10** | <img src="./screenshots/10_ss.jpeg" width="280"/> | **Order History** |

</details>

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Next.js 16 (App Router) + React 19 + TailwindCSS 4         │
│  /core                                                      │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                           │
│  Next.js API Routes (Edge-ready)                            │
│  /core/app/api/*                                            │
└─────────────────────────────────┬───────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────┐
          ▼                       ▼                           ▼
┌─────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   Firebase      │   │   Supabase          │   │   AI Engine         │
│   (Auth)        │   │   (PostgreSQL)      │   │   (Groq/Gemini)     │
│                 │   │   via Prisma ORM    │   │                     │
└─────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## Project Structure

```
scan2save/
├── core/                    # Main Next.js Application
│   ├── app/                 # App Router pages & API routes
│   │   ├── api/             # Backend API endpoints
│   │   ├── admin/           # Admin dashboard (protected)
│   │   ├── dashboard/       # User dashboard
│   │   ├── store/[storeId]/ # Dynamic store pages
│   │   ├── scan/            # QR scanning page
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   └── ...
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities, contexts, clients
│   │   ├── prisma.ts        # Prisma client
│   │   ├── firebase.ts      # Firebase Admin SDK
│   │   └── CartContext.tsx  # Cart state management
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   └── services/            # AI Recommendation Engine
│       └── recommendation-engine/
└── README.md                # This file
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Firebase project (for OTP authentication)

### Demo Credentials

For testing the application:

| Field | Value |
|-------|-------|
| **Phone** | `+91 9696969696` |
| **OTP** | `000000` |

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/scan2save.git
cd scan2save/core

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in `/core` with:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Firebase (for OTP Auth)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Recommendation Engine (optional)
GROQ_API_KEY="..."
```

---

## Key Features

### 1. QR-Based Store Entry
Shoppers scan a store's unique QR code to "enter" the digital store experience.

### 2. AI-Personalized Offers
Real-time recommendation engine analyzes:
- Purchase history
- Browsing behavior
- Category affinities
- Time-based patterns

### 3. Seamless Scan & Go
- Add products to cart by scanning barcodes
- Checkout via UPI/digital payments
- Generate exit pass QR for store verification

### 4. Admin Dashboard
- Store management
- User analytics
- Offer creation
- Transaction verification

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4 |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Firebase Phone Authentication |
| **AI** | Groq LLM / Google Gemini |
| **Styling** | TailwindCSS + Custom Design System |
| **Icons** | Lucide React |
| **Theming** | next-themes (Dark/Light mode) |

---

## User Flow

```
┌────────────┐     ┌─────────────┐     ┌──────────────┐
│  Landing   │────▶│    Login    │────▶│  Dashboard   │
│   Page     │     │  (OTP Auth) │     │              │
└────────────┘     └─────────────┘     └──────┬───────┘
                                              │
                                              ▼
┌────────────┐     ┌─────────────┐     ┌──────────────┐
│  Checkout  │◀────│    Cart     │◀────│  Store Page  │
│            │     │             │     │ (via QR Scan)│
└────────────┘     └─────────────┘     └──────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Orders    │
                   │   History   │
                   └─────────────┘
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy!

**Important:** Ensure `prisma generate` runs during build (already configured in `package.json`).

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Author

Built with ❤️ by **Yashvanth S**

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
</p>
