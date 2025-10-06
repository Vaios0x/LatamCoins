import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!address) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token address is required' 
      }, { status: 400 });
    }

    console.log(`📈 Fetching recent trades for ${address}...`);

    // Obtener trades recientes de Birdeye v3
    const response = await fetch(
      `https://public-api.birdeye.so/defi/v3/txs/recent?address=${address}&limit=${limit}&chain=solana`,
      {
        headers: {
          'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Birdeye trades error: ${response.status}`);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch trades'
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json({
        success: false,
        error: data.message || 'Invalid response from Birdeye'
      }, { status: 400 });
    }

    // Procesar trades
    const trades = (data.data?.items || []).map((trade: any) => ({
      timestamp: trade.timestamp,
      price: trade.price,
      volume: trade.volume,
      side: trade.side, // 'buy' or 'sell'
      txHash: trade.txHash,
      user: trade.user
    }));

    console.log(`✅ Fetched ${trades.length} recent trades from Birdeye v3`);

    return NextResponse.json({
      success: true,
      data: trades,
      source: 'birdeye-v3',
      count: trades.length
    });

  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
