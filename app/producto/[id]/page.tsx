'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { eur } from '@/lib/format';
import { MIN_ORDER, SIZES, CATEGORIES } from '@/lib/constants';
import type { Size } from '@/lib/types';
import ProductImage from '@/components/ProductImage';
import QtyStepper from '@/components/QtyStepper';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { getProduct, addToCart, hydrated } = useStore();
  const product = getProduct(params.id);

  // Selección del cliente. Empieza vacía y se rellena cuando carga el producto.
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState<number>(MIN_ORDER);

  // Colores únicos del producto.
  const colors = useMemo(() => {
    if (!product) return [];
    return product.variants.reduce<{ name: string; hex: string }[]>((acc, v) => {
      if (!acc.some((c) => c.name === v.color)) acc.push({ name: v.color, hex: v.colorHex });
      return acc;
    }, []);
  }, [product]);

  // ¿Tiene stock algún tamaño de este color?
  const colorTieneStock = (nombre: string) =>
    !!product?.variants.some((v) => v.color === nombre && v.stock > 0);

  // Variante concreta seleccionada (color + talla).
  const variant = product?.variants.find((v) => v.color === color && v.size === size);
  const stock = variant?.stock ?? 0;

  // Al cargar el producto, elegimos un color por defecto (uno con stock si es posible).
  useEffect(() => {
    if (!product) return;
    const inicial = colors.find((c) => colorTieneStock(c.name)) ?? colors[0];
    setColor(inicial?.name ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Al cambiar de color, elegimos una talla disponible por defecto.
  useEffect(() => {
    if (!product || !color) return;
    const conStock = SIZES.find((s) =>
      product.variants.some((v) => v.color === color && v.size === s && v.stock > 0),
    );
    const primera = conStock ?? SIZES.find((s) =>
      product.variants.some((v) => v.color === color && v.size === s),
    );
    setSize((primera as Size) ?? null);
    setQty(MIN_ORDER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, product?.id]);

  // ---- Estados de carga / no encontrado ----
  if (!hydrated) {
    return <div className="wrap py-24 text-center text-muted">Cargando producto…</div>;
  }
  if (!product) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Producto no encontrado</h1>
        <Link href="/catalogo/camisetas" className="btn-ink mt-6">Volver al catálogo</Link>
      </div>
    );
  }

  const categoria = CATEGORIES.find((c) => c.slug === product.category);
  const hexSeleccionado = colors.find((c) => c.name === color)?.hex;

  // ¿Se puede añadir? Hace falta cumplir el pedido mínimo.
  const agotado = stock === 0;
  const stockInsuficiente = stock > 0 && stock < MIN_ORDER;
  const puedeAnadir = !!variant && stock >= MIN_ORDER;

  return (
    <div className="wrap py-10">
      {/* Migas de pan */}
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-clay">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/catalogo/${product.category}`} className="hover:text-clay">
          {categoria?.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="overflow-hidden rounded-2xl border border-sand bg-paper shadow-card">
          <div className="aspect-[4/5]">
            <ProductImage product={product} colorHex={hexSeleccionado} />
          </div>
        </div>

        {/* Información y compra */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {product.reference}
          </span>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl text-ink">{eur(product.price)}</span>
            <span className="text-muted">/ud · IVA no incluido</span>
          </div>
          <p className="mt-1 text-sm text-clay">Pedido mínimo: {MIN_ORDER} unidades por producto</p>

          {product.description && (
            <p className="mt-5 max-w-prose leading-relaxed text-muted">{product.description}</p>
          )}

          {/* Selector de COLOR */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span className="label mb-0">Color</span>
              <span className="text-sm text-muted">{color}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {colors.map((c) => {
                const disponible = colorTieneStock(c.name);
                const activo = c.name === color;
                return (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    disabled={!disponible}
                    title={c.name + (disponible ? '' : ' (agotado)')}
                    className={`relative grid h-10 w-10 place-items-center rounded-full border transition ${
                      activo ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'border-sand'
                    } ${!disponible ? 'opacity-40' : ''}`}
                  >
                    <span className="h-7 w-7 rounded-full border border-ink/10" style={{ backgroundColor: c.hex }} />
                    {!disponible && (
                      <span className="absolute h-px w-9 rotate-45 bg-ink/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de TALLA */}
          <div className="mt-6">
            <span className="label">Talla</span>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const v = product.variants.find((x) => x.color === color && x.size === s);
                const existe = !!v;
                const sinStock = !v || v.stock === 0;
                const activo = s === size;
                return (
                  <button
                    key={s}
                    onClick={() => existe && setSize(s)}
                    disabled={sinStock}
                    className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      activo
                        ? 'border-ink bg-ink text-bone'
                        : sinStock
                          ? 'border-sand text-muted/50 line-through'
                          : 'border-sand text-ink hover:border-ink/40'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estado del stock de la variante elegida */}
          <div className="mt-5">
            {agotado ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-sm font-semibold text-bone">
                AGOTADO en esta talla/color
              </span>
            ) : stockInsuficiente ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-clay/15 px-3 py-1.5 text-sm font-medium text-clay-dark">
                Quedan solo {stock} uds (por debajo del mínimo de {MIN_ORDER})
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-3 py-1.5 text-sm font-medium text-sage">
                <span className="h-2 w-2 rounded-full bg-sage" />
                {stock} uds disponibles
              </span>
            )}
          </div>

          {/* Cantidad + añadir */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted">Cantidad</span>
              <QtyStepper
                value={qty}
                onChange={setQty}
                max={Math.max(stock, MIN_ORDER)}
                min={MIN_ORDER}
              />
            </div>
            <button
              onClick={() => variant && addToCart(product, variant, qty)}
              disabled={!puedeAnadir}
              className="btn-primary h-12 flex-1 sm:flex-none sm:px-10"
            >
              {agotado ? 'Agotado' : `Añadir · ${eur(product.price * qty)}`}
            </button>
          </div>

          {/* Ficha técnica */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-sand pt-6 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Referencia</dt><dd className="font-medium text-ink">{product.reference}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Sección</dt><dd className="font-medium text-ink">{categoria?.label}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tallas</dt><dd className="font-medium text-ink">S–XXL</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Colores</dt><dd className="font-medium text-ink">{colors.length}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
