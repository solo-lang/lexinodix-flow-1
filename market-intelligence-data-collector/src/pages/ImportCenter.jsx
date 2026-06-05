import React, { useState, useRef } from 'react';
import {
  Upload, FileText, Code2, PenLine, ChevronDown, ChevronRight,
  CheckCircle2, AlertCircle, Download, RefreshCw, Table2, X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Input, Select, Textarea } from '../components/ui/Input';
import { JobsDB, CompaniesDB, NewsDB, NotesDB } from '../lib/db';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import Papa from 'papaparse';

const TABLES = [
  { id: 'jobs', label: 'Jobs Database', db: JobsDB },
  { id: 'companies', label: 'Companies Database', db: CompaniesDB },
  { id: 'news', label: 'News Database', db: NewsDB },
  { id: 'notes', label: 'Research Notes', db: NotesDB },
];

const TABLE_FIELDS = {
  jobs: ['title', 'company', 'industry', 'location', 'salary', 'description', 'responsibilities', 'requirements', 'source', 'date_collected', 'original_url', 'raw_text'],
  companies: ['name', 'industry', 'website', 'description', 'services', 'location', 'notes', 'source_url', 'raw_text'],
  news: ['headline', 'source', 'date', 'summary', 'full_content', 'url', 'industry', 'raw_text'],
  notes: ['title', 'category', 'observation', 'tags', 'date', 'raw_text'],
};

