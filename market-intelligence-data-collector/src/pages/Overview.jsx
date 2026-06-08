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

// StatCard Component - Light Theme
function StatCard({ icon: Icon, label, value, color, onClick, trend }) {
  return (
    <button
      onClick={onClick}
      className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-accent transition-all duration-200 text-left w-full hover:shadow-lg hover:shadow-accent/5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-3xl font-bold text-text mb-1 tabular-nums">{value}</div>
      <div className="text-xs text-text2 font-medium">{label}</div>
      <ArrowRight size={14} className="absolute top-5 right-5 text-text3 group-hover:text-accent transition-colors" />
    </button>
  );
}

// RecentList Component - Light Theme
function RecentList({ title, items, fieldMap, emptyMsg, onNavigate, navId }) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <button
          onClick={() => onNavigate?.(navId)}
          className="text-xs text-accent hover:text-primary transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-text3">{emptyMsg}</div>
        ) : (
          items.slice(0, 5).map(item => (
            <div key={item.id} className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-bg/60 transition-colors">              <div className="min-w-0">
                <p className="text-xs font-medium text-text truncate">{item[fieldMap.primary] || '—'}</p>
                <p className="text-[10px] text-text2 truncate mt-0.5">{item[fieldMap.secondary] || ''}</p>
              </div>
              {item[fieldMap.badge] && (
                <Badge variant="muted" className="shrink-0 text-[9px] bg-bg-hover text-primary border border-border">
                  {item[fieldMap.badge]}
                </Badge>
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
    <div className="p-6 space-y-6">      {/* Connection banner - Light Theme */}
      {!configured && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">{t.settings.localMode}</p>
            <p className="text-xs text-amber-600/70 mt-0.5">{t.settings.localModeDesc}</p>
          </div>
          <Button variant="ghost" size="xs" onClick={() => onNavigate?.('settings')} className="text-primary hover:text-accent">
            Configure →
          </Button>
        </div>
      )}

      {/* Hero strip - Light Premium Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-bg border border-border p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Module 1 · Market Collector
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{t.overview.title}</h2>
            <p className="text-xs text-white/70 mt-1">{t.overview.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-accent-2 tabular-nums">{loading ? '—' : totalRecords.toLocaleString()}</div>
            <div className="text-xs text-white/70">{t.overview.totalRecords}</div>
          </div>
        </div>
      </div>

      {/* Stat cards - Light Theme Colors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase} label={t.jobs.title}
          value={loading ? '—' : stats.jobs.toLocaleString()}
          color="bg-blue-50 text-blue-700 border border-blue-200"
          onClick={() => onNavigate?.('jobs')}
        />
        <StatCard
          icon={Building2} label={t.companies.title}
          value={loading ? '—' : stats.companies.toLocaleString()}
          color="bg-purple-50 text-purple-700 border border-purple-200"
          onClick={() => onNavigate?.('companies')}
        />
        <StatCard          icon={Newspaper} label={t.news.title}
          value={loading ? '—' : stats.news.toLocaleString()}
          color="bg-emerald-50 text-emerald-700 border border-emerald-200"
          onClick={() => onNavigate?.('news')}
        />
        <StatCard
          icon={BookOpen} label={t.notes.title}
          value={loading ? '—' : stats.notes.toLocaleString()}
          color="bg-amber-50 text-amber-700 border border-amber-200"
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

      {/* Quick actions - Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Import Data', sub: 'CSV · JSON · Manual', nav: 'import', icon: Database },
          { label: 'Inspect Raw Data', sub: 'View collected records', nav: 'inspection', icon: Activity },
          { label: 'Global Search', sub: 'Search all collections', nav: 'search', icon: TrendingUp },
        ].map(({ label, sub, nav, icon: Icon }) => (
          <button
            key={nav}            onClick={() => onNavigate?.(nav)}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-accent hover:bg-bg/60 transition-all duration-200 text-left"
          >
            <Icon size={18} className="text-accent shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text group-hover:text-primary">{label}</p>
              <p className="text-[10px] text-text2">{sub}</p>
            </div>
            <ArrowRight size={14} className="ms-auto text-text3 group-hover:text-accent transition-colors" />
          </button>
        ))}
      </div>

      {/* Future modules roadmap - Light Theme */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <div className="px-5 py-3.5 bg-bg border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text3">Platform Roadmap · Lexinodix Intelligence Engine</p>
        </div>
        <div className="flex flex-wrap divide-x divide-border">
          {[
            { num: '01', label: 'Market Collector', status: 'active', desc: 'Data Collection' },
            { num: '02', label: 'Analysis Engine', status: 'planned', desc: 'Data Processing' },
            { num: '03', label: 'Research Agent', status: 'planned', desc: 'Deep Research' },
            { num: '04', label: 'Opportunity Engine', status: 'planned', desc: 'Opportunity Scoring' },
            { num: '05', label: 'Strategic Dashboard', status: 'planned', desc: 'Executive View' },
          ].map(m => (
            <div key={m.num} className={`flex-1 min-w-[130px] px-4 py-3.5 ${m.status === 'active' ? 'bg-bg/60' : ''}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold font-mono text-text3">Module {m.num}</span>
                {m.status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </div>
              <p className={`text-xs font-semibold ${m.status === 'active' ? 'text-primary' : 'text-text2'}`}>{m.label}</p>
              <p className="text-[10px] text-text2 mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
