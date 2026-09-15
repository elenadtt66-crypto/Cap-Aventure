import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://kjgxyjtqplcmlojahdlx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ3h5anRxcGxjbWxvamFoZGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjg5NjYsImV4cCI6MjEwMTYwNDk2Nn0.pdZWU-sFZ9kJbPhU61DfuMnSggbjOqWkQx6RpR5KyEs';

function isValidHttpUrl(string?: string): boolean {
  if (!string || typeof string !== 'string') return false;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = isValidHttpUrl(rawUrl) ? rawUrl! : DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

const supabaseSecretKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  '';

let client: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
      },
    });
  }
} catch (e) {
  console.warn('Supabase initialization warning:', e);
  client = null;
}

export const supabase = client;

let adminClient: SupabaseClient | null = client;
try {
  if (supabaseUrl && supabaseSecretKey) {
    adminClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
      },
    });
  }
} catch (e) {
  adminClient = client;
}

export const supabaseAdmin = adminClient;

