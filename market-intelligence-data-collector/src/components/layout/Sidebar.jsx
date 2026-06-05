import React, { useState } from 'react';
import {
  LayoutDashboard, Briefcase, Building2, Newspaper, BookOpen,
  Upload, Search, Database, Settings, ChevronLeft, ChevronRight,
  Microscope, Globe2, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

const NAV_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, section: null },
  { id: 'jobs', icon: Briefcase, section: 'collection' },
  { id: 'companies', icon: Building2, section: 'collection' },
  { id: 'news', icon: Newspaper, section: 'collection' },
  { id: 'notes', icon: BookOpen, section: 'collection' },
  { id: 'import', icon: Upload, section: 'tools' },
  { id: 'inspection', icon: Microscope, section: 'tools' },
  { id: 'search', icon: Globe2, section: 'tools' },
  { id: 'schema', icon: Database, section: 'system' },
  { id: 'settings', icon: Settings, section: 'system' },
];

const SECTIONS = {
  collection: { en: 'Data Collection', ar: 'جمع البيانات' },
  tools: { en: 'Tools', ar: 'الأدوات' },
  system: { en: 'System', ar: 'النظام' },
};

export default function Sidebar({ activePage, onNavigate }) {
  const { language, isRTL, switchLanguage } = useApp();
  const { t } = useTranslation(language);
  const [collapsed, setCollapsed] = useState(false);

  let lastSection = null;

  return (
    <aside className={`
      relative flex flex-col shrink-0 h-screen
      bg-[#011C26] border-r border-[#072A40]/80
      transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#072A40]/60 ${collapsed ? 'justify-center' : ''}`}>
        <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#072A40] to-[#BFACA4]/30 border border-[#BFACA4]/30 flex items-center justify-center">
          <Zap size={15} className="text-[#D9C5C1]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#BFACA4] uppercase tracking-[0.15em] leading-tight truncate">
              Lexinodix
            </p>
            <p className="text-[9px] text-[#4F5459] uppercase tracking-widest truncate">
              {t.moduleName}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const showSectionLabel = !collapsed && item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          const isActive = activePage === item.id;
          const Icon = item.icon;
          const label = t.nav[item.id] || item.id;

          return (
            <React.Fragment key={item.id}>
              {showSectionLabel && (
                <div className="px-3 pt-4 pb-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#4F5459]">
                    {SECTIONS[item.section]?.[language] || item.section}
                  </span>
                </div>
              )}
              <button
                onClick={() => onNavigate(item.id)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  transition-all duration-150 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-[#072A40] text-[#D9C5C1] shadow-sm border border-[#BFACA4]/10'
                    : 'text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/40'
                  }
                `}
              >
                <Icon size={17} className={`shrink-0 transition-colors ${isActive ? 'text-[#BFACA4]' : 'text-[#4F5459] group-hover:text-[#BFACA4]'}`} />
                {!collapsed && (
                  <span className="truncate font-medium text-xs">{label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ms-auto w-1.5 h-1.5 rounded-full bg-[#BFACA4] shrink-0" />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Language switcher */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-[#072A40]/60">
          <div className="flex gap-1 p-1 rounded-xl bg-[#072A40]/40 border border-[#BFACA4]/10">
            {['en', 'ar'].map(lang => (
              <button
                key={lang}
                onClick={() => switchLanguage(lang)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  language === lang
                    ? 'bg-[#072A40] text-[#D9C5C1] shadow-sm'
                    : 'text-[#4F5459] hover:text-[#BFACA4]'
                }`}
              >
                {lang === 'en' ? 'EN' : 'عر'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className={`
          absolute top-[72px] -right-3 z-10
          w-6 h-6 rounded-full bg-[#011C26] border border-[#072A40]/80
          flex items-center justify-center
          text-[#4F5459] hover:text-[#BFACA4] transition-colors
          shadow-md
        `}
      >
        {collapsed
          ? (isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />)
          : (isRTL ? <ChevronRight size={12} /> : <ChevronLeft size={12} />)
        }
      </button>
    </aside>
  );
}
