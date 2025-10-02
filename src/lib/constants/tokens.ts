/**
 * Lista de tokens latinoamericanos para CoinLatamCap
 * Enfocados en tokens de Pump.fun en Solana
 */

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  platform: string;
  chain: string;
  contract: string;
  logo: string;
  ath: number;
  atl: number;
  supply: number;
  rank: number;
  sparkline?: number[];
  dexScreenerUrl?: string;
  pumpUrl?: string;
  jupiterUrl?: string;
  cmcSymbols?: string[];
  liquidity?: number;
  fdv?: number;
  source?: string;
  isRealTime?: boolean;
  pairAddress?: string;
  priceChange?: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  lastUpdated?: string;
}

export const LATAM_TOKENS: Token[] = [
  {
    id: 'holder-doggy',
    symbol: 'DOGGY',
    name: 'HOLDER',
    price: 0.0000234,
    change24h: 15.67,
    volume24h: 125000,
    marketCap: 2340000,
    platform: 'Pump.fun',
    chain: 'Solana',
    contract: 'b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt',
    logo: '/tokens/doggy.svg',
    ath: 0.0000456,
    atl: 0.0000012,
    supply: 1000000000,
    rank: 1,
    sparkline: [0.0000012, 0.0000015, 0.0000018, 0.0000021, 0.0000025, 0.0000028, 0.0000032, 0.0000035, 0.0000038, 0.0000042, 0.0000045, 0.0000048, 0.0000052, 0.0000055, 0.0000058, 0.0000062, 0.0000065, 0.0000068, 0.0000072, 0.0000075, 0.0000078, 0.0000082, 0.0000085, 0.0000088, 0.0000092, 0.0000095, 0.0000098, 0.0000102, 0.0000105, 0.0000108, 0.0000112, 0.0000115, 0.0000118, 0.0000122, 0.0000125, 0.0000128, 0.0000132, 0.0000135, 0.0000138, 0.0000142, 0.0000145, 0.0000148, 0.0000152, 0.0000155, 0.0000158, 0.0000162, 0.0000165, 0.0000168, 0.0000172, 0.0000175, 0.0000178, 0.0000182, 0.0000185, 0.0000188, 0.0000192, 0.0000195, 0.0000198, 0.0000202, 0.0000205, 0.0000208, 0.0000212, 0.0000215, 0.0000218, 0.0000222, 0.0000225, 0.0000228, 0.0000232, 0.0000234],
    dexScreenerUrl: 'https://dexscreener.com/solana/b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt',
    pumpUrl: 'https://pump.fun/coin/BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump'
  },
  {
    id: 'mad-coin',
    symbol: 'MAD',
    name: 'MAD COIN',
    price: 0.000156,
    change24h: -8.34,
    volume24h: 87500,
    marketCap: 1560000,
    platform: 'Pump.fun',
    chain: 'Solana',
    contract: '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    logo: '/tokens/mad.svg',
    ath: 0.000289,
    atl: 0.000045,
    supply: 500000000,
    rank: 2,
    sparkline: [0.000045, 0.000048, 0.000052, 0.000055, 0.000058, 0.000062, 0.000065, 0.000068, 0.000072, 0.000075, 0.000078, 0.000082, 0.000085, 0.000088, 0.000092, 0.000095, 0.000098, 0.000102, 0.000105, 0.000108, 0.000112, 0.000115, 0.000118, 0.000122, 0.000125, 0.000128, 0.000132, 0.000135, 0.000138, 0.000142, 0.000145, 0.000148, 0.000152, 0.000155, 0.000158, 0.000162, 0.000165, 0.000168, 0.000172, 0.000175, 0.000178, 0.000182, 0.000185, 0.000188, 0.000192, 0.000195, 0.000198, 0.000202, 0.000205, 0.000208, 0.000212, 0.000215, 0.000218, 0.000222, 0.000225, 0.000228, 0.000232, 0.000235, 0.000238, 0.000242, 0.000245, 0.000248, 0.000252, 0.000255, 0.000258, 0.000262, 0.000265, 0.000268, 0.000272, 0.000275, 0.000278, 0.000282, 0.000285, 0.000288, 0.000156],
    dexScreenerUrl: 'https://dexscreener.com/solana/6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    pumpUrl: 'https://pump.fun/coin/CZbkRyauV5b9Q4xNwKGUtEBEggzqWpC6KMVp2oRppump'
  },
  {
    id: 'quira',
    symbol: 'QRA',
    name: 'Quira',
    price: 0.000089,
    change24h: 23.45,
    volume24h: 45600,
    marketCap: 890000,
    platform: 'Pump.fun',
    chain: 'Solana',
    contract: '3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr',
    logo: '/tokens/qra.svg',
    ath: 0.000156,
    atl: 0.000023,
    supply: 750000000,
    rank: 3,
    sparkline: [0.000023, 0.000025, 0.000028, 0.000031, 0.000034, 0.000037, 0.000040, 0.000043, 0.000046, 0.000049, 0.000052, 0.000055, 0.000058, 0.000061, 0.000064, 0.000067, 0.000070, 0.000073, 0.000076, 0.000079, 0.000082, 0.000085, 0.000088, 0.000091, 0.000094, 0.000097, 0.000100, 0.000103, 0.000106, 0.000109, 0.000112, 0.000115, 0.000118, 0.000121, 0.000124, 0.000127, 0.000130, 0.000133, 0.000136, 0.000139, 0.000142, 0.000145, 0.000148, 0.000151, 0.000154, 0.000157, 0.000160, 0.000163, 0.000166, 0.000169, 0.000172, 0.000175, 0.000178, 0.000181, 0.000184, 0.000187, 0.000190, 0.000193, 0.000196, 0.000199, 0.000202, 0.000205, 0.000208, 0.000211, 0.000214, 0.000217, 0.000220, 0.000223, 0.000226, 0.000229, 0.000232, 0.000235, 0.000238, 0.000241, 0.000089],
    dexScreenerUrl: 'https://dexscreener.com/solana/3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr',
    pumpUrl: 'https://pump.fun/coin/DsMWZg6mkheTV2XTkbUtWcsXaajTzEkk1TC7o6Fmpump'
  },
  {
    id: 'humo',
    symbol: 'HUMO',
    name: 'HUMO',
    price: 0.000134,
    change24h: -12.78,
    volume24h: 67800,
    marketCap: 1340000,
    platform: 'Pump.fun',
    chain: 'Solana',
    contract: '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    logo: '/tokens/humo.svg',
    ath: 0.000234,
    atl: 0.000067,
    supply: 800000000,
    rank: 4,
    sparkline: [0.000067, 0.000070, 0.000073, 0.000076, 0.000079, 0.000082, 0.000085, 0.000088, 0.000091, 0.000094, 0.000097, 0.000100, 0.000103, 0.000106, 0.000109, 0.000112, 0.000115, 0.000118, 0.000121, 0.000124, 0.000127, 0.000130, 0.000133, 0.000136, 0.000139, 0.000142, 0.000145, 0.000148, 0.000151, 0.000154, 0.000157, 0.000160, 0.000163, 0.000166, 0.000169, 0.000172, 0.000175, 0.000178, 0.000181, 0.000184, 0.000187, 0.000190, 0.000193, 0.000196, 0.000199, 0.000202, 0.000205, 0.000208, 0.000211, 0.000214, 0.000217, 0.000220, 0.000223, 0.000226, 0.000229, 0.000232, 0.000235, 0.000238, 0.000241, 0.000244, 0.000247, 0.000250, 0.000253, 0.000256, 0.000259, 0.000262, 0.000265, 0.000268, 0.000271, 0.000274, 0.000277, 0.000280, 0.000283, 0.000134],
    dexScreenerUrl: 'https://dexscreener.com/solana/6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    pumpUrl: 'https://pump.fun/coin/9RLoB3YZwk9sK78ZhmiSAj8CtPhssuJR1pVR326Vpump'
  },
  {
    id: 'darrkito',
    symbol: 'Darrkito',
    name: 'Darrkito Strategic Reserve',
    price: 0.000201,
    change24h: 5.23,
    volume24h: 23400,
    marketCap: 2010000,
    platform: 'Pump.fun',
    chain: 'Solana',
    contract: '3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru',
    logo: '/tokens/darrkito.svg',
    ath: 0.000345,
    atl: 0.000089,
    supply: 600000000,
    rank: 5,
    sparkline: [0.000089, 0.000092, 0.000095, 0.000098, 0.000101, 0.000104, 0.000107, 0.000110, 0.000113, 0.000116, 0.000119, 0.000122, 0.000125, 0.000128, 0.000131, 0.000134, 0.000137, 0.000140, 0.000143, 0.000146, 0.000149, 0.000152, 0.000155, 0.000158, 0.000161, 0.000164, 0.000167, 0.000170, 0.000173, 0.000176, 0.000179, 0.000182, 0.000185, 0.000188, 0.000191, 0.000194, 0.000197, 0.000200, 0.000203, 0.000206, 0.000209, 0.000212, 0.000215, 0.000218, 0.000221, 0.000224, 0.000227, 0.000230, 0.000233, 0.000236, 0.000239, 0.000242, 0.000245, 0.000248, 0.000251, 0.000254, 0.000257, 0.000260, 0.000263, 0.000266, 0.000269, 0.000272, 0.000275, 0.000278, 0.000281, 0.000284, 0.000287, 0.000290, 0.000293, 0.000296, 0.000299, 0.000302, 0.000305, 0.000201],
    dexScreenerUrl: 'https://dexscreener.com/solana/3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru',
    pumpUrl: 'https://pump.fun/coin/9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump'
  }
];

// Estadísticas globales calculadas
export const GLOBAL_STATS = {
  totalMarketCap: LATAM_TOKENS.reduce((sum, token) => sum + token.marketCap, 0),
  totalVolume24h: LATAM_TOKENS.reduce((sum, token) => sum + token.volume24h, 0),
  tokensTracked: LATAM_TOKENS.length,
  averageChange24h: LATAM_TOKENS.reduce((sum, token) => sum + token.change24h, 0) / LATAM_TOKENS.length
};

// Función para obtener token por símbolo
export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return LATAM_TOKENS.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
};

// Función para obtener token por ID
export const getTokenById = (id: string): Token | undefined => {
  return LATAM_TOKENS.find(token => token.id === id);
};
