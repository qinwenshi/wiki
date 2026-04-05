import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url') || '';

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Security: only allow Wikipedia/Wikimedia images
  try {
    const parsed = new URL(imageUrl);
    const allowed = ['upload.wikimedia.org', 'en.wikipedia.org', 'commons.wikimedia.org'];
    if (!allowed.some(domain => parsed.hostname.endsWith(domain))) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'WikiClone/1.0',
        'Referer': 'https://en.wikipedia.org/',
      },
    });

    if (!res.ok) {
      return new NextResponse('Image fetch failed', { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
