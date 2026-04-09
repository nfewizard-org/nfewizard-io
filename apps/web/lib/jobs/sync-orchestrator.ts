import { getDb } from '../db/client';
import { getCompany, getCompanyByCnpj } from '../db/queries';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

// Removed static import to avoid Next.js SSR and Turbopack issues with native dependencies
// import { NFeWizard } from 'nfewizard-io';

const XML_DIR = path.join(process.cwd(), '.data', 'xmls');
const CERTS_DIR = path.join(process.cwd(), '.data', 'certs');
if (!fs.existsSync(XML_DIR)) fs.mkdirSync(XML_DIR, { recursive: true });

function log(jobId: string, nivel: 'info' | 'warn' | 'error', mensagem: string, payload?: any) {
  const db = getDb();
  db.prepare(`
    INSERT INTO job_logs (id, job_id, nivel, mensagem, payload)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuid(), jobId, nivel, mensagem, payload ? JSON.stringify(payload) : null);
}

function updateJobProgress(jobId: string, progresso: number, status: string, endedAt?: string) {
  const db = getDb();
  const args: any[] = [progresso, status];
  let endSql = '';
  if (endedAt) {
    endSql = ', ended_at = ?';
    args.push(endedAt);
  }
  args.push(jobId);
  db.prepare(`
    UPDATE sync_jobs SET progresso = ?, status = ? ${endSql} WHERE id = ?
  `).run(...args);
}

function getCheckpoint(companyId: string, modelo: string) {
  const db = getDb();
  const cp = db.prepare('SELECT * FROM sync_checkpoints WHERE company_id = ? AND modelo = ?').get(companyId, modelo) as any;
  return cp?.ultimo_nsu || '000000000000000';
}

function setCheckpoint(companyId: string, modelo: string, nsu: string) {
  const db = getDb();
  const id = uuid();
  return db.prepare(`
    INSERT INTO sync_checkpoints (id, company_id, modelo, ultimo_nsu)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(company_id, modelo) DO UPDATE SET ultimo_nsu = excluded.ultimo_nsu, updated_at = datetime('now')
  `).run(id, companyId, modelo, nsu);
}

export async function processSyncJob(jobId: string) {
  const db = getDb();
  
  // 1. Get the Job
  const job = db.prepare('SELECT * FROM sync_jobs WHERE id = ?').get(jobId) as any;
  if (!job) return;

  log(jobId, 'info', `Iniciando job de sincronização ${job.tipo_execucao}`);
  updateJobProgress(jobId, 5, 'running');

  // 2. Get the Company and Certificate
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(job.company_id) as any;
  if (!company) {
    log(jobId, 'error', 'Empresa não encontrada');
    updateJobProgress(jobId, 100, 'failed', new Date().toISOString());
    return;
  }

  const cert = db.prepare('SELECT * FROM certificates WHERE company_id = ? AND status = "valid" ORDER BY created_at DESC LIMIT 1').get(job.company_id) as any;
  
  if (!cert) {
    log(jobId, 'error', 'Nenhum certificado válido encontrado para a empresa');
    updateJobProgress(jobId, 100, 'failed', new Date().toISOString());
    return;
  }

  const certPath = path.join(CERTS_DIR, cert.file_name); 
  const certFiles = fs.readdirSync(CERTS_DIR).filter(f => f.startsWith(`${job.company_id}_`) && f.endsWith('.pfx'));
  if (certFiles.length === 0) {
      log(jobId, 'error', 'Arquivo do certificado não encontrado no disco');
      updateJobProgress(jobId, 100, 'failed', new Date().toISOString());
      return;
  }
  const realCertPath = path.join(CERTS_DIR, certFiles[0]);
  const senhaCertificado = Buffer.from(cert.secret_ref, 'base64').toString('utf-8');

  // 3. Init NFeWizard
  try {
    const { NFeWizard } = await import('nfewizard-io');
    const wizard = new NFeWizard();
    await wizard.NFE_LoadEnvironment({
      config: {
        dfe: {
          pathCertificado: realCertPath,
          senhaCertificado,
          UF: company.uf || 'SP', // Fallback, OpenCNPJ sets it
          CPFCNPJ: company.cnpj.replace(/\D/g, ''),
          baixarXMLDistribuicao: false,
          armazenarXMLAutorizacao: false,
          armazenarXMLConsulta: false,
        },
        nfe: {
          ambiente: 1, // Produção
          versaoDF: '4.00'
        }
      }
    });

    log(jobId, 'info', 'Ambiente NFeWizard carregado com sucesso');

    const modelos = JSON.parse(job.modelos);
    let totalProgress = 20;
    const progressPerModel = 80 / modelos.length;

    // 4. Process each model
    for (const [idx, modelo] of modelos.entries()) {
      log(jobId, 'info', `Processando modelo ${modelo}`);
      let currentNsu = getCheckpoint(job.company_id, modelo);
      let isDone = false;
      let countForModel = 0;

      while (!isDone && countForModel < 50) { // Safety limit for dev
        log(jobId, 'info', `Buscando a partir do NSU: ${currentNsu} para modelo ${modelo}`);
        
        try {
          // Dummy map for UF to cUFAutor. In MVP we stick to 35 (SP) if not found.
          const ufMap: Record<string, number> = { SP: 35, RJ: 33, MG: 31, ES: 32, PR: 41, SC: 42, RS: 43 };
          const cUFAutor = ufMap[company.uf] || 35;

          const response = await wizard.NFE_DistribuicaoDFePorUltNSU({
            cUFAutor,
            CNPJ: company.cnpj.replace(/\D/g, ''),
            distNSU: {
              ultNSU: currentNsu,
            }
          });

          if (!response || !response.retDistDFeInt) {
            log(jobId, 'error', `Resposta inválida da SEFAZ`, response);
            break;
          }

          const ret = response.retDistDFeInt;
          
          if (ret.cStat === '137') {
            log(jobId, 'info', 'Nenhum documento localizado (137)');
            isDone = true;
          } else if (ret.cStat === '138') {
            log(jobId, 'info', 'Documentos localizados (138)', { ultNSU: ret.ultNSU, maxNSU: ret.maxNSU });
            
            // Process docZip
            if (ret.loteDistDFeInt && ret.loteDistDFeInt.docZip) {
              const docs = Array.isArray(ret.loteDistDFeInt.docZip) ? ret.loteDistDFeInt.docZip : [ret.loteDistDFeInt.docZip];
              
              for (const doc of docs) {
                 // Save the XML logic would go here. We decode base64.
                 // In the MVP, we can just insert a simulated record based on the raw response info.
                 const chave = doc.NSU + '-' + job.company_id; // mock key
                 
                 db.prepare(`
                   INSERT OR IGNORE INTO xml_documents 
                   (id, company_id, company_name, modelo, tipo, chave, nsu, competencia, path)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                 `).run(uuid(), job.company_id, company.nome_fantasia, modelo, 'entrada', chave, doc.NSU, new Date().toISOString().substring(0,7), '');
              }
            }
            
            currentNsu = String(ret.ultNSU).padStart(15, '0');
            setCheckpoint(job.company_id, modelo, currentNsu);
            countForModel++;
          } else {
            log(jobId, 'warn', `Retorno desconhecido da SEFAZ: ${ret.cStat} - ${ret.xMotivo}`);
            break;
          }
        } catch (err: any) {
          log(jobId, 'error', `Erro na chamada do SEFAZ: ${err.message}`);
          throw err;
        }
      }

      totalProgress += progressPerModel;
      updateJobProgress(jobId, Math.floor(totalProgress), 'running');
    }

    log(jobId, 'info', 'Sincronização concluída com sucesso');
    updateJobProgress(jobId, 100, 'completed', new Date().toISOString());

  } catch (error: any) {
    log(jobId, 'error', `Falha catastrófica no orchestrator: ${error.message}`);
    updateJobProgress(jobId, 100, 'failed', new Date().toISOString());
  }
}
