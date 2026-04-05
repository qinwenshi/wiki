import { NextRequest, NextResponse } from 'next/server';
import { getBacklinks } from '@/lib/localwiki';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('title') || '';
  const backlinks = getBacklinks(slug);
  return NextResponse.json({ backlinks });
}
