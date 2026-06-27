'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { eur, formatDate, whatsappLink } from '@/lib/format';

export default function MisPedidosPage() {
  const { currentUser, myOrders, hydrated } = useStore();

  if (!hydrated) {
    return <div className="wrap py-24 text-center text-muted">Cargando…</div>;
  }

  // Hace falta tener sesión.
  if (!currentUser) {
    return (
      <div className="wrap flex justify-center py-20">
        <div className="card max-w-md p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Inicia sesión</h1>
          <p className="mt-2 text-sm text-muted">Entra en tu cuenta para ver tu historial de pedidos.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/login?next=/mis-pedidos" className="btn-primary">Iniciar sesión</Link>
            <Link href="/registro" className="btn-outline">Crear cuenta</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-12">
      <h1 className="font-display text-3xl text-ink">Mis pedidos</h1>
      <p className="mt-1 text-muted">Hola, {currentUser.name}. Aquí tienes tu historial.</p>

      {myOrders.length === 0 ? (
        <div className="card mt-8 p-10 text-center shadow-card">
          <p className="text-muted">Todavía no has hecho ningún pedido.</p>
          <Link href="/catalogo/camisetas" className="btn-ink mt-5">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {myOrders.map((order) => (
            <div key={order.id} className="card overflow-hidden shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-5 py-4">
                <div>
                  <p className="font-display text-lg text-ink">{order.id}</p>
                  <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="chip border-sage/40 bg-sage/10 text-sage">Confirmado</span>
                  <span className="font-display text-xl text-ink">{eur(order.total)}</span>
                </div>
              </div>

              <ul className="divide-y divide-sand px-5">
                {order.items.map((it) => (
                  <li key={`${it.productId}-${it.variantId}`} className="flex items-center gap-3 py-3">
                    <span className="h-8 w-8 flex-shrink-0 rounded-md border border-ink/10" style={{ backgroundColor: it.colorHex }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight text-ink">{it.name}</p>
                      <p className="text-xs text-muted">{it.color} · {it.size} · {it.qty} uds</p>
                    </div>
                    <span className="text-sm text-ink">{eur(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand px-5 py-3">
                <span className="text-sm text-muted">{order.units} unidades</span>
                <div className="flex gap-2">
                  <Link href={`/pedido/${order.id}`} className="btn-ghost text-sm">Ver detalle</Link>
                  <a href={whatsappLink(order)} target="_blank" rel="noopener noreferrer"
                     className="btn text-sm border border-sand text-ink hover:border-ink/30">
                    Reenviar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
