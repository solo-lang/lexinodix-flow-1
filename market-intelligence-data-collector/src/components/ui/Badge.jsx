// @ts-nocheck
const V = {
  default: { background:'rgba(255,255,255,0.07)', color:'#A8B4BC', border:'1px solid rgba(255,255,255,0.08)' },
  accent:  { background:'rgba(191,172,164,0.12)', color:'#D9C5C1', border:'1px solid rgba(191,172,164,0.2)' },
  success: { background:'rgba(16,185,129,0.1)',   color:'#34D399', border:'1px solid rgba(16,185,129,0.2)' },
  warning: { background:'rgba(245,158,11,0.1)',   color:'#FBBF24', border:'1px solid rgba(245,158,11,0.2)' },
  danger:  { background:'rgba(239,68,68,0.1)',    color:'#F87171', border:'1px solid rgba(239,68,68,0.2)' },
  info:    { background:'rgba(59,130,246,0.1)',   color:'#60A5FA', border:'1px solid rgba(59,130,246,0.2)' },
  muted:   { background:'rgba(255,255,255,0.04)', color:'#5A7080', border:'1px solid rgba(255,255,255,0.06)' },
};
export default function Badge({ children, variant = 'default', className = '', style = {} }) {
  const s = V[variant] || V.default;
  return <span className={`badge-base ${className}`} style={{ ...s, ...style }}>{children}</span>;
}
