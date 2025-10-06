'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Hash } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  contract?: string;
}

interface RecentTradesProps {
  token: Token;
  className?: string;
}

interface Trade {
  timestamp: number;
  price: number;
  volume: number;
  side: 'buy' | 'sell';
  txHash: string;
  user: string;
}

export function RecentTrades({ token, className = '' }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token.contract) return;

    const fetchTrades = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/trades?address=${token.contract}&limit=20`
        );
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch trades');
        }

        setTrades(result.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError('Failed to load trades');
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, [token.contract]);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(8)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-white/60">
            <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando trades...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️</div>
          <div className="text-white/60 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Hash className="w-5 h-5 mr-2 text-[#00ff41]" />
        Trades Recientes
      </h3>
      
      {trades.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-white/60 text-sm">No hay trades recientes</div>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {trades.map((trade, index) => (
            <div 
              key={`${trade.txHash}-${index}`}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 ${
                  trade.side === 'buy' ? 'text-[#00ff41]' : 'text-[#ff0040]'
                }`}>
                  {trade.side === 'buy' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium uppercase">
                    {trade.side}
                  </span>
                </div>
                
                <div className="text-white font-mono text-sm">
                  {formatPrice(trade.price)}
                </div>
                
                <div className="text-white/60 text-xs">
                  {formatVolume(trade.volume)}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-white/60">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(trade.timestamp)}</span>
                </div>
                
                <a
                  href={`https://solscan.io/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ff41] hover:text-[#00ff41]/80 transition-colors"
                  title="Ver en Solscan"
                >
                  {truncateHash(trade.txHash)}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
