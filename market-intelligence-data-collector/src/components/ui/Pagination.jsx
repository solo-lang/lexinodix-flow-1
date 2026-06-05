import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const { language, isRTL } = useApp();
  const { t } = useTranslation(language);

  const totalPages = Math.ceil(total / pageSize);
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-t border-[#BFACA4]/10">
      {/* Info */}
      <span className="text-xs text-[#4F5459]">
        {t.pagination.showing} <span className="text-[#BFACA4] font-medium">{start}–{end}</span> {t.pagination.of} <span className="text-[#BFACA4] font-medium">{total}</span> {t.pagination.records}
      </span>

      <div className="flex items-center gap-3">
        {/* Page size */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4F5459]">{t.pagination.perPage}</span>
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange?.(Number(e.target.value)); onPageChange(0); }}
            className="bg-[#011C26]/60 border border-[#072A40]/60 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#BFACA4]/40"
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-[#4F5459] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pg = i;
            if (totalPages > 5) {
              if (page <= 2) pg = i;
              else if (page >= totalPages - 3) pg = totalPages - 5 + i;
              else pg = page - 2 + i;
            }
            return (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  pg === page
                    ? 'bg-[#BFACA4] text-[#072A40]'
                    : 'text-[#4F5459] hover:text-white hover:bg-white/10'
                }`}
              >
                {pg + 1}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg text-[#4F5459] hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
