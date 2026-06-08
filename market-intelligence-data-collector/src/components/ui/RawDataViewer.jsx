// @ts-nocheck
import React, { useState } from 'react';
import { Copy, CheckCheck, Code2, Table2, FileText, ExternalLink } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch {} };
  return (
    <button onClick={copy} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:6, fontSize:11, fontWeight:600, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:done?'#34D399':'#A8B4BC', cursor:'pointer' }}>
      {done ? <CheckCheck size={11}/> : <Copy size={11}/>} {done ? 'Copied!' : 'Copy'}
    </button>
  );
}

function highlight(json) {
  return json
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"([^"]+)":/g,'<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g,': <span class="json-string">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g,': <span class="json-number">$1</span>')
    .replace(/: (true|false)/g,': <span class="json-bool">$1</span>')
    .replace(/: (null)/g,': <span class="json-null">$1</span>');
}

function JsonView({ data }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', top:10, right:10, zIndex:1 }}><CopyBtn text={json}/></div>
      <pre style={{ background:'#050F16', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:16, overflowX:'auto', maxHeight:460, fontSize:12, lineHeight:1.65, fontFamily:'monospace' }}
        dangerouslySetInnerHTML={{ __html: highlight(json) }} />
    </div>
  );
}

function TableView({ data }) {
  const rows = Object.entries(data).filter(([k]) => k !== 'raw_text');
  return (
    <div style={{ borderRadius:12, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <tbody>
          {rows.map(([k,v], i) => (
            <tr key={k} style={{ borderBottom: i < rows.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <td style={{ padding:'9px 14px', width:'30%', background:'rgba(5,15,22,0.6)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'#5A7080', whiteSpace:'nowrap' }}>
                {k.replace(/_/g,' ')}
              </td>
              <td style={{ padding:'9px 14px', fontSize:12, color:'#D9C5C1', wordBreak:'break-all', fontFamily:'monospace' }}>
                {v === null || v === undefined
                  ? <em style={{ color:'#3D5A6A' }}>null</em>
                  : typeof v === 'object'
                    ? <span style={{ color:'#7EB8D4' }}>{JSON.stringify(v)}</span>
                    : String(v) || <em style={{ color:'#3D5A6A' }}>empty</em>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RawText({ text }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', top:10, right:10, zIndex:1 }}><CopyBtn text={text||''}/></div>
      <pre style={{ background:'#050F16', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:16, fontSize:12, lineHeight:1.7, fontFamily:'monospace', color:'#A8B4BC', overflowX:'auto', maxHeight:460, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
        {text || <em style={{ color:'#3D5A6A' }}>No raw text available</em>}
      </pre>
    </div>
  );
}

export default function RawDataViewer({ isOpen, onClose, data, title }) {
  const [tab, setTab] = useState('structured');
  const { language } = useApp();
  const { t } = useTranslation(language);
  if (!data) return null;

  const raw = data.raw_text || data.full_content || data.description || data.observation;
  const url = data.original_url || data.url || data.source_url || data.website;
  const tabs = [
    { id:'structured', label:'Structured', icon:<Table2 size={12}/> },
    { id:'json',       label:'JSON',       icon:<Code2 size={12}/> },
    { id:'raw',        label:'Raw Text',   icon:<FileText size={12}/> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Record Inspector'} size="xl">

      {/* Meta strip */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:16, padding:'10px 14px', borderRadius:10, background:'rgba(5,15,22,0.6)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <Badge variant="muted" style={{ fontSize:10 }}>ID: {String(data.id||'').slice(0,8)}…</Badge>
        {data.created_at && <Badge variant="muted" style={{ fontSize:10 }}>{new Date(data.created_at).toLocaleString()}</Badge>}
        {data.source && <Badge variant="accent" style={{ fontSize:10 }}>{data.source}</Badge>}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, color:'#BFACA4', textDecoration:'none' }}>
            <ExternalLink size={11}/> Open Source
          </a>
        )}
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:4, marginBottom:16, padding:4, borderRadius:10, background:'rgba(5,15,22,0.6)', border:'1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', transition:'all 0.15s', background:tab===tb.id?'rgba(255,255,255,0.08)':'transparent', color:tab===tb.id?'#D9C5C1':'#5A7080', border:tab===tb.id?'1px solid rgba(191,172,164,0.15)':'1px solid transparent' }}>
            {tb.icon}{tb.label}
          </button>
        ))}
      </div>

      {tab === 'structured' && <TableView data={data}/>}
      {tab === 'json'       && <JsonView data={data}/>}
      {tab === 'raw'        && <RawText text={raw}/>}
    </Modal>
  );
}
