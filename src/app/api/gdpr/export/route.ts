/**
 * API Endpoint para exportación de datos GDPR
 * GET /api/gdpr/export - Exportar datos del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { gdprCompliance } from '@/lib/compliance/gdpr';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const format = searchParams.get('format') || 'json';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (format === 'csv') {
      const csvData = await gdprCompliance.dataPortability.exportUserDataCSV(userId);
      
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="user-data-${userId}.csv"`
        }
      });
    } else {
      const userData = await gdprCompliance.dataPortability.exportUserData(userId);
      
      return NextResponse.json({
        success: true,
        data: userData,
        message: 'Data exported successfully'
      });
    }

  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
}
