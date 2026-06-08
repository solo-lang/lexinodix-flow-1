// @ts-nocheck
import React from 'react';
const V = {
  primary:   { bg:'linear-gradient(135deg,#1A4A6A,#072A40)', hbg:'linear-gradient(135deg,#1E5578,#0A3A56)', color:'#F5F7F8', border:'1px solid rgba(255,255,255,0.1)' },
  secondary: { bg:'rgba(255,255,255,0.06)', hbg:'rgba(255,255,255,0.1)',   color:'#A8B4BC', border:'1px solid rgba(255,255,255,0.1)' },
  accent:    { bg:'rgba(191,172,164,0.15)', hbg:'rgba(191,172,164,0.22)',  color:'#D9C5C1', border:'1px solid rgba(191,172,164,0.25)' },
  danger:    { bg:'rgba(239,68,68,0.1)',    hbg:'rgba(239,68,68,0.18)',    color:'#F87171', border:'1px solid rgba(239,68,68,0.2)' },
  ghost:     { bg:'transparent',           hbg:'rgba(255,255,255,0.06)',  color:'#5A7080', border:'1px solid transparent' },
  success:   { bg:'rgba(16,185,129,0.12)', hbg:'rgba(16,185,129,0.2)',    color:'#34D399', border:'1px solid rgba(16,185,129,0.2)' },
};
const S = {
  xs:{ p:'4px 10px',  fs:11, gap:4, is:11 },
  sm:{ p:'6px 14px',  fs:12, gap:5, is:13 },
  md:{ p:'8px 18px',  fs:13, gap:6, is:14 },
  lg:{ p:'11px 24px', fs:14, gap:7, is:16 },
};
export default function Button({ children, variant='secondary', size='md', icon, iconRight, loading=false, disabled=false, onClick, type='button', className='', style={}, fullWidth=false }) {
  const v = V[variant] || V.secondary;
  const s = S[size] || S.md;
  const dis = disabled || loading;
  return (
    <button type={type} onClick={onClick} disabled={dis} className={className}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:s.gap, padding:s.p, fontSize:s.fs, fontWeight:600, borderRadius:10, cursor:dis?'not-allowed':'pointer', transition:'all 0.15s', whiteSpace:'nowrap', opacity:dis?0.5:1, background:v.bg, color:v.color, border:v.border, width:fullWidth?'100%':undefined, ...style }}
      onMouseEnter={e=>{ if(!dis) e.currentTarget.style.background=v.hbg; }}
      onMouseLeave={e=>{ if(!dis) e.currentTarget.style.background=v.bg; }}
    >
      {loading ? <svg width={s.is} height={s.is} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation:'spin 0.7s linear infinite', flexShrink:0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        : icon ? React.cloneElement(icon, { size:s.is, style:{ flexShrink:0 } }) : null}
      {children}
      {!loading && iconRight && React.cloneElement(iconRight, { size:s.is, style:{ flexShrink:0 } })}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}
