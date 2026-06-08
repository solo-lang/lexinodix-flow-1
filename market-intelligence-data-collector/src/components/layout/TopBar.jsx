// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Search, Database, AlertCircle, CheckCircle2, X, Briefcase, Building2, Newspaper, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';
import { isSupabaseConfigured } from '../../lib/supabase';
import { globalSearch } from '../../lib/db';

const ICONS = { jobs:Briefcase, companies:Building2, news:Newspaper, notes:BookOpen };

export default function TopBar({ title, subtitle, onNavigate }) {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const ref   = useRef(null);
  const timer = useRef(null);
  const configured = isSupabaseConfigured();

  const doSearch = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    if (!val || val.length < 2) { setResults(null); setOpen(false); return; }
    setLoading(true); setOpen(true);
    timer.current = setTimeout(async () => {
      const r = await globalSearch(val);
      setResults(r); setLoading(false);
    }, 350);
  };

  const clear = () => { setQuery(''); setResults(null); setOpen(false); };

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const total = results ? Object.values(results).reduce((s,a) => s + a.length, 0) : 0;

  return (
    <header style={{ height:60, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0, background:'rgba(7,42,64,0.6)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>

      {/* Title */}
      <div style={{ flex:1, minWidth:0, marginRight:16 }}>
        <h1 style={{ fontSize:15, fontWeight:700, color:'#F5F7F8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</h1>
        {subtitle && <p style={{ fontSize:11, color:'#5A7080', marginTop:1 }}>{subtitle}</p>}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>

        {/* Search */}
        <div ref={ref} style={{ position:'relative' }}>
          <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <Search size={13} style={{ position:'absolute', left:10, color:'#5A7080', pointerEvents:'none' }} />
            <input value={query} onChange={e => doSearch(e.target.value)} onFocus={() => query.length >= 2 && setOpen(true)}
              placeholder="Quick search…"
              style={{ width:210, padding:'7px 32px 7px 30px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, fontSize:12, color:'#F5F7F8', outline:'none' }}
              onFocus={e => { e.target.style.background='rgba(255,255,255,0.08)'; e.target.style.borderColor='rgba(191,172,164,0.3)'; }}
              onBlur={e  => { e.target.style.background='rgba(255,255,255,0.05)'; e.target.style.borderColor='rgba(255,255,255,0.09)'; }}
            />
            {query && <button onClick={clear} style={{ position:'absolute', right:8, color:'#5A7080', background:'none', border:'none', cursor:'pointer', display:'flex' }}><X size={12}/></button>}
          </div>

          {/* Dropdown */}
          {open && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, width:300, background:'#123247', border:'1px solid rgba(191,172,164,0.18)', borderRadius:14, boxShadow:'0 16px 48px rgba(0,0,0,0.5)', zIndex:200, overflow:'hidden' }}>
              {loading ? (
                <p style={{ padding:'14px 16px', fontSize:12, color:'#5A7080', textAlign:'center' }}>Searching…</p>
              ) : total === 0 ? (
                <p style={{ padding:'14px 16px', fontSize:12, color:'#5A7080', textAlign:'center' }}>No results for "{query}"</p>
              ) : (
                <>
                  <div style={{ maxHeight:280, overflowY:'auto' }}>
                    {Object.entries(results || {}).map(([sec, items]) =>
                      items.length === 0 ? null : (
                        <div key={sec}>
                          <div style={{ padding:'8px 14px 4px', display:'flex', alignItems:'center', gap:5 }}>
                            {React.createElement(ICONS[sec] || Database, { size:10, style:{ color:'#BFACA4' } })}
                            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#3D5A6A' }}>
                              {t?.nav?.[sec] || sec} ({items.length})
                            </span>
                          </div>
                          {items.map(item => (
                            <button key={item.id} onClick={() => { onNavigate?.(sec); setOpen(false); clear(); }}
                              style={{ width:'100%', padding:'7px 14px', display:'block', background:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}
                              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                              onMouseLeave={e => e.currentTarget.style.background='transparent'}
                            >
                              <p style={{ fontSize:12, fontWeight:500, color:'#F5F7F8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {item.title || item.name || item.headline || '—'}
                              </p>
                              <p style={{ fontSize:11, color:'#5A7080', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {item.industry || item.source || item.category || item.location || ''}
                              </p>
                            </button>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                  <button onClick={() => { onNavigate?.('search'); setOpen(false); clear(); }}
                    style={{ width:'100%', padding:'10px 14px', fontSize:11, color:'#BFACA4', borderTop:'1px solid rgba(255,255,255,0.06)', textAlign:'center', background:'transparent', border:'none', cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    View all {total} results →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:8, fontSize:11, fontWeight:600, background:configured?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)', border:configured?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(245,158,11,0.2)', color:configured?'#34D399':'#FBBF24' }}>
          <Database size={11} />
          {configured ? <CheckCircle2 size={11}/> : <AlertCircle size={11}/>}
          <span style={{ fontSize:10 }}>{configured ? 'Cloud' : 'Local'}</span>
        </div>
      </div>
    </header>
  );
}
