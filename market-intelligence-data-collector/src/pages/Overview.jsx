import React, { useEffect, useState } from 'react';
import {
  Briefcase, Building2, Newspaper, BookOpen, TrendingUp,
  Database, Activity, AlertCircle, ArrowRight, Clock, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import { getStats, JobsDB, CompaniesDB, NewsDB, NotesDB } from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';
import { seedDemoData } from '../lib/seedData';
import { SCHEMA_SQL } from '../lib/supabase';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

function StatCard({ icon: Icon, label, value, color, onClick, trend }) {
  return (
    <button
      onClick={onClick}
      className="group relative p-5 rounded-2xl bg-[#072A40]/60 border border-[#BFACA4]/10 hover:border-[#BFACA4]/30 transition-all duration-200 text-left w-full hover:shadow-lg hover:shadow-[#011C26]/50"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-3xl font-bold text-white mb-1 tabular-nums">{value}</div>
      <div className="text-xs text-[#4F5459] font-medium">{label}</div>
      <ArrowRight size={14} className="absolute top-5 right-5 text-[#4F5459] group-hover:text-[#BFACA4] transition-colors" />
    </button>
  );
}

function RecentList({ title, items, fieldMap, emptyMsg, onNavigate, navId }) {
  return (
    <div className="bg-[#072A40]/40 border border-[#BFACA4]/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#BFACA4]/10">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <button
          onClick={() => onNavigate?.(navId)}
          className="text-xs text-[#BFACA4] hover:text-white transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-[#072A40]/60">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-[#4F5459]">{emptyMsg}</div>
        ) : (
          items.slice(0, 5).map(item => (
            <div key={item.id} className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-[#072A40]/30 transition-colors">
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{item[fieldMap.primary] || '—'}</p>
                <p className="text-[10px] text-[#4F5459] truncate mt-0.5">{item[fieldMap.secondary] || ''}</p>
              </div>
              {item[fieldMap.badge] && (
                <Badge variant="muted" className="shrink-0 text-[9px]">{item[fieldMap.badge]}</Badge>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Overview({ onNavigate }) {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, news: 0, notes: 0 });
  const [recent, setRecent] = useState({ jobs: [], companies: [], news: [], notes: [] });
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Auto-seed demo data if nothing exists yet (local mode only)
      if (!isSupabaseConfigured()) {
        await seedDemoData({ JobsDB, CompaniesDB, NewsDB, NotesDB });
      }
      const [s, rj, rc, rn, rno] = await Promise.all([
        getStats(),
        JobsDB.select({ pageSize: 5, page: 0 }),
        CompaniesDB.select({ pageSize: 5, page: 0 }),
        NewsDB.select({ pageSize: 5, page: 0 }),
        NotesDB.select({ pageSize: 5, page: 0 }),
      ]);
      setStats(s);
      setRecent({ jobs: rj.data || [], companies: rc.data || [], news: rn.data || [], notes: rno.data || [] });
      setLoading(false);
    }
    load();
  }, []);

  const totalRecords = stats.jobs + stats.companies + stats.news + stats.notes;

  return (
    <div className="p-6 space-y-6">
      {/* Connection banner */}
      {!configured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/30">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-300">{t.settings.localMode}</p>
            <p className="text-xs text-amber-400/70 mt-0.5">{t.settings.localModeDesc}</p>
          </div>
          <Button variant="ghost" size="xs" onClick={() => onNavigate?.('settings')}>
            Configure →
          </Button>
        </div>
      )}

      {/* Hero strip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#072A40] via-[#072A40] to-[#011C26] border border-[#BFACA4]/10 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#BFACA4]/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-[#BFACA4]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFACA4]">
                Module 1 · Market Collector
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{t.overview.title}</h2>
            <p className="text-xs text-[#4F5459] mt-1">{t.overview.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#D9C5C1] tabular-nums">{loading ? '—' : totalRecords.toLocaleString()}</div>
            <div className="text-xs text-[#4F5459]">{t.overview.totalRecords}</div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase} label={t.jobs.title}
          value={loading ? '—' : stats.jobs.toLocaleString()}
          color="bg-blue-900/40 text-blue-300 border border-blue-700/20"
          onClick={() => onNavigate?.('jobs')}
        />
        <StatCard
          icon={Building2} label={t.companies.title}
          value={loading ? '—' : stats.companies.toLocaleString()}
          color="bg-purple-900/40 text-purple-300 border border-purple-700/20"
          onClick={() => onNavigate?.('companies')}
        />
        <StatCard
          icon={Newspaper} label={t.news.title}
          value={loading ? '—' : stats.news.toLocaleString()}
          color="bg-emerald-900/40 text-emerald-300 border border-emerald-700/20"
          onClick={() => onNavigate?.('news')}
        />
        <StatCard
          icon={BookOpen} label={t.notes.title}
          value={loading ? '—' : stats.notes.toLocaleString()}
          color="bg-amber-900/40 text-amber-300 border border-amber-700/20"
          onClick={() => onNavigate?.('notes')}
        />
      </div>

      {/* Recent data grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList
          title={t.jobs.title} items={recent.jobs}
          fieldMap={{ primary: 'title', secondary: 'company', badge: 'industry' }}
          emptyMsg="No jobs collected yet"
          onNavigate={onNavigate} navId="jobs"
        />
        <RecentList
          title={t.companies.title} items={recent.companies}
          fieldMap={{ primary: 'name', secondary: 'website', badge: 'industry' }}
          emptyMsg="No companies recorded yet"
          onNavigate={onNavigate} navId="companies"
        />
        <RecentList
          title={t.news.title} items={recent.news}
          fieldMap={{ primary: 'headline', secondary: 'source', badge: 'industry' }}
          emptyMsg="No news articles collected yet"
          onNavigate={onNavigate} navId="news"
        />
        <RecentList
          title={t.notes.title} items={recent.notes}
          fieldMap={{ primary: 'title', secondary: 'category', badge: 'category' }}
          emptyMsg="No research notes added yet"
          onNavigate={onNavigate} navId="notes"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Import Data', sub: 'CSV · JSON · Manual', nav: 'import', icon: Database },
          { label: 'Inspect Raw Data', sub: 'View collected records', nav: 'inspection', icon: Activity },
          { label: 'Global Search', sub: 'Search all collections', nav: 'search', icon: TrendingUp },
        ].map(({ label, sub, nav, icon: Icon }) => (
          <button
            key={nav}
            onClick={() => onNavigate?.(nav)}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[#072A40]/40 border border-[#BFACA4]/10 hover:border-[#BFACA4]/30 hover:bg-[#072A40]/60 transition-all duration-200 text-left"
          >
            <Icon size={18} className="text-[#BFACA4] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-[#D9C5C1]">{label}</p>
              <p className="text-[10px] text-[#4F5459]">{sub}</p>
            </div>
            <ArrowRight size={14} className="ms-auto text-[#4F5459] group-hover:text-[#BFACA4] transition-colors" />
          </button>
        ))}
      </div>

      {/* Future modules roadmap */}
      <div className="rounded-2xl border border-[#BFACA4]/10 overflow-hidden">
        <div className="px-5 py-3.5 bg-[#072A40]/30 border-b border-[#BFACA4]/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4F5459]">Platform Roadmap · Lexinodix Intelligence Engine</p>
        </div>
        <div className="flex flex-wrap divide-x divide-[#072A40]/60">
          {[
            { num: '01', label: 'Market Collector', status: 'active', desc: 'Data Collection' },
            { num: '02', label: 'Analysis Engine', status: 'planned', desc: 'Data Processing' },
            { num: '03', label: 'Research Agent', status: 'planned', desc: 'Deep Research' },
            { num: '04', label: 'Opportunity Engine', status: 'planned', desc: 'Opportunity Scoring' },
            { num: '05', label: 'Strategic Dashboard', status: 'planned', desc: 'Executive View' },
          ].map(m => (
            <div key={m.num} className={`flex-1 min-w-[130px] px-4 py-3.5 ${m.status === 'active' ? 'bg-[#072A40]/40' : ''}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold font-mono text-[#4F5459]">Module {m.num}</span>
                {m.status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>
              <p className={`text-xs font-semibold ${m.status === 'active' ? 'text-[#D9C5C1]' : 'text-[#4F5459]'}`}>{m.label}</p>
              <p className="text-[10px] text-[#4F5459] mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
