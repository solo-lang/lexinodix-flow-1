import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" />,
    info: <Info size={16} className="text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-[#072A40] border ${borders[toast.type] || 'border-[#BFACA4]/20'}
        shadow-2xl text-sm text-white max-w-sm
      `}>
        {icons[toast.type] || icons.info}
        <span className="flex-1">{toast.message}</span>
      </div>
    </div>
  );
}
