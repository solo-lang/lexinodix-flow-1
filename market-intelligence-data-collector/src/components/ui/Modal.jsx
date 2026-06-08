// @ts-nocheck
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
const SIZES = { sm:'480px', md:'600px', lg:'720px', xl:'880px', full:'95vw' };
export default function Modal({ isOpen, onClose, title, children, size='md', footer }) {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(1,28,38,0.85)', backdropFilter:'blur(8px)', animation:'fadeIn 0.15s ease' }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:SIZES[size]||SIZES.md, maxHeight:'90vh', display:'flex', flexDirection:'column', background:'#123247', border:'1px solid rgba(191,172,164,0.15)', borderRadius:18, boxShadow:'0 24px 80px rgba(0,0,0,0.6)', animation:'scaleIn 0.18s ease' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:'#F5F7F8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</h2>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', color:'#5A7080', cursor:'pointer', transition:'all 0.15s', flexShrink:0 }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='#F5F7F8';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#5A7080';}}>
            <X size={14} />
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:20 }}>{children}</div>
        {footer && <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'flex-end', gap:8, flexShrink:0 }}>{footer}</div>}
      </div>
    </div>
  );
}
