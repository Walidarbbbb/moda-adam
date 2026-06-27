import Link from 'next/link';
import type { Product } from '@/lib/types';
import { eur } from '@/lib/format';
import { MIN_ORDER } from '@/lib/constants';
import ProductImage from './ProductImage';

export default function ProductCard({ product }: { product: Product }) {
  const colors = product.variants.reduce<{ name: string; hex: string }[]>((acc, v) => {
    if (!acc.some((c) => c.name === v.color)) acc.push({ name: v.color, hex: v.colorHex });
    return acc;
  }, []);

  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const soldOut = totalStock === 0;

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden border border-sand bg-white transition hover:border-ink"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F3EF]">
        <ProductImage
          product={product}
          className="transition duration-500 group-hover:scale-[1.04]"
        />
        {soldOut && (
          <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            Agotado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          {product.reference}
        </span>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink">
          {product.name}
        </h3>

        {/* Muestras de color */}
        <div className="mt-2 flex items-center gap-1">
          {colors.slice(0, 5).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3 w-3 border border-ink/10"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {colors.length > 5 && (
            <span className="text-[10px] text-muted">+{colors.length - 5}</span>
          )}
        </div>

        {/* Precio */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-black text-ink">{eur(product.price)}</span>
            <span className="text-xs text-muted"> /ud</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Mín. {MIN_ORDER}
          </span>
        </div>
      </div>
    </Link>
  );
}
