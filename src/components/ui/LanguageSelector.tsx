'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LanguageSelector({ className = '', showLabel = true, size = 'md' }: LanguageSelectorProps) {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 min-w-[90px]',
    md: 'text-sm px-3 py-2 min-w-[110px]',
    lg: 'text-base px-4 py-3 min-w-[130px]'
  } as const;

  const label = t('language.label');

  return (
    <div className={cn('relative', className)}>
      {showLabel && (
        <label className="block text-white/60 text-sm mb-1">{label}</label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300',
          isOpen && 'ring-2 ring-[#00ff41]/50',
          sizeClasses[size]
        )}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">{locale === 'en' ? '🇺🇸' : '🇪🇸'}</span>
          <span className="text-white font-medium truncate">
            {locale === 'en' ? t('language.en') : t('language.es')}
          </span>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-white/60 transition-transform flex-shrink-0', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-[#0a0e27]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden"
        >
          <li>
            <button
              role="option"
              aria-selected={locale === 'es'}
              onClick={() => { setLocale('es'); setIsOpen(false); }}
              className={cn('w-full flex items-center p-3 transition-all duration-200',
                locale === 'es' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'hover:bg-white/10 text-white/80 hover:text-white')}
            >
              <span className="text-xl mr-3">🇪🇸</span>
              <span>{t('language.es')}</span>
            </button>
          </li>
          <li>
            <button
              role="option"
              aria-selected={locale === 'en'}
              onClick={() => { setLocale('en'); setIsOpen(false); }}
              className={cn('w-full flex items-center p-3 transition-all duration-200',
                locale === 'en' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'hover:bg-white/10 text-white/80 hover:text-white')}
            >
              <span className="text-xl mr-3">🇺🇸</span>
              <span>{t('language.en')}</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;


