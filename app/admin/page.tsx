'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminDashboard() {
  return (
    <AdminShell>
      <Dashboard />
    </AdminShell>
  );
}

function Dashboard() {
  const { products, orders, resetDemo } = useStore();

  // Cálculos para las tarjetas de resumen.
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((a, v) => a + v.stock, 0),
    0,
  );
  const agotadas = products.reduce(
    (acc, p) => acc + p.variants.filter((v) => v.stock === 0).length,
    0,
  );
  // Productos que tienen alguna talla/color agotado (para avisar).
  const conAgotados = products.filter((p) => p.variants.some((v) => v.stock === 0));

  const onReset = () => {
    if (confirm('¿Reiniciar la demo? Se borrarán los cambios y se volverá a los datos de ejemplo.')) {
      resetDemo();
      alert('Demo reiniciada. Vuelves a empezar con los datos de ejemplo.');
    }
  };

  const stats = [
    { label: 'Productos', value: products.length },
    { label: 'Unidades en stock', value: totalStock },
    { label: 'Variantes agotadas', value: agotadas },
    { label: 'Pedidos', value: orders.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Resumen</h1>
          <p className="text-muted">Vista general de la tienda.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/productos/nuevo" className="btn-primary">+ Nuevo producto</Link>
          <Link href="/admin/productos" className="btn-outline">Gestionar productos</Link>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 shadow-card">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Avisos de stock */}
      <div className="mt-8 card p-5 shadow-card">
        <h2 className="font-display text-xl text-ink">Avisos de stock</h2>
        {conAgotados.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Sin variantes agotadas. ¡Todo en stock!</p>
        ) : (
          <ul className="mt-3 divide-y divide-sand">
            {conAgotados.map((p) => {
              const n = p.variants.filter((v) => v.stock === 0).length;
              return (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{p.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="chip border-clay/30 bg-clay/10 text-clay-dark">
                      {n} agotada{n > 1 ? 's' : ''}
                    </span>
                    <Link href={`/admin/productos/${p.id}`} className="text-sm font-medium text-clay hover:text-clay-dark">
                      Editar
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Reiniciar demo */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-sand p-5">
        <div>
          <p className="font-medium text-ink">Reiniciar datos de la demo</p>
          <p className="text-sm text-muted">Vuelve a los productos y usuarios de ejemplo.</p>
        </div>
        <button onClick={onReset} className="btn-outline">Reiniciar demo</button>
      </div>
    </div>
  );
}
