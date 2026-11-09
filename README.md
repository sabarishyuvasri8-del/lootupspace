# Lootupspace - Pickup-Based Personal Storage Platform for Indian Metro Cities

> **"Your space, back. Your stuff, safe."**  
> An on-demand personal storage web platform & PWA engineered for space-constrained residents in Indian metro cities (Bengaluru, Mumbai, Chennai first).
>
> Live Demo: https://lootupspace.vercel.app

---

## 1. Product Overview

In high-rent Indian metros, square footage in apartments is prohibitively expensive. Residents struggle with seasonal clothes, heavy quilts, books, sports gear, appliances, furniture, and archives that crowd living spaces.

**Lootupspace** solves this with an **Amazon-style doorstep storage experience**:
1. **Photo your products**: Customer snaps 2–8 photos and inputs dimensions or chooses standard box tiers.
2. **Instant live pricing**: The engine calculates monthly storage cost, pickup fee, insurance, and 18% GST in real time.
3. **Doorstep collection**: Uniformed pickup teams arrive in scheduled 2-hour slots with 5-ply cartons and bubble wrap, verified via a secure 4-digit handover OTP.
4. **Vault intake & QR shelving**: Stored in humidity-regulated, 24x7 CCTV-monitored hubs with unique waterproof barcodes and exact rack locations (`Zone-Aisle-Rack-Bin`).
5. **Digital inventory & 1-click return**: Customers view their digital vault anytime and request doorstep return delivery of any single item or batch.

---

## 2. User Roles & Demo Credentials

The platform features role-based access control (RBAC) across 4 dedicated interfaces. A **Role Switcher Banner** is pinned to the top of the app for instant 1-click role toggling during demonstrations.

| Role | Demo User | Phone | Demo OTP | Dashboard Route |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Aarav Sharma | `+919876543210` | `123456` | `/customer` |
| **Pickup Agent (Driver)** | Ramesh Kumar | `+919876543211` | `123456` | `/driver` (PWA) |
| **Warehouse Staff** | Priya Sundaram | `+919876543212` | `123456` | `/warehouse` |
| **Admin (Ops & Finance)** | Siddharth Iyer | `+919876543213` | `123456` | `/admin` |

---

## 3. Architecture & Monorepo Structure

```
lootupspace/
├── apps/
│   ├── api/                     # Node.js + Express + TypeScript RESTful Core API
│   │   ├── src/
│   │   │   ├── controllers/     # Auth, Items, Pickups, Returns, Warehouse, Driver, Payments, Pricing, Admin
│   │   │   ├── services/        # Business logic, Pricing engine, Notifications, QR, Queues
│   │   │   ├── middleware/      # JWT AuthGuard, RBAC role guard, structured request logger
│   │   │   ├── docs/            # OpenAPI 3.0 / Swagger JSON specifications
│   │   │   ├── config/          # Environment configuration
│   │   │   ├── app.ts           # Express app router
│   │   │   └── server.ts        # Server entry point
│   │   └── tests/               # Automated unit & integration tests
│   └── web/                     # Vite + React 18 + React Router + Tailwind CSS + PWA
│       ├── public/              # manifest.json, sw.js, offline fallback
│       ├── index.html           # Vite HTML entry point
│       ├── vite.config.ts       # Vite bundler configuration
│       └── src/
│           ├── App.tsx          # Master client router (Public, Customer, Driver, Warehouse, Admin)
│           ├── main.tsx         # React 18 bootstrap
│           ├── app/             # Marketing pages, Customer portal, Driver PWA, Warehouse, Admin
│           ├── components/      # UI components, Calculators, QR scanners, Invoices
│           └── lib/             # API client, Auth Context, Navigation helpers, Cart state
├── packages/
│   ├── shared/                  # Enums, types, Zod schemas, constants, pure Pricing Engine
│   └── database/                # Prisma schema (PostgreSQL), migrations, seeds, mock adapter
├── infra/
│   ├── Dockerfile.api           # Production Docker container for API
│   ├── Dockerfile.web           # Production Docker container for Web
│   ├── docker-compose.yml       # Full stack: PostgreSQL, Redis, API, Web
│   ├── .env.example             # Environment variables template
│   └── postman_collection.json  # Comprehensive Postman test collection
└── .github/workflows/ci.yml     # Automated CI/CD pipeline
```

---

## 4. Quickstart Guide

### Prerequisites
- Node.js `v20+` or `v25+`
- npm `v10+`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sabarishyuvasri8-del/lootupspace.git
cd lootupspace
npm install
```

### 2. Build Monorepo Packages
```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/database
```

### 3. Run Automated Tests
```bash
# Pure Pricing Engine unit tests (7 passing tests)
node --test packages/shared/dist/pricing-engine.test.js

# Backend Auth & End-to-End Booking Integration tests
npx ts-node apps/api/tests/auth.test.ts
npx ts-node apps/api/tests/booking.test.ts
```

### 4. Start the Application
You can run both apps together from the root or separately per workspace:

```bash
# Start both Core API (port 4000) & Vite Web (port 3000) together:
npm run dev

# Or run separately in two terminals:
# Terminal 1: Core API Server (Runs on port 4000)
npm run dev:api
# Swagger Docs available at: http://localhost:4000/docs

