'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'subtle' | 'bright';
}

/**
 * Componente de tarjeta con efecto glassmorphism
 * Estilo cyberpunk con transparencias y blur
 */
export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  variant = 'default'
}: GlassCardProps) {
  const baseClasses = 'relative rounded-2xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-[#0a0e27]/70 backdrop-blur-xl border border-[#00ff41]/20',
    subtle: 'bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/10',
    bright: 'bg-[#0a0e27]/80 backdrop-blur-2xl border border-[#00ff41]/30'
  };

  const shadowClasses = {
    default: 'shadow-[0_8px_32px_0_rgba(0,255,65,0.1)] shadow-[inset_0_0_20px_rgba(0,255,65,0.05)]',
    subtle: 'shadow-[0_4px_16px_0_rgba(0,255,65,0.05)]',
    bright: 'shadow-[0_12px_40px_0_rgba(0,255,65,0.15)] shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]'
  };

  const hoverClasses = hover ? [
    'hover:-translate-y-1',
    'hover:shadow-[0_12px_40px_0_rgba(0,255,65,0.15)]',
    'hover:border-[#00ff41]/40',
    'hover:shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]'
  ] : [];

  const glowClasses = glow ? [
    'shadow-[0_0_20px_rgba(0,255,65,0.3)]',
    'border-[#00ff41]/50'
  ] : [];

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        shadowClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
    >
      {children}
    </div>
  );
}
