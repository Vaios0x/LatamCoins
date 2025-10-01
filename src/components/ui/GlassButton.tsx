'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
}

/**
 * Componente de botón con efecto glassmorphism
 * Estilo cyberpunk con transparencias y efectos de hover
 */
export function GlassButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  disabled,
  ...props 
}: GlassButtonProps) {
  const baseClasses = [
    'relative overflow-hidden',
    'font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:hover:transform-none disabled:hover:shadow-none'
  ];

  const variantClasses = {
    primary: [
      'bg-[rgba(0,255,65,0.1)] border border-[#00ff41]/30',
      'text-[#00ff41] hover:bg-[rgba(0,255,65,0.2)]',
      'hover:border-[#00ff41]/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]'
    ],
    secondary: [
      'bg-[rgba(168,85,247,0.1)] border border-[#a855f7]/30',
      'text-[#a855f7] hover:bg-[rgba(168,85,247,0.2)]',
      'hover:border-[#a855f7]/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
    ],
    ghost: [
      'bg-transparent border border-[#00ff41]/20',
      'text-[#00ff41] hover:bg-[rgba(0,255,65,0.1)]',
      'hover:border-[#00ff41]/40'
    ],
    danger: [
      'bg-[rgba(255,0,64,0.1)] border border-[#ff0040]/30',
      'text-[#ff0040] hover:bg-[rgba(255,0,64,0.2)]',
      'hover:border-[#ff0040]/60 hover:shadow-[0_0_20px_rgba(255,0,64,0.3)]'
    ]
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-2xl'
  };

  const glowClasses = glow ? [
    'shadow-[0_0_20px_rgba(0,255,65,0.4)]',
    'border-[#00ff41]/60'
  ] : [];

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        'hover:-translate-y-0.5',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Efecto de barrido en hover */}
      <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
}