# Terminal 2: Vite React Frontend Web & PWA (Runs on port 3000)
npm run dev:web
# Frontend UI available at: http://localhost:3000
```

*Note: The platform features a dual-mode database layer. It works out-of-the-box with an in-memory/persistent store for zero-friction local development, and seamlessly connects to managed PostgreSQL with Prisma when `DATABASE_URL` is set.*

---

## 5. Running with Docker Compose

To run PostgreSQL, Redis, Core API, and Vite Web together:

```bash
cd infra
docker-compose up --build
```

- **Frontend Web & PWA**: `http://localhost:3000`
- **Backend Core API**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/docs`
- **PostgreSQL Database**: `localhost:5432` (`lootupspace`)
- **Redis Cache/Queue**: `localhost:6379`

---

## 6. Pricing Engine Specification

| Size Tier | Volume Capacity | Dimensions Guide | Monthly Rate (INR) |
| :--- | :--- | :--- | :--- |
| **Small Box** | Up to 2.0 cu ft | `1.5 ft × 1.2 ft × 1.1 ft` | ₹199 / month |
| **Medium Box** | Up to 5.0 cu ft | `2.0 ft × 1.5 ft × 1.6 ft` | ₹399 / month |
| **Large Box** | Up to 10.0 cu ft | `2.5 ft × 2.0 ft × 2.0 ft` | ₹699 / month |
| **Extra Large / Furniture** | Up to 25.0 cu ft | Mattresses, Desks, Cycles | ₹1,499 / month |
| **Custom Bulk Storage** | Custom cu ft | Dynamic volumetric rating | ₹75 / cu ft / month |

### Additional Rules & Fees
- **Commitment Discounts**: 3 Months (0%), 6 Months (5% off), 12 Months (10% off).
- **Doorstep Pickup Fee**: Base ₹149 (covers first 5 km & 5 boxes) + ₹15/km beyond 5 km + ₹35 per extra box beyond 5.
- **Return Delivery Fee**: Same transparent logic as pickup.
- **Complimentary Insurance**: Free coverage up to ₹10,000 for every booking; optional tiers up to ₹1,00,000.
- **Goods & Services Tax (GST)**: Standard 18% GST (SAC Code 996729 - Warehousing & Storage Services) itemized on every invoice with CGST/SGST breakdown.
- **Early Exit Fee**: 1 month's storage charge if exiting prior to commitment completion.

---

## 7. End-to-End User Journey Walkthrough

1. **Public Marketing & Calculator**: Visit `http://localhost:3000/pricing` to simulate box sizes, custom dimensions (cm/inch/ft), and addons.
2. **Customer Sign-in**: Visit `http://localhost:3000/auth/login` (or tap Customer in top banner).
3. **Add Items**: Go to `http://localhost:3000/customer/items/new`. Upload 2–8 photos, verify dimensions, check the prohibited goods declaration, and add to cart.
4. **Schedule Pickup**: Go to `http://localhost:3000/customer/pickup/new`. Choose delivery slot, commitment duration, and pay via simulated Razorpay. Note down the 4-digit handover OTP.
5. **Live Dispatch**: Visit `http://localhost:3000/customer/tracking/[id]` to view the real-time ETA and driver details.
6. **Driver Verification**: Switch to Driver view at `http://localhost:3000/driver`. Tap **Verify & Collect**, tick off the checklist, take cargo photos, and enter the customer's 4-digit OTP.
7. **Warehouse Intake**: Switch to Warehouse view at `http://localhost:3000/warehouse`. Open the QR barcode scanner, inspect condition, review the AI-suggested bin (`A-03-R2-B5`), and lock the item as `STORED`.
8. **Digital Inventory**: Back in Customer view (`http://localhost:3000/customer/inventory`), view the item tagged with its unique QR code and assigned shelf location.
9. **Return Delivery**: Tap **Request Return** (`http://localhost:3000/customer/returns/new`). Select items, pick a delivery window, and receive your delivery OTP.
10. **Admin Telemetry**: Visit `http://localhost:3000/admin` to observe real-time MRR, warehouse capacity utilization, driver fleet dispatches, and GST invoice exports.

---

## 8. Security & Legal Compliance

- **DPDP Act (2023) Compliance**: Grounded in India's Digital Personal Data Protection Act with clear consent capture, encrypted KYC document storage, and account deletion protocols.
- **Indian Contract Act (1872)**: Governed under Chapter IX Bailment provisions. Includes specific possessory lien clauses (Section 170) and a statutory 90-day default notice protocol prior to item auction.
- **Prohibited Goods Policy**: Strict rejection of perishable foodstuffs, raw unsealed liquids, flammable/hazardous goods, firearms, live animals/plants, and loose cash above ₹50,000.

---

## 9. Assumptions & Future Roadmap

### Assumptions Made
1. **Initial Metro Coverage**: Bengaluru (Indiranagar, Whitefield, Koramangala), Mumbai (BKC, Andheri, Powai), and Chennai (OMR, Anna Nagar). Other pincodes are handled via priority waitlist capture.
2. **Standard Vehicle Fleet**: Default vehicle assigned is Tata Ace mini-trucks (`KA-01-EJ-4912`) suitable for metro narrow street navigation.
3. **Third-Party Keys**: Production keys for Razorpay, Twilio/MSG91, WhatsApp Business API, and AWS S3 are injected via `.env`; development mode defaults to high-fidelity local sandboxes.

### Next Steps (Phase 2 & AI Enhancements)
- **Computer Vision Model**: Auto-detecting item category, volumetric cubic feet, and fragility directly from smartphone photos.
- **Smart Bin 3D Tetris Packing**: Optimizing warehouse rack utilization with automated 3D bin-packing algorithms.
- **Marketplace Integration**: Allowing customers to donate or resell long-stored items with 1 click directly from their digital inventory.

