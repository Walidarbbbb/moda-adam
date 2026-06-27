'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import type { Category } from '@/lib/types';
import { eur } from '@/lib/format';
import ProductImage from '@/components/ProductImage';

// ─── Card de producto con hover ───────────────────────────────────────────────
function ProductCard({ product }: { product: ReturnType<typeof useStore>['products'][0] }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useStore();

  const colors = product.variants.reduce<{ name: string; hex: string }[]>((acc, v) => {
    if (!acc.some((c) => c.name === v.color)) acc.push({ name: v.color, hex: v.colorHex });
    return acc;
  }, []);

  const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);
  const soldOut = totalStock === 0;

  // Tallas disponibles
  const sizesDisponibles = [...new Set(
    product.variants.filter((v) => v.stock > 0).map((v) => v.size)
  )];
  const sizeRange = sizesDisponibles.length > 0
    ? `${sizesDisponibles[0]} – ${sizesDisponibles[sizesDisponibles.length - 1]}`
    : 'Agotado';

  // Para añadir rápido: primera variante con stock
  const firstVariant = product.variants.find((v) => v.stock >= product.minOrder);

  return (
    <div
      className="group relative flex flex-col border border-[#E0E0E0] bg-white transition-all duration-200 hover:border-ink hover:shadow-lift"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F3EF]">
        <ProductImage
          product={product}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {soldOut && (
          <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            Agotado
          </span>
        )}
        {/* Overlay hover con acciones rápidas */}
        <div className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-white/95 p-3 transition-all duration-200 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {firstVariant && !soldOut ? (
            <button
              onClick={() => firstVariant && addToCart(product, firstVariant, product.minOrder)}
              className="w-full bg-ink py-2 text-[11px] font-black uppercase tracking-wide text-white hover:bg-black transition-colors"
            >
              + Añadir al carrito
            </button>
          ) : null}
          <Link
            href={`/producto/${product.id}`}
            className="w-full border border-ink py-2 text-center text-[11px] font-black uppercase tracking-wide text-ink hover:bg-ink hover:text-white transition-colors"
          >
            Ver detalles
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {product.reference}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted whitespace-nowrap">
            Mín. {product.minOrder}
          </span>
        </div>

        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink">
          {product.name}
        </h3>

        {/* Tallas */}
        <p className="mt-1.5 text-xs text-muted">
          Tallas: <span className="font-semibold text-ink">{sizeRange}</span>
        </p>

        {/* Colores */}
        <div className="mt-2 flex items-center gap-1">
          {colors.slice(0, 6).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 border border-ink/10 flex-shrink-0"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {colors.length > 6 && (
            <span className="text-[10px] text-muted">+{colors.length - 6}</span>
          )}
        </div>

        {/* Precio */}
        <div className="mt-auto pt-3">
          <span className="text-xl font-black text-ink">{eur(product.price)}</span>
          <span className="text-xs text-muted"> /ud</span>
        </div>
      </div>
    </div>
  );
}

// ─── Página del catálogo ──────────────────────────────────────────────────────
export default function CatalogoPage({ params }: { params: { categoria: string } }) {
  const { products, hydrated } = useStore();
  const [orden, setOrden] = useState<'rel' | 'asc' | 'desc'>('rel');

  const categoria = CATEGORIES.find((c) => c.slug === params.categoria);

  const lista = useMemo(() => {
    if (!categoria) return [];
    const arr = products.filter((p) => p.category === (categoria.slug as Category));
    if (orden === 'asc') return [...arr].sort((a, b) => a.price - b.price);
    if (orden === 'desc') return [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [products, categoria, orden]);

  if (!categoria) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="text-3xl font-black text-ink">Sección no encontrada</h1>
        <Link href="/catalogo/camisetas" className="btn-ink mt-6">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Tabs de categorías (scroll horizontal) ───────────────────────── */}
      <div className="sticky top-14 z-30 border-b border-[#E0E0E0] bg-white">
        <div className="wrap">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-0 py-0">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/catalogo/${c.slug}`}
                  className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                    c.slug === categoria.slug
                      ? 'border-ink text-ink'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap py-8">
        {/* ── Cabecera de sección ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E0E0E0] pb-6">
          <div>
            <p className="eyebrow">{categoria.tagline}</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">
              {categoria.label}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lista.length} {lista.length === 1 ? 'referencia' : 'referencias'}
            </p>
          </div>

          {/* Ordenar */}
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
            Ordenar:
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as 'rel' | 'asc' | 'desc')}
              className="input-sm font-semibold text-ink"
            >
              <option value="rel">Relevancia</option>
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        {/* ── Grid de productos ─────────────────────────────────────────── */}
        {!hydrated ? (
          <div className="py-20 text-center text-muted">Cargando productos…</div>
        ) : lista.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted">No hay productos en esta sección todavía.</p>
            <Link href="/catalogo/camisetas" className="btn-ink mt-5">
              Ver camisetas
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {lista.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* ── Aviso mayorista ───────────────────────────────────────────── */}
        <div className="mt-12 border border-[#E0E0E0] px-6 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Precios mayoristas · Sin IVA · Pedido mínimo según referencia
          </p>
          <p className="mt-1 text-xs text-muted">
            ¿Necesitas más cantidad o un presupuesto especial?{' '}
            <a
              href="https://wa.me/34600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink underline hover:text-clay"
            >
              Contacta por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
