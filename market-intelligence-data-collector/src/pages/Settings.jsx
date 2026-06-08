// @ts-nocheck
import React, { useState } from 'react';
import { Database, Globe, Save, AlertCircle, CheckCircle2, Eye, EyeOff, RefreshCw, Trash2, Info, Shield } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../lib/i18n';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Settings() {
  const { language, switchLanguage, showToast } = useApp();
  const { t } = useTranslation(language);
  const configured = isSupabaseConfigured();

  const [url,     setUrl]     = useState(() => localStorage.getItem('lexinodix_supabase_url')  || import.meta.env.VITE_SUPABASE_URL     || '');
  const [key,     setKey]     = useState(() => localStorage.getItem('lexinodix_supabase_key')  || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [showKey, setShowKey] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [testing, setTesting] = useState(false);
  const [testRes, setTestRes] = useState(null);

  const TABLES = ['jobs','companies','news','research_notes'];
  const LABELS = { jobs:'Jobs', companies:'Companies', news:'News', research_notes:'Research Notes' };

  const getLocalSizes = () => TABLES.map(k => {
    try { return { key:k, count: JSON.parse(localStorage.getItem(`lexinodix_${k}`)||'[]').length }; }
    catch { return { key:k, count:0 }; }
  });
  const [localSizes, setLocalSizes] = useState(getLocalSizes);

  const save = async () => {
    setSaving(true);
    localStorage.setItem('lexinodix_supabase_url', url);
    localStorage.setItem('lexinodix_supabase_key', key);
    await new Promise(r => setTimeout(r, 400));
    setSaving(false);
    showToast?.('Settings saved â€” refresh page to apply', 'success');
  };

  const test = async () => {
    if (!url || !key) { setTestRes({ ok:false, msg:'Fill in URL and Key first.' }); return; }
    setTesting(true); setTestRes(null);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { error } = await createClient(url, key).from('jobs').select('id').limit(1);
      if (error) throw error;
      setTestRes({ ok:true, msg:'Connection successful!' });
    } catch(e) { setTestRes({ ok:false, msg: e.message || 'Connection failed.' }); }
    setTesting(false);
  };

  const clearTable = (k) => { localStorage.removeItem(`lexinodix_${k}`); setLocalSizes(getLocalSizes()); showToast?.(`Cleared ${k}`, 'success'); };
  const clearAll   = ()  => { TABLES.forEach(k => localStorage.removeItem(`lexinodix_${k}`)); setLocalSizes(getLocalSizes()); showToast?.('All local data cleared', 'success'); };

  const card = { background:'#173D55', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:20, marginBottom:0 };
  const label = { display:'block', fontSize:11, fontWeight:600, color:'#5A7080', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 };

  return (
    <div className="page-content" style={{ maxWidth:680, margin:'0 auto' }}>

      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'#F5F7F8' }}>Settings</h2>
        <p style={{ fontSize:12, color:'#5A7080', marginTop:3 }}>Configure database and interface preferences</p>
      </div>

      {/* Status Banner */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:14, background:configured?'rgba(16,185,129,0.08)':'rgba(245,158,11,0.08)', border:configured?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(245,158,11,0.2)' }}>
        <div style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:configured?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)' }}>
          {configured ? <CheckCircle2 size={16} style={{ color:'#34D399' }}/> : <AlertCircle size={16} style={{ color:'#FBBF24' }}/>}
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:700, color:configured?'#34D399':'#FBBF24', marginBottom:4 }}>
            {configured ? 'ðŸŸ¢ Supabase Connected' : 'ðŸŸ¡ Local Mode â€” No Database'}
          </p>
          <p style={{ fontSize:12, color:configured?'rgba(52,211,153,0.65)':'rgba(251,191,36,0.65)', lineHeight:1.55 }}>
            {configured
              ? 'Data persists in your Supabase cloud database across sessions and devices.'
              : 'Data saved in this browser only. Add Supabase credentials below for persistent cloud storage.'}
          </p>
        </div>
        <Badge variant={configured?'success':'warning'}>{configured?'Cloud':'Local'}</Badge>
      </div>

      {/* Supabase Config */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'rgba(191,172,164,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Database size={14} style={{ color:'#BFACA4' }}/>
          </div>
          <h3 style={{ fontSize:13, fontWeight:700, color:'#F5F7F8' }}>Supabase Configuration</h3>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={label}>Project URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" className="field-base"/>
            <p style={{ fontSize:11, color:'#3D5A6A', marginTop:5 }}>Dashboard â†’ Project Settings â†’ API</p>
          </div>
          <div>
            <label style={label}>Anon / Public Key</label>
            <div style={{ position:'relative' }}>
              <input type={showKey?'text':'password'} value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbGciâ€¦" className="field-base" style={{ paddingRight:38 }}/>
              <button onClick={() => setShowKey(s => !s)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#5A7080', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                {showKey ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
            <p style={{ fontSize:11, color:'#3D5A6A', marginTop:5 }}>Use the anon/public key â€” never service_role</p>
          </div>

          {testRes && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', borderRadius:10, fontSize:12, background:testRes.ok?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)', border:testRes.ok?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(239,68,68,0.2)', color:testRes.ok?'#34D399':'#F87171' }}>
              {testRes.ok ? <CheckCircle2 size={13} style={{ marginTop:1, flexShrink:0 }}/> : <AlertCircle size={13} style={{ marginTop:1, flexShrink:0 }}/>}
              {testRes.msg}
            </div>
          )}

          <div style={{ display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" loading={testing} icon={<RefreshCw size={12}/>} onClick={test}>Test Connection</Button>
            <Button variant="primary"   size="sm" loading={saving}  icon={<Save size={12}/>}      onClick={save}>Save Settings</Button>
          </div>

          <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <Info size={12} style={{ color:'#5A7080', marginTop:1, flexShrink:0 }}/>
            <p style={{ fontSize:11, color:'#5A7080', lineHeight:1.6 }}>
              After saving, refresh the page to apply. You can also set{' '}
              <code style={{ background:'rgba(255,255,255,0.07)', padding:'1px 5px', borderRadius:4, color:'#A8B4BC', fontSize:10 }}>VITE_SUPABASE_URL</code> and{' '}
              <code style={{ background:'rgba(255,255,255,0.07)', padding:'1px 5px', borderRadius:4, color:'#A8B4BC', fontSize:10 }}>VITE_SUPABASE_ANON_KEY</code> in your{' '}
              <code style={{ background:'rgba(255,255,255,0.07)', padding:'1px 5px', borderRadius:4, color:'#A8B4BC', fontSize:10 }}>.env</code> file.
            </p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'rgba(191,172,164,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Globe size={14} style={{ color:'#BFACA4' }}/>
          </div>
          <h3 style={{ fontSize:13, fontWeight:700, color:'#F5F7F8' }}>Interface Language</h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[{ id:'en', label:'English', sub:'LTR Layout' }, { id:'ar', label:'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©', sub:'RTL Layout' }].map(l => (
            <button key={l.id} onClick={() => switchLanguage(l.id)}
              style={{ padding:'16px', borderRadius:12, textAlign:'center', cursor:'pointer', transition:'all 0.2s', background:language===l.id?'rgba(191,172,164,0.12)':'transparent', border:language===l.id?'1px solid rgba(191,172,164,0.3)':'1px solid rgba(255,255,255,0.06)', color:language===l.id?'#D9C5C1':'#5A7080' }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{l.label}</div>
              <div style={{ fontSize:10, opacity:0.6 }}>{l.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Local Storage */}
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'rgba(191,172,164,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={14} style={{ color:'#BFACA4' }}/>
            </div>
            <h3 style={{ fontSize:13, fontWeight:700, color:'#F5F7F8' }}>Local Storage</h3>
          </div>
          <Button variant="danger" size="xs" icon={<Trash2 size={11}/>} onClick={clearAll}>Clear All</Button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {localSizes.map(({ key: k, count }) => (
            <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:10, background:'rgba(5,15,22,0.5)', border:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#F5F7F8' }}>{LABELS[k]}</span>
                <Badge variant={count>0?'accent':'muted'}>{count} records</Badge>
              </div>
              {count > 0 && (
                <button onClick={() => clearTable(k)} style={{ fontSize:11, color:'#F87171', background:'none', border:'none', cursor:'pointer' }}>Clear</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* App info */}
      <div style={{ ...card, padding:'16px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, textAlign:'center' }}>
          {[['Platform','Lexinodix IE'],['Module','Market Collector'],['Version','1.0.0'],['Build','Module 1 of 5'],['Storage',configured?'Supabase':'LocalStorage'],['Language',language==='ar'?'Arabic (RTL)':'English (LTR)']].map(([l,v]) => (
            <div key={l}>
              <p style={{ fontSize:9, color:'#3D5A6A', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>{l}</p>
              <p style={{ fontSize:12, fontWeight:700, color:'#D9C5C1' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
