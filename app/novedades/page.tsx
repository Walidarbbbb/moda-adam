'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { eur } from '@/lib/format';
import ProductImage from '@/components/ProductImage';
import type { Product } from '@/lib/types';

function ProductCard({ product }: { product: Product }) {
  const totalStock = product.variants.reduce((a, v) => a + v.stock, 0);
  const soldOut = totalStock === 0;

  return (
    <div className="group flex flex-col border border-[#E0E0E0] bg-white transition-all duration-200 hover:border-ink hover:shadow-lift">
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
      </div>
      <div className="flex flex-1 flex-col p-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
          {product.reference}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-xl font-black text-ink">{eur(product.price)}</span>
          <Link
            href={`/producto/${product.id}`}
            className="border border-ink px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NovedadesPage() {
  const { products, hydrated } = useStore();

  return (
    <div className="bg-white">
      <div className="wrap py-10">

        {/* Cabecera */}
        <div className="border-b border-[#E0E0E0] pb-6 mb-8">
          <p className="eyebrow">Colección actual</p>
          <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Nuevas Novedades</h1>
          {hydrated && (
            <p className="mt-1 text-sm text-muted">{products.length} referencias</p>
          )}
        </div>

        {/* Grid de productos */}
        {!hydrated ? (
          <div className="py-20 text-center text-muted">Cargando productos…</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted">No hay productos disponibles.</p>
            <Link href="/" className="btn-ink mt-6">Volver al inicio</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
