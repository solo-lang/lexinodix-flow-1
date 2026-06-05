import React from 'react';

const variants = {
  primary: 'bg-[#072A40] hover:bg-[#0a3a57] text-white border border-[#072A40]',
  secondary: 'bg-transparent hover:bg-[#072A40]/10 text-[#072A40] border border-[#072A40]/30',
  danger: 'bg-red-600/90 hover:bg-red-700 text-white border border-red-700',
  ghost: 'bg-transparent hover:bg-[#BFACA4]/20 text-[#4F5459] border border-transparent',
  accent: 'bg-[#BFACA4] hover:bg-[#D9C5C1] text-[#072A40] border border-[#BFACA4]',
  outline: 'bg-transparent hover:bg-white/5 text-[#D9C5C1] border border-[#BFACA4]/40',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  loading,
  icon,
  iconRight,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#072A40]/30 focus:ring-offset-1
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
