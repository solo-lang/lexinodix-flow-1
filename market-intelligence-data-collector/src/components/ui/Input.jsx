import React from 'react';

export function Input({ label, error, helper, className = '', icon, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#BFACA4] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#4F5459]">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-lg
            px-3 py-2.5 text-sm text-white placeholder-[#4F5459]
            focus:outline-none focus:border-[#BFACA4]/60 focus:ring-1 focus:ring-[#BFACA4]/30
            transition-colors duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-red-500/60' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-[#4F5459]">{helper}</p>}
    </div>
  );
}

export function Textarea({ label, error, helper, className = '', rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#BFACA4] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        {...props}
        rows={rows}
        className={`
          w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-lg
          px-3 py-2.5 text-sm text-white placeholder-[#4F5459] resize-y
          focus:outline-none focus:border-[#BFACA4]/60 focus:ring-1 focus:ring-[#BFACA4]/30
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/60' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-[#4F5459]">{helper}</p>}
    </div>
  );
}

export function Select({ label, error, helper, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[#BFACA4] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full bg-[#011C26]/60 border border-[#072A40]/60 rounded-lg
          px-3 py-2.5 text-sm text-white
          focus:outline-none focus:border-[#BFACA4]/60 focus:ring-1 focus:ring-[#BFACA4]/30
          transition-colors duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/60' : ''}
          ${className}
        `}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
