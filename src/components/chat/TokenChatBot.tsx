'use client';

import { ChatBot } from './ChatBot';
import { useChatContext } from '@/hooks/useChatContext';

interface TokenChatBotProps {
  tokenData?: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
    contract: string;
  };
}

export function TokenChatBot({ tokenData }: TokenChatBotProps) {
  const context = useChatContext();
  
  return (
    <ChatBot 
      context={{
        ...context,
        token: tokenData
      }}
    />
  );
}
