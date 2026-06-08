// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Search, Database, AlertCircle, CheckCircle2, X, Briefcase, Building2, Newspaper, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';
import { isSupabaseConfigured } from '../../lib/supabase';
import { globalSearch } from '../../lib/db';

const ICONS = { jobs: Briefcase, companies: Building2, news: Newspaper, notes: BookOpen };

export default function TopBar({ title, subtitle, onNavigate }) {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timer = useRef(null);
  const configured = isSupabaseConfigured();

  const doSearch = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    if (!val || val.length < 2) { setResults(null); setOpen(false); return; }
    setLoading(true); setOpen(true);
    timer.current = setTimeout(async () => {
      const r = await globalSearch(val);
      setResults(r); setLoading(false);
    }, 350);
  };

  const clear = () => { setQuery(''); setResults(null); setOpen(false); };

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const total = results ? Object.values(results).reduce((s, a) => s + a.length, 0) : 0;

  return (
    <header className="h-14 flex items-center justify-between px-6 flex-shrink-0 bg-surface/80 backdrop-blur-md border-b border-border">
      {/* Title */}
      <div className="flex-1 min-w-0 mr-4">
        <h1 className="text-[15px] font-bold text-text truncate">{title}</h1>
        {subtitle && <p className="text-[11px] text-text2 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div ref={ref} className="relative">
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-3 text-text3 pointer-events-none" />
            <input 
              value={query} 
              onChange={e => doSearch(e.target.value)} 
              onFocus={() => query.length >= 2 && setOpen(true)}
              placeholder="Quick search…"
              className="w-52 pl-9 pr-8 py-1.5 bg-bg border border-border rounded-lg text-sm text-text outline-none transition-all placeholder:text-text3 focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
            {query && (
              <button onClick={clear} className="absolute right-3 text-text3 hover:text-text transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full right-0 mt-1.5 w-72 bg-surface border border-border-active rounded-xl shadow-xl z-50 overflow-hidden animate-in">
              {loading ? (
                <p className="py-3.5 px-4 text-xs text-text3 text-center">Searching…</p>
              ) : total === 0 ? (
                <p className="py-3.5 px-4 text-xs text-text3 text-center">No results for "{query}"</p>
              ) : (
                <>
                  <div className="max-h-72 overflow-y-auto">
                    {Object.entries(results || {}).map(([sec, items]) =>
                      items.length === 0 ? null : (
                        <div key={sec}>
                          <div className="px-3.5 pt-2 pb-1 flex items-center gap-1.5">
                            {React.createElement(ICONS[sec] || Database, { size: 10, className: "text-accent" })}
                            <span className="text-[9px] font-bold tracking-widest uppercase text-text3/70">
                              {t?.nav?.[sec] || sec} ({items.length})
                            </span>
                          </div>
                          {items.map(item => (
                            <button key={item.id} onClick={() => { onNavigate?.(sec); setOpen(false); clear(); }}
                              className="w-full px-3.5 py-1.5 block bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-bg/60"
                            >
                              <p className="text-xs font-medium text-text truncate">{item.title || item.name || item.headline || '—'}</p>
                              <p className="text-[11px] text-text3 truncate">{item.industry || item.source || item.category || item.location || ''}</p>
                            </button>
                          ))}
                        </div>
                      )
                    )}
                  </div>                  <button onClick={() => { onNavigate?.('search'); setOpen(false); clear(); }}
                    className="w-full py-2.5 px-3.5 text-[11px] text-accent border-t border-border text-center bg-transparent border-none cursor-pointer hover:bg-bg/60 transition-colors"
                  >
                    View all {total} results →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border ${configured ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
          <Database size={11} />
          {configured ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
          <span className="text-[10px]">{configured ? 'Cloud' : 'Local'}</span>
        </div>
      </div>
    </header>
  );
}
