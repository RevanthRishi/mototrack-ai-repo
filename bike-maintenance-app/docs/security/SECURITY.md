# Security Guidelines - MotoTrack AI

**Threat Model**: Consumer Vehicle Data & Cloud Document Storage  
**Compliance Target**: GDPR, SOC 2 Type II readiness  
**Last Updated**: 2026-09-04

---

## Security Principles

### 1. Row Level Security (RLS)
- Strict database-level isolation on every table (`vehicles`, `fuel_logs`, `service_logs`, `documents`, `ai_diagnostics`).
- Users can never read, modify, or delete another user's vehicles or records.

### 2. Authentication & Token Management
- Supabase Auth with JWT and refresh token rotation.
- Tokens persisted strictly using `expo-secure-store` (iOS Secure Enclave / Android Keystore).
- Never store auth tokens in `AsyncStorage`.

### 3. Data Protection & File Storage
- User-uploaded receipts, bike photos, and insurance papers are stored in private Supabase Storage buckets.
- Files are accessed strictly via short-lived signed URLs generated on-demand.

### 4. AI Interaction Security
- User personal information (email, phone, home location, license plate) is stripped before dispatching diagnostic queries to the Claude API.
- Prompt injection defenses sanitize user-provided symptom text.
- API keys reside solely in Supabase Edge Functions environment variables, never on the mobile client.
