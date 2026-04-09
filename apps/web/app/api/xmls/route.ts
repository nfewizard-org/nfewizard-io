import { NextRequest, NextResponse } from 'next/server';
import { listXmlDocuments } from '@/lib/db/queries';

// GET /api/xmls?companyId=...&modelo=...&tipo=...&search=...
export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId') ?? undefined;
  const modelo = req.nextUrl.searchParams.get('modelo') ?? undefined;
  const tipo = req.nextUrl.searchParams.get('tipo') ?? undefined;
  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  const docs = listXmlDocuments({ companyId, modelo, tipo, search });
  return NextResponse.json(docs);
}
