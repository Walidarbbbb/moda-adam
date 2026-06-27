'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { eur } from '@/lib/format';
import ProductImage from '@/components/ProductImage';
import type { Product } from '@/lib/types';

function ProductMiniCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      <Link href={`/producto/${product.id}`} className="block overflow-hidden bg-[#F5F3EF]">
        <div className="aspect-[3/4] overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">
          <ProductImage product={product} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="mt-2.5 px-0.5">
        <p className="line-clamp-1 text-xs font-bold text-ink">{product.name}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-black text-ink">{eur(product.price)}</span>
          <Link
            href={`/producto/${product.id}`}
            className="border border-ink px-3 py-1 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { currentUser, hydrated, products } = useStore();

  // ── Scroll de categorías ──────────────────────────────────────────
  const catsRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const syncArrows = () => {
    const el = catsRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => { syncArrows(); }, []);

  const scrollCats = (dir: 'left' | 'right') => {
    catsRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO — pantalla completa
      ═══════════════════════════════════════════════════════════ */}
      <section className="flex min-h-[480px] border-b border-[#E0E0E0] bg-white">

        {/* Columna izquierda: altura definida por el contenido */}
        <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-xl">

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">
              Distribución textil · B2B · Crevillent, Alicante
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Ropa al por mayor para tiendas y revendedores
            </h1>

            <p className="mt-5 text-lg text-muted">
              Precios por unidad · Pedido mínimo 6&nbsp;uds · Stock real
            </p>

            <div className="mt-8">
              <Link href="/catalogo/camisetas" className="btn-ink text-sm px-8 py-4">
                VER CATÁLOGO
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-[#E0E0E0] pt-8">
              {[
                ['+50', 'referencias'],
                ['S–XXL', 'todas las tallas'],
                ['24/48h', 'preparación pedido'],
              ].map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-ink">{n}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Columna derecha: misma altura que el texto (flex stretch), imagen rellena con absolute inset-0 */}
        <div className="hidden lg:block lg:w-1/2 xl:w-[44%] relative overflow-hidden bg-[#F2EDE5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/products/chaqueta-denim.jpg"
            alt="Chaqueta denim — Moda Adam"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Franja de marca en la esquina inferior */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent px-8 py-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/90">
              Moda Adam · Mayorista
            </p>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS — círculos estilo YESITEX con flechas
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E0E0E0] bg-white py-12 sm:py-16">
        <div className="wrap">
          <p className="eyebrow mb-10 text-center">Explorar categorías</p>

          {/* Contenedor relativo para posicionar las flechas */}
          <div className="relative flex items-center gap-2">

            {/* Flecha izquierda */}
            <button
              onClick={() => scrollCats('left')}
              aria-label="Anterior"
              className={`flex-shrink-0 flex h-11 w-11 items-center justify-center border border-[#E0E0E0] text-ink transition-all duration-150
                hover:border-ink hover:text-[#D4A574] cursor-pointer
                ${canLeft ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Círculos scrollables */}
            <div
              ref={catsRef}
              onScroll={syncArrows}
              className="flex flex-1 gap-4 overflow-x-auto scroll-smooth pb-2
                         sm:gap-6 lg:gap-8
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATS.map((cat, i) => (
                <Link
                  key={`${cat.slug}-${i}`}
                  href={`/catalogo/${cat.slug}`}
                  className="group flex flex-shrink-0 flex-col items-center gap-2.5"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-[#F2EDE5] sm:h-24 sm:w-24 lg:h-28 lg:w-28
                                  transition-opacity duration-200 group-hover:opacity-60">
                    {cat.icon}
                  </div>
                  <span className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink/80 transition-colors duration-200 group-hover:text-ink">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() => scrollCats('right')}
              aria-label="Siguiente"
              className={`flex-shrink-0 flex h-11 w-11 items-center justify-center border border-[#E0E0E0] text-ink transition-all duration-150
                hover:border-ink hover:text-[#D4A574] cursor-pointer
                ${canRight ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NUEVAS NOVEDADES
      ═══════════════════════════════════════════════════════════ */}
      {hydrated && products.length > 0 && (
        <section className="border-b border-[#E0E0E0] bg-white py-12 sm:py-16">
          <div className="wrap">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-black uppercase tracking-[0.06em] text-ink sm:text-3xl">
                Nuevas Novedades
              </h2>
              <Link
                href="/catalogo/camisetas"
                className="text-xs font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {products.slice(0, 6).map((p) => (
                <ProductMiniCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BEST SELLERS
      ═══════════════════════════════════════════════════════════ */}
      {hydrated && products.length > 6 && (
        <section className="border-b border-[#E0E0E0] bg-[#FAFAFA] py-12 sm:py-16">
          <div className="wrap">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-[0.06em] text-ink sm:text-3xl">
                  Best Sellers
                </h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                  Los más vendidos esta temporada
                </p>
              </div>
              <Link
                href="/catalogo/pantalones"
                className="text-xs font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {products.slice(6, 12).map((p) => (
                <ProductMiniCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CTA FINAL — solo usuarios no registrados
      ═══════════════════════════════════════════════════════════ */}
      {hydrated && !currentUser && (
        <section className="bg-white py-20">
          <div className="wrap">
            <div className="border-2 border-ink p-10 sm:p-14 lg:p-20">
              <p className="eyebrow">¿Tienes una tienda?</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black text-ink sm:text-5xl">
                Regístrate y compra al por mayor
              </h2>
              <p className="mt-4 max-w-lg text-lg text-muted">
                Crea tu cuenta gratis y accede a precios mayorista inmediatamente.
                Sin cuotas ni mínimo de compra anual.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/registro" className="btn-ink">
                  Crear cuenta gratis
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ─── Categorías con ilustración SVG para círculos ────────────────────────────
const S = { fill: 'none' as const, stroke: '#1A1A1A', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const CATS = [
  {
    slug: 'vestidos-faldas', label: 'Vestidos',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* A-line dress */}
        <path d="M23 11C23 8 37 8 37 11L47 52H13Z"/>
        <path d="M23 11C26 16 34 16 37 11"/>
        <line x1="18" y1="30" x2="42" y2="30"/>
      </svg>
    ),
  },
  {
    slug: 'camisetas', label: 'Camisetas',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* T-shirt */}
        <path d="M22 13C22 9 38 9 38 13L50 20L46 27L40 24V52H20V24L14 27L10 20Z"/>
        <path d="M22 13C25 17 35 17 38 13"/>
      </svg>
    ),
  },
  {
    slug: 'chaquetas', label: 'Chaquetas',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Jacket with lapels */}
        <path d="M22 12L11 18L14 26L21 22V53H39V22L46 26L49 18L38 12L34 24L30 20L26 24Z"/>
        <circle cx="30" cy="34" r="1.4" fill="#1A1A1A" stroke="none"/>
        <circle cx="30" cy="42" r="1.4" fill="#1A1A1A" stroke="none"/>
      </svg>
    ),
  },
  {
    slug: 'pantalones', label: 'Pantalones',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Trousers */}
        <path d="M15 13H45L43 54H35L30 36L25 54H17Z"/>
        <line x1="14" y1="19" x2="46" y2="19"/>
        <line x1="30" y1="19" x2="30" y2="32" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    slug: 'pantalones', label: 'Jeans',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Jeans with pocket + stitching */}
        <path d="M15 13H45L43 54H35L30 36L25 54H17Z"/>
        <line x1="14" y1="19" x2="46" y2="19"/>
        <path d="M15 20Q21 18 26 21V28Q21 30 15 28Z"/>
        <line x1="30" y1="20" x2="30" y2="34"/>
        <line x1="17" y1="34" x2="28" y2="34"/>
      </svg>
    ),
  },
  {
    slug: 'blusas-camisas', label: 'Blusas',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Blouse with V-neck */}
        <path d="M22 13C22 9 38 9 38 13L50 20L46 27L40 24V52H20V24L14 27L10 20Z"/>
        <path d="M22 13L30 26L38 13"/>
        <line x1="30" y1="26" x2="30" y2="42"/>
      </svg>
    ),
  },
  {
    slug: 'calzado', label: 'Botas',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Boot side profile */}
        <path d="M22 9H35V38L50 38V47H18V38H22V9Z"/>
        <path d="M16 47H52V51H16Z"/>
        {/* shaft seam */}
        <line x1="27" y1="9" x2="27" y2="38" strokeDasharray="2 3" strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    slug: 'calzado', label: 'Zapatillas',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Sneaker side profile */}
        <path d="M9 40L23 18C27 12 35 11 41 15C47 18 51 26 51 34V40Z"/>
        <path d="M7 40H53V47C53 48 7 48 7 47Z"/>
        {/* laces */}
        <line x1="35" y1="21" x2="45" y2="28"/>
        <line x1="33" y1="27" x2="43" y2="34"/>
      </svg>
    ),
  },
  {
    slug: 'accesorios', label: 'Accesorios',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Handbag */}
        <path d="M13 27H47L50 53H10Z"/>
        <path d="M21 27C21 15 39 15 39 27"/>
        <rect x="26" y="25" width="8" height="4" rx="1"/>
        <line x1="30" y1="25" x2="30" y2="29"/>
      </svg>
    ),
  },
  {
    slug: 'deportiva', label: 'Deportiva',
    icon: (
      <svg viewBox="0 0 60 60" className="h-full w-full" {...S}>
        {/* Athletic tank + shorts */}
        <path d="M22 11Q30 7 38 11L43 16L38 18V36H22V18L17 16Z"/>
        <line x1="23" y1="19" x2="23" y2="35" strokeOpacity="0.35"/>
        <path d="M18 36H42L40 53H34L30 43L26 53H20Z"/>
      </svg>
    ),
  },
];
