'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { CurrencySelector } from '@/components/ui/CurrencySelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useI18n } from '@/lib/i18n';

/**
 * Header principal de CoinLatamCap
 * Logo con efecto neón y navegación
 */
export function Header() {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.markets'), href: '/markets' },
    { name: t('nav.analytics'), href: '/analytics' },
    { name: t('nav.status'), href: '/status' },
    { name: t('nav.about'), href: '/about' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <header className="relative z-50 w-full bg-[#0a0e27]/80 backdrop-blur-xl border-b border-[#00ff41]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center h-14 sm:h-16 md:h-18">
          {/* Logo CoinLatamCap */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <div className="relative">
              <Image
                src="/images/logo/CLCl.png"
                alt="CoinLatamCap Logo"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                priority
              />
            </div>
            <div className="relative">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                CoinLatamCap
              </h1>
            </div>
          </Link>

          {/* Espaciador central */}
          <div className="flex-1" />

          {/* Navegación - Desktop */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 flex-shrink-0">
            {isClient && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-[#00ff41] transition-colors duration-300 font-medium text-sm lg:text-base"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Espaciador entre navegación y selectores */}
          <div className="hidden md:block w-6" />

          {/* Selectores - Desktop/Tablet */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <LanguageSelector size="sm" showLabel={false} />
            <CurrencySelector size="sm" showLabel={false} />
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1 sm:p-2 text-white hover:text-[#00ff41] transition-colors duration-300"
            aria-label={t('menu.open')}
            tabIndex={0}
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0a0e27]/90 backdrop-blur-xl rounded-xl border border-[#00ff41]/20 mt-2">

              {/* Selectores - Móvil */}
              <div className="mb-3 sm:mb-4 flex items-center gap-3">
                <LanguageSelector size="sm" showLabel={true} />
                <CurrencySelector size="sm" showLabel={true} />
              </div>

              {/* Navegación móvil */}
              {isClient && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-2 sm:px-3 py-2 sm:py-2.5 text-white/80 hover:text-[#00ff41] hover:bg-[#00ff41]/10 rounded-lg transition-all duration-300 text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                  tabIndex={0}
                  aria-label={`Ir a ${item.name}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
