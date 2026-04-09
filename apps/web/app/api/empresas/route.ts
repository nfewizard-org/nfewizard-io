import { NextRequest, NextResponse } from 'next/server';
import { listCompanies, createCompany, getCompanyByCnpj } from '@/lib/db/queries';

// GET /api/empresas?search=...
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const companies = listCompanies(search);
  return NextResponse.json(companies);
}

// POST /api/empresas
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { razaoSocial, nomeFantasia, cnpj, uf, municipio, observacoes } = body;

  if (!razaoSocial || !cnpj || !uf) {
    return NextResponse.json({ error: 'Campos obrigatórios: razaoSocial, cnpj, uf' }, { status: 400 });
  }

  // Check duplicate CNPJ
  const existing = getCompanyByCnpj(cnpj);
  if (existing) {
    return NextResponse.json({ error: 'Empresa com este CNPJ já está cadastrada.' }, { status: 409 });
  }

  const company = createCompany({ razaoSocial, nomeFantasia, cnpj, uf, municipio, observacoes });
  return NextResponse.json(company, { status: 201 });
}
