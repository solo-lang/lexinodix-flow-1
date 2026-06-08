// @ts-nocheck
import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
// Pages
import Overview from './pages/Overview';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import News from './pages/News';
import ResearchNotes from './pages/ResearchNotes';
import ImportCenter from './pages/ImportCenter';
import DataInspection from './pages/DataInspection';
import GlobalSearch from './pages/GlobalSearch';
import Schema from './pages/Schema';
import Settings from './pages/Settings';
// Layout
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Toast from './components/ui/Toast';
import ConfirmDialog from './components/ui/ConfirmDialog';

const PAGE_META = {
  overview: { en: 'Market Collection Overview', ar: 'نظرة عامة' },
  jobs: { en: 'Jobs Database', ar: 'قاعدة الوظائف', sub: 'Collect and manage job market intelligence' },
  companies: { en: 'Companies Database', ar: 'قاعدة الشركات', sub: 'Company intelligence registry' },
  news: { en: 'News Database', ar: 'قاعدة الأخبار', sub: 'Market news and industry developments' },
  notes: { en: 'Research Notes', ar: 'ملاحظات البحث', sub: 'Observations and research findings' },
  import: { en: 'Import Center', ar: 'مركز الاستيراد', sub: 'CSV · JSON · Manual entry' },
  inspection: { en: 'Data Inspection Center', ar: 'مركز الفحص', sub: 'Inspect raw collected data' },
  search: { en: 'Global Search', ar: 'البحث الشامل', sub: 'Search across all data collections' },
  schema: { en: 'Database Schema', ar: 'مخطط قاعدة البيانات', sub: 'Supabase setup and table definitions' },
  settings: { en: 'Settings', ar: 'الإعدادات', sub: 'Configure Lexinodix Market Collector' },
};

function AppInner() {
  const [activePage, setActivePage] = useState('overview');
  const { language } = useApp();
  const meta = PAGE_META[activePage] || PAGE_META.overview;
  const title = language === 'ar' ? meta.ar : meta.en;

  const renderPage = () => {
    switch (activePage) {
      case 'overview':   return <Overview onNavigate={setActivePage} />;
      case 'jobs':       return <Jobs />;
      case 'companies':  return <Companies />;
      case 'news':       return <News />;
      case 'notes':      return <ResearchNotes />;
      case 'import':     return <ImportCenter />;
      case 'inspection': return <DataInspection />;
      case 'search':     return <GlobalSearch />;
      case 'schema':     return <Schema />;
      case 'settings':   return <Settings />;
      default:           return <Overview onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} subtitle={meta.sub} onNavigate={setActivePage} />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderPage()}
        </main>
      </div>
      <Toast />
      <ConfirmDialog />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
