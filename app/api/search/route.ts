import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/localwiki';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json([]);
  const results = searchArticles(q);
  return NextResponse.json(results);
}
