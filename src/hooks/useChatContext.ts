import { usePathname } from 'next/navigation';

export interface ChatContext {
  token?: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
    contract: string;
  };
  page?: string;
}

export function useChatContext(): ChatContext {
  const pathname = usePathname();
  
  // Detectar la página actual
  const getPageContext = (path: string): string => {
    if (path === '/') return 'Dashboard principal';
    if (path === '/markets') return 'Página de mercados';
    if (path === '/analytics') return 'Análisis de mercado';
    if (path.startsWith('/token/')) return 'Detalle de token';
    if (path === '/status') return 'Estado de APIs';
    return 'Página general';
  };

  return {
    page: getPageContext(pathname)
  };
}
