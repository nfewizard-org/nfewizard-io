'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Copy, Files, Loader2 } from 'lucide-react';

interface XmlDoc {
  id: string;
  company_id: string;
  companyName?: string;
  company_name?: string;
  modelo: string;
  tipo: string;
  chave: string;
  nsu: string;
  competencia: string;
  status: string;
  created_at: string;
}

interface Company {
  id: string;
  nome_fantasia: string;
}

function DocStatusBadge({ status }: { status: string }) {
  const map: Record<string, { class: string; label: string }> = {
    stored:    { class: 'badge-success', label: 'Armazenado' },
    duplicate: { class: 'badge-warning', label: 'Duplicado' },
    invalid:   { class: 'badge-danger',  label: 'Inválido' },
    failed:    { class: 'badge-danger',  label: 'Falha' },
  };
  const s = map[status] ?? { class: 'badge-muted', label: status };
  return <span className={`badge ${s.class}`}>{s.label}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function XmlsPage() {
  const [search, setSearch] = useState('');
  const [filterModelo, setFilterModelo] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  const [docs, setDocs] = useState<XmlDoc[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Load companies for the dropdown
  useEffect(() => {
    fetch('/api/empresas').then(res => res.json()).then(setCompanies);
  }, []);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search) p.append('search', search);
      if (filterModelo) p.append('modelo', filterModelo);
      if (filterTipo) p.append('tipo', filterTipo);
      if (filterCompany) p.append('companyId', filterCompany);

      const res = await fetch(`/api/xmls?${p.toString()}`);
      if (res.ok) {
        setDocs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterModelo, filterTipo, filterCompany]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchDocs();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchDocs]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">XMLs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Documentos fiscais sincronizados
          {!loading && <span className="ml-2 badge badge-muted">{docs.length} registros</span>}
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 animate-fade-in-up stagger-1">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input !pl-10"
            placeholder="Buscar por chave ou NSU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
          <option value="">Todas empresas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
          ))}
        </select>
        <select className="input" value={filterModelo} onChange={(e) => setFilterModelo(e.target.value)}>
          <option value="">Todos modelos</option>
          <option value="55">NF-e (55)</option>
          <option value="65">NFC-e (65)</option>
        </select>
        <select className="input" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
          <option value="">Todos tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-table animate-fade-in-up stagger-2">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Chave</th>
                <th>NSU</th>
                <th>Competência</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex items-center justify-center py-12 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
                    </div>
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Files />
                      <p>Nenhum documento encontrado com os filtros aplicados.</p>
                    </div>
                  </td>
                </tr>
              ) : docs.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-medium text-slate-900">{doc.companyName || doc.company_name}</td>
                  <td><span className="badge badge-info">{doc.modelo}</span></td>
                  <td className="capitalize text-slate-600">{doc.tipo}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] text-slate-600 max-w-[180px] truncate" title={doc.chave}>
                        {doc.chave}
                      </span>
                      <button
                        className="p-1 rounded hover:bg-slate-900/[0.06] transition-colors"
                        title="Copiar chave"
                        onClick={() => navigator.clipboard.writeText(doc.chave)}
                      >
                        <Copy className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  </td>
                  <td className="font-mono text-[13px] text-slate-600">{doc.nsu}</td>
                  <td className="text-slate-600">{doc.competencia}</td>
                  <td><DocStatusBadge status={doc.status} /></td>
                  <td className="text-slate-600">{formatDate(doc.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
