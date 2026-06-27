'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useStore } from '@/lib/store';

// ============================================================================
//  ARMAZÓN DEL PANEL (/admin)
//  - Protege todas las páginas del panel: si no hay un TRABAJADOR conectado,
//    muestra el login del personal (distinto del de clientes).
//  - Si sí lo hay, muestra la cabecera del panel y el contenido.
// ============================================================================
export default function AdminShell({ children }: { children: ReactNode }) {
  const { hydrated, currentUser } = useStore();
  const pathname = usePathname();

  if (!hydrated) {
    return <div className="wrap py-24 text-center text-muted">Cargando panel…</div>;
  }

  // Solo entran los trabajadores.
  if (!currentUser || currentUser.role !== 'trabajador') {
    return <AdminLogin />;
  }

  const nav = [
    { href: '/admin', label: 'Resumen' },
    { href: '/admin/productos', label: 'Productos' },
  ];
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="min-h-[70vh] bg-bone">
      {/* Cabecera del panel */}
      <div className="border-b border-sand bg-ink text-bone">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-4">
            <span className="font-display text-lg">Panel · Moda Adam</span>
            <nav className="flex gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive(n.href) ? 'bg-bone/15 text-bone' : 'text-bone/60 hover:text-bone'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-bone/70 sm:inline">{currentUser.name}</span>
            <Link href="/" className="rounded-full border border-bone/25 px-3 py-1.5 hover:bg-bone/10">
              Ver tienda
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="wrap py-8">{children}</div>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useStore();
  return (
    <button onClick={logout} className="rounded-full bg-clay px-3 py-1.5 text-white hover:bg-clay-dark">
      Salir
    </button>
  );
}

// ---- Login del PERSONAL (exige rol "trabajador") ----
function AdminLogin() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password, 'trabajador'); // exige que sea trabajador
    if (!res.ok) setError(res.error || 'No se pudo iniciar sesión.');
    // Si va bien, AdminShell se vuelve a dibujar y muestra el panel.
  };

  return (
    <div className="wrap flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-7 shadow-card">
          <span className="eyebrow">Acceso restringido</span>
          <h1 className="mt-2 font-display text-3xl text-ink">Panel del personal</h1>
          <p className="mt-1 text-sm text-muted">Solo para trabajadores de Moda Adam.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="ademail">Email</label>
              <input id="ademail" type="email" className="input" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="adpass">Contraseña</label>
              <input id="adpass" type="password" className="input" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark">{error}</p>}
            <button type="submit" className="btn-ink w-full">Entrar al panel</button>
          </form>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-sand bg-paper/60 p-4 text-sm text-muted">
          <p className="font-medium text-ink">Cuenta de prueba (trabajador):</p>
          <p className="mt-1">Email: <span className="font-mono text-ink">admin@modaadam.com</span></p>
          <p>Contraseña: <span className="font-mono text-ink">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
