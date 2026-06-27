'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';

interface SubItem { label: string; href: string }
interface NavItem  { label: string; href?: string; sub?: SubItem[] }

const NAV: NavItem[] = [
  { label: 'Rebajas',       href: '/catalogo/camisetas' },
  { label: 'Novedades',     href: '/catalogo/camisetas' },
  {
    label: 'Ropa',
    sub: [
      { label: 'Camisetas', href: '/catalogo/camisetas'       },
      { label: 'Pantalones',href: '/catalogo/pantalones'      },
      { label: 'Blusas',    href: '/catalogo/blusas-camisas'  },
      { label: 'Chaquetas', href: '/catalogo/chaquetas'       },
      { label: 'Vestidos',  href: '/catalogo/vestidos-faldas' },
      { label: 'Sudaderas', href: '/catalogo/sudaderas'       },
    ],
  },
  {
    label: 'Zapatos',
    sub: [
      { label: 'Zapatillas', href: '/catalogo/calzado' },
      { label: 'Botas',      href: '/catalogo/calzado' },
      { label: 'Sandalias',  href: '/catalogo/calzado' },
      { label: 'Botines',    href: '/catalogo/calzado' },
    ],
  },
  {
    label: 'Accesorios',
    sub: [
      { label: 'Gorras',     href: '/catalogo/accesorios' },
      { label: 'Bolsas',     href: '/catalogo/accesorios' },
      { label: 'Cinturones', href: '/catalogo/accesorios' },
    ],
  },
  { label: 'Ofertas Flash', href: '/catalogo/camisetas' },
];

interface Props { open: boolean; onClose: () => void }

export default function MobileMenu({ open, onClose }: Props) {
  const { currentUser, logout } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  return (
    <>
      {/* Overlay — clic fuera cierra (desktop) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-lift transition-transform duration-300 ease-in-out
          md:w-[25vw] md:min-w-[280px] md:max-w-[400px]
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* ── Cabecera fija ──────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E0E0E0] px-6 py-5">
          <span className="text-xs font-black uppercase tracking-[0.28em] text-ink">Menú</span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:text-[#D4A574]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>

        {/* ── Área scrollable (nav + contacto) ──────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Navegación */}
          <nav>
            <ul>
              {NAV.map((item) => {
                const hasSub = Array.isArray(item.sub) && item.sub.length > 0;
                const isOpen = expanded === item.label;

                return (
                  <li key={item.label} className="border-b border-[#E0E0E0]">
                    {hasSub ? (
                      <>
                        <button
                          onClick={() => toggle(item.label)}
                          className="flex w-full items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:text-[#D4A574]"
                        >
                          {item.label}
                          <svg
                            width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          >
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </button>

                        <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                          <ul className="border-t border-[#E0E0E0] bg-[#FAFAFA]">
                            {item.sub?.map((sub) => (
                              <li key={sub.label} className="border-b border-[#F0F0F0] last:border-0">
                                <Link
                                  href={sub.href}
                                  onClick={onClose}
                                  className="flex items-center gap-3 px-8 py-3.5 text-sm font-semibold text-[#3A3A3A] transition-colors hover:text-[#D4A574]"
                                >
                                  <span className="text-[#D4A574] text-xs">—</span>
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href ?? '/'}
                        onClick={onClose}
                        className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:text-[#D4A574]"
                      >
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </Link>
                    )}
                  </li>
                );
              })}

              {/* Mis pedidos / Admin si logueado */}
              {currentUser && (
                <>
                  <li className="border-b border-[#E0E0E0]">
                    <Link href="/mis-pedidos" onClick={onClose}
                      className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:text-[#D4A574]">
                      Mis Pedidos
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  </li>
                  {currentUser.role === 'trabajador' && (
                    <li className="border-b border-[#E0E0E0]">
                      <Link href="/admin" onClick={onClose}
                        className="flex items-center justify-between px-6 py-5 text-sm font-black uppercase tracking-[0.18em] text-ink transition-colors hover:text-[#D4A574]">
                        Panel Admin
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>

          {/* Atención al cliente — al final del scroll */}
          <div className="border-t border-[#E0E0E0] px-6 py-8">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#6B6B6B]">
              Atención al Cliente
            </p>

            <div className="mt-5 space-y-3">
              <a href="https://wa.me/34955146737" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 text-sm font-semibold text-ink transition-colors hover:text-[#D4A574]">
                <WaIcon />
                +34 955 146 737
              </a>
              <a href="mailto:info@modaadam.com"
                 className="flex items-center gap-3 text-sm text-[#6B6B6B] transition-colors hover:text-ink">
                <MailIcon />
                info@modaadam.com
              </a>
              <p className="pl-[29px] text-xs leading-relaxed text-[#6B6B6B]">
                Lunes a Viernes<br/>
                9:00–14:00 y 15:00–18:00
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="flex h-8 w-8 items-center justify-center border border-[#E0E0E0] text-ink transition-colors hover:border-[#D4A574] hover:text-[#D4A574]">
                <IgIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                 className="flex h-8 w-8 items-center justify-center border border-[#E0E0E0] text-ink transition-colors hover:border-[#D4A574] hover:text-[#D4A574]">
                <FbIcon />
              </a>
            </div>
          </div>
        </div>

        {/* ── Botones fijos abajo ─────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-[#E0E0E0] px-6 py-4">
          {currentUser ? (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full border border-[#E0E0E0] py-3 text-xs font-black uppercase tracking-wide text-[#6B6B6B] transition-colors hover:border-ink hover:text-ink"
            >
              Cerrar sesión · {currentUser.name.split(' ')[0]}
            </button>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" onClick={onClose}
                className="flex-1 border-2 border-ink py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white">
                Entrar
              </Link>
              <Link href="/registro" onClick={onClose}
                className="flex-1 bg-ink py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-black">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function WaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function FbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
