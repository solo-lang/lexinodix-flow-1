/**
 * Supabase — SAFE init. App never crashes without env vars.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () =>
  supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '';

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, company TEXT, industry TEXT, location TEXT,
  salary TEXT, description TEXT, responsibilities TEXT, requirements TEXT,
  source TEXT, date_collected DATE DEFAULT CURRENT_DATE,
  original_url TEXT, raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, industry TEXT, website TEXT, description TEXT,
  services TEXT, location TEXT, notes TEXT, source_url TEXT, raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL, source TEXT, date DATE DEFAULT CURRENT_DATE,
  summary TEXT, full_content TEXT, url TEXT, industry TEXT, raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS research_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, category TEXT, observation TEXT,
  tags TEXT[], date DATE DEFAULT CURRENT_DATE, raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;
