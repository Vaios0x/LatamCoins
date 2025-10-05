'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { CurrencySelector } from '@/components/ui/CurrencySelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useI18n } from '@/lib/i18n';

/**
 * Footer de CoinLatamCap
 * Enlaces y información de la plataforma
 */
export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: t('footer.about'), href: '/about' },
      { name: t('footer.terms'), href: '/terms' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.contact'), href: '/contact' },
    ],
    resources: [
      { name: t('footer.docs'), href: '/docs' },
      { name: t('footer.api'), href: '/api' },
      { name: t('footer.support'), href: '/support' },
      { name: t('footer.status'), href: '/status' },
    ],
    social: [
      { name: 'X (Twitter)', href: 'https://x.com/coinlatamcap', external: true },
      { name: 'Discord', href: 'https://discord.gg/coinlatamcap', external: true },
      { name: 'GitHub', href: 'https://github.com/coinlatamcap', external: true },
    ]
  };

  return (
    <footer className="relative w-full bg-[#0a0e27]/90 backdrop-blur-xl border-t border-[#00ff41]/20 mt-12 sm:mt-16 md:mt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo y descripción */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo/CLCl.png"
                alt="CoinLatamCap Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
                priority
              />
              <h2 className="text-2xl font-bold text-white">
                CoinLatamCap
              </h2>
            </div>
            <p className="text-white/70 mb-6 max-w-lg text-sm sm:text-base leading-relaxed">
              {t('app.description')}
            </p>
            
            {/* Selector de Moneda */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <LanguageSelector size="md" showLabel={true} />
                <CurrencySelector size="md" showLabel={true} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-white/60">
              <span className="font-medium">{t('footer.powered_by')}</span>
              <div className="flex items-center space-x-4">
                <Link 
                  href="https://pump.fun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00ff41] hover:text-[#00ff41]/80 transition-colors duration-300 flex items-center space-x-2 hover:scale-105 transform"
                  aria-label="Visitar Pump.fun"
                >
                  <span className="font-medium">Pump.fun</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <span className="text-white/40">&</span>
                <Link 
                  href="https://solana.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00ff41] hover:text-[#00ff41]/80 transition-colors duration-300 flex items-center space-x-2 hover:scale-105 transform"
                  aria-label="Visitar Solana"
                >
                  <span className="font-medium">Solana</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Fruta Power */}
            <div className="mt-4 flex items-center space-x-2 text-sm text-white/60">
              <span className="font-medium">Let&apos;s Fruta Build</span>
              <span className="text-[#ff6b35] font-semibold flex items-center space-x-1">
                <span>🍒</span>
                <span>Fruta Power</span>
                <span>🍉</span>
              </span>
            </div>
          </div>

          {/* Enlaces de plataforma */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">{t('footer.platform')}</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#00ff41] transition-colors duration-300 text-sm block py-1 hover:translate-x-1 transform"
                    aria-label={`Ir a ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces de recursos */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">{t('footer.resources')}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#00ff41] transition-colors duration-300 text-sm block py-1 hover:translate-x-1 transform"
                    aria-label={`Ir a ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sección de enlistado de tokens */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">{t('listing.title')}</h3>
            <div className="space-y-4">
              <p className="text-white/70 text-sm leading-relaxed">
                {t('listing.subtitle')}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-white/90 font-medium text-sm">{t('listing.requirements')}</h4>
                <ul className="space-y-1 text-xs text-white/60">
                  <li>{t('listing.requirement1')}</li>
                  <li>{t('listing.requirement2')}</li>
                  <li>{t('listing.requirement3')}</li>
                  <li>{t('listing.requirement4')}</li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href={`mailto:${t('listing.email')}?subject=${encodeURIComponent(t('listing.contact'))}&body=${encodeURIComponent(t('listing.description'))}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 hover:border-[#00ff41]/70 text-[#00ff41] text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 transform"
                  aria-label={t('listing.contact')}
                >
                  <span>🚀</span>
                  <span>{t('listing.contact')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-[#00ff41]/20 my-8" />

        {/* Copyright y enlaces sociales */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="text-white/60 text-sm text-center lg:text-left">
            © {currentYear} CoinLatamCap. {t('footer.rights')}
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Made by Vaiossx */}
            <Link
              href="https://x.com/vaiossx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#00ff41] transition-colors duration-300 flex items-center space-x-2 text-sm hover:scale-105 transform"
              aria-label="Visitar perfil de Vaiossx en X"
            >
              <span>Made by Vaiossx</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            
            {footerLinks.social.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-white/60 hover:text-[#00ff41] transition-colors duration-300 flex items-center space-x-2 text-sm hover:scale-105 transform"
                aria-label={`Visitar ${link.name}`}
              >
                <span>{link.name}</span>
                {link.external && <ExternalLink className="w-4 h-4" />}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-1 h-1 bg-[#00ff41]/30 rounded-full animate-pulse" />
        <div className="absolute top-8 right-8 w-1 h-1 bg-[#00ff41]/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-[#00ff41]/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-8 right-1/4 w-1 h-1 bg-[#00ff41]/25 rounded-full animate-pulse delay-3000" />
      </div>
    </footer>
  );
}
