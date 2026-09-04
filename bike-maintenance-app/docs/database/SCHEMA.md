# Database Schema Documentation - MotoTrack AI

**Database**: PostgreSQL 16 (Managed by Supabase)  
**Extensions**: `uuid-ossp`, `pgcrypto`  
**Security**: Row Level Security (RLS) enabled on all tables

---

## Entity Relationship Diagram

```
┌──────────────┐
│    users     │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼────────┐          ┌──────────────┐
│   vehicles    ├─────────►│  audit_logs  │
└──────┬────────┘ 1      N └──────────────┘
       │
       ├──────────┬──────────┬──────────┬─────────────┐
       │ 1        │ 1        │ 1        │ 1           │ 1
       │          │          │          │             │
       │ N        │ N        │ N        │ N           │ N
┌──────▼────┐ ┌──▼───────┐ ┌▼────────┐ ┌▼─────────┐ ┌▼────────┐
│fuel_logs  │ │service_  │ │parts    │ │reminders │ │documents│
│           │ │logs      │ │         │ │          │ │         │
└───────────┘ └──────────┘ └─────────┘ └──────────┘ └─────────┘

┌──────────────┐
│ai_diagnostics│ (Linked to users & vehicles)
└──────────────┘
```

---

## Tables Specification

### 1. `users` (User Profiles)

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    country_code VARCHAR(10) DEFAULT 'IN', -- ISO 3166-1 alpha-2
    currency VARCHAR(10) DEFAULT 'INR', -- ISO 4217
    distance_unit VARCHAR(10) DEFAULT 'km' CHECK (distance_unit IN ('km', 'miles')),
    volume_unit VARCHAR(10) DEFAULT 'liters' CHECK (volume_unit IN ('liters', 'gallons')),
    preferences JSONB DEFAULT '{
        "theme": "system",
        "notifications": {
            "reminders": true,
            "push": true,
            "email": false
        },
        "biometric_enabled": false
    }'::jsonb,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription ON public.users(subscription_tier, subscription_expires_at);
```

---

### 2. `vehicles` (User's Garage - Bikes/Scooters)

```sql
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. "My Royal Enfield Classic 350"
    make VARCHAR(100) NOT NULL, -- e.g. "Royal Enfield", "Honda", "Yamaha"
    model VARCHAR(100) NOT NULL, -- e.g. "Classic 350", "Activa 6G"
    year INTEGER CHECK (year >= 1900 AND year <= 2100),
    variant VARCHAR(100), -- e.g. "Chrome ABS", "Deluxe"
    vehicle_type VARCHAR(50) DEFAULT 'motorcycle' CHECK (vehicle_type IN ('motorcycle', 'scooter', 'moped')),
    fuel_type VARCHAR(50) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
    registration_number VARCHAR(50),
    vin_number VARCHAR(50), -- Vehicle Identification Number
    purchase_date DATE,
    purchase_price NUMERIC(12, 2),
    current_odometer NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Current reading in user's distance unit
    photo_url TEXT, -- Supabase Storage URL
    color VARCHAR(50),
    engine_capacity INTEGER, -- CC (cubic centimeters)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'retired', 'stolen')),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_make_model ON public.vehicles(make, model);
```

---

### 3. `fuel_logs` (Fuel Refill Records)

```sql
CREATE TABLE public.fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    odometer NUMERIC(10, 2) NOT NULL, -- Odometer reading at fill-up
    quantity NUMERIC(8, 2) NOT NULL CHECK (quantity > 0), -- Liters or gallons
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    price_per_unit NUMERIC(8, 2), -- Cost per liter/gallon (calculated)
    fuel_type VARCHAR(50) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'premium')),
    is_full_tank BOOLEAN DEFAULT true,
    station_name VARCHAR(255),
    location TEXT, -- Optional: lat,long or address
    notes TEXT,
    receipt_url TEXT, -- Supabase Storage URL
    mileage NUMERIC(8, 2), -- Calculated km/l or MPG (NULL for first entry)
    distance_since_last NUMERIC(10, 2), -- Distance traveled since last fill
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_fuel_logs_vehicle_id ON public.fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_date ON public.fuel_logs(date DESC);
CREATE INDEX idx_fuel_logs_vehicle_date ON public.fuel_logs(vehicle_id, date DESC);
```

---

### 4. `service_logs` (Maintenance & Service History)

```sql
CREATE TABLE public.service_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL, -- e.g. "Oil Change", "Chain Maintenance", "Tire Replacement"
    date DATE NOT NULL,
    odometer NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2) DEFAULT 0 CHECK (cost >= 0),
    service_center VARCHAR(255), -- Workshop/garage name
    mechanic_name VARCHAR(255),
    description TEXT,
    parts_replaced TEXT[], -- Array of part names
    next_service_due_km NUMERIC(10, 2), -- Predicted next service odometer
    next_service_due_date DATE, -- Predicted next service date
    receipt_url TEXT, -- Supabase Storage URL
    is_diy BOOLEAN DEFAULT false, -- Did user do it themselves?
    severity VARCHAR(20) DEFAULT 'routine' CHECK (severity IN ('routine', 'urgent', 'critical')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_service_logs_vehicle_id ON public.service_logs(vehicle_id);
CREATE INDEX idx_service_logs_date ON public.service_logs(date DESC);
CREATE INDEX idx_service_logs_type ON public.service_logs(service_type);
```

---

### 5. `parts` (Replacement Parts Inventory & Tracking)

```sql
CREATE TABLE public.parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_log_id UUID REFERENCES public.service_logs(id) ON DELETE SET NULL,
    part_name VARCHAR(255) NOT NULL, -- e.g. "Front Brake Pads", "Engine Oil Filter"
    part_category VARCHAR(100), -- e.g. "Brakes", "Engine", "Tires", "Electrical"
    brand VARCHAR(100),
    part_number VARCHAR(100),
    purchase_date DATE,
    installation_date DATE,
    installation_odometer NUMERIC(10, 2),
    cost NUMERIC(10, 2) DEFAULT 0,
    expected_lifespan_km NUMERIC(10, 2), -- Expected life in km/miles
    expected_lifespan_months INTEGER, -- Expected life in months
    warranty_expires_at DATE,
    supplier VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_parts_vehicle_id ON public.parts(vehicle_id);
CREATE INDEX idx_parts_category ON public.parts(part_category);
```

---

### 6. `reminders` (Maintenance & Service Reminders)

```sql
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('odometer', 'date', 'both')),
    trigger_odometer NUMERIC(10, 2), -- Trigger when odometer reaches this
    trigger_date DATE, -- Trigger on this date
    is_recurring BOOLEAN DEFAULT false,
    recurrence_km NUMERIC(10, 2), -- Repeat every X km
    recurrence_months INTEGER, -- Repeat every X months
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'snoozed', 'completed', 'dismissed')),
    last_triggered_at TIMESTAMPTZ,
    snoozed_until TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_reminders_user_vehicle ON public.reminders(user_id, vehicle_id);
