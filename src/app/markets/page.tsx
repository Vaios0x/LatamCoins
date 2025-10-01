'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Volume2, DollarSign } from 'lucide-react';
import { LATAM_TOKENS, Token } from '@/lib/constants/tokens';
import { formatPrice, formatLargeNumber, formatPercentage } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { PriceChange } from '@/components/ui/PriceChange';
import { Sparkline } from '@/components/dashboard/Sparkline';
import Link from 'next/link';

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume24h' | 'marketCap';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'gainers' | 'losers' | 'volume';

/**
 * Página de mercados con vista avanzada de tokens
 * Filtros, ordenamiento y análisis de mercado
 */
export default function MarketsPage() {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar tokens
  const filteredTokens = useMemo(() => {
    let filtered = LATAM_TOKENS;

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por tipo
    switch (filterType) {
      case 'gainers':
        filtered = filtered.filter(token => token.change24h > 0);
        break;
      case 'losers':
        filtered = filtered.filter(token => token.change24h < 0);
        break;
      case 'volume':
        filtered = filtered.filter(token => token.volume24h > 50000);
        break;
    }

    return filtered;
  }, [searchQuery, filterType]);

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
      return <div className="w-4 h-4 text-white/40" />;
    }
    return sortDirection === 'asc' 
      ? <TrendingUp className="w-4 h-4 text-[#00ff41]" />
      : <TrendingDown className="w-4 h-4 text-[#00ff41]" />;
  };

  const filterOptions = [
    { label: 'Todos', value: 'all', icon: Filter },
    { label: 'Ganadores', value: 'gainers', icon: TrendingUp },
    { label: 'Perdedores', value: 'losers', icon: TrendingDown },
    { label: 'Alto Volumen', value: 'volume', icon: Volume2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header de la página */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-white">Mercados</span>
            <span className="text-[#00ff41] neon-text animate-neon-pulse ml-2">LATAM</span>
          </h1>
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Análisis avanzado de tokens latinoamericanos. Filtra, ordena y descubre oportunidades.
          </p>
        </div>

        {/* Estadísticas del mercado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Market Cap Total
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {formatLargeNumber(LATAM_TOKENS.reduce((sum, token) => sum + token.marketCap, 0))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Volume2 className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Volumen 24h
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {formatLargeNumber(LATAM_TOKENS.reduce((sum, token) => sum + token.volume24h, 0))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Tokens en Verde
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#00ff41] font-mono">
                {LATAM_TOKENS.filter(token => token.change24h > 0).length}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingDown className="w-5 h-5 text-[#ff0040]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Tokens en Rojo
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#ff0040] font-mono">
                {LATAM_TOKENS.filter(token => token.change24h < 0).length}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Controles de filtrado y búsqueda */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                  aria-label="Buscar tokens"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <GlassButton
                    key={option.value}
                    onClick={() => setFilterType(option.value as FilterType)}
                    variant={filterType === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </GlassButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabla de tokens */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#00ff41]/20">
                  <th 
                    className="text-left py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white/80">#</span>
                      {getSortIcon('rank')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white/80">Token</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="text-right py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm font-medium text-white/80">Precio</span>
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    className="text-right py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('change24h')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm font-medium text-white/80">24h</span>
                      {getSortIcon('change24h')}
                    </div>
                  </th>
                  <th 
                    className="text-right py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('volume24h')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm font-medium text-white/80">Volumen 24h</span>
                      {getSortIcon('volume24h')}
                    </div>
                  </th>
                  <th 
                    className="text-right py-4 px-6 cursor-pointer hover:text-[#00ff41] transition-colors duration-300"
                    onClick={() => handleSort('marketCap')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm font-medium text-white/80">Market Cap</span>
                      {getSortIcon('marketCap')}
                    </div>
                  </th>
                  <th className="text-center py-4 px-6">
                    <span className="text-sm font-medium text-white/80">7D</span>
                  </th>
                  <th className="text-center py-4 px-6">
                    <span className="text-sm font-medium text-white/80">Acción</span>
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

        {/* Mensaje si no hay resultados */}
        {sortedTokens.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">No se encontraron tokens</div>
            <p className="text-white/40">Intenta ajustar los filtros o la búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Fila individual de token
 */
function TokenRow({ token }: { token: Token }) {
  return (
    <tr className="border-b border-[#00ff41]/10 hover:bg-[#00ff41]/5 transition-colors duration-300">
      {/* Ranking */}
      <td className="py-4 px-6">
        <span className="text-white/60 font-mono text-sm">
          #{token.rank}
        </span>
      </td>

      {/* Token info */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-[#00ff41]">
              {token.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-white text-base">{token.name}</div>
            <div className="text-sm text-white/60">{token.symbol}</div>
          </div>
        </div>
      </td>

      {/* Precio */}
      <td className="py-4 px-6 text-right">
        <span className="text-white font-mono text-sm">
          {formatPrice(token.price)}
        </span>
      </td>

      {/* Cambio 24h */}
      <td className="py-4 px-6 text-right">
        <PriceChange change={token.change24h} size="sm" />
      </td>

      {/* Volumen 24h */}
      <td className="py-4 px-6 text-right">
        <span className="text-white/80 font-mono text-sm">
          {formatLargeNumber(token.volume24h)}
        </span>
      </td>

      {/* Market Cap */}
      <td className="py-4 px-6 text-right">
        <span className="text-white/80 font-mono text-sm">
          {formatLargeNumber(token.marketCap)}
        </span>
      </td>

      {/* Sparkline 7D */}
      <td className="py-4 px-6 text-center">
        <div className="w-16 h-8 mx-auto">
          <Sparkline data={token.sparkline || []} />
        </div>
      </td>

      {/* Acción */}
      <td className="py-4 px-6 text-center">
        <Link
          href={`/token/${token.symbol.toLowerCase()}`}
          className="inline-flex items-center px-3 py-1.5 bg-[#00ff41]/10 hover:bg-[#00ff41]/20 border border-[#00ff41]/30 hover:border-[#00ff41]/50 text-[#00ff41] text-sm font-medium rounded-lg transition-all duration-300"
          aria-label={`Ver detalles de ${token.name}`}
        >
          Ver Detalles
        </Link>
      </td>
    </tr>
  );
}
