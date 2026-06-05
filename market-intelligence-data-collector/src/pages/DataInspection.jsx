import React, { useState, useEffect, useCallback } from 'react';
import {
  Microscope, Eye, RefreshCw, Filter, ChevronDown,
  Briefcase, Building2, Newspaper, BookOpen, ExternalLink,
  Code2, Table2, FileText, Search, Copy, CheckCheck
} from 'lucide-react';
import { JobsDB, CompaniesDB, NewsDB, NotesDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RawDataViewer from '../components/ui/RawDataViewer';

const SOURCES = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase, db: JobsDB, primaryField: 'title', secondaryField: 'company', color: 'text-blue-300' },
  { id: 'companies', label: 'Companies', icon: Building2, db: CompaniesDB, primaryField: 'name', secondaryField: 'industry', color: 'text-purple-300' },
  { id: 'news', label: 'News', icon: Newspaper, db: NewsDB, primaryField: 'headline', secondaryField: 'source', color: 'text-emerald-300' },
  { id: 'notes', label: 'Notes', icon: BookOpen, db: NotesDB, primaryField: 'title', secondaryField: 'category', color: 'text-amber-300' },
];

function InspectionCard({ record, source, onViewRaw }) {
  const primaryField = source.primaryField;
  const secondaryField = source.secondaryField;
  const Icon = source.icon;

  const hasRawText = record.raw_text || record.full_content || record.description || record.observation;
  const externalUrl = record.original_url || record.url || record.source_url || record.website;

  return (
    <div className="group bg-[#072A40]/40 border border-[#BFACA4]/10 hover:border-[#BFACA4]/25 rounded-2xl p-4 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`shrink-0 w-8 h-8 rounded-lg bg-[#011C26]/60 border border-[#072A40]/60 flex items-center justify-center ${source.color}`}>
            <Icon size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{record[primaryField] || '—'}</p>
            <p className="text-xs text-[#4F5459] truncate">{record[secondaryField] || ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {externalUrl && (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/60 transition-colors"
              title="Open source URL"
              onClick={e => e.stopPropagation()}>
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={() => onViewRaw(record)}
            className="p-1.5 rounded-lg text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/60 transition-colors"
            title="View raw data"
          >
            <Eye size={13} />
          </button>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="muted" className="text-[9px]">{source.label}</Badge>
        {record.industry && <Badge variant="info" className="text-[9px]">{record.industry}</Badge>}
        {record.source && <Badge variant="accent" className="text-[9px]">{record.source}</Badge>}
        {record.category && <Badge variant="accent" className="text-[9px]">{record.category}</Badge>}
        {(record.date_collected || record.date || record.created_at) && (
          <Badge variant="muted" className="text-[9px]">
            {new Date(record.date_collected || record.date || record.created_at).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Preview of raw text / description */}
      {hasRawText && (
        <div className="bg-[#011C26]/60 border border-[#072A40]/60 rounded-xl p-3">
          <p className="text-[10px] font-mono text-[#4F5459] line-clamp-3 leading-relaxed">
            {(record.raw_text || record.full_content || record.description || record.observation || '').slice(0, 200)}
            {(record.raw_text || record.full_content || record.description || record.observation || '').length > 200 && '...'}
          </p>
        </div>
      )}

      {/* Source URL */}
      {externalUrl && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#4F5459]">
          <ExternalLink size={10} />
          <span className="truncate font-mono">{externalUrl}</span>
        </div>
      )}
    </div>
  );
}

export default function DataInspection() {
  const { language } = useApp();
  const { t } = useTranslation(language);

  const [activeSource, setActiveSource] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const PAGE_SIZE = 20;

  const load = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 0 : page;
    if (reset) setPage(0);

    let results = [];

    if (activeSource === 'all') {
      const sources = await Promise.all(
        SOURCES.map(s => s.db.select({ search: search || undefined, page: currentPage, pageSize: Math.ceil(PAGE_SIZE / 4) }))
      );
      sources.forEach((res, idx) => {
        (res.data || []).forEach(item => results.push({ ...item, _source: SOURCES[idx] }));
      });
    } else {
      const src = SOURCES.find(s => s.id === activeSource);
      if (src) {
        const res = await src.db.select({ search: search || undefined, page: currentPage, pageSize: PAGE_SIZE });
        results = (res.data || []).map(item => ({ ...item, _source: src }));
        setHasMore((res.data || []).length === PAGE_SIZE);
      }
    }

    if (reset) setData(results);
    else setData(d => [...d, ...results]);
    setLoading(false);
  }, [activeSource, search, page]);

  useEffect(() => { load(true); }, [activeSource, search]);

  const handleViewRaw = (record) => {
    setSelectedRecord(record);
    setSelectedSource(record._source);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#BFACA4]/10 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <Microscope size={18} className="text-[#BFACA4]" />
          <h2 className="text-xl font-bold text-white">{t.inspection.title}</h2>
        </div>
        <p className="text-sm text-[#4F5459]">{t.inspection.subtitle}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-[#BFACA4]/10 shrink-0">
        {/* Source tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[#011C26]/60 border border-[#072A40]/60">
          <button
            onClick={() => setActiveSource('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSource === 'all' ? 'bg-[#072A40] text-[#D9C5C1]' : 'text-[#4F5459] hover:text-[#BFACA4]'
            }`}
          >All Sources</button>
          {SOURCES.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSource(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSource === s.id ? 'bg-[#072A40] text-[#D9C5C1]' : 'text-[#4F5459] hover:text-[#BFACA4]'
                }`}
              >
                <Icon size={12} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs ms-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F5459] pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter records..."
            className="w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40"
          />
        </div>

        <Button variant="ghost" size="sm" icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />} onClick={() => load(true)} />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#4F5459]">
            <RefreshCw size={20} className="animate-spin me-2" />
            <span className="text-sm">{t.status.loading}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Microscope size={32} className="text-[#4F5459]" />
            <p className="text-sm text-[#4F5459]">{t.status.noData}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.map(record => (
                <InspectionCard
                  key={`${record._source?.id}-${record.id}`}
                  record={record}
                  source={record._source}
                  onViewRaw={handleViewRaw}
                />
              ))}
            </div>

            {/* Load more */}
            {data.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  loading={loading}
                  onClick={() => { setPage(p => p + 1); load(); }}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Raw viewer */}
      <RawDataViewer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        data={selectedRecord}
        title={selectedRecord?.[selectedSource?.primaryField] || 'Record Details'}
      />
    </div>
  );
}
