import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// Map property types to Pexels search queries
function getSearchQuery(bhk: number, type: string): string {
  const isBuy = type === 'buy';

  if (bhk === 1) {
    return isBuy ? 'studio apartment interior' : 'studio apartment rent';
  } else if (bhk === 2) {
    return isBuy ? 'modern 2bhk apartment interior' : '2 bedroom apartment living room';
  } else if (bhk === 3) {
    return isBuy ? 'luxury 3bhk apartment interior' : '3 bedroom apartment modern';
  } else if (bhk >= 4) {
    return isBuy ? 'luxury villa interior design' : 'villa living room';
  }

  return 'modern apartment interior';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bhk = parseInt(searchParams.get('bhk') || '2');
    const type = searchParams.get('type') || 'buy';
    const roomType = searchParams.get('roomType') || 'main';

    if (!PEXELS_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const query = getSearchQuery(bhk, type);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return NextResponse.json(
        { url: 'https://images.pexels.com/photos/1454165/pexels-binyamin-mellish-1454165.jpeg' },
        {
          headers: {
            'Cache-Control': 'public, max-age=86400',
          },
        }
      );
    }

    const imageUrl = data.photos[0].src.large;

    return NextResponse.json(
      { url: imageUrl },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching image:', error);

    // Return fallback image on error
    return NextResponse.json(
      { url: 'https://images.pexels.com/photos/1454165/pexels-binyamin-mellish-1454165.jpeg' },
      { status: 200 }
    );
  }
}
