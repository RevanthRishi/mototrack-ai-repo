# MotoTrack AI - Smart Bike Maintenance & AI Mechanic Platform

**Last Updated**: 2026-09-04  
**Project Status**: Initial Setup Phase  
**AI Management**: This project is designed to be built and maintained entirely by AI agents.

## Project Overview

**MotoTrack AI** is a universal cross-platform application for motorcycle and scooter owners to track maintenance, log fuel consumption, analyze mileage trends, and receive AI-powered diagnostic assistance from an intelligent "Pocket Mechanic."

### Key Features
1. **Multi-Vehicle Garage**: Track multiple bikes/scooters with make, model, year, and photos
2. **Fuel & Mileage Analytics**: Log fuel refills, calculate fuel economy (km/l or MPG), visualize trends
3. **Service & Maintenance History**: Track oil changes, chain maintenance, tire replacements, brake servicing
4. **Smart Reminders**: Odometer-based and time-based alerts (e.g., "Oil change due in 200km")
5. **Expense Tracking**: Categorized spending on fuel, parts, service, insurance
6. **AI Pocket Mechanic**: Natural language symptom diagnosis, repair cost estimates, DIY vs pro recommendations
7. **Document Storage**: Store service receipts, insurance papers, registration documents
8. **Resale Health Certificate**: AI-generated maintenance report to boost resale value

## Technology Stack

### Frontend
- **Framework**: Expo SDK 52+ (React Native)
- **Language**: TypeScript (strict mode enabled)
- **Routing**: Expo Router (file-based, universal)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State Management**: 
  - TanStack Query v5 (server state, caching)
  - Zustand (client-only UI state)
- **Calculations**: Decimal.js (precision arithmetic for fuel costs & mileage)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Victory Native (for fuel economy & expense graphs)

### Backend & Database
- **Platform**: Supabase (managed PostgreSQL)
- **Database**: PostgreSQL 16
- **Authentication**: Supabase Auth (JWT, OAuth, Biometric)
- **Storage**: Supabase Storage (encrypted document storage)
- **Serverless Functions**: Supabase Edge Functions (Deno/TypeScript)
- **Security**: Row Level Security (RLS) policies

### AI Integration
- **LLM**: Claude 3.5 Sonnet/Haiku (Anthropic API)
- **AI SDK**: Vercel AI SDK (streaming, tool-calling)
- **Use Cases**: 
  - Symptom-based diagnostics
  - Repair cost estimation
  - Predictive maintenance alerts
  - Natural language maintenance queries

### DevOps & Monitoring
- **Error Tracking**: Sentry
- **CI/CD**: GitHub Actions
- **Deployment**: 
  - Mobile: Expo EAS Build + Submit
  - Web: Vercel/Netlify
  - OTA Updates: Expo EAS Update

## Project Structure

