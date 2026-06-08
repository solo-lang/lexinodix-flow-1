/**
 * DB Abstraction — Supabase when configured, localStorage otherwise.
 */
import { supabase, isSupabaseConfigured } from './supabase';

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ── LocalStorage backend ─────────────────────────────────────── */
const ls = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(`lexinodix_${k}`) || '[]'); } catch { return []; } },
  set: (k, d) => { try { localStorage.setItem(`lexinodix_${k}`, JSON.stringify(d)); } catch {} },
};

const localCRUD = (table) => ({
  async select(f = {}) {
    let data = ls.get(table);
    if (f.search) { const q = f.search.toLowerCase(); data = data.filter(r => Object.values(r).some(v => String(v||'').toLowerCase().includes(q))); }
    if (f.fields) Object.entries(f.fields).forEach(([k,v]) => { if(v) data = data.filter(r => String(r[k]||'').toLowerCase().includes(v.toLowerCase())); });
    const total = data.length;
    if (f.page !== undefined && f.pageSize) data = data.slice(f.page * f.pageSize, (f.page+1) * f.pageSize);
    return { data, total, error: null };
  },
  async selectOne(id) {
    return { data: ls.get(table).find(r => r.id === id) || null, error: null };
  },
  async insert(record) {
    const data = ls.get(table);
    const now = new Date().toISOString();
    const newR = { ...record, id: genId(), created_at: now, updated_at: now };
    data.unshift(newR); ls.set(table, data);
    return { data: newR, error: null };
  },
  async update(id, record) {
    const data = ls.get(table);
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) return { data: null, error: { message: 'Not found' } };
    data[idx] = { ...data[idx], ...record, updated_at: new Date().toISOString() };
    ls.set(table, data);
    return { data: data[idx], error: null };
  },
  async delete(id) {
    ls.set(table, ls.get(table).filter(r => r.id !== id));
    return { error: null };
  },
  async bulkInsert(records) {
    const existing = ls.get(table);
    const now = new Date().toISOString();
    const newRecs = records.map(r => ({ ...r, id: genId(), created_at: now, updated_at: now }));
    ls.set(table, [...newRecs, ...existing]);
    return { data: newRecs, count: newRecs.length, error: null };
  },
});

/* ── Supabase backend ─────────────────────────────────────────── */
const SEARCH_COLS = {
  jobs:           ['title','company','industry','location','description','requirements'],
  companies:      ['name','industry','website','description','services','location'],
  news:           ['headline','source','summary','full_content','industry'],
  research_notes: ['title','category','observation'],
};

const sbCRUD = (table) => ({
  async select(f = {}) {
    if (!supabase) return localCRUD(table).select(f);
    let q = supabase.from(table).select('*', { count: 'exact' });
    const cols = SEARCH_COLS[table] || [];
    if (f.search && cols.length) q = q.or(cols.map(c => `${c}.ilike.%${f.search}%`).join(','));
    if (f.fields) Object.entries(f.fields).forEach(([k,v]) => { if(v) q = q.ilike(k, `%${v}%`); });
    if (f.page !== undefined && f.pageSize) q = q.range(f.page*f.pageSize, (f.page+1)*f.pageSize-1);
    q = q.order('created_at', { ascending: false });
    const { data, count, error } = await q;
    return { data: data||[], total: count||0, error };
  },
  async selectOne(id) {
    if (!supabase) return localCRUD(table).selectOne(id);
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    return { data, error };
  },
  async insert(record) {
    if (!supabase) return localCRUD(table).insert(record);
    const { data, error } = await supabase.from(table).insert([record]).select().single();
    return { data, error };
  },
  async update(id, record) {
    if (!supabase) return localCRUD(table).update(id, record);
    const { data, error } = await supabase.from(table).update({ ...record, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    return { data, error };
  },
  async delete(id) {
    if (!supabase) return localCRUD(table).delete(id);
    const { error } = await supabase.from(table).delete().eq('id', id);
    return { error };
  },
  async bulkInsert(records) {
    if (!supabase) return localCRUD(table).bulkInsert(records);
    const { data, error } = await supabase.from(table).insert(records).select();
    return { data: data||[], count: data?.length||0, error };
  },
});

const mkDB = (t) => isSupabaseConfigured() ? sbCRUD(t) : localCRUD(t);

export const JobsDB     = mkDB('jobs');
export const CompaniesDB = mkDB('companies');
export const NewsDB      = mkDB('news');
export const NotesDB     = mkDB('research_notes');

export async function globalSearch(query) {
  if (!query || query.length < 2) return { jobs:[], companies:[], news:[], notes:[] };
  const [j,c,n,r] = await Promise.all([
    JobsDB.select({ search: query, pageSize: 5, page: 0 }),
    CompaniesDB.select({ search: query, pageSize: 5, page: 0 }),
    NewsDB.select({ search: query, pageSize: 5, page: 0 }),
    NotesDB.select({ search: query, pageSize: 5, page: 0 }),
  ]);
  return { jobs: j.data||[], companies: c.data||[], news: n.data||[], notes: r.data||[] };
}

export async function getStats() {
  const [j,c,n,r] = await Promise.all([
    JobsDB.select({ pageSize:1, page:0 }),
    CompaniesDB.select({ pageSize:1, page:0 }),
    NewsDB.select({ pageSize:1, page:0 }),
    NotesDB.select({ pageSize:1, page:0 }),
  ]);
  return { jobs: j.total||0, companies: c.total||0, news: n.total||0, notes: r.total||0 };
}
