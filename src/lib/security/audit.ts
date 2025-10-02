/**
 * Sistema de Auditoría y Logging de Seguridad
 * Monitoreo completo de eventos de seguridad y compliance
 */

import { NextRequest } from 'next/server';

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  details: any;
  source: string;
  sessionId?: string;
  requestId?: string;
}

export type SecurityEventType = 
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'AUTH_BLOCKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_INPUT'
  | 'XSS_ATTEMPT'
  | 'SQL_INJECTION_ATTEMPT'
  | 'UNAUTHORIZED_ACCESS'
  | 'DATA_EXPORT'
  | 'DATA_DELETION'
  | 'CONSENT_CHANGE'
  | 'ADMIN_ACTION'
  | 'API_ABUSE'
  | 'SUSPICIOUS_ACTIVITY';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  ipAddress: string;
  userAgent: string;
  details: any;
  sessionId?: string;
}

/**
 * Clase de Auditoría de Seguridad
 */
export class SecurityAuditor {
  private events: SecurityEvent[] = [];
  private auditLogs: AuditLog[] = [];
  private readonly maxEvents: number = 10000;
  private readonly maxLogs: number = 50000;

  /**
   * Registra evento de seguridad
   */
  async logSecurityEvent(
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    description: string,
    details: any,
    request?: NextRequest,
    userId?: string
  ): Promise<void> {
    const event: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      userId,
      ipAddress: request ? this.getClientIP(request) : 'unknown',
      userAgent: request ? request.headers.get('user-agent') || 'unknown' : 'unknown',
      eventType,
      severity,
      description,
      details: this.sanitizeDetails(details),
      source: 'coinlatamcap-api',
      sessionId: request ? this.getSessionId(request) : undefined,
      requestId: this.generateId()
    };

    this.events.push(event);
    
