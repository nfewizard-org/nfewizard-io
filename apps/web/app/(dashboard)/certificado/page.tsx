'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface Company {
  id: string;
  nome_fantasia: string;
  cnpj: string;
}

interface Certificate {
  id: string;
  company_id: string;
  file_name: string;
  validade: string;
  status: string;
  created_at: string;
  company?: Company;
}

function getCertStatusInfo(status: string) {
  switch (status) {
    case 'valid':   return { class: 'badge-success', label: 'Válido',   icon: CheckCircle, color: '#22c55e' };
    case 'expired': return { class: 'badge-danger',  label: 'Expirado', icon: XCircle,     color: '#ef4444' };
    case 'invalid': return { class: 'badge-danger',  label: 'Inválido', icon: XCircle,     color: '#ef4444' };
    case 'pending': return { class: 'badge-warning', label: 'Pendente', icon: Clock,       color: '#f59e0b' };
    default:        return { class: 'badge-muted',   label: status,     icon: Clock,       color: '#64748b' };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CertificadoPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadCompany, setUploadCompany] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetch('/api/empresas').then(res => res.json()).then(setCompanies);
  }, []);

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const q = selectedCompany ? `?companyId=${selectedCompany}` : '';
      const res = await fetch(`/api/certificados${q}`);
      if (res.ok) {
        const raw = await res.json();
        const enriched = raw.map((c: any) => ({
          ...c,
          company: companies.find((co) => co.id === c.company_id),
        }));
        setCerts(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, companies]);

  useEffect(() => {
    if (companies.length > 0) fetchCerts();
  }, [fetchCerts, companies]);

  const handleUpload = async () => {
    if (!uploadCompany || !password || !file) {
      setUploadError('Preencha empresa, selecione o arquivo .pfx e digite a senha.');
      return;
    }
    
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('companyId', uploadCompany);
    formData.append('senha', password);
    formData.append('file', file);

    try {
      const res = await fetch('/api/certificados/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error || 'Erro ao validar o certificado.');
      } else {
        // Success
        setUploadCompany('');
        setPassword('');
        setFile(null);
        if (document.getElementById('file-upload')) {
          (document.getElementById('file-upload') as HTMLInputElement).value = '';
        }
        fetchCerts(); // Refresh list
      }
    } catch (e) {
      setUploadError('Erro de conexão ao enviar arquivo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Certificados</h1>
          <p className="text-slate-500 text-sm mt-1">Upload e validação de certificados digitais A1.</p>
        </div>
      </div>

      {/* Upload Card */}
      <div className="glass-card mb-8 animate-fade-in-up stagger-1">
        <h2 className="text-base font-semibold text-slate-900 mb-5">Upload de Certificado</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Empresa *</label>
            <select className="input" value={uploadCompany} onChange={e => setUploadCompany(e.target.value)}>
              <option value="">Selecione a empresa</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Arquivo .pfx *</label>
            <label className="input flex items-center gap-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
              <Upload className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-500 text-sm truncate">
                {file ? file.name : 'Selecionar arquivo...'}
              </span>
              <input 
                id="file-upload"
                type="file" 
                accept=".pfx,.p12" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Senha do Certificado *</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>
        {uploadError && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {uploadError}
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : <><Upload className="w-4 h-4" /> Enviar e Validar</>}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 max-w-xs animate-fade-in-up stagger-2">
        <select
          className="input"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Todas as empresas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
          ))}
        </select>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-3">
        {loading && <div className="col-span-2 text-center text-slate-500 py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>}
        {!loading && certs.map((cert) => {
          const info = getCertStatusInfo(cert.status);
          const Icon = info.icon;
          const days = daysUntil(cert.validade);
          const expiring = cert.status === 'valid' && days <= 60;

          return (
            <div key={cert.id} className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${info.color}18` }}>
                    <ShieldCheck className="w-5 h-5" style={{ color: info.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{cert.company?.nome_fantasia ?? '—'}</p>
                    <p className="text-xs text-slate-500 font-mono">{cert.file_name}</p>
                  </div>
                </div>
                <span className={`badge ${info.class}`}>
                  <Icon className="w-3 h-3" /> {info.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Validade</p>
                  <p className="text-slate-900 mt-0.5">{formatDate(cert.validade)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Dias Restantes</p>
                  <p className={`mt-0.5 font-medium ${days <= 0 ? 'text-red-600' : expiring ? 'text-orange-500' : 'text-slate-900'}`}>
                    {days <= 0 ? 'Expirado' : `${days} dias`}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Empresa</p>
                  <p className="text-slate-600 mt-0.5 font-mono text-xs">{cert.company?.cnpj ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Upload</p>
                  <p className="text-slate-600 mt-0.5">{formatDate(cert.created_at)}</p>
                </div>
              </div>

              {expiring && (
                <div className="mt-4 flex items-center gap-2 text-orange-500 text-xs bg-yellow-400/10 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Certificado expira em menos de 60 dias
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!loading && certs.length === 0 && (
        <div className="glass-card">
          <div className="empty-state">
            <ShieldCheck />
            <p>Nenhum certificado encontrado. Selecione uma empresa e faça o upload do arquivo .pfx.</p>
          </div>
        </div>
      )}
    </div>
  );
}