CREATE INDEX idx_reminders_status ON public.reminders(status);
CREATE INDEX idx_reminders_triggers ON public.reminders(trigger_date, trigger_odometer) WHERE status = 'active';
```

---

### 7. `ai_diagnostics` (AI Pocket Mechanic Conversation History)

```sql
CREATE TABLE public.ai_diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    symptoms TEXT[], -- Extracted symptom keywords
    probable_causes TEXT[], -- AI-suggested root causes
    estimated_cost_min NUMERIC(10, 2),
    estimated_cost_max NUMERIC(10, 2),
    severity VARCHAR(20) CHECK (severity IN ('safe', 'caution', 'urgent', 'critical')),
    recommendation VARCHAR(20) CHECK (recommendation IN ('diy', 'professional', 'immediate')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_ai_diagnostics_user_session ON public.ai_diagnostics(user_id, session_id);
CREATE INDEX idx_ai_diagnostics_vehicle ON public.ai_diagnostics(vehicle_id);
CREATE INDEX idx_ai_diagnostics_created ON public.ai_diagnostics(created_at DESC);
```

---

### 8. `documents` (Stored Receipts, Insurance, Registration Papers)

```sql
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('receipt', 'insurance', 'registration', 'tax', 'warranty', 'other')),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage URL
    file_name VARCHAR(255),
    file_size INTEGER, -- Bytes
    mime_type VARCHAR(100),
    date DATE,
    expiry_date DATE, -- For insurance, registration, etc.
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_documents_user_vehicle ON public.documents(user_id, vehicle_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_expiry ON public.documents(expiry_date) WHERE expiry_date IS NOT NULL;
```

---

### 9. `audit_logs` (Immutable Activity Tracking)

```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indices
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
```

---

## Row Level Security (RLS) Policies

All tables have RLS enabled to enforce strict user data isolation.

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view and edit own profile"
    ON public.users FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can CRUD own vehicles"
    ON public.vehicles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Fuel logs policies
CREATE POLICY "Users can manage fuel logs for own vehicles"
    ON public.fuel_logs FOR ALL
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = fuel_logs.vehicle_id AND vehicles.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = fuel_logs.vehicle_id AND vehicles.user_id = auth.uid()));

-- Service logs policies
CREATE POLICY "Users can manage service logs for own vehicles"
    ON public.service_logs FOR ALL
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = service_logs.vehicle_id AND vehicles.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = service_logs.vehicle_id AND vehicles.user_id = auth.uid()));

-- Parts policies
CREATE POLICY "Users can manage parts for own vehicles"
    ON public.parts FOR ALL
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = parts.vehicle_id AND vehicles.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles WHERE vehicles.id = parts.vehicle_id AND vehicles.user_id = auth.uid()));

-- Reminders policies
CREATE POLICY "Users can manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- AI diagnostics policies
CREATE POLICY "Users can access own AI diagnostic history"
    ON public.ai_diagnostics FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can manage own documents"
    ON public.documents FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Audit logs policies (read-only for users, write via triggers)
CREATE POLICY "Users cannot directly access audit logs"
    ON public.audit_logs FOR SELECT
    USING (false);

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);
```

---

## Key Features & Constraints

### Automatic Mileage Calculation
- `fuel_logs.mileage` is calculated from the difference in odometer readings divided by fuel quantity
- First fuel entry has `NULL` mileage (no previous data)

### Automatic Odometer Updates
- When a fuel or service log is added, `vehicles.current_odometer` is updated automatically via trigger

### Subscription Tier Enforcement
- Free tier: 1 vehicle limit (enforced at application level)
- Premium tier: unlimited vehicles

### Data Validation
- All numeric fields validated for positive values where appropriate
- Date fields validated for realistic ranges
- Enum fields constrained to specific values

---

This schema supports all core features: garage management, fuel tracking, service history, AI diagnostics, reminders, and document storage while maintaining strict data isolation via RLS.
