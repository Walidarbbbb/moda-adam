'use client';

import Link from 'next/link';
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

// Tiles de categoría estilo YESITEX — imagen de fondo real
const CATEGORY_TILES = [
  { slug: 'camisetas',       label: 'Camisetas',      image: '/images/products/camiseta-negra.jpg' },
  { slug: 'pantalones',      label: 'Pantalones',     image: '/images/products/pantalon-jeans.jpg' },
  { slug: 'blusas-camisas',  label: 'Blusas',         image: '/images/products/blusa-blanca.jpg' },
  { slug: 'chaquetas',       label: 'Chaquetas',      image: '/images/products/chaqueta-denim.jpg' },
  { slug: 'vestidos-faldas', label: 'Vestidos',       image: '/images/products/vestido-midi.jpg' },
  { slug: 'sudaderas',       label: 'Sudaderas',      image: '/images/products/sudadera-gris.jpg' },
  { slug: 'conjuntos',       label: 'Conjuntos',      image: '/images/products/blazer-negro.jpg' },
  { slug: 'calzado',         label: 'Calzado',        image: '/images/products/zapatillas-blancas.jpg' },
  { slug: 'accesorios',      label: 'Accesorios',     image: '/images/products/gorra-negra.jpg' },
  { slug: 'deportiva',       label: 'Deportiva',      image: '/images/products/camiseta-gris.jpg' },
];

export default function HomePage() {
  const { currentUser, hydrated, products } = useStore();

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E0E0E0] bg-white">

        {/* Imagen hero — solo visible en móvil (en desktop está en la columna derecha) */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE5] sm:aspect-[16/7] lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/products/chaqueta-denim.jpg"
            alt="Moda Adam — Mayorista"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/90">
              Distribución textil · B2B · Crevillent
            </p>
          </div>
        </div>

        {/* Fila principal: texto izquierda + imagen derecha (desktop) */}
        <div className="flex lg:min-h-[500px]">

          {/* Columna de texto */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-xl">

              <p className="hidden text-xs font-bold uppercase tracking-[0.22em] text-muted lg:block">
                Distribución textil · B2B · Crevillent, Alicante
              </p>

              <h1 className="mt-2 text-4xl font-black leading-[1.03] text-ink sm:text-5xl lg:mt-5 lg:text-6xl xl:text-7xl">
                Ropa al por mayor para tiendas y revendedores
              </h1>

              <p className="mt-4 text-base text-muted sm:text-lg">
                Precios por unidad · Pedido mínimo 6&nbsp;uds · Stock real
              </p>

              <div className="mt-7">
                <Link href="/catalogo/camisetas" className="btn-ink text-sm px-8 py-4">
                  VER CATÁLOGO
                </Link>
              </div>

            </div>
          </div>

          {/* Imagen derecha — solo desktop */}
          <div className="relative hidden overflow-hidden bg-[#F2EDE5] lg:block lg:w-1/2 xl:w-[44%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/chaqueta-denim.jpg"
              alt="Chaqueta denim — Moda Adam"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent px-8 py-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/90">
                Moda Adam · Mayorista
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BARRA DE STATS — estilo YESITEX
      ═══════════════════════════════════════════════════════════ */}
      <div className="border-b border-[#E0E0E0] bg-ink">
        <div className="wrap grid grid-cols-2 sm:grid-cols-4">
          {[
            ['+15',   'Años distribuyendo'],
            ['+50',   'Referencias activas'],
            ['6 uds', 'Pedido mínimo'],
            ['24/48h','Preparación envío'],
          ].map(([n, label]) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 px-4 py-6 text-center"
            >
              <span className="text-2xl font-black text-white sm:text-3xl">{n}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS — tiles con foto estilo YESITEX
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E0E0E0] bg-white py-10 sm:py-14">
        <div className="wrap">
          <p className="eyebrow mb-7 text-center">Comprar por categoría</p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.slug + cat.label}
                href={`/catalogo/${cat.slug}`}
                className="group relative block aspect-square overflow-hidden bg-bone"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/50" />
                {/* Etiqueta */}
                <span className="absolute inset-x-0 bottom-0 p-3 text-xs font-black uppercase tracking-[0.16em] text-white drop-shadow-sm sm:p-4 sm:text-[11px]">
                  {cat.label}
                </span>
              </Link>
            ))}
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
