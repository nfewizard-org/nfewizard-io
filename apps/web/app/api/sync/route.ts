import { NextRequest, NextResponse } from 'next/server';
import { listSyncJobs, createSyncJob } from '@/lib/db/queries';

// GET /api/sync?companyId=...
export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId') ?? undefined;
  const jobs = listSyncJobs(companyId);
  
  const parsed = (jobs as Record<string, unknown>[]).map((j) => ({
    ...j,
    modelos: typeof j.modelos === 'string' ? JSON.parse(j.modelos as string) : j.modelos,
    tipos: typeof j.tipos === 'string' ? JSON.parse(j.tipos as string) : j.tipos,
  }));

  return NextResponse.json(parsed);
}

// POST /api/sync
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companyId, companyName, tipoExecucao, modelos, tipos, periodoStart, periodoEnd } = body;

  if (!companyId || !tipoExecucao || !modelos?.length || !tipos?.length) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
  }

  const job = createSyncJob({ companyId, companyName, tipoExecucao, modelos, tipos, periodoStart, periodoEnd });
  return NextResponse.json(job, { status: 201 });
}
