'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';

export default function EditarProductoPage({ params }: { params: { id: string } }) {
  return (
    <AdminShell>
      <EditarProducto id={params.id} />
    </AdminShell>
  );
}

function EditarProducto({ id }: { id: string }) {
  const { getProduct } = useStore();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-2xl text-ink">Producto no encontrado</h1>
        <Link href="/admin/productos" className="btn-ink mt-5">Volver a productos</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/productos" className="text-sm text-muted hover:text-clay">← Productos</Link>
        <h1 className="mt-2 font-display text-3xl text-ink">Editar: {product.name}</h1>
      </div>
      {/* Pasamos "initial" para que el formulario cargue los datos actuales. */}
      <ProductForm initial={product} />
    </>
  );
}
