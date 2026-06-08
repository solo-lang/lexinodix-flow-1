// @ts-nocheck
import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, Building2, Newspaper, BookOpen, Upload, Search, Database, Settings, ChevronLeft, ChevronRight, Microscope, Globe2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../lib/i18n';

const NAV = [
  { id:'overview',   icon:LayoutDashboard, section:null },
  { id:'jobs',       icon:Briefcase,       section:'collection' },
  { id:'companies',  icon:Building2,       section:'collection' },
  { id:'news',       icon:Newspaper,       section:'collection' },
  { id:'notes',      icon:BookOpen,        section:'collection' },
  { id:'import',     icon:Upload,          section:'tools' },
  { id:'inspection', icon:Microscope,      section:'tools' },
  { id:'search',     icon:Globe2,          section:'tools' },
  { id:'schema',     icon:Database,        section:'system' },
  { id:'settings',   icon:Settings,        section:'system' },
];
const SECS = {
  collection:{ en:'Data Collection', ar:'جمع البيانات' },
  tools:     { en:'Tools',           ar:'الأدوات' },
  system:    { en:'System',          ar:'النظام' },
};

export default function Sidebar({ activePage, onNavigate }) {
  const { language, switchLanguage } = useApp();
  const { t } = useTranslation(language);
  const [collapsed, setCollapsed] = useState(false);
  let lastSec = null;

  return (
    <aside style={{ width:collapsed?64:240, display:'flex', flexDirection:'column', height:'100vh', flexShrink:0, transition:'width 0.25s', background:'linear-gradient(180deg,#0D2E42 0%,#072A40 60%,#061F30 100%)', borderRight:'1px solid rgba(255,255,255,0.07)', position:'relative' }}>

      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'18px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', justifyContent:collapsed?'center':undefined }}>
        <div style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'linear-gradient(135deg,#1A4A6A,#BFACA4)', boxShadow:'0 2px 12px rgba(0,0,0,0.4)' }}>
          <Zap size={15} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ minWidth:0, lineHeight:1.25 }}>
            <p style={{ fontSize:11, fontWeight:800, color:'#D9C5C1', letterSpacing:'0.14em', textTransform:'uppercase' }}>Lexinodix</p>
            <p style={{ fontSize:9,  fontWeight:500, color:'#3D5A6A', letterSpacing:'0.12em', textTransform:'uppercase' }}>{t?.moduleName || 'Intelligence'}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'10px 8px', display:'flex', flexDirection:'column', gap:1 }}>
        {NAV.map(item => {
          const showSec = !collapsed && item.section && item.section !== lastSec;
          if (item.section) lastSec = item.section;
          const active = activePage === item.id;
          const Icon = item.icon;
          const label = t?.nav?.[item.id] || item.id;
          return (
            <React.Fragment key={item.id}>
              {showSec && (
                <div style={{ padding:'14px 10px 4px' }}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#2D4A5A' }}>
                    {SECS[item.section]?.[language] || item.section}
                  </span>
                </div>
              )}
              <button onClick={() => onNavigate(item.id)} title={collapsed ? label : undefined}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:10, cursor:'pointer', transition:'all 0.15s', position:'relative', justifyContent:collapsed?'center':undefined, background:active?'rgba(255,255,255,0.08)':'transparent', color:active?'#F5F7F8':'#4A6878', border:active?'1px solid rgba(191,172,164,0.12)':'1px solid transparent' }}
                onMouseEnter={e=>{ if(!active){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#8FA8B8';} }}
                onMouseLeave={e=>{ if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#4A6878';} }}
              >
                {active && <span className="nav-active-bar" />}
                <Icon size={15} style={{ flexShrink:0, color:active?'#BFACA4':'inherit' }} />
                {!collapsed && <span style={{ fontSize:12.5, fontWeight:active?600:400, flex:1, textAlign:'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>}
                {active && !collapsed && <span style={{ width:5, height:5, borderRadius:'50%', background:'#BFACA4', flexShrink:0 }} />}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Lang switcher */}
      {!collapsed && (
        <div style={{ padding:'8px 10px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', gap:4, padding:4, borderRadius:10, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.06)' }}>
            {['en','ar'].map(l => (
              <button key={l} onClick={() => switchLanguage(l)}
                style={{ flex:1, padding:'6px 0', borderRadius:7, fontSize:11, fontWeight:700, letterSpacing:'0.1em', cursor:'pointer', transition:'all 0.15s', background:language===l?'rgba(255,255,255,0.1)':'transparent', color:language===l?'#D9C5C1':'#3D5A6A', border:'none' }}>
                {l === 'en' ? 'EN' : 'عر'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(c => !c)}
        style={{ position:'absolute', top:72, right:-12, width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'#0D2E42', border:'1px solid rgba(255,255,255,0.1)', color:'#4A6878', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.4)', zIndex:10 }}
        onMouseEnter={e => e.currentTarget.style.color='#BFACA4'}
        onMouseLeave={e => e.currentTarget.style.color='#4A6878'}
      >
        {collapsed ? <ChevronRight size={12}/> : <ChevronLeft size={12}/>}
      </button>
    </aside>
  );
}
