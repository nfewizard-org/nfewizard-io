'use client';

import { useState, useEffect } from 'react';
import { Grid3X3, CheckCircle, AlertTriangle, XCircle, MinusCircle, Loader2 } from 'lucide-react';

interface Company {
  id: string;
  nome_fantasia: string;
  cnpj: string;
}

interface CoverageItem {
  periodo: string;
  modelo: string;
  tipo: string;
  status: 'complete' | 'partial' | 'failed' | 'not_processed';
}

function StatusCell({ status }: { status: CoverageItem['status'] }) {
  switch (status) {
    case 'complete':
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center" title="Completo">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      );
    case 'partial':
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center" title="Parcial">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center" title="Falha">
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-8 h-8 rounded-lg bg-slate-900/[0.04] flex items-center justify-center" title="Não processado">
            <MinusCircle className="w-4 h-4 text-[#475569]" />
          </div>
        </div>
      );
  }
}

export default function CoberturaPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/empresas').then(res => res.json()).then(data => {
      setCompanies(data);
      if (data.length > 0) setSelectedCompany(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    setLoading(true);
    fetch(`/api/cobertura?companyId=${selectedCompany}`)
      .then(res => res.json())
      .then(setCoverage)
      .finally(() => setLoading(false));
  }, [selectedCompany]);

  const periods = [...new Set(coverage.map((c) => c.periodo))].sort().reverse();

  const getStatus = (periodo: string, modelo: '55' | '65', tipo: 'entrada' | 'saida'): CoverageItem['status'] => {
    const found = coverage.find(
      (c) => c.periodo === periodo && c.modelo === modelo && c.tipo === tipo
    );
    return found?.status ?? 'not_processed';
  };

  const company = companies.find((c) => c.id === selectedCompany);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cobertura</h1>
          <p className="text-slate-500 text-sm mt-1">Grade mensal de cobertura por modelo e tipo.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in-up stagger-1">
        <div className="w-64">
          <select
            className="input"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
            ))}
          </select>
        </div>
        {company && (
          <span className="badge badge-info font-mono text-xs">{company.cnpj}</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-6 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-5 h-5 rounded bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
          </div>
          Completo
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-5 h-5 rounded bg-orange-500/15 flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
          </div>
          Parcial
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-5 h-5 rounded bg-red-500/15 flex items-center justify-center">
            <XCircle className="w-3 h-3 text-red-600" />
          </div>
          Falha
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-5 h-5 rounded bg-slate-900/[0.04] flex items-center justify-center">
            <MinusCircle className="w-3 h-3 text-[#475569]" />
          </div>
          Não processado
        </div>
      </div>

      {/* Coverage Grid */}
      <div className="glass-table animate-fade-in-up stagger-3">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white/90 backdrop-blur z-10" style={{ minWidth: 120 }}>Competência</th>
                <th className="text-center" style={{ minWidth: 90 }}>
                  <div className="text-center">
                    <span className="badge badge-info text-[10px] mb-1">55</span>
                    <p>Entrada</p>
                  </div>
                </th>
                <th className="text-center" style={{ minWidth: 90 }}>
                  <div className="text-center">
                    <span className="badge badge-info text-[10px] mb-1">55</span>
                    <p>Saída</p>
                  </div>
                </th>
                <th className="text-center" style={{ minWidth: 90 }}>
                  <div className="text-center">
                    <span className="badge badge-info text-[10px] mb-1">65</span>
                    <p>Entrada</p>
                  </div>
                </th>
                <th className="text-center" style={{ minWidth: 90 }}>
                  <div className="text-center">
                    <span className="badge badge-info text-[10px] mb-1">65</span>
                    <p>Saída</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex items-center justify-center py-12 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
                    </div>
                  </td>
                </tr>
              ) : periods.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <Grid3X3 />
                      <p>Nenhum dado de cobertura disponível para esta empresa.</p>
                    </div>
                  </td>
                </tr>
              ) : periods.map((periodo) => {
                const [y, m] = periodo.split('-');
                const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                const label = `${monthNames[parseInt(m) - 1]} ${y}`;
                return (
                  <tr key={periodo}>
                    <td className="font-medium text-slate-900 sticky left-0 bg-white/90 backdrop-blur z-10">
                      {label}
                    </td>
                    <td><StatusCell status={getStatus(periodo, '55', 'entrada')} /></td>
                    <td><StatusCell status={getStatus(periodo, '55', 'saida')} /></td>
                    <td><StatusCell status={getStatus(periodo, '65', 'entrada')} /></td>
                    <td><StatusCell status={getStatus(periodo, '65', 'saida')} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
