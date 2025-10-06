import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const timeframe = searchParams.get('timeframe') || '24h';

    if (!address) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token address is required' 
      }, { status: 400 });
    }

    console.log(`📊 Fetching price stats for ${address} (${timeframe})...`);

    // Obtener estadísticas de precio de Birdeye v3
    const response = await fetch(
      `https://public-api.birdeye.so/defi/v3/price/stats/single?address=${address}&type=${timeframe}&chain=solana`,
      {
        headers: {
          'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Birdeye price stats error: ${response.status}`);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch price stats'
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json({
        success: false,
        error: data.message || 'Invalid response from Birdeye'
      }, { status: 400 });
    }

    console.log(`✅ Fetched price stats from Birdeye v3`);

    return NextResponse.json({
      success: true,
      data: {
        currentPrice: data.data?.value || 0,
        priceChange: data.data?.priceChange24h || 0,
        high24h: data.data?.high24h || 0,
        low24h: data.data?.low24h || 0,
        volume24h: data.data?.volume24h || 0,
        marketCap: data.data?.marketCap || 0,
        source: 'birdeye-v3',
        timeframe
      }
    });

  } catch (error) {
    console.error('Error fetching price stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
