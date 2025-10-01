'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'matrix' | 'pulse';
}

/**
 * Componente de spinner de carga con estilo cyberpunk
 * Diferentes variantes y tamaños
 */
export function LoadingSpinner({ 
  size = 'md', 
  className,
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'border-[#00ff41] border-t-transparent',
    matrix: 'border-[#00ff41] border-t-transparent shadow-[0_0_10px_rgba(0,255,65,0.5)]',
    pulse: 'bg-[#00ff41] animate-pulse'
  };

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          variantClasses.pulse,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'border-2 rounded-full animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}