```
bike-maintenance-app/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/                   # Main app (bottom tabs)
│   │   ├── _layout.tsx           # Tab navigation layout
│   │   ├── index.tsx             # Garage/Home (vehicle list)
│   │   ├── fuel.tsx              # Fuel logs & mileage analytics
│   │   ├── service.tsx           # Service history timeline
│   │   ├── ai-mechanic.tsx       # AI diagnostic chat
│   │   └── profile.tsx           # User profile & settings
│   ├── vehicle/                  # Vehicle-specific screens
│   │   ├── [id].tsx              # Vehicle details & health dashboard
│   │   ├── add.tsx               # Add new vehicle
│   │   └── edit/[id].tsx         # Edit vehicle details
│   ├── _layout.tsx               # Root layout (providers)
│   └── +not-found.tsx            # 404 page
│
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Chart.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── VehicleCard.tsx
│   │   ├── FuelLogItem.tsx
│   │   ├── ServiceTimeline.tsx
│   │   ├── MileageChart.tsx
│   │   └── ExpenseSummary.tsx
│   ├── ai/                       # AI-specific components
│   │   ├── DiagnosticChat.tsx
│   │   ├── SymptomSelector.tsx
│   │   └── RepairEstimate.tsx
│   └── layout/                   # Layout components
│       ├── Screen.tsx
│       └── Container.tsx
│
├── lib/                          # Business logic & utilities
│   ├── supabase/
│   │   ├── client.ts             # Supabase client configuration
│   │   ├── database.types.ts     # Auto-generated TypeScript types
│   │   └── queries.ts            # Database query functions
│   ├── calculations/
│   │   ├── mileage.ts            # Fuel economy calculations
│   │   ├── expenses.ts           # Cost tracking & analytics
│   │   └── service-intervals.ts  # Predictive maintenance timing
│   ├── hooks/
│   │   ├── useVehicles.ts        # Vehicle data hook
│   │   ├── useFuelLogs.ts        # Fuel logs hook
│   │   ├── useServiceLogs.ts     # Service history hook
│   │   └── useAIDiagnostic.ts    # AI mechanic interface
│   ├── utils/
│   │   ├── currency.ts           # Currency formatting
│   │   ├── date.ts               # Date utilities
│   │   ├── distance.ts           # Distance unit conversion (km/miles)
│   │   └── validation.ts         # Input validation helpers
│   ├── security/
│   │   ├── biometric.ts          # Biometric authentication
│   │   └── encryption.ts         # Client-side encryption utils
│   └── types/
│       ├── vehicle.ts            # Vehicle type definitions
│       ├── fuel.ts               # Fuel log types
│       └── service.ts            # Service log types
│
├── supabase/                     # Supabase configuration
│   ├── migrations/               # Database migrations (SQL)
│   │   └── 20260904000000_initial.sql
│   ├── functions/                # Edge Functions (serverless)
│   │   ├── ai-diagnostic/
│   │   │   └── index.ts
│   │   ├── calculate-mileage/
│   │   │   └── index.ts
│   │   └── service-reminder/
│   │       └── index.ts
│   └── config.toml               # Supabase configuration
│
├── docs/                         # Project documentation
│   ├── architecture/
│   │   └── ARCHITECTURE.md       # System architecture
│   ├── database/
│   │   └── SCHEMA.md             # Database schema documentation
│   ├── security/
│   │   └── SECURITY.md           # Security guidelines
│   └── api/
│       └── API_REFERENCE.md      # API documentation
│
├── .github/
│   └── workflows/
│       ├── ci.yml                # Continuous Integration
│       └── deploy.yml            # Deployment pipeline
│
├── assets/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── .cursorrules                  # AI coding rules
├── CLAUDE.md                     # This file - project context
├── .env.example                  # Environment variables template
├── .gitignore
├── README.md                     # User-facing documentation
└── SETUP.md                      # Setup instructions
```

## Architecture Principles

### 1. Universal App (Single Codebase)
- One codebase deploys to iOS, Android, and Web
- Expo Router handles navigation for all platforms
- Platform-specific code only when necessary (use `Platform.OS`)

### 2. Type Safety Everywhere
- Strict TypeScript mode enabled
- Database schema auto-generates TypeScript types
- Runtime validation with Zod for user inputs
- No `any` types allowed

### 3. Security-First Design
- **Row Level Security (RLS)**: Users can only access their own vehicles and logs
- **JWT Authentication**: Short-lived tokens with refresh rotation
- **Hardware-backed encryption**: Tokens stored in Expo SecureStore
- **Biometric auth**: Face ID, Touch ID, Fingerprint support
- **Audit logging**: Track important user actions

### 4. Precision Calculations
- All fuel cost and mileage calculations use `decimal.js`
- Prevents JavaScript floating-point errors
- Round currency to 2 decimals, mileage to 2 decimals

### 5. Offline-First
- TanStack Query caches all data locally
- App works offline, syncs when online
- Optimistic updates for better UX

### 6. AI-Native Architecture
- AI Pocket Mechanic for symptom diagnosis
- Natural language interface for maintenance queries
- Predictive maintenance based on usage patterns
- Automated customer support

## Core Features Breakdown

### Phase 1: Core Utility (MVP - Weeks 1-2)
- ✅ User authentication (email/password, OAuth)
- ✅ Add vehicles to garage (make, model, year, photo)
- ✅ Fuel log entry (date, odometer, liters, cost)
- ✅ Automatic mileage calculation (km/l or MPG)
- ✅ Service log entry (type, date, odometer, cost, notes)
- ✅ Basic expense tracking
- ✅ Reminder setup (odometer-based or time-based)

