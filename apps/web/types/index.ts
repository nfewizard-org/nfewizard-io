// ─── Enums ──────────────────────────────────────────────────────

export type CompanyStatus = 'active' | 'inactive';
export type CertificateStatus = 'pending' | 'valid' | 'expired' | 'invalid';
export type JobStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'partial';
export type DocumentStatus = 'stored' | 'duplicate' | 'invalid' | 'failed';
export type CoverageStatus = 'not_processed' | 'partial' | 'complete' | 'failed';
export type Modelo = '55' | '65';
export type Tipo = 'entrada' | 'saida';
export type LogLevel = 'info' | 'warn' | 'error';

// ─── Entidades ──────────────────────────────────────────────────

export interface Company {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  uf: string;
  observacoes: string;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  companyId: string;
  fileName: string;
  validade: string;
  status: CertificateStatus;
  secretRef: string;
  createdAt: string;
}

export interface SyncJob {
  id: string;
  companyId: string;
  companyName?: string;
  tipoExecucao: 'backfill' | 'incremental';
  modelos: Modelo[];
  tipos: Tipo[];
  status: JobStatus;
  progresso: number; // 0-100
  startedAt: string;
  endedAt?: string;
}

export interface SyncCheckpoint {
  id: string;
  companyId: string;
  modelo: Modelo;
  ultimoNsu: string;
  ultimoPeriodoProcessado: string;
  updatedAt: string;
}

export interface XmlDocument {
  id: string;
  companyId: string;
  companyName?: string;
  modelo: Modelo;
  tipo: Tipo;
  chave: string;
  nsu: string;
  competencia: string;
  path: string;
  status: DocumentStatus;
  createdAt: string;
}

export interface CoverageSnapshot {
  id: string;
  companyId: string;
  periodo: string;
  modelo: Modelo;
  tipo: Tipo;
  cobertura: number;
  faltas: number;
  status: CoverageStatus;
  updatedAt: string;
}

export interface JobLog {
  id: string;
  jobId: string;
  nivel: LogLevel;
  mensagem: string;
  payload?: string;
  tentativa?: number;
  createdAt: string;
}
