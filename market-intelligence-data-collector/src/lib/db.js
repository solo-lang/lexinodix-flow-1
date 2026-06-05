/**
 * Lexinodix Intelligence Engine – Market Collector
 * Database Abstraction Layer
 *
 * Provides a unified interface for Supabase operations with
 * graceful fallback to localStorage when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from './supabase';

// ─── LOCAL STORAGE FALLBACK ──────────────────────────────────────────────────

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const localStore = {
  get: (key) => {
    try {
      const raw = localStorage.getItem(`lexinodix_${key}`);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
  set: (key, data) => {
    try { localStorage.setItem(`lexinodix_${key}`, JSON.stringify(data)); } catch {}
  },
};

const localCRUD = (table) => ({
  async select(filters = {}) {
    let data = localStore.get(table);
    // Apply search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(row =>
        Object.values(row).some(v => String(v || '').toLowerCase().includes(q))
      );
    }
    // Apply field filters
    if (filters.fields) {
      Object.entries(filters.fields).forEach(([k, v]) => {
        if (v) data = data.filter(row => String(row[k] || '').toLowerCase().includes(v.toLowerCase()));
      });
    }
    const total = data.length;
    // Apply pagination
    if (filters.page !== undefined && filters.pageSize) {
      const start = filters.page * filters.pageSize;
      data = data.slice(start, start + filters.pageSize);
    }
    return { data, total, error: null };
  },
  async selectOne(id) {
    const data = localStore.get(table);
    return { data: data.find(r => r.id === id) || null, error: null };
  },
  async insert(record) {
    const data = localStore.get(table);
    const now = new Date().toISOString();
    const newRecord = { ...record, id: generateId(), created_at: now, updated_at: now };
    data.unshift(newRecord);
    localStore.set(table, data);
    return { data: newRecord, error: null };
  },
  async update(id, record) {
    const data = localStore.get(table);
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) return { data: null, error: { message: 'Record not found' } };
    data[idx] = { ...data[idx], ...record, updated_at: new Date().toISOString() };
    localStore.set(table, data);
    return { data: data[idx], error: null };
  },
  async delete(id) {
    const data = localStore.get(table);
    const filtered = data.filter(r => r.id !== id);
    localStore.set(table, filtered);
    return { error: null };
  },
  async bulkInsert(records) {
    const data = localStore.get(table);
    const now = new Date().toISOString();
    const newRecords = records.map(r => ({ ...r, id: generateId(), created_at: now, updated_at: now }));
    localStore.set(table, [...newRecords, ...data]);
    return { data: newRecords, count: newRecords.length, error: null };
  },
});

// ─── SUPABASE CRUD ───────────────────────────────────────────────────────────

const supabaseCRUD = (table, searchColumns = []) => ({
  async select(filters = {}) {
    let query = supabase.from(table).select('*', { count: 'exact' });

    // Full-text search across columns
    if (filters.search && searchColumns.length > 0) {
      const searchConditions = searchColumns
        .map(col => `${col}.ilike.%${filters.search}%`)
        .join(',');
      query = query.or(searchConditions);
    }

    // Field-specific filters
    if (filters.fields) {
      Object.entries(filters.fields).forEach(([k, v]) => {
        if (v) query = query.ilike(k, `%${v}%`);
      });
    }

    // Pagination
    if (filters.page !== undefined && filters.pageSize) {
      const start = filters.page * filters.pageSize;
      query = query.range(start, start + filters.pageSize - 1);
    }

    query = query.order('created_at', { ascending: false });
    const { data, count, error } = await query;
    return { data: data || [], total: count || 0, error };
  },
  async selectOne(id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    return { data, error };
  },
  async insert(record) {
    const { data, error } = await supabase.from(table).insert([record]).select().single();
    return { data, error };
  },
  async update(id, record) {
    const { data, error } = await supabase.from(table).update({ ...record, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    return { data, error };
  },
  async delete(id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    return { error };
  },
  async bulkInsert(records) {
    const { data, error } = await supabase.from(table).insert(records).select();
    return { data: data || [], count: data?.length || 0, error };
  },
});

// ─── TABLE SEARCH COLUMNS ────────────────────────────────────────────────────

const TABLE_SEARCH_COLS = {
  jobs: ['title', 'company', 'industry', 'location', 'description', 'requirements'],
  companies: ['name', 'industry', 'website', 'description', 'services', 'location'],
  news: ['headline', 'source', 'summary', 'full_content', 'industry'],
  research_notes: ['title', 'category', 'observation'],
};

// ─── FACTORY ─────────────────────────────────────────────────────────────────

const createDB = (table) => {
  if (isSupabaseConfigured()) {
    return supabaseCRUD(table, TABLE_SEARCH_COLS[table] || []);
  }
  return localCRUD(table);
};

// ─── EXPORTED DATABASES ──────────────────────────────────────────────────────

export const JobsDB = createDB('jobs');
export const CompaniesDB = createDB('companies');
export const NewsDB = createDB('news');
export const NotesDB = createDB('research_notes');

// ─── GLOBAL SEARCH ───────────────────────────────────────────────────────────

export async function globalSearch(query) {
  if (!query || query.length < 2) return { jobs: [], companies: [], news: [], notes: [] };

  const [jobs, companies, news, notes] = await Promise.all([
    JobsDB.select({ search: query, pageSize: 5, page: 0 }),
    CompaniesDB.select({ search: query, pageSize: 5, page: 0 }),
    NewsDB.select({ search: query, pageSize: 5, page: 0 }),
    NotesDB.select({ search: query, pageSize: 5, page: 0 }),
  ]);

  return {
    jobs: jobs.data || [],
    companies: companies.data || [],
    news: news.data || [],
    notes: notes.data || [],
  };
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export async function getStats() {
  const [jobs, companies, news, notes] = await Promise.all([
    JobsDB.select({ pageSize: 1, page: 0 }),
    CompaniesDB.select({ pageSize: 1, page: 0 }),
    NewsDB.select({ pageSize: 1, page: 0 }),
    NotesDB.select({ pageSize: 1, page: 0 }),
  ]);

  return {
    jobs: jobs.total || 0,
    companies: companies.total || 0,
    news: news.total || 0,
    notes: notes.total || 0,
  };
}
