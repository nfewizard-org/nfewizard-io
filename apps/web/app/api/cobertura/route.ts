import { NextRequest, NextResponse } from 'next/server';
import { listCoverage } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }
  const coverage = listCoverage(companyId);
  return NextResponse.json(coverage);
}
