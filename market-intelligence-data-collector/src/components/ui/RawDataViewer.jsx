import React, { useState } from 'react';
import { Copy, CheckCheck, Code2, Table2, ExternalLink, FileText } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const { language } = useApp();
  const { t } = useTranslation(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Button variant="ghost" size="xs" onClick={handleCopy}
      icon={copied ? <CheckCheck size={13} /> : <Copy size={13} />}>
      {copied ? t.actions.copied : t.actions.copy}
    </Button>
  );
}

function JsonView({ data }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={json} />
      </div>
      <pre className="bg-[#011C26] border border-[#072A40]/80 rounded-xl p-4 text-xs text-emerald-300 font-mono overflow-auto max-h-[500px] leading-relaxed">
        {json}
      </pre>
    </div>
  );
}

function TableView({ data }) {
  const entries = Object.entries(data).filter(([k]) => !['raw_text'].includes(k));
  return (
    <div className="rounded-xl border border-[#072A40]/80 overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-[#072A40]/40 last:border-0">
              <td className="px-4 py-2.5 text-[#BFACA4] font-medium text-xs uppercase tracking-wider w-1/3 bg-[#011C26]/40">
                {key.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-2.5 text-white text-xs font-mono break-all">
                {value === null || value === undefined ? (
                  <span className="text-[#4F5459] italic">null</span>
                ) : typeof value === 'object' ? (
                  <span className="text-emerald-300">{JSON.stringify(value)}</span>
                ) : String(value) || (
                  <span className="text-[#4F5459] italic">empty</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RawTextView({ text }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={text || ''} />
      </div>
      <pre className="bg-[#011C26] border border-[#072A40]/80 rounded-xl p-4 text-xs text-[#D9C5C1] font-mono overflow-auto max-h-[500px] leading-relaxed whitespace-pre-wrap">
        {text || <span className="text-[#4F5459] italic">No raw text available</span>}
      </pre>
    </div>
  );
}

export default function RawDataViewer({ isOpen, onClose, data, title }) {
  const [tab, setTab] = useState('structured');
  const { language } = useApp();
  const { t } = useTranslation(language);

  if (!data) return null;

  const tabs = [
    { id: 'structured', label: t.inspection.structuredData, icon: <Table2 size={14} /> },
    { id: 'json', label: t.inspection.jsonView, icon: <Code2 size={14} /> },
    { id: 'raw', label: t.inspection.rawData, icon: <FileText size={14} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || t.inspection.title} size="xl">
      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl bg-[#011C26]/60 border border-[#072A40]/40">
        <Badge variant="muted">ID: {String(data.id).slice(0, 8)}...</Badge>
        {data.created_at && (
          <Badge variant="muted">{t.fields.createdAt}: {new Date(data.created_at).toLocaleString()}</Badge>
        )}
        {data.source && <Badge variant="accent">{t.fields.source}: {data.source}</Badge>}
        {(data.original_url || data.url || data.source_url) && (
          <a
            href={data.original_url || data.url || data.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#BFACA4] hover:text-white transition-colors"
          >
            <ExternalLink size={12} />
            {t.inspection.originalSource}
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[#011C26]/60 border border-[#072A40]/40">
        {tabs.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
              tab === tb.id
                ? 'bg-[#072A40] text-[#D9C5C1] shadow-sm'
                : 'text-[#4F5459] hover:text-[#BFACA4]'
            }`}
          >
            {tb.icon}
            {tb.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {tab === 'structured' && <TableView data={data} />}
        {tab === 'json' && <JsonView data={data} />}
        {tab === 'raw' && <RawTextView text={data.raw_text || data.full_content || data.description || data.observation} />}
      </div>
    </Modal>
  );
}
