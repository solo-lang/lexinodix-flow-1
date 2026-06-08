// @ts-nocheck
import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, Building2, Newspaper, BookOpen, Upload, Search, Database, Settings, ChevronLeft, ChevronRight, Microscope, Globe2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

const NAV = [
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

const SECS = {
  collection: { en: 'Data Collection', ar: 'جمع البيانات' },
  tools: { en: 'Tools', ar: 'الأدوات' },
  system: { en: 'System', ar: 'النظام' },
};

export default function Sidebar({ activePage, onNavigate }) {
  const { language, switchLanguage } = useApp();
  const { t } = useTranslation(language);
  const [collapsed, setCollapsed] = useState(false);

  let lastSec = null;

  return (
    <aside 
      className={`relative flex flex-col h-screen flex-shrink-0 transition-all duration-250 ease-in-out border-r border-border
        ${collapsed ? 'w-16' : 'w-60'} 
        bg-gradient-to-b from-[#0D2E42] via-bg-primary to-[#061F30]`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 p-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 bg-gradient-to-br from-[#1A4A6A] to-accent shadow-lg">
          <Zap size={14} className="text-white" />
        </div>
        
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="text-[11px] font-bold tracking-widest uppercase text-accent2">Lexinodix</p>
            <p className="text-[9px] font-medium tracking-widest uppercase text-text3/70">
              {t?.moduleName || 'Intelligence'}
            </p>          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
        {NAV.map(item => {
          const showSec = !collapsed && item.section && item.section !== lastSec;
          if (item.section) lastSec = item.section;
          const active = activePage === item.id;
          const Icon = item.icon;
          const label = t?.nav?.[item.id] || item.id;

          return (
            <React.Fragment key={item.id}>
              {showSec && (
                <div className="pt-3 px-2 pb-1">
                  <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-text3/50 block">
                    {SECS[item.section]?.[language] || item.section}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => onNavigate(item.id)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 relative
                  ${collapsed ? 'justify-center' : ''}
                  ${active 
                    ? 'bg-white/10 text-text border border-white/10' 
                    : 'bg-transparent text-text3/80 border border-transparent hover:bg-white/5 hover:text-accent/80'}
                `}
              >
                {active && !collapsed && (
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-accent rounded-r-full" />
                )}
                
                <Icon size={16} className={`flex-shrink-0 transition-colors ${active ? 'text-accent' : ''}`} />
                
                {!collapsed && (
                  <span className={`text-[12.5px] flex-1 text-left truncate ${active ? 'font-semibold' : 'font-normal'}`}>
                    {label}
                  </span>
                )}
                
                {active && !collapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
              </button>            </React.Fragment>
          );
        })}
      </nav>

      {/* Lang Switcher */}
      {!collapsed && (
        <div className="p-2 border-t border-border">
          <div className="flex gap-1 p-1 rounded-lg bg-black/20 border border-border/50">
            {['en', 'ar'].map(l => (
              <button
                key={l}
                onClick={() => switchLanguage(l)}
                className={`
                  flex-1 py-1 rounded-md text-[11px] font-bold tracking-widest cursor-pointer transition-all duration-150 border-none outline-none
                  ${language === l 
                    ? 'bg-white/10 text-accent2 shadow-sm' 
                    : 'bg-transparent text-text3/50 hover:text-accent/70'}
                `}
              >
                {l === 'en' ? 'EN' : 'عر'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="
          absolute top-18 -right-3 w-6 h-6 rounded-full flex items-center justify-center
          bg-[#0D2E42] border border-white/10 text-text3/70 cursor-pointer shadow-md z-10
          hover:text-accent hover:border-accent transition-colors
        "
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
