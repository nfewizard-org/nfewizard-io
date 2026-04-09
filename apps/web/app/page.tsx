'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  CalendarCheck,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

interface DashboardStats {
  activeCompanies: number;
  storedXmls: number;
  completePeriods: number;
  pendingFailures: number;
}

interface SyncJob {
  id: string;
  companyName: string;
  tipoExecucao: string;
  modelos: string[];
  progresso: number;
  status: string;
  startedAt?: string;
  started_at?: string; // DB uses snake case for some fields
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { class: string; label: string }> = {
    completed: { class: 'badge-success', label: 'Concluído' },
    running:   { class: 'badge-info',    label: 'Em execução' },
    failed:    { class: 'badge-danger',  label: 'Falha' },
    paused:    { class: 'badge-warning', label: 'Pausado' },
    pending:   { class: 'badge-muted',   label: 'Pendente' },
    partial:   { class: 'badge-warning', label: 'Parcial' },
  };
  const s = map[status] ?? { class: 'badge-muted', label: status };
  return <span className={`badge ${s.class}`}>{s.label}</span>;
}

function ProgressBar({ value, status }: { value: number; status: string }) {
  const cls = status === 'failed' ? 'danger' : status === 'paused' ? 'warning' : value === 100 ? 'success' : '';
  return (
    <div className="progress-bar">
      <div className={`progress-bar-fill ${cls}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function DashboardPage() {
  const [data, setData] = useState<{ stats: DashboardStats | null, recentJobs: SyncJob[] }>({
    stats: null,
    recentJobs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statConfig = [
    {
      label: 'Empresas Ativas',
      value: data.stats?.activeCompanies ?? 0,
      icon: Building2,
      color: '#ff5a36',
      bg: 'rgba(255, 90, 54, 0.1)',
    },
    {
      label: 'XMLs Sincronizados',
      value: data.stats?.storedXmls ?? 0,
      icon: FileText,
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.1)',
    },
    {
      label: 'Períodos Completos',
      value: data.stats?.completePeriods ?? 0,
      icon: CalendarCheck,
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.08)',
    },
    {
      label: 'Falhas Pendentes',
      value: data.stats?.pendingFailures ?? 0,
      icon: AlertTriangle,
      color: '#ea580c',
      bg: 'rgba(234, 88, 12, 0.1)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral do sistema de coleta de XMLs fiscais.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statConfig.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card animate-fade-in-up stagger-${i + 1}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : s.value}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Syncs */}
      <div className="glass-table animate-fade-in-up stagger-5">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-900/[0.08]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Últimas Sincronizações</h2>
            <p className="text-xs text-slate-500 mt-0.5">Jobs recentes de backfill e sync incremental</p>
          </div>
          <a href="/sincronizacao" className="btn btn-ghost btn-sm">
            Ver todas <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Tipo</th>
                <th>Modelos</th>
                <th>Progresso</th>
                <th>Status</th>
                <th>Início</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center py-8 text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : data.recentJobs.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center py-8 text-slate-500 text-sm">Nenhum job de sincronização recente.</div>
                  </td>
                </tr>
              ) : (
                data.recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="font-medium text-slate-900">{job.companyName}</td>
                    <td>
                      <span className="badge badge-muted capitalize">{job.tipoExecucao}</span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        {(job.modelos || []).map((m) => (
                          <span key={m} className="badge badge-info">{m}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ minWidth: 140 }}>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={job.progresso} status={job.status} />
                        <span className="text-xs text-slate-600 font-medium">{job.progresso}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={job.status} /></td>
                    <td className="text-slate-600">{formatDate(job.startedAt || job.started_at || '')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
