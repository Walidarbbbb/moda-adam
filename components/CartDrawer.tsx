'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { eur } from '@/lib/format';
import { MIN_ORDER } from '@/lib/constants';
import ProductImage from './ProductImage';
import QtyStepper from './QtyStepper';

// Carrito lateral que se desliza desde la derecha.
export default function CartDrawer() {
  const {
    cart, isCartOpen, closeCart, updateQty, removeFromCart,
    cartUnits, cartTotal, getProduct,
  } = useStore();

  return (
    <>
      {/* Capa oscura de fondo (al pulsarla, se cierra) */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isCartOpen}
      />

      {/* Panel del carrito */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone shadow-lift transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de la compra"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <div>
            <h2 className="font-display text-xl text-ink">Tu carrito</h2>
            <p className="text-xs text-muted">{cartUnits} unidades</p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-ink/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Lista de productos */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-sand/60 text-muted">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
            <p className="text-sm text-muted">Tu carrito está vacío.</p>
            <Link href="/catalogo/camisetas" onClick={closeCart} className="btn-ink">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {cart.map((it) => {
              const product = getProduct(it.productId);
              const maxStock =
                product?.variants.find((v) => v.id === it.variantId)?.stock ?? it.qty;
              return (
                <div key={`${it.productId}-${it.variantId}`} className="flex gap-3">
                  {/* Miniatura */}
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-sand bg-paper">
                    {product ? (
                      <ProductImage product={product} colorHex={it.colorHex} />
                    ) : (
                      <div className="h-full w-full" style={{ backgroundColor: it.colorHex }} />
                    )}
                  </div>

                  {/* Datos */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-snug text-ink">{it.name}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          <span
                            className="inline-block h-3 w-3 rounded-full border border-ink/10"
                            style={{ backgroundColor: it.colorHex }}
                          />
                          {it.color} · Talla {it.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(it.productId, it.variantId)}
                        aria-label="Quitar del carrito"
                        className="text-muted transition hover:text-clay"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper
                        value={it.qty}
                        onChange={(n) => updateQty(it.productId, it.variantId, n)}
                        max={Math.max(maxStock, it.qty)}
                        size="sm"
                      />
                      <span className="text-sm font-semibold text-ink">{eur(it.price * it.qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pie con totales */}
        {cart.length > 0 && (
          <div className="border-t border-sand bg-paper px-5 py-5">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Unidades</span>
              <span className="font-medium text-ink">{cartUnits}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-display text-lg text-ink">Total</span>
              <span className="font-display text-2xl text-ink">{eur(cartTotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              IVA no incluido · Pedido mínimo {MIN_ORDER} uds por producto
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
              Finalizar compra
            </Link>
            <button onClick={closeCart} className="btn-ghost mt-1 w-full">
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
