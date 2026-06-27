'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password); // sin rol obligatorio: aquí entran clientes
    if (!res.ok) {
      setError(res.error || 'No se pudo iniciar sesión.');
      return;
    }
    // Si veníamos de otra página (ej. /checkout), volvemos allí.
    const next = new URLSearchParams(window.location.search).get('next');
    router.push(next || '/');
  };

  return (
    <div className="wrap flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-7 shadow-card">
          <h1 className="font-display text-3xl text-ink">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted">Accede a tu cuenta de cliente mayorista.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" required />
            </div>
            <div>
              <label className="label" htmlFor="password">Contraseña</label>
              <input id="password" type="password" className="input" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && (
              <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full">Entrar</button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-medium text-clay hover:text-clay-dark">
              Crea una gratis
            </Link>
          </p>
        </div>

        {/* Ayuda para la demo */}
        <div className="mt-4 rounded-xl border border-dashed border-sand bg-paper/60 p-4 text-sm text-muted">
          <p className="font-medium text-ink">Cuenta de prueba (cliente):</p>
          <p className="mt-1">Email: <span className="font-mono text-ink">cliente@modaadam.com</span></p>
          <p>Contraseña: <span className="font-mono text-ink">cliente123</span></p>
          <p className="mt-2 text-xs">
            ¿Eres del personal? Entra por el{' '}
            <Link href="/admin" className="text-clay hover:text-clay-dark">panel de administración</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
