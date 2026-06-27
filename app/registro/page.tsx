'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function RegistroPage() {
  const { register } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    const res = register({ name: form.name, email: form.email, password: form.password });
    if (!res.ok) {
      setError(res.error || 'No se pudo crear la cuenta.');
      return;
    }
    router.push('/'); // al registrarse, ya queda con sesión iniciada
  };

  return (
    <div className="wrap flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-7 shadow-card">
          <h1 className="font-display text-3xl text-ink">Crear cuenta mayorista</h1>
          <p className="mt-1 text-sm text-muted">
            Regístrate para comprar al por mayor y ver tus pedidos.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="name">Nombre o nombre de la tienda</label>
              <input id="name" className="input" value={form.name} onChange={set('name')}
                placeholder="Ej. Tienda Sara" required />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" value={form.email} onChange={set('email')}
                placeholder="tucorreo@ejemplo.com" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="password">Contraseña</label>
                <input id="password" type="password" className="input" value={form.password}
                  onChange={set('password')} placeholder="Mín. 6 caracteres" required />
              </div>
              <div>
                <label className="label" htmlFor="password2">Repetir</label>
                <input id="password2" type="password" className="input" value={form.password2}
                  onChange={set('password2')} placeholder="Repite" required />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full">Crear cuenta</button>
            <p className="text-center text-xs text-muted">
              Demo: no se envía ningún email de verificación.
            </p>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-clay hover:text-clay-dark">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
