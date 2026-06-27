'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { eur } from '@/lib/format';
import ProductImage from '@/components/ProductImage';
import type { Product } from '@/lib/types';

function ProductScrollCard({ product }: { product: Product }) {
  return (
    <div className="group flex w-36 flex-shrink-0 flex-col sm:w-44">
      <Link href={`/producto/${product.id}`} className="block overflow-hidden bg-[#F5F3EF]">
        <div className="aspect-[3/4] overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">
          <ProductImage product={product} className="h-full w-full object-cover" />
        </div>
      </Link>
      <div className="mt-2 px-0.5">
        <p className="line-clamp-1 text-xs font-bold text-ink">{product.name}</p>
        <div className="mt-1 flex items-center justify-between gap-1">
          <span className="text-sm font-black text-ink">{eur(product.price)}</span>
          <Link
            href={`/producto/${product.id}`}
            className="border border-ink px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

// Círculos de categoría con foto real — estilo YESITEX móvil
const CATEGORY_CIRCLES = [
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

        {/* Imagen hero — móvil: nombre de empresa encima */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE5] sm:aspect-[16/7] lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/products/chaqueta-denim.jpg"
            alt="Moda Adam — Mayorista"
            className="h-full w-full object-cover object-center"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
          {/* Nombre de empresa centrado */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-4xl font-black uppercase tracking-[0.18em] text-white drop-shadow-lg sm:text-5xl">
              MODA ADAM
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.36em] text-white/80">
              Mayorista
            </span>
          </div>
        </div>

        {/* Fila principal — texto + imagen desktop */}
        <div className="flex lg:min-h-[500px]">

          {/* Columna texto */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="text-sm text-muted sm:text-base">
                Precios por unidad · Pedido mínimo 6&nbsp;uds · Stock real
              </p>
              <div className="mt-6">
                <Link href="/catalogo/camisetas" className="btn-ink text-sm px-8 py-4">
                  VER CATÁLOGO
                </Link>
              </div>
            </div>
          </div>

          {/* Imagen derecha — solo desktop, con nombre de empresa */}
          <div className="relative hidden overflow-hidden bg-[#F2EDE5] lg:block lg:w-1/2 xl:w-[44%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/chaqueta-denim.jpg"
              alt="Moda Adam — Mayorista"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            {/* Nombre centrado en desktop */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className="text-5xl font-black uppercase tracking-[0.18em] text-white drop-shadow-lg xl:text-6xl">
                MODA ADAM
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.36em] text-white/80">
                Mayorista
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS — círculos con foto, scroll horizontal (YESITEX móvil)
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E0E0E0] bg-white py-10 sm:py-14">
        <div className="wrap">
          <p className="eyebrow mb-7 text-center">Comprar por categoría</p>

          <div className="flex gap-5 overflow-x-auto pb-3 sm:gap-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_CIRCLES.map((cat) => (
              <Link
                key={cat.slug + cat.label}
                href={`/catalogo/${cat.slug}`}
                className="group flex flex-shrink-0 flex-col items-center gap-2.5"
              >
                {/* Círculo con foto */}
                <div className="h-20 w-20 overflow-hidden rounded-full bg-bone ring-2 ring-transparent transition-all duration-200 group-hover:ring-clay sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Etiqueta */}
                <span className="text-center text-[10px] font-black uppercase tracking-[0.14em] text-ink/80 transition-colors group-hover:text-ink">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NUEVAS NOVEDADES — fila deslizable
      ═══════════════════════════════════════════════════════════ */}
      {hydrated && products.length > 0 && (
        <section className="border-b border-[#E0E0E0] bg-white py-12 sm:py-16">
          <div className="wrap">
            <div className="mb-7 flex items-end justify-between">
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
            {/* Fila deslizable */}
            <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.slice(0, 10).map((p) => (
                <ProductScrollCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          BEST SELLERS — fila deslizable
      ═══════════════════════════════════════════════════════════ */}
      {hydrated && products.length > 0 && (
        <section className="border-b border-[#E0E0E0] bg-[#FAFAFA] py-12 sm:py-16">
          <div className="wrap">
            <div className="mb-7 flex items-end justify-between">
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
            {/* Fila deslizable — orden invertido para variar */}
            <div className="flex gap-3 overflow-x-auto pb-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[...products].reverse().slice(0, 10).map((p) => (
                <ProductScrollCard key={p.id} product={p} />
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
