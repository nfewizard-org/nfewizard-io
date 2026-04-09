'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  RefreshCw,
  Grid3X3,
  FileText,
  ScrollText,
  Zap,
} from 'lucide-react';

const nav = [
  { href: '/',               label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/empresas',       label: 'Empresas',       icon: Building2 },
  { href: '/certificado',    label: 'Certificado',    icon: ShieldCheck },
  { href: '/sincronizacao',  label: 'Sincronização',  icon: RefreshCw },
  { href: '/cobertura',      label: 'Cobertura',      icon: Grid3X3 },
  { href: '/xmls',           label: 'XMLs',           icon: FileText },
  { href: '/logs',           label: 'Logs',           icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar fixed top-0 left-0 bottom-0 flex flex-col"
      style={{ width: 'var(--sidebar-width)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-900/[0.08]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5a36] to-[#e11d48] flex items-center justify-center shadow-lg shadow-[#ff5a36]/30">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">NFe Wizard</h1>
          <p className="text-[11px] text-slate-500 font-medium">Coletor de XMLs</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-[10px] rounded-xl text-[14px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm shadow-[#ff5a36]/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-900/[0.04]'
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-slate-900/[0.08]">
        <div className="glass-card !p-3 !rounded-xl">
          <p className="text-[11px] text-slate-500 font-medium">Versão MVP</p>
          <p className="text-[12px] text-slate-600 mt-0.5">v0.1.0 — internal</p>
        </div>
      </div>
    </aside>
  );
}
