/**
 * API Endpoint para gestión de consentimiento GDPR
 * POST /api/gdpr/consent - Registrar consentimiento
 * GET /api/gdpr/consent - Obtener consentimientos del usuario
 * DELETE /api/gdpr/consent - Retirar consentimiento
 */

import { NextRequest, NextResponse } from 'next/server';
import { gdprCompliance } from '@/lib/compliance/gdpr';

export async function POST(request: NextRequest) {
  try {
    const { userId, purpose, granted, version } = await request.json();

    if (!userId || !purpose) {
      return NextResponse.json(
        { error: 'userId and purpose are required' },
        { status: 400 }
      );
    }

    await gdprCompliance.consentManager.recordConsent(
      userId,
      purpose,
      granted,
      version || '1.0'
    );

    return NextResponse.json({
      success: true,
      message: 'Consent recorded successfully',
      data: {
        userId,
        purpose,
        granted,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error recording consent:', error);
    return NextResponse.json(
      { error: 'Failed to record consent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const consentHistory = await gdprCompliance.consentManager.getConsentHistory(userId);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        consentHistory,
        totalConsents: consentHistory.length
      }
    });

  } catch (error) {
    console.error('Error fetching consent history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consent history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, purpose } = await request.json();

    if (!userId || !purpose) {
      return NextResponse.json(
        { error: 'userId and purpose are required' },
        { status: 400 }
      );
    }

    await gdprCompliance.consentManager.withdrawConsent(userId, purpose);

    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully',
      data: {
        userId,
        purpose,
        withdrawnAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error withdrawing consent:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}
