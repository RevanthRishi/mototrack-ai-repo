-- Add avatar_url column to users table for Google OAuth profile storage
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
