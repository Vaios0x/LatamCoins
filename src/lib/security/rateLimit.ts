/**
 * Sistema de Rate Limiting Avanzado
 * Protección contra DDoS, abuso de APIs y ataques de fuerza bruta
 */

import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
  onLimitReached?: (req: NextRequest, res: Response) => void;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  lastRequest: number;
}

/**
 * Clase de Rate Limiting Seguro
 */
export class SecureRateLimit {
  private rateLimitMap: Map<string, RateLimitEntry> = new Map();
  private readonly defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  /**
   * Verifica rate limit para una request
   */
  checkRateLimit(
    request: NextRequest, 
    config: Partial<RateLimitConfig> = {}
  ): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
    const finalConfig = { ...this.defaultConfig, ...config };
    const key = this.generateKey(request, finalConfig);
    const now = Date.now();
    
    const entry = this.rateLimitMap.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Nueva ventana de tiempo
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + finalConfig.windowMs,
        blocked: false,
        lastRequest: now
      });
      
      return {
        allowed: true,
        remaining: finalConfig.maxRequests - 1,
        resetTime: now + finalConfig.windowMs
      };
    }
    
    if (entry.blocked) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter
      };
    }
    
    if (entry.count >= finalConfig.maxRequests) {
      // Bloquear por exceso de requests
      entry.blocked = true;
      entry.resetTime = now + finalConfig.windowMs;
      
      if (finalConfig.onLimitReached) {
        finalConfig.onLimitReached(request, new Response('Rate limit exceeded'));
      }
      
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter
      };
    }
    
    // Incrementar contador
    entry.count++;
    entry.lastRequest = now;
    
    return {
      allowed: true,
      remaining: finalConfig.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Rate limiting por IP
   */
  checkIPRateLimit(request: NextRequest, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    const ip = this.getClientIP(request);
    return this.checkRateLimit(request, {
      windowMs,
      maxRequests,
      keyGenerator: () => `ip:${ip}`
    });
  }

  /**
   * Rate limiting por usuario autenticado
   */
  checkUserRateLimit(request: NextRequest, userId: string, maxRequests: number = 1000, windowMs: number = 15 * 60 * 1000) {
    return this.checkRateLimit(request, {
      windowMs,
      maxRequests,
      keyGenerator: () => `user:${userId}`
    });
  }

  /**
   * Rate limiting por endpoint específico
   */
  checkEndpointRateLimit(request: NextRequest, endpoint: string, maxRequests: number = 50, windowMs: number = 60 * 1000) {
    const ip = this.getClientIP(request);
    return this.checkRateLimit(request, {
      windowMs,
      maxRequests,
      keyGenerator: () => `endpoint:${endpoint}:${ip}`
    });
  }

  /**
   * Rate limiting para APIs de trading (más restrictivo)
   */
  checkTradingRateLimit(request: NextRequest, userId: string) {
    return this.checkRateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // Solo 10 requests por minuto
      keyGenerator: () => `trading:${userId}`,
      onLimitReached: (req, res) => {
        console.warn(`Trading rate limit exceeded for user: ${userId}`);
      }
    });
  }

  /**
   * Rate limiting para APIs de GDPR (muy restrictivo)
   */
  checkGDPRRateLimit(request: NextRequest, userId: string) {
    return this.checkRateLimit(request, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5, // Solo 5 requests por hora
      keyGenerator: () => `gdpr:${userId}`,
      onLimitReached: (req, res) => {
        console.warn(`GDPR rate limit exceeded for user: ${userId}`);
      }
    });
  }

  /**
   * Rate limiting para login (protección contra fuerza bruta)
   */
  checkLoginRateLimit(request: NextRequest, identifier: string) {
    return this.checkRateLimit(request, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // Solo 5 intentos por 15 minutos
      keyGenerator: () => `login:${identifier}`,
      onLimitReached: (req, res) => {
        console.warn(`Login rate limit exceeded for: ${identifier}`);
        // En producción, bloquear IP temporalmente
      }
    });
  }

  /**
   * Rate limiting para APIs públicas
   */
  checkPublicAPIRateLimit(request: NextRequest) {
    const ip = this.getClientIP(request);
    return this.checkRateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60, // 60 requests por minuto
      keyGenerator: () => `public:${ip}`
    });
  }

  /**
   * Genera clave única para rate limiting
   */
  private generateKey(request: NextRequest, config: RateLimitConfig): string {
    if (config.keyGenerator) {
      return config.keyGenerator(request);
    }
    
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const endpoint = new URL(request.url).pathname;
    
    return `rate_limit:${ip}:${endpoint}:${userAgent.substring(0, 50)}`;
  }

  /**
   * Obtiene IP del cliente
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }

  /**
   * Limpia entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }

  /**
   * Obtiene estadísticas de rate limiting
   */
  getStats(): { totalEntries: number; blockedEntries: number; activeEntries: number } {
    const now = Date.now();
    let blockedEntries = 0;
    let activeEntries = 0;
    
    for (const entry of this.rateLimitMap.values()) {
      if (entry.blocked) {
        blockedEntries++;
      }
      if (now <= entry.resetTime) {
        activeEntries++;
      }
    }
    
    return {
      totalEntries: this.rateLimitMap.size,
      blockedEntries,
      activeEntries
    };
  }

  /**
   * Resetea rate limit para una clave específica
   */
  resetRateLimit(key: string): void {
    this.rateLimitMap.delete(key);
  }

  /**
   * Bloquea una clave específica
   */
  blockKey(key: string, duration: number = 15 * 60 * 1000): void {
    const now = Date.now();
    this.rateLimitMap.set(key, {
      count: Number.MAX_SAFE_INTEGER,
      resetTime: now + duration,
      blocked: true,
      lastRequest: now
    });
  }
}

// Instancia global del rate limiter
export const secureRateLimit = new SecureRateLimit();

/**
 * Middleware de rate limiting para APIs
 */
export function rateLimitMiddleware(
  config: Partial<RateLimitConfig> = {}
) {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const rateLimitResult = secureRateLimit.checkRateLimit(request, config);
      
      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            retryAfter: rateLimitResult.retryAfter,
            resetTime: new Date(rateLimitResult.resetTime).toISOString()
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': config.maxRequests?.toString() || '100',
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
              'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
            }
          }
        );
      }
      
      // Agregar headers de rate limit a la response
      const response = await handler(request);
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', config.maxRequests?.toString() || '100');
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      }
      
      return response;
    };
  };
}

/**
 * Configuraciones predefinidas de rate limiting
 */
export const rateLimitConfigs = {
  // APIs públicas
  publicAPI: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  },
  
  // APIs de autenticación
  authAPI: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  
  // APIs de trading
  tradingAPI: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  },
  
  // APIs de GDPR
  gdprAPI: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5
  },
  
  // APIs de datos en tiempo real
  realtimeAPI: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100
  }
};
