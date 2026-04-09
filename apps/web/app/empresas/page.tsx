'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Search, Pencil, SearchIcon, Loader2, CheckCircle, AlertCircle, X, Trash2 } from 'lucide-react';

// ─── Tipos ──────────────────────────────────────────────────────
interface Company {
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

interface CnpjApiResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  uf: string;
  municipio: string;
}

// ─── Helpers ─────────────────────────────────────────────────────
function formatCnpj(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 2)  return d;
  if (d.length <= 5)  return `${d.slice(0,2)}.${d.slice(2)}`;
  if (d.length <= 8)  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

function StatusBadge({ status }: { status: string }) {
  return status === 'active'
    ? <span className="badge badge-success">Ativa</span>
    : <span className="badge badge-muted">Inativa</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

// ─── Modal de Cadastro com Busca CNPJ ────────────────────────────
function CompanyModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [cnpjInput, setCnpjInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [obs, setObs] = useState('');

  function reset() {
    setCnpjInput(''); setLoading(false); setSaving(false); setError(''); setFetched(false);
    setRazaoSocial(''); setNomeFantasia(''); setUf(''); setMunicipio(''); setObs('');
  }

  function handleClose() { reset(); onClose(); }

  async function buscarCnpj() {
    const digits = cnpjInput.replace(/\D/g, '');
    if (digits.length !== 14) { setError('Informe um CNPJ com 14 dígitos.'); return; }
    setLoading(true); setError(''); setFetched(false);

    try {
      const res = await fetch(`https://api.opencnpj.org/${digits}`);
      if (res.status === 404) { setError('CNPJ não encontrado na base da Receita Federal.'); return; }
      if (res.status === 429) { setError('Limite de consultas atingido. Aguarde e tente novamente.'); return; }
      if (!res.ok) { setError(`Erro ao consultar CNPJ (HTTP ${res.status}).`); return; }
      const data: CnpjApiResponse = await res.json();
      setRazaoSocial(data.razao_social ?? '');
      setNomeFantasia(data.nome_fantasia ?? '');
      setUf(data.uf ?? '');
      setMunicipio(data.municipio ?? '');
      setFetched(true);
    } catch { setError('Falha na conexão com a API OpenCNPJ.'); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razaoSocial, nomeFantasia, cnpj: cnpjInput, uf, municipio, observacoes: obs,
        }),
      });
      if (res.status === 409) { setError('Empresa com este CNPJ já está cadastrada.'); return; }
      if (!res.ok) { const r = await res.json(); setError(r.error || 'Erro ao salvar.'); return; }
      onSaved();
      handleClose();
    } catch { setError('Erro de conexão ao salvar empresa.'); }
    finally { setSaving(false); }
  }

  if (!open) return null;
  const UFs = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={handleClose}>
      <div className="absolute inset-0 bg-[#e2e8f0]/80 backdrop-blur-md" />
      <div className="glass-modal relative z-10 w-full max-w-xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Nova Empresa</h2>
            <p className="text-sm text-slate-500 mt-0.5">Busque pelo CNPJ para preencher automaticamente.</p>
          </div>
          <button onClick={handleClose} className="btn btn-ghost !p-2 !rounded-xl"><X className="w-4 h-4" /></button>
        </div>

        {/* CNPJ Search */}
        <div className="mb-6 p-4 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent)]/20">
          <label className="block text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">Buscar por CNPJ</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input !pl-9 !bg-white/80" placeholder="00.000.000/0000-00" value={cnpjInput}
                onChange={(e) => { setCnpjInput(formatCnpj(e.target.value)); setError(''); if (fetched) setFetched(false); }}
                onKeyDown={(e) => e.key === 'Enter' && buscarCnpj()} maxLength={18} />
            </div>
            <button className="btn btn-primary whitespace-nowrap" onClick={buscarCnpj} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</> : <><SearchIcon className="w-4 h-4" /> Buscar</>}
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          {fetched && !error && (
            <div className="mt-3 flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
              <CheckCircle className="w-4 h-4 shrink-0" />Dados preenchidos automaticamente. Revise e confirme.
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Razão Social *</label>
            <input className="input" placeholder="Nome jurídico da empresa" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Nome Fantasia</label>
            <input className="input" placeholder="Nome comercial (se houver)" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">CNPJ *</label>
              <input className="input" value={cnpjInput} readOnly placeholder="Preenchido pela busca" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">UF *</label>
              <select className="input" value={uf} onChange={(e) => setUf(e.target.value)}>
                <option value="">Selecione</option>
                {UFs.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {municipio && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Município</label>
              <input className="input" value={municipio} readOnly />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Observações</label>
            <textarea className="input" rows={2} placeholder="Notas internas..." style={{ resize: 'vertical' }} value={obs} onChange={(e) => setObs(e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="btn btn-ghost" onClick={handleClose}>Cancelar</button>
          <button className="btn btn-primary" disabled={!razaoSocial || !cnpjInput || !uf || saving} onClick={handleSave}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : 'Cadastrar Empresa'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página ─────────────────────────────────────────────────────
export default function EmpresasPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const fetchCompanies = useCallback(async () => {
    setLoadingList(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/empresas${q}`);
      if (res.ok) setCompanies(await res.json());
    } catch (e) { console.error('Erro ao carregar empresas', e); }
    finally { setLoadingList(false); }
  }, [search]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    await fetch(`/api/empresas/${id}`, { method: 'DELETE' });
    fetchCompanies();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Empresas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie as empresas cadastradas no sistema.
            {!loadingList && <span className="ml-2 badge badge-muted">{companies.length} registros</span>}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Nova Empresa
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md animate-fade-in-up stagger-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input !pl-10" placeholder="Buscar por razão social, fantasia ou CNPJ..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="glass-table animate-fade-in-up stagger-2">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>Nome Fantasia</th>
                <th>CNPJ</th>
                <th>UF</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
                    </div>
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <Building2 />
                      <p>{search ? 'Nenhuma empresa encontrada com os filtros atuais.' : 'Nenhuma empresa cadastrada. Clique em "+ Nova Empresa" para começar.'}</p>
                    </div>
                  </td>
                </tr>
              ) : companies.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-slate-900">{c.razao_social}</td>
                  <td className="text-slate-600">{c.nome_fantasia}</td>
                  <td className="font-mono text-[13px] text-slate-600">{c.cnpj}</td>
                  <td><span className="badge badge-info">{c.uf}</span></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-slate-600">{formatDate(c.created_at)}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-sm !p-2 !rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="btn btn-danger btn-sm !p-2 !rounded-lg" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyModal open={showModal} onClose={() => setShowModal(false)} onSaved={fetchCompanies} />
    </div>
  );
}