### Phase 2: Analytics & Insights (Weeks 3-4)
- ✅ Fuel economy trends (charts)
- ✅ Expense breakdown by category
- ✅ Service history timeline
- ✅ Predictive service reminders
- ✅ Export data (PDF/CSV)

### Phase 3: AI Pocket Mechanic (Weeks 5-6)
- 🤖 Natural language symptom input
- 🤖 AI diagnosis with probable causes
- 🤖 Repair cost estimation
- 🤖 DIY vs professional recommendation
- 🤖 Maintenance advice chatbot

### Phase 4: Advanced Features (Weeks 7-8)
- 📸 Receipt OCR (scan & auto-extract data)
- 📸 Visual inspection AI (tire tread, brake pads)
- 📄 Resale health certificate generator
- 🔔 Push notifications for reminders
- 🌐 Multi-language support
- 🌙 Dark mode

## Monetization Strategy

### Free Tier
- Track 1 vehicle
- Basic fuel & service logging
- Manual reminders
- Limited AI queries (5/month)

### Premium Subscription ($2.99/month or $24.99/year)
- Unlimited vehicles
- Unlimited AI Pocket Mechanic queries
- Advanced analytics & insights
- Predictive maintenance alerts
- Export reports (PDF/Excel)
- Document storage (unlimited)
- Priority customer support
- Resale health certificate generator

### Additional Revenue Streams
- **Insurance renewal reminders**: Affiliate commissions
- **Parts marketplace**: Commission on accessory sales
- **Service center partnerships**: Lead generation fees

## Development Workflow

### Initial Setup
```bash
cd bike-maintenance-app
npm install
cp .env.example .env.local
# Fill in Supabase credentials
npx supabase start
npm run types:supabase
npx expo start
```

### Database Changes
```bash
npx supabase migration new <migration_name>
npx supabase db push
npm run types:supabase
```

### Testing
```bash
npm test
npm run type-check
npm run lint
```

### Deployment
```bash
eas build --platform all
eas submit --platform all
eas update --branch production  # OTA updates
```

## Database Schema Overview

Core tables:
- `users`: User accounts and profiles
- `vehicles`: Motorcycles/scooters in user's garage
- `fuel_logs`: Fuel refill records with odometer readings
- `service_logs`: Maintenance and service history
- `parts`: Replacement parts tracking
- `reminders`: Scheduled maintenance alerts
- `ai_diagnostics`: AI mechanic conversation history
- `documents`: Stored receipts, insurance papers, registration
- `audit_logs`: Activity tracking

All tables have RLS policies ensuring users only access their own data.

See `docs/database/SCHEMA.md` for complete schema documentation.

## Target Audience

### Primary Users
- Daily commuters (mileage tracking for tax/reimbursement)
- Motorcycle enthusiasts (detailed maintenance logs)
- First-time bike owners (AI guidance & maintenance education)
- Bike flippers/resellers (maintenance history for higher resale value)

### Geographic Focus
- **Phase 1**: India (200M+ two-wheeler owners)
- **Phase 2**: Southeast Asia, Europe, Latin America
- **Phase 3**: Global expansion

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Weekly fuel logs per user
- Service logs per month
- AI mechanic queries per user

### Revenue Metrics
- Free to premium conversion rate (target: 5-10%)
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
- Churn rate (target: <5% monthly)

### Growth Metrics
- New user signups
- Viral coefficient (referrals per user)
- App Store ratings & reviews
- Social media mentions

## Next Steps

1. ✅ Create folder structure
2. ✅ Write AI coding rules (.cursorrules)
3. ⏳ Write project documentation (CLAUDE.md)
4. ⏳ Create database schema documentation
5. ⏳ Create architecture documentation
6. ⏳ Create configuration templates
7. Initialize Expo project
8. Set up Supabase project
9. Implement authentication
10. Build core features (garage, fuel logs, service logs)
11. Integrate AI Pocket Mechanic
12. Deploy MVP to App Stores

---

**Remember**: This project is AI-first. All code, documentation, and maintenance should be AI-manageable with minimal human intervention.
