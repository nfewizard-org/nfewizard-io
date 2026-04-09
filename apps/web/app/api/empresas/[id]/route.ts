import { NextRequest, NextResponse } from 'next/server';
import { getCompany, updateCompany, deleteCompany } from '@/lib/db/queries';

// GET /api/empresas/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
  return NextResponse.json(company);
}

// PATCH /api/empresas/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateCompany(id, body);
  if (!updated) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/empresas/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteCompany(id);
  if (!ok) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
