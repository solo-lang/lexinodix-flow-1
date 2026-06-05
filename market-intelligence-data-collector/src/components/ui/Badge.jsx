import React from 'react';

const variants = {
  default: 'bg-[#072A40] text-[#D9C5C1] border-[#BFACA4]/20',
  accent: 'bg-[#BFACA4]/20 text-[#D9C5C1] border-[#BFACA4]/30',
  success: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30',
  warning: 'bg-amber-900/40 text-amber-300 border-amber-700/30',
  danger: 'bg-red-900/40 text-red-300 border-red-700/30',
  info: 'bg-blue-900/40 text-blue-300 border-blue-700/30',
  muted: 'bg-[#4F5459]/30 text-[#BFACA4] border-[#4F5459]/30',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5
      text-xs font-medium rounded-md border
      ${variants[variant] || variants.default}
      ${className}
    `}>
      {children}
    </span>
  );
}
