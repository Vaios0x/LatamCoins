import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TickerBar } from '@/components/layout/TickerBar';
import MatrixRain from '@/components/effects/MatrixRain';
import { ChatBot } from '@/components/chat/ChatBot';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'LATAMCOINS - El pulso de las crypto latinas',
  description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun. El futuro de las crypto latinas.',
  keywords: 'crypto, latinoamerica, solana, pump.fun, tokens, blockchain, defi',
  authors: [{ name: 'LATAMCOINS Team' }],
  creator: 'LATAMCOINS',
  publisher: 'LATAMCOINS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://latamcoins.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LATAMCOINS - El pulso de las crypto latinas',
    description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun.',
    url: 'https://latamcoins.com',
    siteName: 'LATAMCOINS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LATAMCOINS - El pulso de las crypto latinas',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LATAMCOINS - El pulso de las crypto latinas',
    description: 'Tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun.',
    images: ['/og-image.png'],
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
        <meta name="apple-mobile-web-app-title" content="LATAMCOINS" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icon-192x192.svg" />
      </head>
      <body className={`${inter.className} bg-[#0a0e27] text-white antialiased`}>
        {/* Efecto de lluvia Matrix de fondo */}
        <MatrixRain />
        
        {/* Layout principal */}
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
      </body>
    </html>
  );
}