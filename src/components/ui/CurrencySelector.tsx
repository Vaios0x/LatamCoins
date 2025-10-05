'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  getExchangeRates, 
  getSelectedCurrency, 
  setSelectedCurrency, 
  type ExchangeRate 
} from '@/lib/services/exchangeRates';
import { useI18n } from '@/lib/i18n';

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
  const { t, locale } = useI18n();
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
    sm: 'text-xs px-2 py-1 min-w-[80px]',
    md: 'text-sm px-3 py-2 min-w-[100px]',
    lg: 'text-base px-4 py-3 min-w-[120px]'
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && <span className="text-white/60">{t('currency.label')}:</span>}
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
          {t('currency.label')}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between bg-white/10 hover:bg-white/20 
          border border-white/20 rounded-lg transition-all duration-300
          ${sizeClasses[size]}
          ${isOpen ? 'ring-2 ring-[#00ff41]/50' : ''}
        `}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">{selectedCurrencyInfo?.flag}</span>
          <span className="text-white font-medium truncate">
            {selectedCurrency}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0e27]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto min-w-full sm:min-w-[250px]">
          <div className="p-2">
            {exchangeRates.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-200
                  ${selectedCurrency === currency.code 
                    ? 'bg-[#00ff41]/20 text-[#00ff41]' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-xl flex-shrink-0">{currency.flag}</span>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium truncate">{currency.code}</div>
                    <div className="text-xs text-white/60 truncate">{currency.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-white/10 p-2 text-xs text-white/40 text-center">
            {t('currency.last_update')}: {new Date().toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-ES')}
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
  formatLargeNumber: (numberUSD: number) => string;
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

  const formatLargeNumber = (numberUSD: number) => {
    const convertedNumber = convertPrice(numberUSD);
    const currencyInfo = exchangeRates.find(r => r.code === selectedCurrency);
    
    if (!currencyInfo) return `$${formatLargeNumberUSD(numberUSD)}`;
    
    const { symbol } = currencyInfo;
    
    if (convertedNumber >= 1e12) {
      return `${symbol}${(convertedNumber / 1e12).toFixed(2)}T`;
    } else if (convertedNumber >= 1e9) {
      return `${symbol}${(convertedNumber / 1e9).toFixed(2)}B`;
    } else if (convertedNumber >= 1e6) {
      return `${symbol}${(convertedNumber / 1e6).toFixed(2)}M`;
    } else if (convertedNumber >= 1e3) {
      return `${symbol}${(convertedNumber / 1e3).toFixed(2)}K`;
    } else {
      return `${symbol}${convertedNumber.toFixed(2)}`;
    }
  };

  const formatLargeNumberUSD = (number: number) => {
    if (number >= 1e12) {
      return `${(number / 1e12).toFixed(2)}T`;
    } else if (number >= 1e9) {
      return `${(number / 1e9).toFixed(2)}B`;
    } else if (number >= 1e6) {
      return `${(number / 1e6).toFixed(2)}M`;
    } else if (number >= 1e3) {
      return `${(number / 1e3).toFixed(2)}K`;
    } else {
      return number.toFixed(2);
    }
  };

  return {
    selectedCurrency,
    exchangeRates,
    convertPrice,
    formatPrice,
    formatLargeNumber
  } as const;
}
