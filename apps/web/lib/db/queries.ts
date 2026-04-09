import { getDb } from './client';
import { v4 as uuid } from 'uuid';

// ─── Companies ──────────────────────────────────────────────────

export interface CompanyRow {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  uf: string;
  municipio: string;
  observacoes: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export function listCompanies(search?: string): CompanyRow[] {
  const db = getDb();
  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    return db.prepare(`
      SELECT * FROM companies 
      WHERE LOWER(razao_social) LIKE ? 
         OR LOWER(nome_fantasia) LIKE ? 
         OR cnpj LIKE ?
      ORDER BY created_at DESC
    `).all(q, q, q) as CompanyRow[];
  }
  return db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all() as CompanyRow[];
}

export function getCompany(id: string): CompanyRow | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM companies WHERE id = ?').get(id) as CompanyRow | undefined;
}

export function getCompanyByCnpj(cnpj: string): CompanyRow | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM companies WHERE cnpj = ?').get(cnpj) as CompanyRow | undefined;
}

export function createCompany(data: {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  uf: string;
  municipio?: string;
  observacoes?: string;
}): CompanyRow {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO companies (id, razao_social, nome_fantasia, cnpj, uf, municipio, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.razaoSocial, data.nomeFantasia ?? '', data.cnpj, data.uf, data.municipio ?? '', data.observacoes ?? '');
  return getCompany(id)!;
}

export function updateCompany(id: string, data: Partial<{
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  uf: string;
  municipio: string;
  observacoes: string;
  status: 'active' | 'inactive';
}>): CompanyRow | undefined {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.razaoSocial !== undefined) { fields.push('razao_social = ?'); values.push(data.razaoSocial); }
  if (data.nomeFantasia !== undefined) { fields.push('nome_fantasia = ?'); values.push(data.nomeFantasia); }
  if (data.cnpj !== undefined) { fields.push('cnpj = ?'); values.push(data.cnpj); }
  if (data.uf !== undefined) { fields.push('uf = ?'); values.push(data.uf); }
  if (data.municipio !== undefined) { fields.push('municipio = ?'); values.push(data.municipio); }
  if (data.observacoes !== undefined) { fields.push('observacoes = ?'); values.push(data.observacoes); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }

  if (fields.length === 0) return getCompany(id);

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE companies SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getCompany(id);
}

export function deleteCompany(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM companies WHERE id = ?').run(id);
  return result.changes > 0;
}

// ─── Dashboard Stats ────────────────────────────────────────────

export function getDashboardStats() {
  const db = getDb();
  const companies = db.prepare("SELECT COUNT(*) as count FROM companies WHERE status = 'active'").get() as { count: number };
  const xmls = db.prepare("SELECT COUNT(*) as count FROM xml_documents WHERE status = 'stored'").get() as { count: number };
  const failures = db.prepare("SELECT COUNT(*) as count FROM sync_jobs WHERE status = 'failed'").get() as { count: number };
  const completePeriods = db.prepare("SELECT COUNT(DISTINCT periodo) as count FROM coverage_snapshots WHERE status = 'complete'").get() as { count: number };

  return {
    activeCompanies: companies.count,
    storedXmls: xmls.count,
    completePeriods: completePeriods.count,
    pendingFailures: failures.count,
  };
}

export function getRecentSyncJobs(limit = 10) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM sync_jobs ORDER BY started_at DESC LIMIT ?
  `).all(limit);
}

// ─── Certificates ───────────────────────────────────────────────

export function listCertificates(companyId?: string) {
  const db = getDb();
  if (companyId) {
    return db.prepare('SELECT * FROM certificates WHERE company_id = ? ORDER BY created_at DESC').all(companyId);
  }
  return db.prepare('SELECT * FROM certificates ORDER BY created_at DESC').all();
}

export function createCertificate(data: {
  companyId: string;
  fileName: string;
  validade: string;
  status?: string;
  secretRef?: string;
}) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO certificates (id, company_id, file_name, validade, status, secret_ref)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.companyId, data.fileName, data.validade, data.status ?? 'pending', data.secretRef ?? '');
  return db.prepare('SELECT * FROM certificates WHERE id = ?').get(id);
}

// ─── Sync Jobs ──────────────────────────────────────────────────

export function listSyncJobs(companyId?: string) {
  const db = getDb();
  if (companyId) {
    return db.prepare('SELECT * FROM sync_jobs WHERE company_id = ? ORDER BY started_at DESC').all(companyId);
  }
  return db.prepare('SELECT * FROM sync_jobs ORDER BY started_at DESC').all();
}

export function createSyncJob(data: {
  companyId: string;
  companyName: string;
  tipoExecucao: 'backfill' | 'incremental';
  modelos: string[];
  tipos: string[];
  periodoStart?: string;
  periodoEnd?: string;
}) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO sync_jobs (id, company_id, company_name, tipo_execucao, modelos, tipos, periodo_start, periodo_end, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(id, data.companyId, data.companyName, data.tipoExecucao, JSON.stringify(data.modelos), JSON.stringify(data.tipos), data.periodoStart ?? null, data.periodoEnd ?? null);
  return db.prepare('SELECT * FROM sync_jobs WHERE id = ?').get(id);
}

// ─── XML Documents ──────────────────────────────────────────────

export function listXmlDocuments(filters?: { companyId?: string; modelo?: string; tipo?: string; search?: string }) {
  const db = getDb();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters?.companyId) { clauses.push('company_id = ?'); params.push(filters.companyId); }
  if (filters?.modelo) { clauses.push('modelo = ?'); params.push(filters.modelo); }
  if (filters?.tipo) { clauses.push('tipo = ?'); params.push(filters.tipo); }
  if (filters?.search) { clauses.push('(chave LIKE ? OR nsu LIKE ?)'); params.push(`%${filters.search}%`, `%${filters.search}%`); }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return db.prepare(`SELECT * FROM xml_documents ${where} ORDER BY created_at DESC LIMIT 200`).all(...params);
}

// ─── Job Logs ───────────────────────────────────────────────────

export function listJobLogs(filters?: { jobId?: string; nivel?: string }) {
  const db = getDb();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters?.jobId) { clauses.push('job_id = ?'); params.push(filters.jobId); }
  if (filters?.nivel) { clauses.push('nivel = ?'); params.push(filters.nivel); }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return db.prepare(`SELECT * FROM job_logs ${where} ORDER BY created_at DESC LIMIT 200`).all(...params);
}

export function createJobLog(data: {
  jobId: string;
  nivel: 'info' | 'warn' | 'error';
  mensagem: string;
  payload?: string;
  tentativa?: number;
}) {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO job_logs (id, job_id, nivel, mensagem, payload, tentativa)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.jobId, data.nivel, data.mensagem, data.payload ?? null, data.tentativa ?? null);
}

// ─── Coverage ───────────────────────────────────────────────────

export function listCoverage(companyId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM coverage_snapshots WHERE company_id = ? ORDER BY periodo DESC').all(companyId);
}
