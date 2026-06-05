import React, { useState, useEffect } from 'react';
import { Settings2, Database, Globe, Save, AlertCircle, CheckCircle2, Eye, EyeOff, RefreshCw, Trash2, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Settings() {
  const { language, switchLanguage, showToast } = useApp();
  const { t } = useTranslation(language);
  const configured = isSupabaseConfigured();

  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('lexinodix_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('lexinodix_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const localDataSizes = () => {
    const keys = ['jobs', 'companies', 'news', 'research_notes'];
    return keys.map(k => {
      const raw = localStorage.getItem(`lexinodix_${k}`);
      const count = raw ? JSON.parse(raw).length : 0;
      return { key: k, count };
    });
  };

  const [localSizes, setLocalSizes] = useState(localDataSizes());

  const handleSave = async () => {
    setSaving(true);
    localStorage.setItem('lexinodix_supabase_url', supabaseUrl);
    localStorage.setItem('lexinodix_supabase_key', supabaseKey);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    showToast('Settings saved. Please refresh the page to apply changes.');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await client.from('jobs').select('id').limit(1);
      if (error) throw error;
      setTestResult({ success: true, message: 'Connection successful! Tables are accessible.' });
    } catch (e) {
      setTestResult({ success: false, message: e.message || 'Connection failed' });
    }
    setTesting(false);
  };

  const clearLocalData = (key) => {
    localStorage.removeItem(`lexinodix_${key}`);
    setLocalSizes(localDataSizes());
    showToast(`Cleared ${key} local data`);
  };

  const clearAllLocal = () => {
    ['jobs', 'companies', 'news', 'research_notes'].forEach(k => localStorage.removeItem(`lexinodix_${k}`));
    setLocalSizes(localDataSizes());
    showToast('All local data cleared');
  };

  const TABLE_LABELS = { jobs: 'Jobs', companies: 'Companies', news: 'News', research_notes: 'Research Notes' };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Settings2 size={18} className="text-[#BFACA4]" />
          <h2 className="text-xl font-bold text-white">{t.settings.title}</h2>
        </div>
        <p className="text-sm text-[#4F5459]">{t.settings.subtitle}</p>
      </div>

      {/* Connection status */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${
        configured
          ? 'bg-emerald-900/20 border-emerald-700/30'
          : 'bg-amber-900/20 border-amber-700/30'
      }`}>
        {configured
          ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
          : <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        }
        <div>
          <p className={`text-sm font-semibold ${configured ? 'text-emerald-300' : 'text-amber-300'}`}>
            {configured ? t.settings.connectedMode : t.settings.localMode}
          </p>
          <p className={`text-xs mt-0.5 ${configured ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
            {configured
              ? 'Data is being stored in your Supabase database.'
              : t.settings.localModeDesc
            }
          </p>
        </div>
      </div>

      {/* Supabase config */}
      <section className="p-5 rounded-2xl bg-[#072A40]/40 border border-[#BFACA4]/10 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Database size={15} className="text-[#BFACA4]" />
          <h3 className="text-sm font-bold text-white">Supabase Configuration</h3>
        </div>

        <Input
          label={t.settings.supabaseUrl}
          value={supabaseUrl}
          onChange={e => setSupabaseUrl(e.target.value)}
          placeholder="https://your-project.supabase.co"
          helper="Found in: Supabase Dashboard → Project Settings → API"
        />

        <div className="relative">
          <Input
            label={t.settings.supabaseKey}
            type={showKey ? 'text' : 'password'}
            value={supabaseKey}
            onChange={e => setSupabaseKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            helper="Use the anon/public key (not service_role)"
          />
          <button
            onClick={() => setShowKey(s => !s)}
            className="absolute right-3 top-7 text-[#4F5459] hover:text-[#BFACA4] transition-colors"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {testResult && (
          <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
            testResult.success ? 'bg-emerald-900/20 border-emerald-700/30 text-emerald-300' : 'bg-red-900/20 border-red-700/30 text-red-300'
          }`}>
            {testResult.success ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" /> : <AlertCircle size={13} className="mt-0.5 shrink-0" />}
            {testResult.message}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" loading={testing} icon={<RefreshCw size={13} />} onClick={handleTest}>
            Test Connection
          </Button>
          <Button variant="primary" size="sm" loading={saving} icon={<Save size={13} />} onClick={handleSave}>
            {t.settings.save}
          </Button>
        </div>

        <div className="p-3 rounded-xl bg-blue-900/10 border border-blue-700/20 flex items-start gap-2">
          <Info size={13} className="text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-400/80">
            After saving, refresh the page for changes to take effect. You can also set{' '}
            <code className="font-mono text-blue-300 bg-blue-900/30 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-blue-300 bg-blue-900/30 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono text-blue-300 bg-blue-900/30 px-1 rounded">.env</code> file.
          </p>
        </div>
      </section>

      {/* Language */}
      <section className="p-5 rounded-2xl bg-[#072A40]/40 border border-[#BFACA4]/10 space-y-4">
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-[#BFACA4]" />
          <h3 className="text-sm font-bold text-white">Interface Language</h3>
        </div>
        <div className="flex gap-3">
          {[
            { id: 'en', label: 'English', sub: 'LTR' },
            { id: 'ar', label: 'العربية', sub: 'RTL' },
          ].map(lang => (
            <button
              key={lang.id}
              onClick={() => switchLanguage(lang.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-xl border transition-all ${
                language === lang.id
                  ? 'bg-[#072A40] border-[#BFACA4]/40 text-[#D9C5C1]'
                  : 'bg-transparent border-[#072A40]/60 text-[#4F5459] hover:border-[#BFACA4]/20 hover:text-[#BFACA4]'
              }`}
            >
              <span className="text-base font-bold">{lang.label}</span>
              <span className="text-[10px] opacity-60">{lang.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Local Storage */}
      <section className="p-5 rounded-2xl bg-[#072A40]/40 border border-[#BFACA4]/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={15} className="text-[#BFACA4]" />
            <h3 className="text-sm font-bold text-white">Local Storage</h3>
          </div>
          <Button variant="danger" size="xs" icon={<Trash2 size={12} />} onClick={clearAllLocal}>
            Clear All
          </Button>
        </div>
        <div className="space-y-2">
          {localSizes.map(({ key, count }) => (
            <div key={key} className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#011C26]/40 border border-[#072A40]/40">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-medium">{TABLE_LABELS[key]}</span>
                <Badge variant={count > 0 ? 'accent' : 'muted'}>{count} records</Badge>
              </div>
              {count > 0 && (
                <button onClick={() => clearLocalData(key)} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                  Clear
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-[#4F5459]">
          Local storage data is only available in this browser. Connect Supabase for persistent, multi-device storage.
        </p>
      </section>

      {/* App Info */}
      <section className="p-5 rounded-2xl bg-[#072A40]/40 border border-[#BFACA4]/10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: 'Platform', value: 'Lexinodix IE' },
            { label: 'Module', value: 'Market Collector' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Build', value: 'Module 1 of 5' },
            { label: 'Storage', value: configured ? 'Supabase' : 'LocalStorage' },
            { label: 'Direction', value: language === 'ar' ? 'RTL (Arabic)' : 'LTR (English)' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-[#4F5459] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-semibold text-[#D9C5C1]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
