'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { cartUnits, hydrated, currentUser, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E0E0E0] bg-white">
        <div className="wrap relative flex h-14 items-center justify-between">

          {/* Izquierda: hamburguesa */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="flex h-10 w-10 items-center justify-center text-ink hover:text-clay transition-colors"
          >
            <MenuIcon />
          </button>

          {/* Centro: logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="block text-lg font-black uppercase tracking-[0.16em] text-ink leading-none">
              Moda Adam
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.24em] text-clay leading-none mt-0.5">
              Mayorista
            </span>
          </Link>

          {/* Derecha: usuario + carrito */}
          <div className="flex items-center gap-1">
            {hydrated && currentUser ? (
              <details className="group relative">
                <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center text-ink hover:text-clay transition-colors marker:hidden">
                  <UserIcon />
                </summary>
                <div className="absolute right-0 mt-1 w-52 border border-[#E0E0E0] bg-white shadow-lift z-50">
                  <div className="border-b border-[#E0E0E0] px-4 py-3">
                    <p className="truncate text-xs font-black text-ink">{currentUser.name}</p>
                    <p className="truncate text-xs text-muted">{currentUser.email}</p>
                  </div>
                  <nav className="p-1">
                    <UserDropdownLinks role={currentUser.role} />
                  </nav>
                </div>
              </details>
            ) : (
              <Link
                href="/login"
                aria-label="Entrar"
                className="flex h-10 w-10 items-center justify-center text-ink hover:text-clay transition-colors"
              >
                <UserIcon />
              </Link>
            )}
            <CartButton count={hydrated ? cartUnits : 0} onClick={openCart} />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function UserDropdownLinks({ role }: { role: string }) {
  const { logout } = useStore();
  return (
    <>
      <Link href="/mis-pedidos" className="block px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5">
        Mis pedidos
      </Link>
      {role === 'trabajador' && (
        <Link href="/admin" className="block px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5">
          Panel admin
        </Link>
      )}
      <button
        onClick={logout}
        className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-clay hover:bg-clay/5"
      >
        Cerrar sesión
      </button>
    </>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir carrito"
      className="relative flex h-10 w-10 items-center justify-center text-ink hover:text-clay transition-colors"
    >
      <BagIcon />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center bg-ink px-0.5 text-[10px] font-black text-white">
          {count}
        </span>
      )}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5"/>
    </svg>
  );
}
