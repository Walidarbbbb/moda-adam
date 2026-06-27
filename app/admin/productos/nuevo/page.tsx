'use client';

import AdminShell from '@/components/admin/AdminShell';
import ProductForm from '@/components/admin/ProductForm';

export default function NuevoProductoPage() {
  return (
    <AdminShell>
      <h1 className="mb-6 font-display text-3xl text-ink">Nuevo producto</h1>
      {/* Sin "initial": el formulario arranca vacío para crear uno nuevo. */}
      <ProductForm />
    </AdminShell>
  );
}
