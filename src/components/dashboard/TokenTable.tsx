'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react';
import { Token } from '@/lib/constants/tokens';
import { formatLargeNumber as formatLargeNumberUSD } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { PriceChange } from '@/components/ui/PriceChange';
import { Sparkline } from './Sparkline';
import { useRealPrices } from '@/lib/hooks/useRealPrices';
import { useCurrency } from '@/components/ui/CurrencySelector';
import { useI18n } from '@/lib/i18n';

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume24h' | 'marketCap';
type SortDirection = 'asc' | 'desc';

/**
 * Tabla principal de tokens
 * Muestra todos los tokens con sorting y filtros
 */
export function TokenTable() {
  const { t } = useI18n();
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Controles móviles
  const [mobileFilter, setMobileFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  const [mobileSortField, setMobileSortField] = useState<SortField>('marketCap');
  const [mobileSortDir, setMobileSortDir] = useState<SortDirection>('desc');
  
  // Usar el hook de precios reales
  const { tokens, isLoading, refreshPrices } = useRealPrices();
  
  // Usar el hook de moneda (no usado en este componente)
  // const { formatPrice } = useCurrency();

  // Filtrar tokens por búsqueda
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase().trim();
    
    return tokens.filter(token => 
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
    );
  }, [searchQuery, tokens]);

  // Ordenar tokens
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      // Manejar diferentes tipos de campos
      switch (sortField) {
        case 'name':
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          if (sortDirection === 'asc') {
            return aName > bName ? 1 : -1;
          } else {
            return aName < bName ? 1 : -1;
          }
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'change24h':
          aValue = a.change24h || 0;
          bValue = b.change24h || 0;
          break;
        case 'volume24h':
          aValue = a.volume24h || 0;
          bValue = b.volume24h || 0;
          break;
        case 'marketCap':
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
          break;
        case 'rank':
          aValue = a.rank || 0;
          bValue = b.rank || 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      // Ordenar valores numéricos
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [filteredTokens, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-white/40" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-[#00ff41]" />
      : <ArrowDown className="w-4 h-4 text-[#00ff41]" />;
  };

  // Móvil: lista según filtros y orden seleccionados
  const mobileList = useMemo(() => {
    // Base: aplicar búsqueda ya hecha (filteredTokens)
    let list = [...filteredTokens];

    // Filtro por cambio 24h
    if (mobileFilter === 'gainers') {
      list = list.filter(t => (t.change24h ?? 0) > 0);
    } else if (mobileFilter === 'losers') {
      list = list.filter(t => (t.change24h ?? 0) < 0);
    }

    // Orden
    list.sort((a, b) => {
      const num = (field: SortField, x: typeof a) => {
        switch (field) {
          case 'price': return x.price ?? 0;
          case 'change24h': return x.change24h ?? 0;
          case 'volume24h': return x.volume24h ?? 0;
          case 'marketCap': return x.marketCap ?? 0;
          case 'rank': return x.rank ?? 0;
          default: return 0;
        }
      };
      if (mobileSortField === 'name') {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        return mobileSortDir === 'asc' ? (an > bn ? 1 : -1) : (an < bn ? 1 : -1);
      }
      const av = num(mobileSortField, a);
      const bv = num(mobileSortField, b);
      return mobileSortDir === 'asc' ? av - bv : bv - av;
    });

    return list;
  }, [filteredTokens, mobileFilter, mobileSortField, mobileSortDir]);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Barra de búsqueda */}
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 w-4 h-4" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 sm:py-4 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300 text-base"
            aria-label={t('search.aria')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors duration-300"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botón de actualización */}
        <button
          onClick={refreshPrices}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          <div className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}>
            🔄
          </div>
          <span className="text-sm text-white">
            {isLoading ? t('markets.loading') : t('apis.control.reload').replace('🔄 ', '')}
          </span>
        </button>
      </div>

      {/* Resultados de búsqueda */}
      {searchQuery && (
        <div className="text-center">
          <p className="text-white/70 text-sm">
            {sortedTokens.length === 0 
              ? `${t('analytics.no_tokens_found')} "${searchQuery}"`
              : `${sortedTokens.length} ${t('analytics.total_tokens').toLowerCase()}`
            }
          </p>
        </div>
      )}

      {/* Vista móvil - Lista completa ordenada por Market Cap (desc) */}
      <div className="block lg:hidden">
        <GlassCard className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-sm">
              {t('markets.title')} · {t('table.market_cap')}
            </h3>
            <Link href="/markets" className="text-xs text-[#00ff41] hover:underline">
              {t('markets.view_all')}
            </Link>
          </div>

          {/* Controles móviles: filtros y orden */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto">
            <button
              onClick={() => setMobileFilter('all')}
              className={`px-2 py-1 rounded text-xs border ${mobileFilter === 'all' ? 'bg-[#00ff41]/20 border-[#00ff41]/50 text-[#00ff41]' : 'bg-white/5 border-white/10 text-white/70'}`}
            >
              {t('markets.filters.all')}
            </button>
            <button
              onClick={() => setMobileFilter('gainers')}
              className={`px-2 py-1 rounded text-xs border ${mobileFilter === 'gainers' ? 'bg-[#00ff41]/20 border-[#00ff41]/50 text-[#00ff41]' : 'bg-white/5 border-white/10 text-white/70'}`}
            >
              {t('markets.filters.gainers')}
            </button>
            <button
              onClick={() => setMobileFilter('losers')}
              className={`px-2 py-1 rounded text-xs border ${mobileFilter === 'losers' ? 'bg-[#ff0040]/20 border-[#ff0040]/50 text-[#ff0040]' : 'bg-white/5 border-white/10 text-white/70'}`}
            >
              {t('markets.filters.losers')}
            </button>
          </div>

          <ul className="divide-y divide-white/10">
            {mobileList.map((token) => (
              <MobileGainerItem key={token.id} token={token} />)
            )}
          </ul>
        </GlassCard>
      </div>

      {/* Vista desktop - Tabla completa */}
      <GlassCard className="overflow-hidden hidden lg:block">
        <div className="w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-[#00ff41]/20">
                <th 
                  className="w-12 text-left py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('rank')}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-white/80">#</span>
                    {getSortIcon('rank')}
                  </div>
                </th>
                <th 
                  className="w-32 text-left py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-white/80">Token</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="w-20 text-right py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-medium text-white/80">Precio</span>
                    {getSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="w-16 text-right py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-medium text-white/80">24h</span>
                    {getSortIcon('change24h')}
                  </div>
                </th>
                <th 
                  className="w-20 text-right py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-medium text-white/80">Vol</span>
                    {getSortIcon('volume24h')}
                  </div>
                </th>
                <th 
                  className="w-20 text-right py-3 px-2 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs font-medium text-white/80">Cap</span>
                    {getSortIcon('marketCap')}
                  </div>
                </th>
                <th className="w-16 text-center py-3 px-2">
                  <span className="text-xs font-medium text-white/80">7D</span>
                </th>
                <th className="w-40 text-center py-3 px-2">
                  <span className="text-xs font-medium text-white/80">Acción</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTokens.map((token) => (
                <TokenRow key={token.id} token={token} />
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Fila individual de token
 */
function TokenRow({ token }: { token: Token }) {
  const router = useRouter();
  
  // Usar el hook de moneda
  const { formatPrice, formatLargeNumber } = useCurrency();
  
  const handleRowClick = () => {
    router.push(`/token/${token.symbol.toLowerCase()}`);
  };

  return (
    <tr 
      className="border-b border-[#00ff41]/10 hover:bg-[#00ff41]/5 transition-colors duration-300 cursor-pointer group"
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
      aria-label={`Ver detalles de ${token.name}`}
    >
      {/* Ranking */}
      <td className="py-2 px-2">
        <span className="text-white/60 font-mono text-xs">
          #{token.rank}
        </span>
      </td>

      {/* Token info */}
      <td className="py-2 px-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#00ff41]">
              {token.symbol.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white text-xs truncate">{token.name}</div>
            <div className="text-xs text-white/60 truncate">{token.symbol}</div>
          </div>
        </div>
      </td>

      {/* Precio */}
      <td className="py-2 px-2 text-right">
        <span className="text-white font-mono text-xs">
          {formatPrice(token.price)}
        </span>
      </td>

      {/* Cambio 24h */}
      <td className="py-2 px-2 text-right">
        <PriceChange change={token.change24h} size="sm" />
      </td>

      {/* Volumen 24h */}
      <td className="py-2 px-2 text-right">
        <span className="text-white/80 font-mono text-xs">
          {formatLargeNumber(token.volume24h)}
        </span>
      </td>

      {/* Market Cap */}
      <td className="py-2 px-2 text-right">
        <span className="text-white/80 font-mono text-xs">
          {formatLargeNumber(token.marketCap)}
        </span>
      </td>

      {/* Sparkline 7D */}
      <td className="py-2 px-2 text-center">
        <div className="w-12 h-6 mx-auto">
          <Sparkline data={token.sparkline || []} />
        </div>
      </td>

      {/* Acción */}
      <td className="py-2 px-2 text-center">
        <div className="flex items-center justify-center space-x-1">
          <div className="inline-flex items-center px-2 py-1 bg-[#00ff41]/20 group-hover:bg-[#00ff41]/30 border border-[#00ff41]/50 group-hover:border-[#00ff41]/70 text-[#00ff41] text-xs font-semibold rounded transition-all duration-300">
            🔍
          </div>
          {token.dexScreenerUrl && (
            <a
              href={token.dexScreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 border border-[#ff6b35]/50 hover:border-[#ff6b35]/70 text-[#ff6b35] text-xs font-semibold rounded transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Ver ${token.name} en DexScreener`}
            >
              📊
            </a>
          )}
          {token.pumpUrl && (
            <a
              href={token.pumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/50 hover:border-[#8b5cf6]/70 text-[#8b5cf6] text-xs font-semibold rounded transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Ver ${token.name} en Pump.fun`}
            >
              🚀
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * Card individual de token para vista móvil
 */
function TokenCard({ token }: { token: Token }) {
  // Usar el hook de moneda
  const { formatPrice, formatLargeNumber } = useCurrency();

  return (
    <Link href={`/token/${token.symbol.toLowerCase()}`} className="block">
      <GlassCard className="p-4 hover:bg-[#00ff41]/5 transition-all duration-300 cursor-pointer group">
        <div className="space-y-4">
          {/* Header del token */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-[#00ff41]">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-white text-lg">{token.name}</div>
                <div className="text-sm text-white/60">{token.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-white">{formatPrice(token.price)}</div>
              <PriceChange change={token.change24h} size="sm" />
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/60 mb-1">Volumen 24h</div>
              <div className="text-sm font-mono text-white/80">{formatLargeNumber(token.volume24h)}</div>
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">Market Cap</div>
              <div className="text-sm font-mono text-white/80">{formatLargeNumber(token.marketCap)}</div>
            </div>
          </div>

          {/* Sparkline */}
          <div className="h-12">
            <Sparkline data={token.sparkline || []} />
          </div>

          {/* Botón de acción */}
          <div className="pt-4 border-t border-[#00ff41]/20">
            <div className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#00ff41]/20 group-hover:bg-[#00ff41]/30 border-2 border-[#00ff41]/50 group-hover:border-[#00ff41]/70 text-[#00ff41] text-base font-semibold rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-[#00ff41]/20">
              🔍 Ver Detalles Completos
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

function MobileGainerItem({ token }: { token: Token }) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const handleClick = () => router.push(`/token/${token.symbol.toLowerCase()}`);

  return (
    <li
      className="py-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 px-2 rounded"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 bg-[#00ff41]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-[#00ff41]">{token.symbol.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <div className="text-white text-sm font-medium truncate">{token.symbol}</div>
          <div className="text-white/60 text-xs truncate">{token.name}</div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-white font-mono text-xs">{formatPrice(token.price)}</div>
        <PriceChange change={token.change24h} size="sm" />
      </div>
    </li>
  );
}
