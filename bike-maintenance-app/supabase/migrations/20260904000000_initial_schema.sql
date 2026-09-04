-- MotoTrack AI - Initial Database Schema
-- Migration: 20260904000000_initial_schema.sql
-- Created: 2026-09-04

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    country_code VARCHAR(10) DEFAULT 'IN',
    currency VARCHAR(10) DEFAULT 'INR',
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

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription ON public.users(subscription_tier, subscription_expires_at);

-- ============================================================================
-- VEHICLES TABLE
-- ============================================================================
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER CHECK (year >= 1900 AND year <= 2100),
    variant VARCHAR(100),
    vehicle_type VARCHAR(50) DEFAULT 'motorcycle' CHECK (vehicle_type IN ('motorcycle', 'scooter', 'moped')),
    fuel_type VARCHAR(50) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
    registration_number VARCHAR(50),
    vin_number VARCHAR(50),
    purchase_date DATE,
    purchase_price NUMERIC(12, 2),
    current_odometer NUMERIC(10, 2) NOT NULL DEFAULT 0,
    photo_url TEXT,
    color VARCHAR(50),
    engine_capacity INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'retired', 'stolen')),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_make_model ON public.vehicles(make, model);

-- ============================================================================
-- FUEL_LOGS TABLE
-- ============================================================================
CREATE TABLE public.fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    odometer NUMERIC(10, 2) NOT NULL,
    quantity NUMERIC(8, 2) NOT NULL CHECK (quantity > 0),
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    price_per_unit NUMERIC(8, 2),
    fuel_type VARCHAR(50) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'premium')),
    is_full_tank BOOLEAN DEFAULT true,
    station_name VARCHAR(255),
    location TEXT,
    notes TEXT,
    receipt_url TEXT,
    mileage NUMERIC(8, 2),
    distance_since_last NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_fuel_logs_vehicle_id ON public.fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_date ON public.fuel_logs(date DESC);
CREATE INDEX idx_fuel_logs_vehicle_date ON public.fuel_logs(vehicle_id, date DESC);

-- ============================================================================
-- SERVICE_LOGS TABLE
-- ============================================================================
CREATE TABLE public.service_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    odometer NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2) DEFAULT 0 CHECK (cost >= 0),
    service_center VARCHAR(255),
    mechanic_name VARCHAR(255),
    description TEXT,
    parts_replaced TEXT[],
    next_service_due_km NUMERIC(10, 2),
    next_service_due_date DATE,
    receipt_url TEXT,
    is_diy BOOLEAN DEFAULT false,
    severity VARCHAR(20) DEFAULT 'routine' CHECK (severity IN ('routine', 'urgent', 'critical')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_service_logs_vehicle_id ON public.service_logs(vehicle_id);
CREATE INDEX idx_service_logs_date ON public.service_logs(date DESC);
CREATE INDEX idx_service_logs_type ON public.service_logs(service_type);

-- ============================================================================
-- PARTS TABLE
-- ============================================================================
CREATE TABLE public.parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_log_id UUID REFERENCES public.service_logs(id) ON DELETE SET NULL,
    part_name VARCHAR(255) NOT NULL,
    part_category VARCHAR(100),
    brand VARCHAR(100),
    part_number VARCHAR(100),
    purchase_date DATE,
    installation_date DATE,
    installation_odometer NUMERIC(10, 2),
    cost NUMERIC(10, 2) DEFAULT 0,
    expected_lifespan_km NUMERIC(10, 2),
    expected_lifespan_months INTEGER,
    warranty_expires_at DATE,
    supplier VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_parts_vehicle_id ON public.parts(vehicle_id);
CREATE INDEX idx_parts_category ON public.parts(part_category);

-- ============================================================================
-- REMINDERS TABLE
-- ============================================================================
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('odometer', 'date', 'both')),
    trigger_odometer NUMERIC(10, 2),
    trigger_date DATE,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_km NUMERIC(10, 2),
    recurrence_months INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'snoozed', 'completed', 'dismissed')),
    last_triggered_at TIMESTAMPTZ,
    snoozed_until TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_reminders_user_vehicle ON public.reminders(user_id, vehicle_id);
