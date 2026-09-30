-- ========================================================
-- SCRIPT DE CRÉATION DES TABLES SUPABASE POUR CAP-AVENTURE
-- À copier et exécuter dans : Supabase Dashboard > SQL Editor > Run
-- ========================================================

-- 1. Table des Véhicules
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  price_per_day NUMERIC DEFAULT 0,
  seats INTEGER DEFAULT 2,
  beds INTEGER DEFAULT 2,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  available BOOLEAN DEFAULT true,
  location TEXT DEFAULT 'Bordeaux',
  owner JSONB DEFAULT '{}'::jsonb,
  tech_specs JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Politiques de sécurité (autoriser lecture et écriture publiques)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on vehicles" ON public.vehicles;
CREATE POLICY "Allow public all on vehicles"
ON public.vehicles
FOR ALL
USING (true)
WITH CHECK (true);


-- 2. Table des Réservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT,
  vehicle_name TEXT,
  client_id TEXT,
  client_name TEXT,
  start_date TEXT,
  end_date TEXT,
  total_days INTEGER,
  total_price NUMERIC,
  status TEXT DEFAULT 'EN_ATTENTE',
  specific_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on reservations" ON public.reservations;
CREATE POLICY "Allow public all on reservations"
ON public.reservations
FOR ALL
USING (true)
WITH CHECK (true);


-- 3. Table des Clients
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  driving_license_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on clients" ON public.clients;
CREATE POLICY "Allow public all on clients"
ON public.clients
FOR ALL
USING (true)
WITH CHECK (true);
