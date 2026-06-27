'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { eur, formatDate, whatsappLink } from '@/lib/format';

export default function PedidoPage({ params }: { params: { id: string } }) {
  const { getOrder, hydrated } = useStore();
  const order = getOrder(params.id);

  if (!hydrated) {
    return <div className="wrap py-24 text-center text-muted">Cargando pedido…</div>;
  }
  if (!order) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Pedido no encontrado</h1>
        <Link href="/" className="btn-ink mt-6">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="wrap max-w-2xl py-12">
      {/* Cabecera de éxito */}
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage/15 text-sage">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4 4 10-10" />
          </svg>
        </div>
        <h1 className="mt-4 font-display text-3xl text-ink">¡Pedido confirmado!</h1>
        <p className="mt-2 text-muted">
          Gracias, {order.userName}. Tu pedido <span className="font-medium text-ink">{order.id}</span> está registrado.
        </p>
        <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
      </div>

      {/* Avisos automáticos enviados */}
      <div className="mt-8 space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3 rounded-xl border border-sage/30 bg-sage/8 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-sage">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <p className="text-sm text-ink">
            Email de confirmación enviado a <span className="font-semibold">{order.userEmail}</span>
          </p>
        </div>

        {/* WhatsApp (se abrió automáticamente; botón de reintento si se cerró) */}
        <div className="flex items-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/8 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" className="flex-shrink-0">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <p className="flex-1 text-sm text-ink">
            WhatsApp abierto automáticamente con el resumen del pedido
          </p>
          <a
            href={whatsappLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs font-bold text-[#128C7E] underline underline-offset-2 hover:opacity-80"
          >
            Reenviar
          </a>
        </div>
      </div>

      {/* Detalle del pedido */}
      <div className="card mt-8 overflow-hidden shadow-card">
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="font-display text-lg text-ink">Detalle</h2>
          <span className="chip border-sage/40 bg-sage/10 text-sage">Confirmado</span>
        </div>
        <ul className="divide-y divide-sand px-5">
          {order.items.map((it) => (
            <li key={`${it.productId}-${it.variantId}`} className="flex items-center gap-3 py-3">
              <span className="h-9 w-9 flex-shrink-0 rounded-md border border-ink/10" style={{ backgroundColor: it.colorHex }} />
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight text-ink">{it.name}</p>
                <p className="text-xs text-muted">{it.reference} · {it.color} · {it.size} · {it.qty} uds</p>
              </div>
              <span className="text-sm font-medium text-ink">{eur(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-sand px-5 py-4 text-sm">
          <div className="flex justify-between text-muted"><span>Unidades</span><span className="text-ink">{order.units}</span></div>
          <div className="flex justify-between text-muted"><span>Pago</span><span className="text-ink">Tarjeta •••• {order.payment.last4} (simulado)</span></div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-lg text-ink">Total</span>
            <span className="font-display text-2xl text-ink">{eur(order.total)}</span>
          </div>
          <p className="pt-1 text-[11px] text-muted">IVA no incluido</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/mis-pedidos" className="btn-outline">Ver mis pedidos</Link>
        <Link href="/catalogo/camisetas" className="btn-ink">Seguir comprando</Link>
      </div>
    </div>
  );
}