CREATE INDEX idx_reminders_status ON public.reminders(status);
CREATE INDEX idx_reminders_triggers ON public.reminders(trigger_date, trigger_odometer) WHERE status = 'active';

-- ============================================================================
-- AI_DIAGNOSTICS TABLE
-- ============================================================================
CREATE TABLE public.ai_diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    symptoms TEXT[],
    probable_causes TEXT[],
    estimated_cost_min NUMERIC(10, 2),
    estimated_cost_max NUMERIC(10, 2),
    severity VARCHAR(20) CHECK (severity IN ('safe', 'caution', 'urgent', 'critical')),
    recommendation VARCHAR(20) CHECK (recommendation IN ('diy', 'professional', 'immediate')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_ai_diagnostics_user_session ON public.ai_diagnostics(user_id, session_id);
CREATE INDEX idx_ai_diagnostics_vehicle ON public.ai_diagnostics(vehicle_id);
CREATE INDEX idx_ai_diagnostics_created ON public.ai_diagnostics(created_at DESC);

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('receipt', 'insurance', 'registration', 'tax', 'warranty', 'other')),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_documents_user_vehicle ON public.documents(user_id, vehicle_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_expiry ON public.documents(expiry_date) WHERE expiry_date IS NOT NULL;

-- ============================================================================
-- AUDIT_LOGS TABLE
-- ============================================================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

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

-- Audit logs policies
CREATE POLICY "Users cannot directly access audit logs"
    ON public.audit_logs FOR SELECT
    USING (false);

CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_logs_updated_at BEFORE UPDATE ON public.fuel_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_logs_updated_at BEFORE UPDATE ON public.service_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update vehicle odometer
CREATE OR REPLACE FUNCTION update_vehicle_odometer()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.vehicles
    SET current_odometer = NEW.odometer
    WHERE id = NEW.vehicle_id AND NEW.odometer > current_odometer;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vehicle odometer from fuel logs
CREATE TRIGGER update_odometer_from_fuel AFTER INSERT OR UPDATE ON public.fuel_logs
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_odometer();

-- Trigger to update vehicle odometer from service logs
CREATE TRIGGER update_odometer_from_service AFTER INSERT OR UPDATE ON public.service_logs
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_odometer();

-- Function to calculate mileage and distance for fuel logs
CREATE OR REPLACE FUNCTION calculate_fuel_mileage()
RETURNS TRIGGER AS $$
DECLARE
    previous_log RECORD;
BEGIN
    -- Get the previous fuel log for this vehicle
    SELECT * INTO previous_log
    FROM public.fuel_logs
    WHERE vehicle_id = NEW.vehicle_id
      AND date < NEW.date
    ORDER BY date DESC, created_at DESC
    LIMIT 1;

    IF FOUND AND previous_log.is_full_tank AND NEW.is_full_tank THEN
        -- Calculate distance since last fill
        NEW.distance_since_last := NEW.odometer - previous_log.odometer;

        -- Calculate mileage (distance / quantity)
        IF NEW.quantity > 0 THEN
            NEW.mileage := NEW.distance_since_last / NEW.quantity;
        END IF;
    ELSE
        NEW.distance_since_last := NULL;
        NEW.mileage := NULL;
    END IF;

    -- Calculate price per unit
    IF NEW.quantity > 0 THEN
        NEW.price_per_unit := NEW.cost / NEW.quantity;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate mileage before insert/update
CREATE TRIGGER calculate_mileage_before_insert BEFORE INSERT ON public.fuel_logs
    FOR EACH ROW EXECUTE FUNCTION calculate_fuel_mileage();

CREATE TRIGGER calculate_mileage_before_update BEFORE UPDATE ON public.fuel_logs
    FOR EACH ROW EXECUTE FUNCTION calculate_fuel_mileage();