    // Mantener límite de eventos
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log a consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${severity}: ${description}`, details);
    }

    // En producción, enviar a sistema de logging
    if (process.env.NODE_ENV === 'production') {
      await this.sendToSecuritySystem(event);
    }

    // Alertas para eventos críticos
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      await this.sendSecurityAlert(event);
    }
  }

  /**
   * Registra log de auditoría
   */
  async logAuditEvent(
    action: string,
    resource: string,
    result: 'SUCCESS' | 'FAILURE' | 'BLOCKED',
    details: any,
    request?: NextRequest,
    userId?: string
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      userId,
      action,
      resource,
      result,
      ipAddress: request ? this.getClientIP(request) : 'unknown',
      userAgent: request ? request.headers.get('user-agent') || 'unknown' : 'unknown',
      details: this.sanitizeDetails(details),
      sessionId: request ? this.getSessionId(request) : undefined
    };

    this.auditLogs.push(auditLog);
    
    // Mantener límite de logs
    if (this.auditLogs.length > this.maxLogs) {
      this.auditLogs = this.auditLogs.slice(-this.maxLogs);
    }
  }

  /**
   * Detecta actividad sospechosa
   */
  async detectSuspiciousActivity(
    request: NextRequest,
    userId?: string
  ): Promise<boolean> {
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Detectar patrones sospechosos
    const suspiciousPatterns = [
      /bot|crawler|spider/i,
      /curl|wget|python|java/i,
      /sqlmap|nikto|nmap/i,
      /admin|root|test/i
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(userAgent) || pattern.test(request.url)
    );

    if (isSuspicious) {
      await this.logSecurityEvent(
        'SUSPICIOUS_ACTIVITY',
        'MEDIUM',
        'Suspicious user agent or request pattern detected',
        { ip, userAgent, url: request.url },
        request,
        userId
      );
    }

    return isSuspicious;
  }

  /**
   * Detecta intentos de inyección
   */
  async detectInjectionAttempt(
    input: string,
    request: NextRequest,
    userId?: string
  ): Promise<boolean> {
    const injectionPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\#|\/\*|\*\/)/g,
      /\$where|\$ne|\$gt|\$lt|\$regex/gi
    ];

    const hasInjection = injectionPatterns.some(pattern => pattern.test(input));

    if (hasInjection) {
      await this.logSecurityEvent(
        'XSS_ATTEMPT',
        'HIGH',
        'Potential XSS or injection attempt detected',
        { input: input.substring(0, 100), pattern: 'injection_detected' },
        request,
        userId
      );
    }

    return hasInjection;
  }

  /**
   * Detecta abuso de APIs
   */
  async detectAPIAbuse(
    request: NextRequest,
    userId?: string,
    requestCount: number = 0
  ): Promise<boolean> {
    const isAbuse = requestCount > 100; // Más de 100 requests en ventana

    if (isAbuse) {
      await this.logSecurityEvent(
        'API_ABUSE',
        'HIGH',
        'Potential API abuse detected',
        { requestCount, url: request.url },
        request,
        userId
      );
    }

    return isAbuse;
  }

  /**
   * Obtiene eventos de seguridad por período
   */
  getSecurityEvents(
    startDate?: Date,
    endDate?: Date,
    severity?: SecuritySeverity
  ): SecurityEvent[] {
    let filtered = this.events;

    if (startDate) {
      filtered = filtered.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(event => event.timestamp <= endDate);
    }

    if (severity) {
      filtered = filtered.filter(event => event.severity === severity);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Obtiene logs de auditoría por usuario
   */
  getAuditLogsByUser(userId: string, limit: number = 100): AuditLog[] {
    return this.auditLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Obtiene estadísticas de seguridad
   */
  getSecurityStats(): {
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    mediumEvents: number;
    lowEvents: number;
    last24Hours: number;
    topEventTypes: { type: SecurityEventType; count: number }[];
  } {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const last24HoursEvents = this.events.filter(
      event => event.timestamp >= last24Hours
    );

    const eventTypeCounts = new Map<SecurityEventType, number>();
    this.events.forEach(event => {
      const count = eventTypeCounts.get(event.eventType) || 0;
      eventTypeCounts.set(event.eventType, count + 1);
    });

    const topEventTypes = Array.from(eventTypeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEvents: this.events.length,
      criticalEvents: this.events.filter(e => e.severity === 'CRITICAL').length,
      highEvents: this.events.filter(e => e.severity === 'HIGH').length,
      mediumEvents: this.events.filter(e => e.severity === 'MEDIUM').length,
      lowEvents: this.events.filter(e => e.severity === 'LOW').length,
      last24Hours: last24HoursEvents.length,
      topEventTypes
    };
  }

  /**
   * Genera reporte de compliance
   */
  generateComplianceReport(): {
    gdprEvents: number;
    dataExports: number;
    dataDeletions: number;
    consentChanges: number;
    unauthorizedAccess: number;
  } {
    const gdprEvents = this.events.filter(e => 
      e.eventType === 'DATA_EXPORT' || 
      e.eventType === 'DATA_DELETION' || 
      e.eventType === 'CONSENT_CHANGE'
    ).length;

    const dataExports = this.events.filter(e => e.eventType === 'DATA_EXPORT').length;
    const dataDeletions = this.events.filter(e => e.eventType === 'DATA_DELETION').length;
    const consentChanges = this.events.filter(e => e.eventType === 'CONSENT_CHANGE').length;
    const unauthorizedAccess = this.events.filter(e => e.eventType === 'UNAUTHORIZED_ACCESS').length;

    return {
      gdprEvents,
      dataExports,
      dataDeletions,
      consentChanges,
      unauthorizedAccess
    };
  }

  /**
   * Obtiene IP del cliente
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (cfConnectingIP) return cfConnectingIP;
    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIP) return realIP;
    
    return 'unknown';
  }

  /**
   * Obtiene session ID
   */
  private getSessionId(request: NextRequest): string | undefined {
    return request.headers.get('x-session-id') || undefined;
  }

  /**
   * Genera ID único
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Sanitiza detalles para logging
   */
  private sanitizeDetails(details: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    
    if (typeof details === 'object' && details !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(details)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeDetails(value);
        }
      }
      return sanitized;
    }
    
    return details;
  }

  /**
   * Envía evento a sistema de seguridad
   */
  private async sendToSecuritySystem(event: SecurityEvent): Promise<void> {
    // En producción, integrar con sistemas como:
    // - Splunk
    // - ELK Stack
    // - Datadog
    // - New Relic
    console.log('Sending to security system:', event);
  }

  /**
   * Envía alerta de seguridad
   */
  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    // En producción, enviar alertas a:
    // - Email
    // - Slack
    // - PagerDuty
    // - SMS
    console.log('SECURITY ALERT:', event);
  }
}

// Instancia global del auditor
export const securityAuditor = new SecurityAuditor();

/**
 * Middleware de auditoría para APIs
 */
export function auditMiddleware(
  action: string,
  resource: string
) {
  return (handler: Function) => {
    return async (request: NextRequest, user?: any) => {
      const startTime = Date.now();
      let result: 'SUCCESS' | 'FAILURE' | 'BLOCKED' = 'SUCCESS';
      let response: Response;

      try {
        response = await handler(request, user);
        
        if (response.status >= 400) {
          result = 'FAILURE';
        }
        
        await securityAuditor.logAuditEvent(
          action,
          resource,
          result,
          {
            method: request.method,
            url: request.url,
            status: response.status,
            duration: Date.now() - startTime
          },
          request,
          user?.id
        );

        return response;
      } catch (error) {
        result = 'FAILURE';
        
        await securityAuditor.logAuditEvent(
          action,
          resource,
          result,
          {
            method: request.method,
            url: request.url,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration: Date.now() - startTime
          },
          request,
          user?.id
        );

        throw error;
      }
    };
  };
}
