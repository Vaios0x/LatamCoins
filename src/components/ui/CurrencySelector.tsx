'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { 
  getExchangeRates, 
  getSelectedCurrency, 
  setSelectedCurrency, 
  formatPrice,
  type ExchangeRate 
} from '@/lib/services/exchangeRates';

interface CurrencySelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CurrencySelector({ 
  className = '', 
  showLabel = true,
  size = 'md'
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrencyState] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsLoading(true);
        const savedCurrency = getSelectedCurrency();
        setSelectedCurrencyState(savedCurrency);
        
        const response = await getExchangeRates();
        if (response.success) {
          setExchangeRates(response.data);
        }
      } catch (error) {
        console.error('Error loading exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrencyState(currency);
    setSelectedCurrency(currency);
    setIsOpen(false);
    
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency, rates: exchangeRates } 
    }));
  };

  const selectedCurrencyInfo = exchangeRates.find(r => r.code === selectedCurrency);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && <span className="text-white/60">Moneda:</span>}
        <div className="flex items-center space-x-1 bg-white/10 rounded-lg px-3 py-2">
          <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-white/60 text-sm mb-1">
          Moneda
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 bg-white/10 hover:bg-white/20 
          border border-white/20 rounded-lg transition-all duration-300
          ${sizeClasses[size]}
          ${isOpen ? 'ring-2 ring-[#00ff41]/50' : ''}
        `}
      >
        <Globe className="w-4 h-4 text-[#00ff41]" />
        <span className="text-white font-medium">
          {selectedCurrencyInfo?.flag} {selectedCurrency}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0e27]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            {exchangeRates.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`
                  w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200
                  ${selectedCurrency === currency.code 
                    ? 'bg-[#00ff41]/20 text-[#00ff41]' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{currency.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-white/60">{currency.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">
                    {currency.symbol}1 = ${(1 / currency.rate).toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-white/10 p-2 text-xs text-white/40 text-center">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook para usar la moneda seleccionada
 */
export function useCurrency(): {
  selectedCurrency: string;
  exchangeRates: ExchangeRate[];
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
} {
  const [selectedCurrency, setSelectedCurrencyState] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const savedCurrency = getSelectedCurrency();
      setSelectedCurrencyState(savedCurrency);
      
      const response = await getExchangeRates();
      if (response.success) {
        setExchangeRates(response.data);
      }
    };

    loadData();

    // Escuchar cambios de moneda
    const handleCurrencyChange = (event: CustomEvent) => {
      setSelectedCurrencyState(event.detail.currency);
      setExchangeRates(event.detail.rates);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const convertPrice = (priceUSD: number) => {
    if (selectedCurrency === 'USD') return priceUSD;
    
    const rate = exchangeRates.find(r => r.code === selectedCurrency);
    if (!rate) return priceUSD;
    
    return priceUSD * rate.rate;
  };

  const formatPrice = (priceUSD: number) => {
    const convertedPrice = convertPrice(priceUSD);
    const currencyInfo = exchangeRates.find(r => r.code === selectedCurrency);
    
    if (!currencyInfo) return `$${priceUSD.toFixed(8)}`;
    
    const { symbol } = currencyInfo;
    
    if (convertedPrice >= 1) {
      return `${symbol}${convertedPrice.toFixed(2)}`;
    } else if (convertedPrice >= 0.01) {
      return `${symbol}${convertedPrice.toFixed(4)}`;
    } else {
      return `${symbol}${convertedPrice.toFixed(8)}`;
    }
  };

  return {
    selectedCurrency,
    exchangeRates,
    convertPrice,
    formatPrice
  } as const;
}
