# Setup Instructions - MotoTrack AI

## Prerequisites

Before starting, install:

1. **Node.js 18+** - https://nodejs.org/
2. **npm** (comes with Node.js)
3. **Git** - https://git-scm.com/
4. **Docker** (for local Supabase) - https://www.docker.com/
5. **Expo CLI** - Installed with project dependencies

### Optional
- **Xcode** (macOS) - For iOS development
- **Android Studio** - For Android development
- **Expo Go app** - For quick testing on physical devices

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd bike-maintenance-app
npm install
```

### 2. Set Up Supabase

#### Option A: Local Development (Recommended)
```bash
# Initialize Supabase
npx supabase init

# Start local Supabase (Docker required)
npx supabase start

# Note the output:
# API URL: http://localhost:54321
# Anon key: eyJhb...
# Service role key: eyJhb...
```

#### Option B: Supabase Cloud
1. Go to https://supabase.com
2. Create new project
3. Copy project URL and anon key

### 3. Configure Environment

```bash
# Copy template
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

Fill in:
```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Database Schema

```bash
# Apply migrations
npx supabase db push

# Generate TypeScript types
npm run types:supabase
```

### 5. Start Development Server

```bash
npx expo start
```

Options:
- Press `i` - iOS Simulator
- Press `a` - Android Emulator
- Press `w` - Web browser
- Scan QR code - Expo Go app

---

## Verify Setup

1. Open Supabase Studio: http://localhost:54323
2. Check tables exist: `users`, `vehicles`, `fuel_logs`, `service_logs`
3. Verify RLS is enabled on all tables

---

## Troubleshooting

### Expo won't start
```bash
npx expo start -c
```

### Types not generating
```bash
npx supabase status
npx supabase gen types typescript --local > lib/supabase/database.types.ts
```

### Can't connect to Supabase
- Check Docker is running
- Verify `.env.local` credentials
- Run `npx supabase status`

---

## Quick Commands

```bash
# Development
npx expo start              # Start dev server
npx expo start -c           # Clear cache

# Database
npx supabase start          # Start local
npx supabase stop           # Stop local
npx supabase db push        # Apply migrations
npm run types:supabase      # Generate types

# Testing
npm test                    # Run tests
npm run type-check          # TypeScript check
npm run lint                # Lint code
```

---

See [README.md](README.md) for complete documentation.
