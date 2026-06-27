'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { CATEGORIES, SIZES } from '@/lib/constants';
import { slugify } from '@/lib/format';
import type { Category, Product, Size, Variant } from '@/lib/types';

// Cada fila del editor de variantes lleva una "key" interna para React.
type Row = { key: string; size: Size; color: string; colorHex: string; stock: number };

// Convierte las variantes guardadas en filas editables.
const toRows = (variants: Variant[]): Row[] =>
  variants.map((v, i) => ({
    key: `${v.id}-${i}`,
    size: v.size,
    color: v.color,
    colorHex: v.colorHex,
    stock: v.stock,
  }));

const filaVacia = (): Row => ({
  key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  size: 'M',
  color: '',
  colorHex: '#1C1B1A',
  stock: 12,
});

export default function ProductForm({ initial }: { initial?: Product }) {
  const { upsertProduct } = useStore();
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? '');
  const [reference, setReference] = useState(initial?.reference ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'camisetas');
  const [price, setPrice] = useState<string>(initial ? String(initial.price) : '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [rows, setRows] = useState<Row[]>(
    initial ? toRows(initial.variants) : [filaVacia()],
  );
  const [error, setError] = useState('');

  // --- Helpers del editor de variantes ---
  const updateRow = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => [...rs, filaVacia()]);
  const removeRow = (key: string) => setRows((rs) => rs.filter((r) => r.key !== key));
  const marcarAgotada = (key: string) => updateRow(key, { stock: 0 }); // botón "Agotar"

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones sencillas.
    const precioNum = parseFloat(price.replace(',', '.'));
    if (!name.trim()) return setError('Escribe el nombre del producto.');
    if (!reference.trim()) return setError('Escribe la referencia (ej. CAM-005).');
    if (!precioNum || precioNum <= 0) return setError('Escribe un precio válido mayor que 0.');
    if (rows.length === 0) return setError('Añade al menos una variante (talla + color).');
    if (rows.some((r) => !r.color.trim())) return setError('Cada variante necesita un nombre de color.');

    // Construimos las variantes con un id único (color + talla).
    const usados = new Set<string>();
    const variants: Variant[] = rows.map((r, i) => {
      let id = `${slugify(r.color)}-${r.size}`;
      if (usados.has(id)) id = `${id}-${i}`; // por si se repite color+talla
      usados.add(id);
      return {
        id,
        size: r.size,
        color: r.color.trim(),
        colorHex: r.colorHex,
        stock: Math.max(0, Math.floor(Number(r.stock) || 0)),
      };
    });

    const product: Product = {
      id: initial?.id ?? `prod-${Date.now()}`,
      reference: reference.trim(),
      name: name.trim(),
      category,
      price: precioNum,
      minOrder: initial?.minOrder ?? 6,
      image: image.trim() || undefined,
      description: description.trim() || undefined,
      variants,
    };

    upsertProduct(product);
    router.push('/admin/productos');
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Columna izquierda: datos + variantes */}
      <div className="space-y-6">
        <div className="card p-6 shadow-card">
          <h2 className="font-display text-xl text-ink">Datos del producto</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Nombre</label>
              <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Camiseta Básica Algodón" />
            </div>
            <div>
              <label className="label" htmlFor="ref">Referencia</label>
              <input id="ref" className="input" value={reference} onChange={(e) => setReference(e.target.value)}
                placeholder="CAM-005" />
            </div>
            <div>
              <label className="label" htmlFor="cat">Sección</label>
              <select id="cat" className="input" value={category}
                onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="price">Precio por unidad (€)</label>
              <input id="price" inputMode="decimal" className="input" value={price}
                onChange={(e) => setPrice(e.target.value)} placeholder="6.90" />
            </div>
            <div>
              <label className="label" htmlFor="img">Foto (URL, opcional)</label>
              <input id="img" className="input" value={image} onChange={(e) => setImage(e.target.value)}
                placeholder="https://…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="desc">Descripción</label>
              <textarea id="desc" className="input min-h-[80px]" value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Composición, corte, gramaje…" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            Si dejas la foto vacía, se mostrará una ilustración con el color de la prenda.
          </p>
        </div>

        {/* Editor de variantes */}
        <div className="card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Variantes (talla · color · stock)</h2>
            <button type="button" onClick={addRow} className="btn-outline text-sm">+ Añadir variante</button>
          </div>

          <div className="mt-4 space-y-3">
            {rows.map((r) => (
              <div key={r.key} className="flex flex-wrap items-end gap-3 rounded-xl border border-sand p-3">
                <div>
                  <label className="mb-1 block text-xs text-muted">Talla</label>
                  <select className="input-sm w-20" value={r.size}
                    onChange={(e) => updateRow(r.key, { size: e.target.value as Size })}>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="mb-1 block text-xs text-muted">Color (nombre)</label>
                  <input className="input-sm" value={r.color}
                    onChange={(e) => updateRow(r.key, { color: e.target.value })} placeholder="Ej. Azul marino" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Tono</label>
                  <input type="color" className="h-9 w-12 cursor-pointer rounded-lg border border-sand bg-paper p-0.5"
                    value={r.colorHex} onChange={(e) => updateRow(r.key, { colorHex: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Unidades</label>
                  <input type="number" min={0} className="input-sm w-24" value={r.stock}
                    onChange={(e) => updateRow(r.key, { stock: Number(e.target.value) })} />
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => marcarAgotada(r.key)}
                    className="rounded-lg border border-sand px-2.5 py-1.5 text-xs font-medium text-clay-dark hover:bg-clay/5"
                    title="Poner stock a 0">
                    Agotar
                  </button>
                  <button type="button" onClick={() => removeRow(r.key)}
                    className="rounded-lg border border-sand px-2.5 py-1.5 text-xs font-medium text-muted hover:border-ink/30"
                    title="Quitar variante">
                    Quitar
                  </button>
                </div>
                {r.stock === 0 && (
                  <span className="w-full text-xs font-medium text-clay-dark">Esta variante está AGOTADA</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna derecha: guardar */}
      <div>
        <div className="card p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-ink">{initial ? 'Guardar cambios' : 'Publicar producto'}</h2>
          <p className="mt-1 text-sm text-muted">
            Los cambios se reflejan al instante en la tienda.
          </p>
          {error && <p className="mt-4 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark">{error}</p>}
          <button type="submit" className="btn-primary mt-5 w-full">
            {initial ? 'Guardar cambios' : 'Publicar producto'}
          </button>
          <button type="button" onClick={() => router.push('/admin/productos')} className="btn-ghost mt-1 w-full">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
