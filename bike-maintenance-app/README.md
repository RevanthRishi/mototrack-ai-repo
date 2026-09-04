# MotoTrack AI - Smart Bike Maintenance Platform

A universal cross-platform application for motorcycle and scooter owners to track maintenance, analyze fuel economy, and get AI-powered diagnostic assistance.

## 🎯 Project Status

**Phase**: Foundation Setup Complete  
**Version**: 0.1.0 (Pre-development)  
**Last Updated**: September 4, 2026

## 🚀 Features

### Core Features
- 🏍️ Multi-vehicle garage (unlimited bikes/scooters for premium users)
- ⛽ Fuel logging with automatic mileage calculation (km/l or MPG)
- 🔧 Service & maintenance history tracking
- 📊 Expense analytics by category
- ⏰ Smart reminders (odometer-based & date-based)
- 📄 Document storage (receipts, insurance, registration)
- 📈 Fuel economy trends & charts

### AI-Powered Features (Phase 2)
- 🤖 AI Pocket Mechanic (symptom diagnosis)
- 🤖 Repair cost estimation
- 🤖 Predictive maintenance alerts
- 🤖 DIY vs professional recommendations
- 🤖 Resale health certificate generator

### Premium Features
- Unlimited vehicles
- Unlimited AI diagnostic queries
- Advanced analytics & insights
- Export reports (PDF/Excel)
- Priority support

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Expo SDK 52+, React Native, TypeScript |
| **Routing** | Expo Router (file-based, universal) |
| **Styling** | NativeWind v4 (Tailwind CSS) |
| **State** | TanStack Query v5, Zustand |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **AI** | Claude 3.5 Sonnet/Haiku, Vercel AI SDK |
| **Calculations** | Decimal.js (precision math) |
| **Monitoring** | Sentry |
| **CI/CD** | GitHub Actions, Expo EAS |

## 📁 Project Structure

```
bike-maintenance-app/
├── app/                 # Expo Router screens
│   ├── (auth)/         # Login, register
│   ├── (tabs)/         # Garage, fuel, service, AI, profile
│   └── vehicle/        # Vehicle details & management
├── components/         # Reusable UI components
│   ├── ui/            # Base components
│   ├── features/      # Domain components
│   ├── ai/            # AI-specific UI
│   └── layout/        # Layout wrappers
├── lib/               # Business logic
│   ├── supabase/      # Database client
│   ├── calculations/  # Mileage & cost math
│   ├── hooks/         # React hooks
│   └── utils/         # Helpers
├── supabase/          # Backend
│   ├── migrations/    # Database migrations
│   └── functions/     # Edge functions
└── docs/              # Documentation
```

## 🗄️ Database

PostgreSQL 16 with Row Level Security:
- `users` - User profiles
- `vehicles` - Garage (bikes/scooters)
- `fuel_logs` - Fuel refill records
- `service_logs` - Maintenance history
- `parts` - Replacement parts tracking
- `reminders` - Maintenance alerts
- `ai_diagnostics` - AI chat history
- `documents` - Stored receipts & papers

## 🔒 Security

- Row Level Security (RLS) on all tables
- Hardware-backed token storage (Secure Enclave/Keystore)
- Biometric authentication support
- Encrypted file storage
- JWT with refresh token rotation
- Audit logging

## 💰 Monetization

### Free Tier
- 1 vehicle
- Basic logging & reminders
- 5 AI queries/month

### Premium ($2.99/month or $24.99/year)
- Unlimited vehicles
- Unlimited AI Pocket Mechanic
- Advanced analytics
- Export reports
- Document storage
- Resale health certificate

## 🎯 Target Audience

- Daily commuters (mileage tracking)
- Motorcycle enthusiasts (detailed logs)
- First-time bike owners (AI guidance)
- Bike resellers (maintenance history)

## 🌍 Market

- **Phase 1**: India (200M+ two-wheeler owners)
- **Phase 2**: Southeast Asia, Europe, Latin America
- **Phase 3**: Global

## 📚 Documentation

- [Architecture](docs/architecture/ARCHITECTURE.md)
- [Database Schema](docs/database/SCHEMA.md)
- [Security Guidelines](docs/security/SECURITY.md)
- [AI Coding Rules](.cursorrules)
- [Project Context](CLAUDE.md)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- Docker (for local Supabase)

### Installation
```bash
cd bike-maintenance-app
npm install
cp .env.example .env.local
# Add your Supabase credentials
npx supabase start
npm run types:supabase
npx expo start
```

See [SETUP.md](SETUP.md) for detailed instructions.

## 📋 Next Steps

1. ✅ Foundation & documentation complete
2. ⏳ Initialize Expo project
3. ⏳ Create database migrations
4. ⏳ Build authentication
5. ⏳ Implement core features
6. ⏳ Integrate AI Pocket Mechanic
7. ⏳ Launch MVP

---

**Built with AI. Designed for riders.**
