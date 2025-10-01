'use client';

import { cn } from '@/lib/utils';

interface PriceChangeProps {
  change: number;
  className?: string;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente para mostrar cambios de precio con colores
 * Verde para subidas, rojo para bajadas
 */
export function PriceChange({ 
  change, 
  className,
  showSign = true,
  size = 'md'
}: PriceChangeProps) {
  const isPositive = change >= 0;
  const isNeutral = change === 0;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const colorClasses = isNeutral 
    ? 'text-white' 
    : isPositive 
      ? 'text-[#00ff41]' 
      : 'text-[#ff0040]';

  const formatChange = (value: number) => {
    const sign = showSign && value !== 0 ? (value > 0 ? '+' : '') : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <span
      className={cn(
        'font-mono font-medium transition-colors duration-300',
        sizeClasses[size],
        colorClasses,
        isPositive && 'animate-pulse',
        className
      )}
    >
      {formatChange(change)}
    </span>
  );
}
