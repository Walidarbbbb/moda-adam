import type { Category, Product } from '@/lib/types';

function isLight(hex: string) {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16) || 0;
  const g = parseInt(m.substring(2, 4), 16) || 0;
  const b = parseInt(m.substring(4, 6), 16) || 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function garmentPath(category: Category) {
  switch (category) {
    case 'pantalones':
      return <path d="M132 130 L268 130 L256 332 L214 332 L200 198 L186 332 L144 332 Z" />;
    case 'conjuntos':
      return (
        <>
          <path d="M170 120 C170 132 230 132 230 120 L260 110 L274 138 L252 150 L246 144 L246 216 L154 216 L154 144 L148 150 L126 138 L140 110 Z" />
          <path d="M152 248 L250 248 L244 318 L212 318 L201 280 L190 318 L158 318 Z" />
        </>
      );
    case 'vestidos-faldas':
      return <path d="M160 100 L240 100 L260 320 L140 320 Z M160 100 C170 80 200 75 200 75 C200 75 230 80 240 100" />;
    case 'chaquetas':
      return <path d="M150 110 L110 130 L100 180 L130 175 L130 320 L200 320 L200 150 Z M250 110 L290 130 L300 180 L270 175 L270 320 L200 320 L200 150 Z M150 110 C165 90 200 82 200 82 C200 82 235 90 250 110" />;
    case 'sudaderas':
      return <path d="M148 148 C148 165 252 165 252 148 L296 134 L314 172 L276 192 L268 182 L268 320 L132 320 L132 182 L124 192 L86 172 L104 134 Z M200 148 C200 130 190 115 200 100 C210 115 200 130 200 148" />;
    case 'blusas-camisas':
      return <path d="M155 120 C155 138 245 138 245 120 L285 108 L300 148 L268 166 L256 154 L256 310 L144 310 L144 154 L132 166 L100 148 L115 108 Z" />;
    case 'deportiva':
      return <path d="M152 140 C152 158 248 158 248 140 L290 126 L308 162 L274 180 L262 170 L262 310 L138 310 L138 170 L126 180 L92 162 L110 126 Z M175 180 L225 180 L225 200 L175 200 Z" />;
    case 'calzado':
      return <path d="M80 280 L80 240 C80 220 90 200 120 195 L190 190 L260 200 L290 210 L310 240 L310 280 L200 285 L80 280 Z M120 195 L140 160 L170 150 L200 150 L200 190" />;
    case 'accesorios':
      return <path d="M120 200 C120 160 200 130 200 130 C200 130 280 160 280 200 L290 220 L310 230 L310 260 L90 260 L90 230 L110 220 Z" />;
    case 'camisetas':
    default:
      return <path d="M152 148 C152 168 248 168 248 148 L300 132 L322 176 L286 198 L272 186 L272 322 L128 322 L128 186 L114 198 L78 176 L100 132 Z" />;
  }
}

export default function ProductImage({
  product,
  colorHex,
  className = '',
}: {
  product: Product;
  colorHex?: string;
  className?: string;
}) {
  if (product.image && product.image.trim()) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.name}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const tile = colorHex || product.variants[0]?.colorHex || '#C8B79B';
  const ink = isLight(tile) ? '#1A1714' : '#F7F3EC';

  return (
    <svg
      viewBox="0 0 400 500"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`Ilustración de ${product.name}`}
    >
      <rect width="400" height="500" fill={tile} />
      <defs>
        <radialGradient id={`g-${product.id}`} cx="30%" cy="22%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#g-${product.id})`} />
      <g
        fill="none"
        stroke={ink}
        strokeOpacity="0.80"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {garmentPath(product.category)}
      </g>
      <text x="28" y="462" fill={ink} fillOpacity="0.7" fontSize="18"
            fontFamily="Georgia, serif" letterSpacing="2">MODA ADAM</text>
      <text x="28" y="482" fill={ink} fillOpacity="0.45" fontSize="13"
            fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="1">
        {product.reference}
      </text>
    </svg>
  );
}
