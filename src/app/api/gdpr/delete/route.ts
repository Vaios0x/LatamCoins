/**
 * API Endpoint para derecho al olvido GDPR
 * DELETE /api/gdpr/delete - Eliminar datos del usuario
 */

import { NextRequest, NextResponse } from 'next/server';
import { gdprCompliance } from '@/lib/compliance/gdpr';

export async function DELETE(request: NextRequest) {
  try {
    const { userId, confirmDeletion } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!confirmDeletion) {
      return NextResponse.json(
        { error: 'confirmDeletion must be true to proceed' },
        { status: 400 }
      );
    }

    const deletionResult = await gdprCompliance.rightToErasure.deleteUserData(userId);

    if (deletionResult.success) {
      return NextResponse.json({
        success: true,
        message: 'User data deleted successfully',
        data: {
          userId,
          deletedRecords: deletionResult.deletedRecords,
          deletedAt: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Partial deletion completed with errors',
          data: {
            deletedRecords: deletionResult.deletedRecords,
            errors: deletionResult.errors
          }
        },
        { status: 207 } // Multi-Status
      );
    }

  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json(
      { error: 'Failed to delete user data' },
      { status: 500 }
    );
  }
}
