'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react';
import { LATAM_TOKENS, Token } from '@/lib/constants/tokens';
import { formatPrice, formatLargeNumber } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { PriceChange } from '@/components/ui/PriceChange';
import { Sparkline } from './Sparkline';

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume24h' | 'marketCap';
type SortDirection = 'asc' | 'desc';

/**
 * Tabla principal de tokens
 * Muestra todos los tokens con sorting y filtros
 */
export function TokenTable() {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar tokens por búsqueda
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return LATAM_TOKENS;
    
    const query = searchQuery.toLowerCase().trim();
    
    return LATAM_TOKENS.filter(token => 
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.platform.toLowerCase().includes(query) ||
      token.chain.toLowerCase().includes(query) ||
      token.contract.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Ordenar tokens
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Barra de búsqueda */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md sm:max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 sm:py-4 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300 text-base"
            aria-label="Buscar tokens"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 hover:text-[#00ff41] transition-colors duration-300"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchQuery && (
        <div className="text-center">
          <p className="text-white/70 text-sm">
            {sortedTokens.length === 0 
              ? `No se encontraron tokens que coincidan con "${searchQuery}"`
              : `${sortedTokens.length} token${sortedTokens.length !== 1 ? 's' : ''} encontrado${sortedTokens.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}

      {/* Vista móvil - Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {sortedTokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
        
        {/* Botón flotante de ayuda para móvil */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <div className="bg-[#00ff41]/20 backdrop-blur-lg border-2 border-[#00ff41]/50 rounded-full p-3 shadow-lg">
            <div className="text-center">
              <div className="text-[#00ff41] text-xs font-semibold mb-1">💡</div>
              <div className="text-white text-xs">Toca cualquier token para ver detalles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Tabla completa */}
      <GlassCard className="overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] sm:min-w-[800px] md:min-w-[900px]">
            <thead>
              <tr className="border-b border-[#00ff41]/20">
                <th 
                  className="text-left py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('rank')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">#</span>
                    {getSortIcon('rank')}
                  </div>
                </th>
                <th 
                  className="text-left py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">Token</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="text-right py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">Precio</span>
                    {getSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="text-right py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                  onClick={() => handleSort('change24h')}
                >
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">24h</span>
                    {getSortIcon('change24h')}
                  </div>
                </th>
                <th 
                  className="text-right py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300 hidden sm:table-cell"
                  onClick={() => handleSort('volume24h')}
                >
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">Volumen 24h</span>
                    {getSortIcon('volume24h')}
                  </div>
                </th>
                <th 
                  className="text-right py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300 hidden md:table-cell"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-white/80">Market Cap</span>
                    {getSortIcon('marketCap')}
                  </div>
                </th>
                <th className="text-center py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 hidden lg:table-cell">
                  <span className="text-xs sm:text-sm font-medium text-white/80">7D</span>
                </th>
                <th className="text-center py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6">
                  <span className="text-xs sm:text-sm font-medium text-white/80">Acción</span>
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
  return (
    <tr className="border-b border-[#00ff41]/10 hover:bg-[#00ff41]/5 transition-colors duration-300 cursor-pointer group">
      <Link href={`/token/${token.symbol.toLowerCase()}`} className="contents">
        {/* Ranking */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6">
          <span className="text-white/60 font-mono text-xs sm:text-sm">
            #{token.rank}
          </span>
        </td>

        {/* Token info */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#00ff41]">
                {token.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium text-white text-sm sm:text-base">{token.name}</div>
              <div className="text-xs sm:text-sm text-white/60">{token.symbol}</div>
            </div>
          </div>
        </td>

        {/* Precio */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-right">
          <span className="text-white font-mono text-xs sm:text-sm">
            {formatPrice(token.price)}
          </span>
        </td>

        {/* Cambio 24h */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-right">
          <PriceChange change={token.change24h} size="sm" />
        </td>

        {/* Volumen 24h */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-right hidden sm:table-cell">
          <span className="text-white/80 font-mono text-xs sm:text-sm">
            {formatLargeNumber(token.volume24h)}
          </span>
        </td>

        {/* Market Cap */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-right hidden md:table-cell">
          <span className="text-white/80 font-mono text-xs sm:text-sm">
            {formatLargeNumber(token.marketCap)}
          </span>
        </td>

        {/* Sparkline 7D */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-center hidden lg:table-cell">
          <div className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 md:h-8 mx-auto">
            <Sparkline data={token.sparkline || []} />
          </div>
        </td>

        {/* Acción */}
        <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-[#00ff41]/20 group-hover:bg-[#00ff41]/30 border-2 border-[#00ff41]/50 group-hover:border-[#00ff41]/70 text-[#00ff41] text-sm font-semibold rounded-lg transition-all duration-300 shadow-md group-hover:shadow-[#00ff41]/20">
            🔍 Ver Detalles
          </div>
        </td>
      </Link>
    </tr>
  );
}

/**
 * Card individual de token para vista móvil
 */
function TokenCard({ token }: { token: Token }) {
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
