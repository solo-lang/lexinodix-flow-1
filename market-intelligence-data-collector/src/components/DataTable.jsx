import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, X, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import Pagination from './ui/Pagination';
import Badge from './ui/Badge';
import RawDataViewer from './ui/RawDataViewer';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

export default function DataTable({
  db,
  columns,
  title,
  subtitle,
  onAdd,
  onEdit,
  filterFields = [],
  renderBadge,
  rowPrimaryField = 'title',
  emptyIcon,
}) {
  const { language, showToast, showConfirm } = useApp();
  const { t } = useTranslation(language);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [fieldFilters, setFieldFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRaw, setSelectedRaw] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await db.select({
        search: search || undefined,
        fields: Object.fromEntries(Object.entries(fieldFilters).filter(([, v]) => v)),
        page,
        pageSize,
      });
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      showToast(err.message || t.status.error, 'error');
    }
    setLoading(false);
  }, [db, search, fieldFilters, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (row) => {
    showConfirm(t.status.confirmDelete, async () => {
      const { error } = await db.delete(row.id);
      if (error) showToast(error.message || t.status.error, 'error');
      else { showToast(t.status.success); load(); }
    });
  };

  const handleSearch = (val) => { setSearch(val); setPage(0); };
  const handleFieldFilter = (key, val) => { setFieldFilters(f => ({ ...f, [key]: val })); setPage(0); };
  const clearFilters = () => { setFieldFilters({}); setSearch(''); setPage(0); };

  const activeFilterCount = Object.values(fieldFilters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-5 border-b border-[#BFACA4]/10 shrink-0">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F5459] pointer-events-none" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder={`${t.actions.search}...`}
            className="w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40 transition-colors"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4F5459] hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        {filterFields.length > 0 && (
          <Button
            variant={showFilters ? 'accent' : 'secondary'}
            size="sm"
            icon={<SlidersHorizontal size={14} />}
            onClick={() => setShowFilters(f => !f)}
          >
            {t.actions.filter}
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#072A40] text-[#D9C5C1] text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" icon={<X size={13} />} onClick={clearFilters}>
            {t.actions.clear}
          </Button>
        )}

        <div className="flex items-center gap-2 ms-auto">
          <Button variant="ghost" size="sm" icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />} onClick={load} />
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onAdd}>
            {t.actions.add}
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && filterFields.length > 0 && (
        <div className="flex flex-wrap gap-3 px-5 py-3 bg-[#011C26]/30 border-b border-[#BFACA4]/10 shrink-0">
          {filterFields.map(field => (
            <div key={field.key} className="min-w-[160px]">
              <input
                value={fieldFilters[field.key] || ''}
                onChange={e => handleFieldFilter(field.key, e.target.value)}
                placeholder={field.label}
                className="w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40"
              />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center gap-3 text-[#4F5459]">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">{t.status.loading}</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#072A40]/60 border border-[#BFACA4]/10 flex items-center justify-center text-[#4F5459]">
              {emptyIcon || <Search size={20} />}
            </div>
            <p className="text-sm text-[#4F5459]">{t.status.noData}</p>
            <p className="text-xs text-[#4F5459]/60">{t.status.addFirst}</p>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onAdd}>
              {t.actions.add}
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[#011C26]/90 backdrop-blur-sm">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#4F5459] border-b border-[#072A40]/60 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#4F5459] border-b border-[#072A40]/60 w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#072A40]/30">
              {data.map((row, idx) => (
                <tr key={row.id} className={`hover:bg-[#072A40]/20 transition-colors group ${idx % 2 === 0 ? '' : 'bg-[#072A40]/10'}`}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-xs text-[#D9C5C1] max-w-[200px]">
                      {col.render ? col.render(row[col.key], row) : (
                        col.truncate !== false ? (
                          <span className="block truncate" title={row[col.key] || ''}>
                            {row[col.key] || <span className="text-[#4F5459] italic">—</span>}
                          </span>
                        ) : row[col.key] || <span className="text-[#4F5459] italic">—</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedRaw(row)}
                        className="p-1.5 rounded-lg text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/60 transition-colors"
                        title={t.actions.view}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onEdit?.(row)}
                        className="p-1.5 rounded-lg text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/60 transition-colors"
                        title={t.actions.edit}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 rounded-lg text-[#4F5459] hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        title={t.actions.delete}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(ps) => { setPageSize(ps); setPage(0); }}
        />
      </div>

      {/* Raw Data Viewer */}
      <RawDataViewer
        isOpen={!!selectedRaw}
        onClose={() => setSelectedRaw(null)}
        data={selectedRaw}
        title={selectedRaw?.[rowPrimaryField] || 'Record Details'}
      />
    </div>
  );
}
