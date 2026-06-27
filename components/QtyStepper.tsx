'use client';

import { MIN_ORDER } from '@/lib/constants';

// Selector de cantidad con botones − y +. Respeta el mínimo (6) y el máximo (stock).
export default function QtyStepper({
  value,
  onChange,
  min = MIN_ORDER,
  max,
  size = 'md',
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  size?: 'sm' | 'md';
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btn =
    size === 'sm'
      ? 'h-8 w-8 text-base'
      : 'h-10 w-10 text-lg';
  const box = size === 'sm' ? 'w-10 text-sm' : 'w-12 text-base';

  return (
    <div className="inline-flex items-center rounded-full border border-sand bg-paper">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Quitar una unidad"
        className={`${btn} grid place-items-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-30`}
      >
        −
      </button>
      <span className={`${box} text-center font-medium tabular-nums`}>{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Añadir una unidad"
        className={`${btn} grid place-items-center rounded-full text-ink transition hover:bg-ink/5 disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
}
