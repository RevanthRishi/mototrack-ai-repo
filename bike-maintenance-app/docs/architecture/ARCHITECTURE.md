# System Architecture - MotoTrack AI

## Overview

MotoTrack AI is a **universal cross-platform application** designed for mobile (iOS, Android) and Web from a single codebase, backed by a managed serverless architecture and an autonomous AI agent layer.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CROSS-PLATFORM CLIENT                              │
│                    (Expo SDK 52+ / React Native)                            │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │     Expo Router       │  │     NativeWind v4    │  │  TanStack Query  │  │
│  │ (Universal Navigation)│  │   (Tailwind Styles)  │  │  (Cache & Sync)  │  │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │      Zustand          │  │     Decimal.js       │  │ Expo SecureStore │  │
│  │   (UI Client State)   │  │(Mileage & Cost Math) │  │ (Hardware Keystore│ │
│  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    HTTPS / TLS 1.3 + WebSockets (Realtime)
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                           SUPABASE BACKEND                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Auth & Identity: JWT, OAuth (Google/Apple), Biometric Pass            │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Database Layer: PostgreSQL 16 + Row Level Security (RLS)              │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Storage Layer: Encrypted object store for receipts & bike photos      │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ Edge Functions: TypeScript/Deno serverless logic & AI Diagnostic Proxy│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     AI POCKET MECHANIC        │             │   AUTONOMOUS SENTRY DEVOPS    │
│  • Claude 3.5 Sonnet / Haiku  │             │  • Crash & Error Telemetry    │
│  • Vercel AI SDK Tool-Calling │             │  • GitHub Actions Claude Agent│
│  • Symptom & Cost Diagnostics │             │  • Auto-PR Creation & EAS OTA │
└───────────────────────────────┘             └───────────────────────────────┘
```

---

## Key Modules

### 1. Garage & Vehicle Module
- Multi-vehicle management (Bikes, Scooters, Mopeds)
- Make, model, year, variant, registration, engine capacity, color
- Odometer tracking & photo storage
- Resale health score indicator

### 2. Fuel & Mileage Intelligence Engine
- Fuel refill logging (liters, cost, station, full-tank indicator)
- Automatic delta calculation between odometer entries
- Mileage metrics: km/l, Miles Per Gallon (MPG), cost per km/mile
- Long-term trend analysis (detecting sudden drops in fuel economy)

### 3. Service & Maintenance Timeline
- Categorized logs: Engine Oil, Chain & Sprocket, Brake Pads, Tyres, Battery, Spark Plug, Air Filter
- Service interval calculator (Predicts due date & mileage based on user's daily commute average)
- Parts inventory and warranty tracking

### 4. AI Pocket Mechanic Engine
- Natural language symptom input (e.g. *"bike vibrates violently when braking above 50 km/h"*)
- Multi-stage diagnostic logic:
  1. Identifies likely mechanical failure (e.g., warped front brake rotor or loose caliper bolts)
  2. Estimates severity & urgency (Immediate attention vs next routine service)
  3. Predicts repair cost range in user's currency to protect from mechanic overcharges
  4. Classifies as DIY fixable vs Professional Mechanic required

### 5. Smart Notifications & Reminders
- Hybrid trigger: Triggers on whichever happens first—Elapsed Days or Odometer Milestone
- Local push notifications via Expo Notifications
- Insurance renewal and road tax expiry alerts

---

## Data Flow Architecture

```
User Action (e.g. Log Refill)
      │
      ▼
Client Validation (Zod Schema)
      │
      ▼
TanStack Query Optimistic Update (Immediate UI response)
      │
      ▼
Supabase Client (Encrypted TLS 1.3 payload)
      │
      ▼
PostgreSQL Engine (RLS check against auth.uid())
      │
      ├──> Auto-compute mileage trigger
      └──> Update vehicles.current_odometer
```