const CSV_TEMPLATES = {
  jobs: 'title,company,industry,location,salary,description,responsibilities,requirements,source,date_collected,original_url\nSenior Developer,TechCorp,Technology,Dubai,AED 25000,Job description here,Responsibilities here,Requirements here,LinkedIn,2024-01-15,https://example.com',
  companies: 'name,industry,website,description,services,location,notes,source_url\nAcme Corp,Technology,https://acme.com,Company description,Service offerings,Dubai,,https://source.com',
  news: 'headline,source,date,summary,full_content,url,industry\nMarket Update Q1,Bloomberg,2024-01-15,Brief summary,Full content here,https://example.com,Finance',
  notes: 'title,category,observation,tags,date\nKey Market Insight,Market Trend,Detailed observation,"tag1,tag2",2024-01-15',
};

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-[#072A40] text-[#D9C5C1] border border-[#BFACA4]/20'
          : 'text-[#4F5459] hover:text-[#BFACA4] hover:bg-[#072A40]/30'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ImportResult({ result }) {
  if (!result) return null;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${
      result.error
        ? 'bg-red-900/20 border-red-700/30'
        : 'bg-emerald-900/20 border-emerald-700/30'
    }`}>
      {result.error
        ? <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
        : <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
      }
      <div>
        <p className={`text-sm font-semibold ${result.error ? 'text-red-300' : 'text-emerald-300'}`}>
          {result.error ? 'Import Failed' : 'Import Successful'}
        </p>
        <p className={`text-xs mt-0.5 ${result.error ? 'text-red-400/70' : 'text-emerald-400/70'}`}>
          {result.error || `${result.count} records imported successfully`}
        </p>
      </div>
    </div>
  );
}

// ─── CSV Import ───────────────────────────────────────────────────────────────

function CSVImport({ onImported }) {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const [targetTable, setTargetTable] = useState('jobs');
  const [preview, setPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const parseFile = (file) => {
    setResult(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setPreview({ data: res.data, headers: res.meta.fields || [] }),
      error: (err) => setResult({ error: err.message }),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  const handleImport = async () => {
    if (!preview?.data?.length) return;
    setImporting(true);
    const db = TABLES.find(t => t.id === targetTable)?.db;
    if (!db) { setResult({ error: 'Invalid table selected' }); setImporting(false); return; }
    const res = await db.bulkInsert(preview.data);
    setImporting(false);
    if (res.error) setResult({ error: res.error.message || 'Import failed' });
    else {
      setResult({ count: res.count });
      setPreview(null);
      onImported?.();
    }
  };

  const downloadTemplate = () => {
    const csv = CSV_TEMPLATES[targetTable] || '';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lexinodix_${targetTable}_template.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Target table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={t.import.selectTarget}
          value={targetTable}
          onChange={e => { setTargetTable(e.target.value); setPreview(null); setResult(null); }}
        >
          {TABLES.map(tb => <option key={tb.id} value={tb.id}>{tb.label}</option>)}
        </Select>
        <div className="flex items-end">
          <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={downloadTemplate}>
            {t.import.downloadTemplate}
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3 h-40
          rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${dragOver ? 'border-[#BFACA4]/60 bg-[#072A40]/40' : 'border-[#072A40]/60 bg-[#011C26]/30 hover:border-[#BFACA4]/30 hover:bg-[#072A40]/20'}
        `}
      >
        <Upload size={24} className={`transition-colors ${dragOver ? 'text-[#BFACA4]' : 'text-[#4F5459]'}`} />
        <div className="text-center">
          <p className="text-sm text-[#BFACA4]">{t.import.dragDrop}</p>
          <p className="text-xs text-[#4F5459] mt-0.5">{t.import.orClick} · CSV files only</p>
        </div>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Preview */}
      {preview && (
        <div className="rounded-2xl border border-[#BFACA4]/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#072A40]/40 border-b border-[#BFACA4]/10">
            <div className="flex items-center gap-2">
              <Table2 size={14} className="text-[#BFACA4]" />
              <span className="text-sm font-medium text-white">{t.import.preview}</span>
              <Badge variant="accent">{preview.data.length} rows</Badge>
            </div>
            <button onClick={() => setPreview(null)} className="text-[#4F5459] hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-xs">
              <thead className="bg-[#011C26]/60 sticky top-0">
                <tr>
                  {preview.headers.map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[#4F5459] font-medium whitespace-nowrap border-b border-[#072A40]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#072A40]/20">
                {preview.data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-[#072A40]/20">
                    {preview.headers.map(h => (
                      <td key={h} className="px-3 py-2 text-[#D9C5C1] truncate max-w-[150px]" title={row[h]}>
                        {row[h] || <span className="text-[#4F5459]">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                {preview.data.length > 5 && (
                  <tr>
                    <td colSpan={preview.headers.length} className="px-3 py-2 text-center text-[#4F5459] text-[10px]">
                      + {preview.data.length - 5} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#BFACA4]/10 flex justify-end">
            <Button variant="primary" size="sm" loading={importing} icon={<Upload size={14} />} onClick={handleImport}>
              {importing ? t.import.importing : `Import ${preview.data.length} Records`}
            </Button>
          </div>
        </div>
      )}

      <ImportResult result={result} />
    </div>
  );
}

// ─── JSON Import ──────────────────────────────────────────────────────────────

function JSONImport({ onImported }) {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [targetTable, setTargetTable] = useState('jobs');
  const [jsonText, setJsonText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleParse = () => {
    setParseError('');
    setResult(null);
    try {
      const data = JSON.parse(jsonText);
      const arr = Array.isArray(data) ? data : [data];
      setParsed(arr);
    } catch (e) {
      setParseError('Invalid JSON: ' + e.message);
      setParsed(null);
    }
  };

  const handleImport = async () => {
    if (!parsed?.length) return;
    setImporting(true);
    const db = TABLES.find(tb => tb.id === targetTable)?.db;
    if (!db) { setResult({ error: 'Invalid table' }); setImporting(false); return; }
    const res = await db.bulkInsert(parsed);
    setImporting(false);
    if (res.error) setResult({ error: res.error.message });
    else { setResult({ count: res.count }); setJsonText(''); setParsed(null); onImported?.(); }
  };

  return (
    <div className="space-y-5">
      <Select
        label={t.import.selectTarget}
        value={targetTable}
        onChange={e => { setTargetTable(e.target.value); setParsed(null); setResult(null); }}
      >
        {TABLES.map(tb => <option key={tb.id} value={tb.id}>{tb.label}</option>)}
      </Select>

      <div>
        <label className="text-xs font-semibold text-[#BFACA4] uppercase tracking-wider block mb-1.5">
          JSON Data (Array or Object)
        </label>
        <textarea
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          rows={10}
          placeholder={`[\n  {\n    "title": "Senior Developer",\n    "company": "TechCorp",\n    "industry": "Technology"\n  }\n]`}
          className="w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-xl px-4 py-3 text-xs text-emerald-300 font-mono placeholder-[#4F5459] focus:outline-none focus:border-[#BFACA4]/40 resize-y"
        />
        {parseError && <p className="text-xs text-red-400 mt-1">{parseError}</p>}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="sm" icon={<Code2 size={14} />} onClick={handleParse}>
          Parse JSON
        </Button>
        {parsed && (
          <Button variant="primary" size="sm" loading={importing} icon={<Upload size={14} />} onClick={handleImport}>
            {importing ? t.import.importing : `Import ${parsed.length} Records`}
          </Button>
        )}
        {parsed && (
          <Badge variant="success" className="self-center">{parsed.length} records ready</Badge>
        )}
      </div>

      <ImportResult result={result} />
    </div>
  );
}

// ─── Manual Entry ─────────────────────────────────────────────────────────────

function ManualEntry({ onImported }) {
  const { language, showToast } = useApp();
  const { t } = useTranslation(language);
  const [targetTable, setTargetTable] = useState('jobs');
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const fields = TABLE_FIELDS[targetTable] || [];
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const db = TABLES.find(tb => tb.id === targetTable)?.db;
    const res = await db.insert(form);
    setSaving(false);
    if (res.error) setResult({ error: res.error.message });
    else { setResult({ count: 1 }); setForm({}); onImported?.(); }
  };

  return (
    <div className="space-y-5">
      <Select
        label={t.import.selectTarget}
        value={targetTable}
        onChange={e => { setTargetTable(e.target.value); setForm({}); setResult(null); }}
      >
        {TABLES.map(tb => <option key={tb.id} value={tb.id}>{tb.label}</option>)}
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          field === 'description' || field === 'observation' || field === 'full_content' || field === 'raw_text' || field === 'responsibilities' || field === 'requirements' || field === 'summary' ? (
            <div key={field} className={field === 'raw_text' ? 'md:col-span-2' : ''}>
              <Textarea
                label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={form[field] || ''}
                onChange={e => set(field, e.target.value)}
                rows={field === 'raw_text' ? 4 : 3}
              />
            </div>
          ) : (
            <Input
              key={field}
              label={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={form[field] || ''}
              onChange={e => set(field, e.target.value)}
              type={field.includes('date') ? 'date' : field === 'url' || field === 'website' || field.includes('url') ? 'url' : 'text'}
            />
          )
        ))}
      </div>

      <Button variant="primary" size="sm" loading={saving} icon={<PenLine size={14} />} onClick={handleSave}>
        {saving ? t.status.saving : 'Save Record'}
      </Button>

      <ImportResult result={result} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ImportCenter() {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('csv');
  const [importCount, setImportCount] = useState(0);

  const onImported = () => setImportCount(c => c + 1);

  const tabs = [
    { id: 'csv', label: t.import.csv, icon: <FileText size={15} /> },
    { id: 'json', label: t.import.json, icon: <Code2 size={15} /> },
    { id: 'manual', label: t.import.manual, icon: <PenLine size={15} /> },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Upload size={18} className="text-[#BFACA4]" />
          <h2 className="text-xl font-bold text-white">{t.import.title}</h2>
          {importCount > 0 && <Badge variant="success">{importCount} imports done</Badge>}
        </div>
        <p className="text-sm text-[#4F5459]">{t.import.subtitle}</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-6 p-1.5 rounded-2xl bg-[#011C26]/60 border border-[#072A40]/60">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#072A40]/30 border border-[#BFACA4]/10 rounded-2xl p-6">
        {activeTab === 'csv' && <CSVImport onImported={onImported} />}
        {activeTab === 'json' && <JSONImport onImported={onImported} />}
        {activeTab === 'manual' && <ManualEntry onImported={onImported} />}
      </div>
    </div>
  );
}
