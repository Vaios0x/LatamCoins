/**
 * API Endpoint para monitoreo de seguridad
 * GET /api/security/status - Estado del sistema de seguridad
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityAuditor } from '@/lib/security/audit';
import { secureRateLimit } from '@/lib/security/rateLimit';
import { secureAuth } from '@/lib/security/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar rate limiting
    const rateLimitResult = secureRateLimit.checkPublicAPIRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Obtener estadísticas de seguridad
    const securityStats = securityAuditor.getSecurityStats();
    const complianceReport = securityAuditor.generateComplianceReport();
    const rateLimitStats = secureRateLimit.getStats();

    // Obtener eventos críticos de las últimas 24 horas
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const criticalEvents = securityAuditor.getSecurityEvents(
      last24Hours,
      undefined,
      'CRITICAL'
    );

    const highEvents = securityAuditor.getSecurityEvents(
      last24Hours,
      undefined,
      'HIGH'
    );

    // Estado general del sistema
    const systemStatus = {
      security: {
        status: criticalEvents.length > 0 ? 'CRITICAL' : 
                highEvents.length > 5 ? 'WARNING' : 'HEALTHY',
        lastCheck: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
      },
      rateLimiting: {
        active: rateLimitStats.activeEntries,
        blocked: rateLimitStats.blockedEntries,
        total: rateLimitStats.totalEntries
      },
      events: {
        total: securityStats.totalEvents,
        critical: securityStats.criticalEvents,
        high: securityStats.highEvents,
        medium: securityStats.mediumEvents,
        low: securityStats.lowEvents,
        last24Hours: securityStats.last24Hours
      },
      compliance: {
        gdprEvents: complianceReport.gdprEvents,
        dataExports: complianceReport.dataExports,
        dataDeletions: complianceReport.dataDeletions,
        consentChanges: complianceReport.consentChanges,
        unauthorizedAccess: complianceReport.unauthorizedAccess
      },
      topThreats: securityStats.topEventTypes,
      recentCriticalEvents: criticalEvents.slice(0, 5).map(event => ({
        id: event.id,
        timestamp: event.timestamp,
        type: event.eventType,
        severity: event.severity,
        description: event.description,
        ipAddress: event.ipAddress
      }))
    };

    // Headers de seguridad
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
    };

    return NextResponse.json({
      success: true,
      data: systemStatus,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: securityHeaders
    });

  } catch (error) {
    console.error('Security status error:', error);
    
    // Log del error de seguridad
    await securityAuditor.logSecurityEvent(
      'API_ABUSE',
      'MEDIUM',
      'Error retrieving security status',
      { error: error instanceof Error ? error.message : 'Unknown error' },
      request
    );

    return NextResponse.json(
      { error: 'Failed to retrieve security status' },
      { status: 500 }
    );
  }
}
