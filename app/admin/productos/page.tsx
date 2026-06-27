'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { eur } from '@/lib/format';
import { CATEGORIES } from '@/lib/constants';
import AdminShell from '@/components/admin/AdminShell';
import ProductImage from '@/components/ProductImage';

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ProductsList />
    </AdminShell>
  );
}

function ProductsList() {
  const { products, deleteProduct } = useStore();

  const onDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      deleteProduct(id);
    }
  };

  const labelOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Productos</h1>
          <p className="text-muted">{products.length} productos en catálogo.</p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary">+ Nuevo producto</Link>
      </div>

      {/* Tabla (en móvil se ve como tarjetas apiladas) */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-sand bg-paper shadow-card">
        {/* Cabecera de la tabla (solo escritorio) */}
        <div className="hidden grid-cols-[1fr_120px_110px_120px_140px] items-center gap-4 border-b border-sand px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted md:grid">
          <span>Producto</span>
          <span>Sección</span>
          <span>Precio</span>
          <span>Stock total</span>
          <span className="text-right">Acciones</span>
        </div>

        <ul className="divide-y divide-sand">
          {products.map((p) => {
            const stock = p.variants.reduce((a, v) => a + v.stock, 0);
            const agotadas = p.variants.filter((v) => v.stock === 0).length;
            return (
              <li
                key={p.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_120px_110px_120px_140px] md:items-center md:gap-4"
              >
                {/* Producto */}
                <div className="flex items-center gap-3">
                  <div className="h-14 w-12 flex-shrink-0 overflow-hidden rounded-md border border-sand">
                    <ProductImage product={p} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{p.reference} · {p.variants.length} variantes</p>
                  </div>
                </div>

                {/* Sección */}
                <div className="text-sm text-muted">
                  <span className="md:hidden">Sección: </span>{labelOf(p.category)}
                </div>

                {/* Precio */}
                <div className="text-sm text-ink">
                  <span className="text-muted md:hidden">Precio: </span>{eur(p.price)}
                </div>

                {/* Stock */}
                <div className="text-sm">
                  <span className="font-medium text-ink">{stock} uds</span>
                  {agotadas > 0 && (
                    <span className="ml-2 chip border-clay/30 bg-clay/10 text-clay-dark">{agotadas} agotada{agotadas > 1 ? 's' : ''}</span>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 md:justify-end">
                  <Link href={`/admin/productos/${p.id}`} className="rounded-lg border border-sand px-3 py-1.5 text-sm font-medium text-ink hover:border-ink/30">
                    Editar
                  </Link>
                  <button onClick={() => onDelete(p.id, p.name)}
                    className="rounded-lg border border-sand px-3 py-1.5 text-sm font-medium text-clay hover:border-clay/40 hover:bg-clay/5">
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
