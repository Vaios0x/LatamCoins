import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`📊 Fetching gainers/losers (${timeframe})...`);

    // Obtener gainers/losers de Birdeye
    const response = await fetch(
      `https://public-api.birdeye.so/trader/gainers-losers?time_frame=${timeframe}&limit=${limit}`,
      {
        headers: {
          'X-API-KEY': process.env.BIRDEYE_API_KEY || '',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Birdeye gainers/losers error: ${response.status}`);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch gainers/losers'
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json({
        success: false,
        error: data.message || 'Invalid response from Birdeye'
      }, { status: 400 });
    }

    // Procesar datos
    const gainers = (data.data?.gainers || []).map((token: any) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      priceChange: token.priceChange,
      volume24h: token.volume24h,
      marketCap: token.marketCap
    }));

    const losers = (data.data?.losers || []).map((token: any) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      priceChange: token.priceChange,
      volume24h: token.volume24h,
      marketCap: token.marketCap
    }));

    console.log(`✅ Fetched ${gainers.length} gainers and ${losers.length} losers from Birdeye`);

    return NextResponse.json({
      success: true,
      data: {
        gainers,
        losers
      },
      source: 'birdeye',
      timeframe,
      count: { gainers: gainers.length, losers: losers.length }
    });

  } catch (error) {
    console.error('Error fetching gainers/losers:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
