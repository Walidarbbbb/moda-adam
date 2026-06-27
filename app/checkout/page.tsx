'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { eur } from '@/lib/format';
import { MIN_ORDER } from '@/lib/constants';

export default function CheckoutPage() {
  const { cart, cartTotal, cartUnits, currentUser, placeOrder, hydrated } = useStore();
  const router = useRouter();

  // Datos del formulario de tarjeta (FALSO). Prellenamos con una tarjeta de prueba.
  const [name, setName] = useState('');
  const [number, setNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/29');
  const [cvc, setCvc] = useState('123');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Al saber quién es el usuario, ponemos su nombre en la tarjeta.
  useEffect(() => {
    if (currentUser) setName(currentUser.name);
  }, [currentUser]);

  // Formatea el número de tarjeta en grupos de 4: "4242424242424242" -> "4242 4242 ..."
  const onNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    setNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };
  const onExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 4);
    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validación mínima (es un formulario de mentira, pero comprobamos el formato).
    if (!name.trim()) return setError('Escribe el nombre del titular.');
    if (number.replace(/\s/g, '').length !== 16) return setError('El número de tarjeta debe tener 16 dígitos.');
    if (expiry.length !== 5) return setError('La caducidad debe ser MM/AA.');
    if (cvc.length < 3) return setError('El CVC debe tener 3 dígitos.');

    setProcessing(true);
    // Simulamos el "tiempo de procesar el pago" con una pequeña espera.
    // 👉 EN REAL: aquí se llamaría a Stripe para cobrar de verdad y solo si la
    //    pasarela confirma el pago se crearía el pedido.
    setTimeout(() => {
      const order = placeOrder({ name, number });
      if (!order) {
        setProcessing(false);
        setError('No se pudo crear el pedido.');
        return;
      }

      // Envía el email de confirmación al cliente (fire-and-forget).
      fetch('/api/email-confirmacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      }).catch(() => {});

      router.push(`/pedido/${order.id}`);
    }, 1400);
  };

  // Mientras carga lo guardado en el navegador.
  if (!hydrated) {
    return <div className="wrap py-24 text-center text-muted">Cargando…</div>;
  }

  // Hace falta tener sesión para finalizar (así el pedido queda en "Mis pedidos").
  if (!currentUser) {
    return (
      <div className="wrap flex justify-center py-20">
        <div className="card max-w-md p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Inicia sesión para pagar</h1>
          <p className="mt-2 text-sm text-muted">
            Necesitas una cuenta de cliente para finalizar el pedido y guardarlo en tu historial.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/login?next=/checkout" className="btn-primary">Iniciar sesión</Link>
            <Link href="/registro" className="btn-outline">Crear cuenta</Link>
          </div>
        </div>
      </div>
    );
  }

  // Carrito vacío.
  if (cart.length === 0) {
    return (
      <div className="wrap flex justify-center py-20">
        <div className="card max-w-md p-8 text-center shadow-card">
          <h1 className="font-display text-2xl text-ink">Tu carrito está vacío</h1>
          <p className="mt-2 text-sm text-muted">Añade productos antes de finalizar la compra.</p>
          <Link href="/catalogo/camisetas" className="btn-ink mt-6">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <h1 className="font-display text-3xl text-ink">Finalizar compra</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ---- Formulario de pago (SIMULADO) ---- */}
        <div className="order-2 lg:order-1">
          {/* Aviso bien visible */}
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-clay/30 bg-clay/5 p-4">
            <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-clay text-xs font-bold text-white">!</span>
            <p className="text-sm text-ink">
              <span className="font-semibold">Pago simulado.</span> No se cobra nada ni se envían
              datos a ningún sitio. <span className="text-muted">No introduzcas una tarjeta real.</span>
            </p>
          </div>

          <form onSubmit={onSubmit} className="card p-6 shadow-card">
            <h2 className="font-display text-xl text-ink">Datos de la tarjeta</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="cardname">Titular</label>
                <input id="cardname" className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="cardnum">Número de tarjeta</label>
                <input id="cardnum" inputMode="numeric" className="input font-mono" value={number} onChange={onNumber} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="exp">Caducidad (MM/AA)</label>
                  <input id="exp" inputMode="numeric" className="input font-mono" value={expiry} onChange={onExpiry} placeholder="MM/AA" />
                </div>
                <div>
                  <label className="label" htmlFor="cvc">CVC</label>
                  <input id="cvc" inputMode="numeric" className="input font-mono" value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" />
                </div>
              </div>
            </div>

            {error && <p className="mt-4 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark">{error}</p>}

            <button type="submit" disabled={processing} className="btn-primary mt-6 w-full">
              {processing ? 'Procesando pago…' : `Pagar ${eur(cartTotal)}`}
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              Tarjeta de prueba precargada: 4242 4242 4242 4242
            </p>
          </form>
        </div>

        {/* ---- Resumen del pedido ---- */}
        <div className="order-1 lg:order-2">
          <div className="card overflow-hidden shadow-card lg:sticky lg:top-24">
            <div className="border-b border-sand px-5 py-4">
              <h2 className="font-display text-lg text-ink">Tu pedido</h2>
              <p className="text-xs text-muted">{cartUnits} unidades</p>
            </div>
            <ul className="divide-y divide-sand px-5">
              {cart.map((it) => (
                <li key={`${it.productId}-${it.variantId}`} className="flex items-center gap-3 py-3">
                  <span className="h-9 w-9 flex-shrink-0 rounded-md border border-ink/10" style={{ backgroundColor: it.colorHex }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight text-ink">{it.name}</p>
                    <p className="text-xs text-muted">{it.color} · {it.size} · {it.qty} uds</p>
                  </div>
                  <span className="text-sm font-medium text-ink">{eur(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-sand px-5 py-4">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal (sin IVA)</span><span className="text-ink">{eur(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Envío</span><span className="text-ink">Se calcula al confirmar</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-display text-lg text-ink">Total</span>
                <span className="font-display text-2xl text-ink">{eur(cartTotal)}</span>
              </div>
              <p className="pt-1 text-[11px] text-muted">Pedido mínimo {MIN_ORDER} uds por producto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
