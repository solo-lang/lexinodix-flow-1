import React, { useState } from 'react';
import { Database, Copy, CheckCheck, ChevronDown, ChevronRight, Table2, Key, Link2, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SCHEMA_SQL } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';

const TABLES_SCHEMA = [
  {
    name: 'jobs',
    description: 'Market job postings and employment data',
    color: 'text-blue-300',
    bg: 'bg-blue-900/20 border-blue-700/20',
    columns: [
      { name: 'id', type: 'UUID', pk: true, description: 'Primary key, auto-generated' },
      { name: 'title', type: 'TEXT', required: true, description: 'Job title / position' },
      { name: 'company', type: 'TEXT', description: 'Company name' },
      { name: 'industry', type: 'TEXT', description: 'Industry sector' },
      { name: 'location', type: 'TEXT', description: 'Job location' },
      { name: 'salary', type: 'TEXT', description: 'Salary range or compensation' },
      { name: 'description', type: 'TEXT', description: 'Full job description' },
      { name: 'responsibilities', type: 'TEXT', description: 'Job responsibilities' },
      { name: 'requirements', type: 'TEXT', description: 'Required qualifications' },
      { name: 'source', type: 'TEXT', description: 'Source platform (LinkedIn, Indeed, etc.)' },
      { name: 'date_collected', type: 'DATE', description: 'Date the data was collected' },
      { name: 'original_url', type: 'TEXT', description: 'Original posting URL' },
      { name: 'raw_text', type: 'TEXT', description: 'Raw scraped text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Record creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Last update timestamp' },
    ],
  },
  {
    name: 'companies',
    description: 'Company intelligence registry',
    color: 'text-purple-300',
    bg: 'bg-purple-900/20 border-purple-700/20',
    columns: [
      { name: 'id', type: 'UUID', pk: true, description: 'Primary key' },
      { name: 'name', type: 'TEXT', required: true, description: 'Company name' },
      { name: 'industry', type: 'TEXT', description: 'Industry sector' },
      { name: 'website', type: 'TEXT', description: 'Company website URL' },
      { name: 'description', type: 'TEXT', description: 'Company overview' },
      { name: 'services', type: 'TEXT', description: 'Services or products' },
      { name: 'location', type: 'TEXT', description: 'Headquarters location' },
      { name: 'notes', type: 'TEXT', description: 'Internal research notes' },
      { name: 'source_url', type: 'TEXT', description: 'Data source URL' },
      { name: 'raw_text', type: 'TEXT', description: 'Raw source text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Update timestamp' },
    ],
  },
  {
    name: 'news',
    description: 'Market news and industry developments',
    color: 'text-emerald-300',
    bg: 'bg-emerald-900/20 border-emerald-700/20',
    columns: [
      { name: 'id', type: 'UUID', pk: true, description: 'Primary key' },
      { name: 'headline', type: 'TEXT', required: true, description: 'Article headline' },
      { name: 'source', type: 'TEXT', description: 'News source / publication' },
      { name: 'date', type: 'DATE', description: 'Publication date' },
      { name: 'summary', type: 'TEXT', description: 'Brief summary' },
      { name: 'full_content', type: 'TEXT', description: 'Full article content' },
      { name: 'url', type: 'TEXT', description: 'Article URL' },
      { name: 'industry', type: 'TEXT', description: 'Related industry' },
      { name: 'raw_text', type: 'TEXT', description: 'Raw scraped content' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Update timestamp' },
    ],
  },
  {
    name: 'research_notes',
    description: 'Research observations and insights',
    color: 'text-amber-300',
    bg: 'bg-amber-900/20 border-amber-700/20',
    columns: [
      { name: 'id', type: 'UUID', pk: true, description: 'Primary key' },
      { name: 'title', type: 'TEXT', required: true, description: 'Note title' },
      { name: 'category', type: 'TEXT', description: 'Research category' },
      { name: 'observation', type: 'TEXT', description: 'Detailed observation' },
      { name: 'tags', type: 'TEXT[]', description: 'Searchable tags array' },
      { name: 'date', type: 'DATE', description: 'Observation date' },
      { name: 'raw_text', type: 'TEXT', description: 'Supporting raw text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Update timestamp' },
    ],
  },
];

function TableCard({ table }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-[#BFACA4]/10 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#072A40]/40 hover:bg-[#072A40]/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${table.bg} ${table.color}`}>
            <Table2 size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">{table.name}</span>
              <Badge variant="muted" className="text-[9px]">{table.columns.length} columns</Badge>
            </div>
            <p className="text-xs text-[#4F5459]">{table.description}</p>
          </div>
        </div>
        {expanded ? <ChevronDown size={16} className="text-[#4F5459]" /> : <ChevronRight size={16} className="text-[#4F5459]" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#011C26]/60">
              <tr>
                <th className="px-4 py-2.5 text-left text-[#4F5459] font-medium text-[10px] uppercase tracking-wider border-b border-[#072A40]/40">Column</th>
                <th className="px-4 py-2.5 text-left text-[#4F5459] font-medium text-[10px] uppercase tracking-wider border-b border-[#072A40]/40">Type</th>
                <th className="px-4 py-2.5 text-left text-[#4F5459] font-medium text-[10px] uppercase tracking-wider border-b border-[#072A40]/40">Constraints</th>
                <th className="px-4 py-2.5 text-left text-[#4F5459] font-medium text-[10px] uppercase tracking-wider border-b border-[#072A40]/40">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#072A40]/20">
              {table.columns.map(col => (
                <tr key={col.name} className="hover:bg-[#072A40]/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {col.pk && <Key size={10} className="text-amber-400 shrink-0" />}
                      <span className={`font-mono font-semibold ${col.pk ? 'text-amber-300' : 'text-[#D9C5C1]'}`}>{col.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="text-emerald-300 font-mono text-[10px] bg-emerald-900/20 px-1.5 py-0.5 rounded">{col.type}</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      {col.pk && <Badge variant="warning" className="text-[9px]">PK</Badge>}
                      {col.required && <Badge variant="danger" className="text-[9px]">NOT NULL</Badge>}
                      {!col.pk && !col.required && <span className="text-[#4F5459] text-[10px]">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#4F5459]">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Schema() {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Database size={18} className="text-[#BFACA4]" />
          <h2 className="text-xl font-bold text-white">{t.schema.title}</h2>
        </div>
        <p className="text-sm text-[#4F5459]">{t.schema.subtitle}</p>
      </div>

      {/* Setup guide */}
      <div className="p-5 rounded-2xl bg-blue-900/10 border border-blue-700/20">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-2">Supabase Setup Guide</p>
            <ol className="space-y-1.5 text-xs text-blue-400/80 list-decimal list-inside">
              <li>Create a new Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">supabase.com</a></li>
              <li>Copy your Project URL and Anon Key from <strong>Project Settings → API</strong></li>
              <li>Go to <strong>Settings</strong> in this app and enter your credentials</li>
              <li>Navigate to <strong>SQL Editor</strong> in Supabase dashboard</li>
              <li>Copy the SQL below and run it to create all tables</li>
              <li>Disable Row Level Security or add policies as needed</li>
            </ol>
          </div>
        </div>
      </div>

      {/* SQL Block */}
      <div className="rounded-2xl border border-[#BFACA4]/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#072A40]/40 border-b border-[#BFACA4]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#BFACA4] uppercase tracking-wider">SQL Schema</span>
            <Badge variant="muted">PostgreSQL</Badge>
          </div>
          <Button
            variant="secondary"
            size="xs"
            icon={copied ? <CheckCheck size={13} /> : <Copy size={13} />}
            onClick={handleCopy}
          >
            {copied ? t.actions.copied : t.schema.copySQL}
          </Button>
        </div>
        <pre className="p-5 text-xs font-mono text-emerald-300 bg-[#011C26]/80 overflow-auto max-h-96 leading-relaxed">
          {SCHEMA_SQL.trim()}
        </pre>
      </div>

      {/* Table schemas */}
      <div>
        <h3 className="text-sm font-bold text-[#BFACA4] uppercase tracking-wider mb-4">Table Definitions</h3>
        <div className="space-y-3">
          {TABLES_SCHEMA.map(table => <TableCard key={table.name} table={table} />)}
        </div>
      </div>
    </div>
  );
}
