/**
 * Sistema de Validación y Sanitización Seguro
 * Protección contra inyección, XSS, y ataques de validación
 */

import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Esquemas de validación para APIs
 */
export const userSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  email: z.string().email('Invalid email format').max(255),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.enum(['user', 'admin', 'moderator'], {
    errorMap: () => ({ message: 'Invalid role' })
  })
});

export const gdprConsentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  purpose: z.enum(['analytics', 'marketing', 'trading', 'security'], {
    errorMap: () => ({ message: 'Invalid consent purpose' })
  }),
  granted: z.boolean(),
  version: z.string().optional().default('1.0')
});

export const tokenDataSchema = z.object({
  symbol: z.string().min(1).max(10).regex(/^[A-Z0-9]+$/, 'Invalid token symbol'),
  name: z.string().min(1).max(100),
  contract: z.string().regex(/^[A-Za-z0-9]{32,44}$/, 'Invalid contract address'),
  price: z.number().positive('Price must be positive'),
  change24h: z.number().finite('Invalid change value'),
  volume24h: z.number().nonnegative('Volume cannot be negative'),
  marketCap: z.number().nonnegative('Market cap cannot be negative')
});

export const apiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  endpoint: z.string().min(1).max(255),
  userId: z.string().uuid().optional(),
  timestamp: z.date().default(() => new Date()),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional()
});

/**
 * Clase de validación segura
 */
export class SecureValidator {
  private readonly maxStringLength: number = 1000;
  private readonly allowedHtmlTags: string[] = ['b', 'i', 'em', 'strong'];
  private readonly blockedPatterns: RegExp[] = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  /**
   * Valida y sanitiza input del usuario
   */
  validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      const result = schema.parse(data);
      return this.sanitizeData(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error('Invalid input data');
    }
  }

  /**
   * Sanitiza datos recursivamente
   */
  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Sanitiza string contra XSS y inyección
   */
  sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Truncar si es muy largo
    let sanitized = input.substring(0, this.maxStringLength);

    // Detectar patrones maliciosos
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(sanitized)) {
        throw new Error('Potentially malicious input detected');
      }
    }

    // Usar DOMPurify para limpiar HTML
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: this.allowedHtmlTags,
      ALLOWED_ATTR: []
    });

    // Escapar caracteres especiales
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  /**
   * Valida email con regex estricto
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Valida UUID v4
   */
  validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Valida dirección de contrato Solana
   */
  validateSolanaAddress(address: string): boolean {
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaRegex.test(address);
  }

  /**
   * Valida número con límites seguros
   */
  validateNumber(value: number, min: number = -Number.MAX_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): boolean {
    return !isNaN(value) && isFinite(value) && value >= min && value <= max;
  }

  /**
   * Valida URL segura
   */
  validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['https:', 'http:'];
      const allowedDomains = [
        'coinlatamcap.com',
        'api.coinlatamcap.com',
        'dexscreener.com',
        'pump.fun',
        'solana.com'
      ];
      
      return allowedProtocols.includes(urlObj.protocol) && 
             allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
    } catch {
      return false;
    }
  }

  /**
   * Valida JSON seguro
   */
  validateJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  }

  /**
   * Detecta intentos de inyección SQL
   */
  detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\#|\/\*|\*\/)/g,
      /(\b(OR|AND)\b.*\b(OR|AND)\b)/gi,
      /(\b(UNION|UNION ALL)\b)/gi,
      /(\b(EXEC|EXECUTE)\b)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detecta intentos de inyección NoSQL
   */
  detectNoSQLInjection(input: string): boolean {
    const nosqlPatterns = [
      /\$where/gi,
      /\$ne/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$regex/gi,
      /\$exists/gi,
      /\$in/gi,
      /\$nin/gi,
      /\$or/gi,
      /\$and/gi
    ];

    return nosqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Valida rate limiting
   */
  validateRateLimit(identifier: string, limit: number, windowMs: number): boolean {
    // En producción, implementar con Redis
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    
    // Placeholder - implementar lógica real
    return true;
  }

  /**
   * Sanitiza para logging (remover datos sensibles)
   */
  sanitizeForLogging(data: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeForLogging(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }
}

// Instancia global del validador
export const secureValidator = new SecureValidator();

/**
 * Middleware de validación para APIs
 */
export function validateAPIRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json();
      return secureValidator.validateInput(schema, body);
    } catch (error) {
      throw new Error(`API validation failed: ${error}`);
    }
  };
}

/**
 * Middleware de sanitización para inputs
 */
export function sanitizeInput(input: any): any {
  return secureValidator.sanitizeData(input);
}
