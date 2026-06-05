import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';
import { isSupabaseConfigured } from '../../lib/supabase';
import { globalSearch } from '../../lib/db';

export default function TopBar({ title, subtitle, onNavigate }) {
  const { language, isRTL } = useApp();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const timerRef = useRef(null);
  const configured = isSupabaseConfigured();

  const handleSearch = (val) => {
    setSearchQuery(val);
    clearTimeout(timerRef.current);
    if (!val.trim() || val.length < 2) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }
    setSearching(true);
    setShowResults(true);
    timerRef.current = setTimeout(async () => {
      const results = await globalSearch(val);
      setSearchResults(results);
      setSearching(false);
    }, 400);
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalResults = searchResults
    ? Object.values(searchResults).reduce((s, a) => s + a.length, 0)
    : 0;

  return (
    <header className="shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-[#072A40]/60 bg-[#011C26]/80 backdrop-blur-sm">
      {/* Title */}
      <div>
        <h1 className="text-base font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#4F5459] mt-0.5">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Quick search */}
        <div ref={searchRef} className="relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F5459] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              placeholder={t.globalSearch.placeholder}
              className="w-64 bg-[#072A40]/60 border border-[#072A40]/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40 transition-colors"
            />
          </div>

          {/* Dropdown results */}
          {showResults && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-[#072A40] border border-[#BFACA4]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
              {searching ? (
                <div className="px-4 py-3 text-xs text-[#4F5459] text-center">{t.globalSearch.searching}</div>
              ) : totalResults === 0 ? (
                <div className="px-4 py-3 text-xs text-[#4F5459] text-center">{t.globalSearch.noResults}</div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-[#072A40]/60">
                  {Object.entries(searchResults || {}).map(([section, items]) =>
                    items.length > 0 ? (
                      <div key={section}>
                        <div className="px-3 pt-2 pb-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#4F5459]">{t.nav[section]}</span>
                        </div>
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate?.(section);
                              setShowResults(false);
                              setSearchQuery('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-[#072A40]/80 transition-colors"
                          >
                            <p className="text-xs text-white font-medium truncate">
                              {item.title || item.name || item.headline || item.company || '—'}
                            </p>
                            <p className="text-[10px] text-[#4F5459] truncate">
                              {item.industry || item.source || item.category || ''}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : null
                  )}
                </div>
              )}
              {totalResults > 0 && (
                <button
                  onClick={() => { onNavigate?.('search'); setShowResults(false); }}
                  className="w-full px-4 py-2.5 text-xs text-[#BFACA4] hover:bg-[#072A40]/60 border-t border-[#BFACA4]/10 text-center transition-colors"
                >
                  View all results →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Supabase status */}
        <div className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs
          ${configured
            ? 'bg-emerald-900/20 border-emerald-700/30 text-emerald-400'
            : 'bg-amber-900/20 border-amber-700/30 text-amber-400'
          }
        `}>
          <Database size={11} />
          <span className="hidden sm:inline font-medium">
            {configured ? 'Supabase' : 'Local'}
          </span>
          {configured
            ? <CheckCircle2 size={11} className="text-emerald-400" />
            : <AlertCircle size={11} className="text-amber-400" />
          }
        </div>
      </div>
    </header>
  );
}
