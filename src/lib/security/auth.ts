/**
 * Sistema de Autenticación Seguro para CoinLatamCap
 * JWT + 2FA + Rate Limiting + Security Headers
 */

import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  isVerified: boolean;
  lastLogin: Date;
  ipAddress: string;
  userAgent: string;
}

export interface AuthSession {
  userId: string;
  sessionId: string;
  token: string;
  expiresAt: Date;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

/**
 * Clase principal de autenticación segura
 */
export class SecureAuth {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;
  private readonly maxLoginAttempts: number;
  private readonly lockoutDuration: number;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    this.maxLoginAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
    this.lockoutDuration = parseInt(process.env.LOCKOUT_DURATION || '900000'); // 15 minutes
  }

  /**
   * Genera JWT token seguro
   */
  generateToken(user: AuthUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      isVerified: user.isVerified,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
    };

    const options: SignOptions = {
      expiresIn: this.jwtExpiresIn
    };
    return jwt.sign(payload, this.jwtSecret as Secret, options);
  }

  /**
   * Genera refresh token
   */
  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Verifica JWT token
   */
  verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret as Secret) as any;
      
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions || [],
        isVerified: decoded.isVerified || false,
        lastLogin: new Date(decoded.iat * 1000),
        ipAddress: '', // Will be set by middleware
        userAgent: '' // Will be set by middleware
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Genera hash seguro para contraseñas
   */
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return salt + ':' + hash.toString('hex');
  }

  /**
   * Verifica contraseña
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':');
    const hashVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return hash === hashVerify.toString('hex');
  }

  /**
   * Genera código 2FA
   */
  generate2FACode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Verifica código 2FA
   */
  verify2FACode(code: string, storedCode: string, expiresAt: Date): boolean {
    if (new Date() > expiresAt) {
      return false;
    }
    return code === storedCode;
  }

  /**
   * Middleware de autenticación
   */
  requireAuth(handler: Function) {
    return async (request: NextRequest) => {
      try {
        const token = this.extractToken(request);
        
        if (!token) {
          return new Response('Unauthorized: No token provided', { 
            status: 401,
            headers: this.securityHeaders()
          });
        }

        const user = this.verifyToken(token);
        if (!user) {
          return new Response('Unauthorized: Invalid token', { 
            status: 401,
            headers: this.securityHeaders()
          });
        }

        // Verificar si el usuario está bloqueado
        if (await this.isUserLocked(user.id)) {
          return new Response('Account temporarily locked', { 
            status: 423,
            headers: this.securityHeaders()
          });
        }

        // Agregar información de la request al usuario
        user.ipAddress = this.getClientIP(request);
        user.userAgent = request.headers.get('user-agent') || '';

        return handler(request, user);
      } catch (error) {
        console.error('Auth middleware error:', error);
        return new Response('Internal server error', { 
          status: 500,
          headers: this.securityHeaders()
        });
      }
    };
  }

  /**
   * Middleware de autorización por roles
   */
  requireRole(allowedRoles: string[]) {
    return (handler: Function) => {
      return async (request: NextRequest, user: AuthUser) => {
        if (!allowedRoles.includes(user.role)) {
          return new Response('Forbidden: Insufficient permissions', { 
            status: 403,
            headers: this.securityHeaders()
          });
        }
        return handler(request, user);
      };
    };
  }

  /**
   * Middleware de autorización por permisos
   */
  requirePermission(permission: string) {
    return (handler: Function) => {
      return async (request: NextRequest, user: AuthUser) => {
        if (!user.permissions.includes(permission)) {
          return new Response('Forbidden: Missing permission', { 
            status: 403,
            headers: this.securityHeaders()
          });
        }
        return handler(request, user);
      };
    };
  }

  /**
   * Rate limiting por usuario
   */
  async checkRateLimit(userId: string, action: string, limit: number = 100): Promise<boolean> {
    // En producción, usar Redis o base de datos
    const key = `rate_limit:${userId}:${action}`;
    // Implementar lógica de rate limiting
    return true; // Placeholder
  }

  /**
   * Bloquea usuario por intentos fallidos
   */
  async lockUser(userId: string, reason: string): Promise<void> {
    // Implementar bloqueo temporal
    console.log(`User ${userId} locked: ${reason}`);
  }

  /**
   * Verifica si usuario está bloqueado
   */
  async isUserLocked(userId: string): Promise<boolean> {
    // Implementar verificación de bloqueo
    return false; // Placeholder
  }

  /**
   * Extrae token del header Authorization
   */
  private extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Obtiene IP del cliente
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }

  /**
   * Headers de seguridad
   */
  private securityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-XSS-Protection': '1; mode=block',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    };
  }
}

// Instancia global del sistema de autenticación
export const secureAuth = new SecureAuth();
