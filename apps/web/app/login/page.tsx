'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-[var(--accent)]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-[#7c3aed]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-sm glass-card !p-10 relative z-10 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--accent)] text-white shadow-lg mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center tracking-tight mb-2">NF-e Wizard</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Acesso restrito ao painel administrativo.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2"
            disabled={loading || !password}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
            {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}
