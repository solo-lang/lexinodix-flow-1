import React, { useState, useRef, useCallback } from 'react';
import {
  Globe2, Search, Briefcase, Building2, Newspaper,
  BookOpen, Eye, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { globalSearch } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import Badge from '../components/ui/Badge';
import RawDataViewer from '../components/ui/RawDataViewer';

const SECTION_CONFIG = {
  jobs: { label: 'Jobs', icon: Briefcase, primaryField: 'title', secondaryField: 'company', badge: 'industry', color: 'text-blue-300', bg: 'bg-blue-900/20 border-blue-700/20' },
  companies: { label: 'Companies', icon: Building2, primaryField: 'name', secondaryField: 'website', badge: 'industry', color: 'text-purple-300', bg: 'bg-purple-900/20 border-purple-700/20' },
  news: { label: 'News', icon: Newspaper, primaryField: 'headline', secondaryField: 'source', badge: 'industry', color: 'text-emerald-300', bg: 'bg-emerald-900/20 border-emerald-700/20' },
  notes: { label: 'Research Notes', icon: BookOpen, primaryField: 'title', secondaryField: 'category', badge: 'category', color: 'text-amber-300', bg: 'bg-amber-900/20 border-amber-700/20' },
};

function ResultCard({ item, config, onViewRaw }) {
  const Icon = config.icon;
  return (
    <div className="group flex items-start gap-3 p-3.5 rounded-xl bg-[#072A40]/30 border border-[#BFACA4]/10 hover:border-[#BFACA4]/25 transition-all duration-150">
      <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${config.bg} ${config.color}`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{item[config.primaryField] || '—'}</p>
        <p className="text-xs text-[#4F5459] truncate mt-0.5">{item[config.secondaryField] || ''}</p>
        {item[config.badge] && (
          <Badge variant="muted" className="mt-1.5 text-[9px]">{item[config.badge]}</Badge>
        )}
      </div>
      <button
        onClick={() => onViewRaw(item, config)}
        className="shrink-0 p-1.5 rounded-lg text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/60 transition-colors opacity-0 group-hover:opacity-100"
        title="View raw data"
      >
        <Eye size={13} />
      </button>
    </div>
  );
}

function SectionBlock({ sectionKey, items, onViewRaw }) {
  const config = SECTION_CONFIG[sectionKey];
  const Icon = config.icon;

  if (!items?.length) return null;

  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b border-[#072A40]/60`}>
        <Icon size={14} className={config.color} />
        <h3 className="text-sm font-bold text-white">{config.label}</h3>
        <Badge variant="muted">{items.length}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map(item => (
          <ResultCard key={item.id} item={item} config={config} onViewRaw={onViewRaw} />
        ))}
      </div>
    </div>
  );
}

export default function GlobalSearch() {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const timerRef = useRef();

  const handleSearch = useCallback((val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (!val.trim() || val.length < 2) { setResults(null); return; }
    setSearching(true);
    timerRef.current = setTimeout(async () => {
      const res = await globalSearch(val);
      setResults(res);
      setSearching(false);
    }, 350);
  }, []);

  const totalResults = results
    ? Object.values(results).reduce((s, arr) => s + arr.length, 0)
    : 0;

  const handleViewRaw = (item, config) => {
    setSelectedRecord(item);
    setSelectedConfig(config);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#BFACA4]/10 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <Globe2 size={18} className="text-[#BFACA4]" />
          <h2 className="text-xl font-bold text-white">{t.globalSearch.title}</h2>
        </div>
        <p className="text-sm text-[#4F5459]">{t.globalSearch.subtitle}</p>

        {/* Big search input */}
        <div className="relative mt-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F5459] pointer-events-none" />
          <input
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder={t.globalSearch.placeholder}
            autoFocus
            className="w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40 focus:ring-1 focus:ring-[#BFACA4]/20 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searching && <RefreshCw size={14} className="text-[#4F5459] animate-spin" />}
            {query && !searching && (
              <button onClick={() => handleSearch('')} className="text-[#4F5459] hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        {results && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#4F5459]">
              {totalResults === 0 ? t.globalSearch.noResults : `${totalResults} results for "${query}"`}
            </span>
            {Object.entries(results).map(([key, items]) =>
              items.length > 0 ? (
                <Badge key={key} variant="muted" className="text-[9px]">
                  {SECTION_CONFIG[key]?.label}: {items.length}
                </Badge>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {!query && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#072A40]/60 border border-[#BFACA4]/10 flex items-center justify-center">
              <Search size={24} className="text-[#4F5459]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#4F5459]">Start typing to search across all collections</p>
              <p className="text-xs text-[#4F5459]/60 mt-1">Jobs · Companies · News · Research Notes</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {Object.entries(SECTION_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.color}`}>
                    <Icon size={14} />
                    <span className="text-xs font-medium">{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {query && searching && (
          <div className="flex items-center justify-center h-32 gap-3 text-[#4F5459]">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">{t.globalSearch.searching}</span>
          </div>
        )}

        {results && !searching && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-sm text-[#4F5459]">{t.globalSearch.noResults}</p>
            <p className="text-xs text-[#4F5459]/60">Try a different search term</p>
          </div>
        )}

        {results && !searching && totalResults > 0 && (
          <div className="space-y-8">
            {Object.entries(results).map(([key, items]) => (
              <SectionBlock key={key} sectionKey={key} items={items} onViewRaw={handleViewRaw} />
            ))}
          </div>
        )}
      </div>

      {/* Raw viewer */}
      <RawDataViewer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        data={selectedRecord}
        title={selectedRecord?.[selectedConfig?.primaryField] || 'Record Details'}
      />
    </div>
  );
}
