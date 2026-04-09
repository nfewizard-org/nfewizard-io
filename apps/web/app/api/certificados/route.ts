import { NextRequest, NextResponse } from 'next/server';
import { listCertificates, createCertificate } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId') ?? undefined;
  const certs = listCertificates(companyId);
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyId, fileName, validade, status, secretRef } = body;

  if (!companyId || !fileName || !validade) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
  }

  const cert = createCertificate({ companyId, fileName, validade, status, secretRef });
  return NextResponse.json(cert, { status: 201 });
}
