'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  RefreshCw, Play, Pause, RotateCcw, CheckCircle,
  Loader2, XCircle, Clock, CalendarRange, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────
interface Company {
  id: string;
  nome_fantasia: string;
}

interface SyncJob {
  id: string;
  companyName: string;
  tipoExecucao: string;
  modelos: string[];
  tipos: string[];
  progresso: number;
  status: string;
  startedAt?: string;
  started_at?: string;
  endedAt?: string;
  ended_at?: string;
}

// ─── Month Range Picker ──────────────────────────────────────────
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const NOW = new Date();
const THIS_YEAR = NOW.getFullYear();
const THIS_MONTH = NOW.getMonth(); // 0-indexed

function toKey(y: number, m: number) { return `${y}-${String(m + 1).padStart(2, '0')}`; }
function keyLabel(key: string) {
  const [y, m] = key.split('-');
  return `${MONTHS[parseInt(m) - 1]}/${y}`;
}
function cmp(y1: number, m1: number, y2: number, m2: number) {
  return y1 !== y2 ? y1 - y2 : m1 - m2;
}

interface MonthPickerProps {
  start: string; // 'YYYY-MM'
  end: string;
  onChange: (start: string, end: string) => void;
}

function MonthRangePicker({ start, end, onChange }: MonthPickerProps) {
  const [viewYear, setViewYear] = useState(THIS_YEAR);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  function pick(y: number, m: number) {
    const key = toKey(y, m);
    if (selecting === 'start') {
      onChange(key, end && key > end ? key : end);
      setSelecting('end');
    } else {
      if (key < start) {
        onChange(key, start);
      } else {
        onChange(start, key);
      }
      setSelecting('start');
    }
  }

  function isInRange(y: number, m: number) {
    if (!start || !end) return false;
    const key = toKey(y, m);
    return key >= start && key <= end;
  }

  function isStart(y: number, m: number) { return toKey(y, m) === start; }
  function isEnd(y: number, m: number) { return toKey(y, m) === end; }
  function isFuture(y: number, m: number) { return cmp(y, m, THIS_YEAR, THIS_MONTH) > 0; }

  return (
    <div className="w-[280px]">
      {/* Year nav */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          className="p-1.5 rounded-lg hover:bg-slate-900/[0.06] transition-colors"
          onClick={() => setViewYear(y => y - 1)}
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-sm font-bold text-slate-900">{viewYear}</span>
        <button
          className="p-1.5 rounded-lg hover:bg-slate-900/[0.06] transition-colors"
          onClick={() => setViewYear(y => y + 1)}
          disabled={viewYear >= THIS_YEAR}
        >
          <ChevronRight className={`w-4 h-4 ${viewYear >= THIS_YEAR ? 'text-slate-300' : 'text-slate-500'}`} />
        </button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-4 gap-1">
        {MONTHS.map((label, m) => {
          const inRange = isInRange(viewYear, m);
          const isS = isStart(viewYear, m);
          const isE = isEnd(viewYear, m);
          const future = isFuture(viewYear, m);

          return (
            <button
              key={m}
              disabled={future}
              onClick={() => !future && pick(viewYear, m)}
              className={[
                'py-2 rounded-xl text-[13px] font-medium transition-all',
                future ? 'text-slate-300 cursor-not-allowed' :
                  (isS || isE)
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : inRange
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-slate-700 hover:bg-slate-900/[0.06]',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-[11px] text-slate-400 text-center mt-3">
        {selecting === 'start' ? 'Clique no mês inicial' : 'Agora clique no mês final'}
      </p>
    </div>
  );
}

interface PeriodInputProps {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

function PeriodInput({ start, end, onChange }: PeriodInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = start && end
    ? `${keyLabel(start)} → ${keyLabel(end)}`
    : start ? `${keyLabel(start)} → ?`
    : 'Selecione o período';

  const monthCount = start && end
    ? (() => {
        const [sy, sm] = start.split('-').map(Number);
        const [ey, em] = end.split('-').map(Number);
        return (ey - sy) * 12 + (em - sm) + 1;
      })()
    : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`input text-left flex items-center justify-between gap-2 cursor-pointer ${open ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/20' : ''}`}
      >
        <span className={start ? 'text-slate-900' : 'text-slate-400'}>{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {monthCount && (
            <span className="badge badge-info text-[11px]">{monthCount} {monthCount === 1 ? 'mês' : 'meses'}</span>
          )}
          <CalendarRange className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-[calc(100%+8px)] left-0 glass-card !p-4 shadow-xl shadow-slate-900/[0.08] border-[var(--border-bright)] animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">De</p>
              <p className="text-sm font-semibold text-slate-900">{start ? keyLabel(start) : '—'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex-1 text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Até</p>
              <p className="text-sm font-semibold text-slate-900">{end ? keyLabel(end) : '—'}</p>
            </div>
          </div>
          <div className="border-t border-slate-900/[0.06] pt-3">
            <MonthRangePicker start={start} end={end} onChange={onChange} />
          </div>

          {/* Presets */}
          <div className="border-t border-slate-900/[0.06] pt-3 mt-3">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Atalhos</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '6 meses', months: 6 },
                { label: '12 meses', months: 12 },
                { label: '24 meses', months: 24 },
                { label: '60 meses', months: 60 },
              ].map(({ label, months }) => (
                <button
                  key={label}
                  className="badge badge-muted hover:badge-info cursor-pointer transition-colors"
                  onClick={() => {
                    const endDate = new Date(THIS_YEAR, THIS_MONTH, 1);
                    const startDate = new Date(THIS_YEAR, THIS_MONTH - (months - 1), 1);
                    onChange(
                      toKey(startDate.getFullYear(), startDate.getMonth()),
                      toKey(endDate.getFullYear(), endDate.getMonth()),
                    );
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Status e Progresso ──────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { class: string; label: string; icon: React.ElementType }> = {
    completed: { class: 'badge-success', label: 'Concluído',    icon: CheckCircle },
    running:   { class: 'badge-info',    label: 'Em execução',  icon: Loader2 },
    failed:    { class: 'badge-danger',  label: 'Falha',        icon: XCircle },
    paused:    { class: 'badge-warning', label: 'Pausado',      icon: Pause },
    pending:   { class: 'badge-muted',   label: 'Pendente',     icon: Clock },
    partial:   { class: 'badge-warning', label: 'Parcial',      icon: Clock },
  };
  const s = map[status] ?? { class: 'badge-muted', label: status, icon: Clock };
  const Icon = s.icon;
  return (
    <span className={`badge ${s.class}`}>
      <Icon className={`w-3 h-3 ${status === 'running' ? 'animate-spin' : ''}`} /> {s.label}
    </span>
  );
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
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// ─── Página ──────────────────────────────────────────────────────
export default function SincronizacaoPage() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [mod55, setMod55] = useState(true);
  const [mod65, setMod65] = useState(true);
  const [tipoEntrada, setTipoEntrada] = useState(true);
  const [tipoSaida, setTipoSaida] = useState(true);

  // Default: últimos 60 meses
  const defaultEnd = toKey(THIS_YEAR, THIS_MONTH);
  const defaultStart = (() => {
    const d = new Date(THIS_YEAR, THIS_MONTH - 59, 1);
    return toKey(d.getFullYear(), d.getMonth());
  })();
  const [periodoStart, setPeriodoStart] = useState(defaultStart);
  const [periodoEnd, setPeriodoEnd] = useState(defaultEnd);

  const monthCount = (() => {
    if (!periodoStart || !periodoEnd) return 0;
    const [sy, sm] = periodoStart.split('-').map(Number);
    const [ey, em] = periodoEnd.split('-').map(Number);
    return (ey - sy) * 12 + (em - sm) + 1;
  })();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetch('/api/empresas').then(res => res.json()).then(setCompanies);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    fetch('/api/sync')
      .then(res => res.json())
      .then(setJobs)
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleStartSync() {
    if (!selectedCompany) return alert("Selecione a empresa");
    
    const companyName = companies.find(c => c.id === selectedCompany)?.nome_fantasia || '';
    const modelos = [];
    if (mod55) modelos.push('55');
    if (mod65) modelos.push('65');

    const tipos = [];
    if (tipoEntrada) tipos.push('entrada');
    if (tipoSaida) tipos.push('saida');

    if (modelos.length === 0 || tipos.length === 0) {
      return alert("Selecione pelo menos um modelo e um tipo");
    }

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          companyName,
          tipoExecucao: monthCount > 0 ? 'backfill' : 'incremental',
          modelos,
          tipos,
          periodoStart,
          periodoEnd
        })
      });
      if (res.ok) {
        fetchJobs();
      } else {
        alert("Erro ao iniciar sincronização");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao iniciar sincronização");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sincronização</h1>
        <p className="text-slate-500 text-sm mt-1">Configure e execute jobs de download de XMLs fiscais.</p>
      </div>

      {/* Config Card */}
      <div className="glass-card mb-8 animate-fade-in-up stagger-1">
        <h2 className="text-base font-semibold text-slate-900 mb-6">Nova Sincronização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Empresa *</label>
            <select className="input" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="">Selecione</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.nome_fantasia}</option>
              ))}
            </select>
          </div>

          {/* Models */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-3">Modelos *</label>
            <div className="flex gap-5">
              <label className="checkbox-wrapper">
                <input type="checkbox" checked={mod55} onChange={(e) => setMod55(e.target.checked)} />
                NF-e (55)
              </label>
              <label className="checkbox-wrapper">
                <input type="checkbox" checked={mod65} onChange={(e) => setMod65(e.target.checked)} />
                NFC-e (65)
              </label>
            </div>
          </div>

          {/* Types */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-3">Tipos *</label>
            <div className="flex gap-5">
              <label className="checkbox-wrapper">
                <input type="checkbox" checked={tipoEntrada} onChange={(e) => setTipoEntrada(e.target.checked)} />
                Entrada
              </label>
              <label className="checkbox-wrapper">
                <input type="checkbox" checked={tipoSaida} onChange={(e) => setTipoSaida(e.target.checked)} />
                Saída
              </label>
            </div>
          </div>

          {/* Period — Month Range Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Período
              {monthCount > 0 && (
                <span className="ml-2 badge badge-info text-[10px]">{monthCount} meses</span>
              )}
            </label>
            <PeriodInput
              start={periodoStart}
              end={periodoEnd}
              onChange={(s, e) => { setPeriodoStart(s); setPeriodoEnd(e); }}
            />
          </div>
        </div>

        {/* Summary */}
        {(mod55 || mod65) && (
          <div className="mt-6 bg-slate-900/[0.03] border border-slate-900/[0.08] rounded-xl px-5 py-4">
            <p className="text-xs text-slate-500 font-medium mb-2">Resumo da configuração:</p>
            <div className="flex flex-wrap gap-2">
              {mod55 && tipoEntrada && <span className="badge badge-info">55 Entrada</span>}
              {mod55 && tipoSaida && <span className="badge badge-info">55 Saída</span>}
              {mod65 && tipoEntrada && <span className="badge badge-info">65 Entrada</span>}
              {mod65 && tipoSaida && <span className="badge badge-info">65 Saída</span>}
              {periodoStart && periodoEnd && (
                <span className="badge badge-muted">
                  {keyLabel(periodoStart)} → {keyLabel(periodoEnd)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              O sistema executará fluxos separados para cada modelo e consolidará o resultado.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="btn btn-ghost">
            <CheckCircle className="w-4 h-4" /> Validar Config
          </button>
          <button className="btn btn-primary" onClick={handleStartSync}>
            <Play className="w-4 h-4" /> Iniciar Sincronização
          </button>
        </div>
      </div>

      {/* Active / Recent Jobs */}
      <div className="glass-table animate-fade-in-up stagger-3">
        <div className="px-6 py-5 border-b border-slate-900/[0.08]">
          <h2 className="text-base font-semibold text-slate-900">Jobs de Sincronização</h2>
          <p className="text-xs text-slate-500 mt-0.5">Acompanhe o progresso e status de cada execução.</p>
        </div>

        <div className="divide-y divide-slate-900/[0.06]">
          {loadingJobs ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
             <div className="text-center py-8 text-slate-500 text-sm">Nenhum job de sincronização encontrado.</div>
          ) : jobs.map((job) => (
            <div key={job.id} className="px-6 py-5 hover:bg-slate-900/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                    <RefreshCw className={`w-4 h-4 text-[var(--accent)] ${job.status === 'running' ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.companyName}</p>
                    <p className="text-xs text-slate-500">
                      {job.tipoExecucao === 'backfill' ? 'Backfill completo' : 'Incremental'} — {(job.tipos || []).join(' + ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={job.status} />
                  <div className="flex gap-1.5">
                    {(job.modelos || []).map((m) => (
                      <span key={m} className="badge badge-muted text-[11px]">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <ProgressBar value={job.progresso} status={job.status} />
                </div>
                <span className="text-xs text-slate-600 font-medium w-12 text-right">{job.progresso}%</span>
                <div className="flex gap-1.5">
                  {job.status === 'running' && (
                    <button className="btn btn-warning btn-sm !p-2 !rounded-lg" title="Pausar">
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {job.status === 'failed' && (
                    <button className="btn btn-danger btn-sm !p-2 !rounded-lg" title="Reprocessar">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {job.status === 'paused' && (
                    <button className="btn btn-success btn-sm !p-2 !rounded-lg" title="Retomar">
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-6 mt-3 text-xs text-slate-500">
                <span>Início: {formatDate(job.startedAt || job.started_at || '')}</span>
                {(job.endedAt || job.ended_at) && <span>Fim: {formatDate((job.endedAt || job.ended_at)!)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
