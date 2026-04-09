import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DB_DIR, 'nfewizard.db');

// Ensure .data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Empresas
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      razao_social TEXT NOT NULL,
      nome_fantasia TEXT NOT NULL DEFAULT '',
      cnpj TEXT NOT NULL UNIQUE,
      uf TEXT NOT NULL,
      municipio TEXT NOT NULL DEFAULT '',
      observacoes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Certificados
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      validade TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','valid','expired','invalid')),
      secret_ref TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Jobs de Sincronização
    CREATE TABLE IF NOT EXISTS sync_jobs (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      company_name TEXT NOT NULL DEFAULT '',
      tipo_execucao TEXT NOT NULL CHECK(tipo_execucao IN ('backfill','incremental')),
      modelos TEXT NOT NULL DEFAULT '[]',
      tipos TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','running','paused','completed','failed','partial')),
      progresso INTEGER NOT NULL DEFAULT 0 CHECK(progresso BETWEEN 0 AND 100),
      periodo_start TEXT,
      periodo_end TEXT,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at TEXT
    );

    -- Checkpoints de Sincronização
    CREATE TABLE IF NOT EXISTS sync_checkpoints (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      modelo TEXT NOT NULL,
      ultimo_nsu TEXT NOT NULL DEFAULT '000000000000000',
      ultimo_periodo_processado TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Documentos XML
    CREATE TABLE IF NOT EXISTS xml_documents (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      company_name TEXT NOT NULL DEFAULT '',
      modelo TEXT NOT NULL CHECK(modelo IN ('55','65')),
      tipo TEXT NOT NULL CHECK(tipo IN ('entrada','saida')),
      chave TEXT NOT NULL,
      nsu TEXT NOT NULL,
      competencia TEXT NOT NULL,
      path TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'stored' CHECK(status IN ('stored','duplicate','invalid','failed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(chave)
    );

    -- Cobertura por Competência
    CREATE TABLE IF NOT EXISTS coverage_snapshots (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      periodo TEXT NOT NULL,
      modelo TEXT NOT NULL,
      tipo TEXT NOT NULL,
      cobertura INTEGER NOT NULL DEFAULT 0,
      faltas INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'not_processed' CHECK(status IN ('not_processed','partial','complete','failed')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(company_id, periodo, modelo, tipo)
    );

    -- Logs
    CREATE TABLE IF NOT EXISTS job_logs (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES sync_jobs(id) ON DELETE CASCADE,
      nivel TEXT NOT NULL DEFAULT 'info' CHECK(nivel IN ('info','warn','error')),
      mensagem TEXT NOT NULL,
      payload TEXT,
      tentativa INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
    CREATE INDEX IF NOT EXISTS idx_certificates_company ON certificates(company_id);
    CREATE INDEX IF NOT EXISTS idx_sync_jobs_company ON sync_jobs(company_id);
    CREATE INDEX IF NOT EXISTS idx_xml_documents_company ON xml_documents(company_id);
    CREATE INDEX IF NOT EXISTS idx_xml_documents_chave ON xml_documents(chave);
    CREATE INDEX IF NOT EXISTS idx_xml_documents_competencia ON xml_documents(competencia);
    CREATE INDEX IF NOT EXISTS idx_coverage_company ON coverage_snapshots(company_id);
    CREATE INDEX IF NOT EXISTS idx_job_logs_job ON job_logs(job_id);
  `);
}

export default getDb;
