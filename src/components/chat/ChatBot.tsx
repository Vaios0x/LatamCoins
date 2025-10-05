'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
// import { GlassCard } from '@/components/ui/GlassCard'; // Removido - no se usa

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatBotProps {
  context?: {
    token?: {
      symbol: string;
      name: string;
      price: number;
      change24h: number;
      marketCap: number;
      contract: string;
    };
    page?: string;
  };
}

interface TokenAnalysis {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  fdv: number;
  source: string;
  isRealTime: boolean;
  contract: string;
  rank: number;
}

export function ChatBot({ context }: ChatBotProps) {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: t('chatbot.welcome'),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para obtener datos reales de tokens
  const fetchTokenData = async (symbol: string): Promise<TokenAnalysis | null> => {
    try {
      console.log(`🔍 Buscando datos para token: ${symbol}`);
      const response = await fetch('/api/tokens');
      if (!response.ok) {
        console.error('Error en la respuesta de la API:', response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      console.log('📊 Estructura de datos:', {
        hasData: !!data.data,
        isArray: Array.isArray(data.data),
        length: data.data?.length,
        success: data.success
      });
      
      if (!data.data || !Array.isArray(data.data)) {
        console.error('Formato de datos inválido - esperando data.data array');
        console.error('Estructura recibida:', Object.keys(data));
        return null;
      }
      
      const token = data.data.find((t: { symbol: string }) => 
        t.symbol && t.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      if (!token) {
        console.log(`❌ Token ${symbol} no encontrado. Tokens disponibles:`, 
          data.data.map((t: { symbol: string }) => t.symbol).join(', '));
        return null;
      }
      
      console.log(`✅ Token encontrado:`, token);
      
      return {
        symbol: token.symbol,
        name: token.name,
        price: token.price || 0,
        change24h: token.change24h || 0,
        volume24h: token.volume24h || 0,
        marketCap: token.marketCap || 0,
        liquidity: token.liquidity || 0,
        fdv: token.fdv || 0,
        source: token.source || 'unknown',
        isRealTime: token.isRealTime || false,
        contract: token.contract || '',
        rank: token.rank || 0
      };
    } catch (error) {
      console.error('Error fetching token data:', error);
      return null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Si cambia el idioma y solo está el mensaje de bienvenida, actualizar su contenido
    setMessages(prev => {
      if (prev.length === 1 && prev[0]?.id === '1' && prev[0]?.type === 'bot') {
        return [{ ...prev[0], content: t('chatbot.welcome') }];
      }
      return prev;
    });
  }, [locale, t]);

  // Función para generar análisis avanzado de tokens
  const generateTokenAnalysis = (tokenData: TokenAnalysis): string => {
    const { symbol, name, price, change24h, volume24h, marketCap, liquidity, fdv, source, isRealTime } = tokenData;
    
    // Análisis de tendencia
    const trend = change24h > 5 ? '🚀 FUERTE ALZA' : 
                  change24h > 0 ? '📈 ALZA' : 
                  change24h > -5 ? '📉 CORRECCIÓN' : '🔻 BAJA FUERTE';
    
    // Análisis de volumen
    const volumeAnalysis = volume24h > 100000 ? '🔥 ALTO VOLUMEN' : 
                          volume24h > 50000 ? '📊 VOLUMEN MODERADO' : '📉 BAJO VOLUMEN';
    
    // Análisis de liquidez
    const liquidityAnalysis = liquidity > 100000 ? '💧 EXCELENTE LIQUIDEZ' : 
                             liquidity > 50000 ? '💧 BUENA LIQUIDEZ' : '⚠️ LIQUIDEZ LIMITADA';
    
    // Análisis de market cap vs FDV
    const fdvRatio = fdv > 0 ? marketCap / fdv : 0;
    const fdvAnalysis = fdvRatio > 0.8 ? '✅ DILUCIÓN BAJA' : 
                        fdvRatio > 0.5 ? '⚠️ DILUCIÓN MODERADA' : '🚨 ALTA DILUCIÓN';
    
    // Recomendación de trading
    let recommendation = '';
    if (change24h > 10 && volume24h > 100000) {
      recommendation = '🎯 MOMENTUM POSITIVO - Considera entrada con stop-loss';
    } else if (change24h < -10 && volume24h > 100000) {
      recommendation = '⚠️ CORRECCIÓN FUERTE - Espera confirmación de rebote';
    } else if (change24h > 0 && volume24h < 50000) {
      recommendation = '📊 MOVIMIENTO DÉBIL - Falta volumen para confirmar tendencia';
    } else {
      recommendation = '⏳ OBSERVA - Espera mayor claridad en el mercado';
    }
    
    // Información adicional del token
    let tokenInfo = '';
    if (symbol === 'HOLDER' || symbol === 'DOGGY') {
      tokenInfo = '\n🐕 **HOLDER (DOGGY)**: Token comunitario con fuerte base de holders y utilidad en el ecosistema LATAM.';
    } else if (symbol === 'MAD') {
      tokenInfo = '\n🔥 **MAD COIN**: Proyecto innovador con enfoque en la comunidad y casos de uso reales.';
    } else if (symbol === 'QRA') {
      tokenInfo = '\n💎 **Quira (QRA)**: Token con enfoque en DeFi y pagos, parte del ecosistema crypto latinoamericano.';
    } else if (symbol === 'DARRKITO') {
      tokenInfo = '\n🏦 **Darrkito**: Reserva estratégica comunitaria con enfoque en estabilidad y crecimiento.';
    }
    
    return `📊 **ANÁLISIS COMPLETO DE ${symbol.toUpperCase()}**\n\n` +
           `**${name}**${tokenInfo}\n\n` +
           `💰 **Precio**: $${price.toFixed(6)}\n` +
           `📈 **Cambio 24h**: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}% ${trend}\n` +
           `📊 **Volumen 24h**: $${(volume24h / 1000).toFixed(1)}K ${volumeAnalysis}\n` +
           `💎 **Market Cap**: $${(marketCap / 1000).toFixed(1)}K\n` +
           `💧 **Liquidez**: $${(liquidity / 1000).toFixed(1)}K ${liquidityAnalysis}\n` +
           `📊 **FDV Ratio**: ${(fdvRatio * 100).toFixed(1)}% ${fdvAnalysis}\n\n` +
           `🔍 **FUENTE**: ${source.toUpperCase()} ${isRealTime ? '✅ TIEMPO REAL' : '📊 SIMULADO'}\n\n` +
           `💡 **RECOMENDACIÓN**: ${recommendation}\n\n` +
           `🔗 **Contract**: \`${tokenData.contract.slice(0, 8)}...${tokenData.contract.slice(-8)}\``;
  };

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (context?.token) {
      const { symbol, name, price, change24h, marketCap, contract } = context.token;
      if (msg.includes(symbol.toLowerCase()) || msg.includes(name.toLowerCase())) {
        const trendText = change24h > 0 ? t('chatbot.bullish') : t('chatbot.correction');
        const contractShort = `${contract.slice(0, 8)}...${contract.slice(-8)}`;
        const parts = [
          `${t('chatbot.analyzing')} ${name} (${symbol}):`,
          '',
          `📊 ${t('chatbot.currentPrice')}: $${price.toFixed(6)}`,
          `📈 ${t('chatbot.change24h')}: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%`,
          `💰 ${t('chatbot.marketCap')}: $${(marketCap / 1000).toFixed(1)}K` ,
          `🔗 ${t('chatbot.contract')}: ${contractShort}`,
          '',
          `${change24h > 0 ? '🚀' : '📉'} ${trendText}. ${t('chatbot.moreInfoQuestion')}`
        ];
        return parts.join('\n');
      }
    }

    if (msg.includes('latam') || msg.includes('latinoamerica') || msg.includes('latinoamérica')) {
      return t('chatbot.latamInfo');
    }

    if (msg.includes('solana') || msg.includes('sol')) {
      return t('chatbot.solanaInfo');
    }

    if (msg.includes('trading') || msg.includes('comprar') || msg.includes('vender')) {
      return t('chatbot.tradingStrategies');
    }

    if (msg.includes('defi') || msg.includes('yield') || msg.includes('farming')) {
      return t('chatbot.defiInfo');
    }

    if (msg.includes('seguridad') || msg.includes('scam') || msg.includes('estafa') || msg.includes('security')) {
      return t('chatbot.securityTips');
    }

    if (msg.includes('precio') || msg.includes('valor') || msg.includes('análisis') || msg.includes('analysis') || msg.includes('price') || msg.includes('value')) {
      return t('chatbot.priceAnalysis');
    }

    if (msg.includes('ayuda') || msg.includes('help')) {
      return t('chatbot.help');
    }

    return t('chatbot.defaultResponse');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const message = currentInput.toLowerCase();
      const tokenMatch = message.match(/(analiza|analyze)\s+(\w+)/i);
      
      if (tokenMatch) {
        const tokenSymbol = tokenMatch[2].toUpperCase();
        console.log(`🔍 Buscando token: ${tokenSymbol}`);
        
        // Mapeo de nombres alternativos
        const tokenMapping: { [key: string]: string } = {
          'HOLDER': 'DOGGY',
          'DOGGY': 'DOGGY',
          'MAD': 'MAD',
          'MADCOIN': 'MAD',
          'QRA': 'QRA',
          'QUIRA': 'QRA',
          'DARRKITO': 'DARRKITO',
          'DARKITO': 'DARRKITO'
        };
        
        const mappedSymbol = tokenMapping[tokenSymbol] || tokenSymbol;
        console.log(`🔄 Mapeo: ${tokenSymbol} -> ${mappedSymbol}`);
        
        const tokenData = await fetchTokenData(mappedSymbol);
        
        if (tokenData) {
          const analysis = generateTokenAnalysis(tokenData);
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: analysis,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: `${t('chatbot.tokenNotFound')} "${tokenSymbol}".`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        // Respuesta general
        const botResponse = generateBotResponse(currentInput);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: t('chatbot.errorProcessing'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: t('chatbot.quickAnalyzeHolder'), icon: TrendingUp, action: 'analiza HOLDER' },
    { label: t('chatbot.quickDeFiSolana'), icon: BarChart3, action: 'Explica DeFi en Solana' }
  ];

  return (
    <>
      {/* Botón flotante con glassmorphism */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl hover:shadow-[#00ff41]/25 hover:shadow-2xl transition-all duration-500 flex items-center justify-center group hover:scale-110"
          aria-label={t('chatbot.openAria')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/20 to-[#00cc33]/20 rounded-full animate-pulse"></div>
          <div className="relative w-6 h-6 bg-gradient-to-r from-[#00ff41] to-[#00cc33] rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff41]/30 to-[#00cc33]/30 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      )}

      {/* Chat modal con glassmorphism */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-1 sm:p-4">
          <div className="w-full max-w-[300px] sm:max-w-sm md:max-w-md h-[380px] sm:h-[400px] md:h-[500px] flex flex-col transform transition-all duration-300 ease-out animate-slide-up mb-2 sm:mb-4">
            {/* Efecto de fondo neural */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/5 via-transparent to-[#00cc33]/5 rounded-2xl blur-xl"></div>
            
             {/* Glassmorphism container con efectos neurales */}
             <div className="relative flex-1 flex flex-col glass-morphism neural-glow particle-effect rounded-2xl shadow-2xl bg-white/30">
              {/* Efecto de borde animado */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00ff41]/20 via-[#00cc33]/20 to-[#00ff41]/20 opacity-50 animate-pulse"></div>
              
              {/* Header sticky - siempre visible */}
               <div className="sticky top-0 flex items-center justify-between p-2 sm:p-1.5 md:p-2 border-b border-white/10 bg-white/60 backdrop-blur-lg z-[999] flex-shrink-0 rounded-t-2xl">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    {/* Avatar compacto */}
                    <div className="relative">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#00ff41] to-[#00cc33] rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
                      </div>
                      <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-[#00ff41]/30 to-[#00cc33]/30 rounded-full blur opacity-75 animate-pulse"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-[9px] sm:text-[10px] md:text-xs truncate neural-text">
                        Crypto Expert LATAM
                      </h3>
                      <p className="text-[8px] sm:text-[9px] text-white/60 truncate">Solana & Tokens</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-red-500 hover:bg-red-600 border-2 border-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 z-[999] relative"
                    aria-label={t('chatbot.closeAria')}
                  >
                    <X className="w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white font-black" />
                  </button>
                </div>

                {/* Contenedor de mensajes y acciones */}
                <div className="flex-1 flex flex-col overflow-hidden">
                   {/* Messages más grandes para móviles */}
                   <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-2 sm:py-1 md:px-3 md:py-2 pb-4 space-y-2 sm:space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`flex items-start space-x-1.5 sm:space-x-2 ${message.type === 'user' ? 'max-w-[80%] sm:max-w-[75%] flex-row-reverse space-x-reverse' : 'max-w-[95%] sm:max-w-[90%]'}`}>
                        {/* Avatar compacto */}
                        <div className="relative">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center backdrop-blur-sm ${
                            message.type === 'user' 
                              ? 'bg-[#00ff41]/10 border border-[#00ff41]/20' 
                              : 'bg-gradient-to-r from-[#00ff41] to-[#00cc33] shadow-lg'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#00ff41]" />
                            ) : (
                              <Bot className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                            )}
                          </div>
                          {message.type === 'bot' && (
                            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-[#00ff41]/20 to-[#00cc33]/20 rounded-full blur opacity-50 animate-pulse"></div>
                          )}
                        </div>
                        
                         {/* Mensaje compacto */}
                         <div className={`rounded-lg sm:rounded-xl ${message.type === 'user' ? 'p-1.5 sm:p-2 md:p-2.5' : 'p-1.5 sm:p-1.5 md:p-2'} backdrop-blur-sm border ${
                           message.type === 'user'
                             ? 'bg-[#00ff41]/10 border-[#00ff41]/20 text-white shadow-lg'
                             : 'bg-white/5 border-white/10 text-white shadow-lg'
                         }`}>
                          <div className={`whitespace-pre-wrap leading-tight sm:leading-relaxed ${message.type === 'user' ? 'text-[10px] sm:text-xs' : 'text-[11px] sm:text-sm'}`}>
                            {message.content}
                          </div>
                          <div className="text-[9px] sm:text-xs opacity-50 mt-0.5 sm:mt-1 flex items-center space-x-1">
                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/30 rounded-full animate-pulse"></div>
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="relative">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00ff41] to-[#00cc33] flex items-center justify-center shadow-lg">
                          <Bot className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff41]/30 to-[#00cc33]/30 rounded-full blur opacity-75 animate-pulse"></div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

              {/* Quick actions solo en mensaje inicial */}
              {messages.length === 1 && (
                <div className="absolute bottom-12 left-2 right-2 p-2 border-t border-white/10 bg-white/20 backdrop-blur-sm rounded-lg">
                  <div className="text-[8px] sm:text-[9px] text-white/60 mb-0.5 sm:mb-1 flex items-center space-x-1">
                    <div className="w-0.5 h-0.5 bg-[#00ff41] rounded-full animate-pulse"></div>
                    <span>{t('chatbot.actions')}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(action.action)}
                        className="flex items-center space-x-0.5 sm:space-x-1 px-1 py-0.5 sm:px-1.5 sm:py-1 md:px-2 md:py-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[#00ff41]/30 rounded-md sm:rounded-lg text-[9px] sm:text-xs text-white/80 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00ff41]/10"
                      >
                        <action.icon className="w-1.5 h-1.5 sm:w-2 sm:h-2 flex-shrink-0 text-[#00ff41]" />
                        <span className="truncate text-[9px] sm:text-xs">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input fijo en la parte inferior del modal */}
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-white/10 bg-white/40 backdrop-blur-sm rounded-b-lg z-10">
                 <div className="flex items-center space-x-2">
                   <input
                     ref={inputRef}
                     type="text"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyPress={handleKeyPress}
                     placeholder={t('chatbot.placeholder')}
                     className="flex-1 px-2 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50 transition-all duration-300 text-xs shadow-lg"
                     disabled={isTyping}
                   />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-1.5 bg-gradient-to-r from-[#00ff41]/20 to-[#00cc33]/20 hover:from-[#00ff41]/30 hover:to-[#00cc33]/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-300 flex-shrink-0 backdrop-blur-sm border border-[#00ff41]/30 hover:border-[#00ff41]/50 shadow-lg hover:shadow-[#00ff41]/25"
                  >
                    {isTyping ? (
                      <Loader2 className="w-3 h-3 text-[#00ff41] animate-spin" />
                    ) : (
                      <Send className="w-3 h-3 text-[#00ff41]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}
    </>
  );
}
