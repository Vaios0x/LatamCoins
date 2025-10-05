import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TickerBar } from '@/components/layout/TickerBar';
import MatrixRain from '@/components/effects/MatrixRain';
import { ChatBot } from '@/components/chat/ChatBot';
import { Analytics } from '@vercel/analytics/next';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'CoinLatamCap - El pulso de las crypto latinas',
  description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun.',
  keywords: 'crypto, latinoamerica, solana, pump.fun, tokens, blockchain, defi, coinlatamcap',
  authors: [{ name: 'CoinLatamCap Team' }],
  creator: 'CoinLatamCap',
  publisher: 'CoinLatamCap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://coinlatamcap.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CoinLatamCap - El pulso de las crypto latinas',
    description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun.',
    url: 'https://coinlatamcap.com',
    siteName: 'CoinLatamCap',
    images: [
      {
        url: '/images/logo/CLCl.png',
        width: 512,
        height: 512,
        alt: 'CoinLatamCap - El pulso de las crypto latinas',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoinLatamCap - El pulso de las crypto latinas',
    description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun.',
    images: ['/images/logo/CLCl.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#00ff41" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CoinLatamCap" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo/CLCl.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo/CLCl.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo/CLCl.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/logo/CLCl.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/logo/CLCl.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#0a0e27] text-white antialiased`}>
        {/* Efecto de lluvia Matrix de fondo */}
        <MatrixRain />
        
        {/* Layout principal */}
        <I18nProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <TickerBar />
            
            <main className="flex-1 w-full">
              <div className="w-full">
                {children}
              </div>
            </main>
            
            <Footer />
          </div>

          {/* Chatbot flotante */}
          <ChatBot />
        </I18nProvider>
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}