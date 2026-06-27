import type { Product, User, Variant, Size } from './types';
import { SIZES } from './constants';

// Paleta de colores del almacén
const C = {
  blanco:     { name: 'Blanco',        hex: '#F4F1EA' },
  hueso:      { name: 'Hueso',         hex: '#E9E2D4' },
  negro:      { name: 'Negro',         hex: '#1C1B1A' },
  antracita:  { name: 'Antracita',     hex: '#34322F' },
  gris:       { name: 'Gris',          hex: '#9C968D' },
  grisCla:    { name: 'Gris claro',    hex: '#CECAC4' },
  marino:     { name: 'Azul marino',   hex: '#243044' },
  azulMed:    { name: 'Azul medio',    hex: '#3E5C76' },
  azulCla:    { name: 'Azul claro',    hex: '#6B9AB8' },
  denim:      { name: 'Denim',         hex: '#4A6FA5' },
  oliva:      { name: 'Verde oliva',   hex: '#6E7A5E' },
  caza:       { name: 'Verde caza',    hex: '#49523F' },
  salvia:     { name: 'Verde salvia',  hex: '#8E9A82' },
  terracota:  { name: 'Terracota',     hex: '#B65C3F' },
  burdeos:    { name: 'Burdeos',       hex: '#6E2230' },
  rojo:       { name: 'Rojo',          hex: '#B23B36' },
  rosa:       { name: 'Rosa palo',     hex: '#D4A0A0' },
  beige:      { name: 'Beige',         hex: '#C8B79B' },
  caqui:      { name: 'Caqui',         hex: '#8A7F63' },
  camel:      { name: 'Camel',         hex: '#B08D57' },
  tostado:    { name: 'Tostado',       hex: '#9B7B5A' },
  marron:     { name: 'Marrón',        hex: '#5C3D2E' },
};

type Color = { name: string; hex: string };
const STOCK: Record<Size, number> = { S: 30, M: 45, L: 50, XL: 28, XXL: 15 };

function makeVariants(colors: Color[], soldOut: [string, Size][] = []): Variant[] {
  const out: Variant[] = [];
  for (const c of colors) {
    for (const size of SIZES) {
      const isOut = soldOut.some(([cn, sz]) => cn === c.name && sz === size);
      out.push({
        id: `${slug(c.name)}-${size}`,
        size,
        color: c.name,
        colorHex: c.hex,
        stock: isOut ? 0 : STOCK[size],
      });
    }
  }
  return out;
}

function slug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
//  PRODUCTOS (37 referencias, 10 categorías)
//  Los primeros 12 aparecen en la homepage (Nuevas Novedades: 0–5, Best Sellers: 6–11)
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_PRODUCTS: Product[] = [

  // ══ NUEVAS NOVEDADES (posiciones 0–5) ══════════════════════════════════════

  {
    id: 'cam-001', reference: 'CAM-001', minOrder: 6,
    name: 'Camiseta Básica Algodón 180g',
    category: 'camisetas', price: 2.90,
    image: '/images/products/camiseta-negra.jpg',
    description: '100% algodón peinado 180 g/m². Corte regular. Ideal para revender o personalizar.',
    variants: makeVariants([C.blanco, C.negro, C.gris, C.marino], [['Negro', 'XL']]),
  },
  {
    id: 'pan-004', reference: 'PAN-004', minOrder: 6,
    name: 'Pantalón Cargo Utility',
    category: 'pantalones', price: 7.90,
    image: '/images/products/pantalon-cargo.jpg',
    description: 'Cargo con bolsillos laterales. Tendencia utilitaria sostenida.',
    variants: makeVariants([C.caqui, C.negro, C.oliva]),
  },
  {
    id: 'blu-002', reference: 'BLU-002', minOrder: 6,
    name: 'Camisa Lino Casual',
    category: 'blusas-camisas', price: 5.50,
    image: '/images/products/blusa-blanca.jpg',
    description: 'Mezcla de lino 55%, fresca y transpirable. Corte relajado, temporada cálida.',
    variants: makeVariants([C.hueso, C.azulMed, C.terracota]),
  },
  {
    id: 'cha-001', reference: 'CHA-001', minOrder: 6,
    name: 'Chaqueta Denim Básica',
    category: 'chaquetas', price: 8.90,
    image: '/images/products/chaqueta-denim.jpg',
    description: 'Denim rígido, corte recto clásico. Un básico que nunca falla.',
    variants: makeVariants([C.denim, C.negro, C.antracita]),
  },
  {
    id: 'sud-001', reference: 'SUD-001', minOrder: 6,
    name: 'Hoodie Básico Unisex 320g',
    category: 'sudaderas', price: 6.50,
    image: '/images/products/sudadera-gris.jpg',
    description: 'Felpa rizo 320 g/m², capucha con cordón. Básico imprescindible.',
    variants: makeVariants([C.negro, C.gris, C.marino, C.hueso]),
  },
  {
    id: 'ves-002', reference: 'VES-002', minOrder: 6,
    name: 'Falda Cargo Midi',
    category: 'vestidos-faldas', price: 4.90,
    image: '/images/products/falda-midi.jpg',
    description: 'Cargo con bolsillos laterales, largo midi. Tendencia utilitaria femenina.',
    variants: makeVariants([C.caqui, C.negro, C.oliva]),
  },

  // ══ BEST SELLERS (posiciones 6–11) ════════════════════════════════════════

  {
    id: 'cam-002', reference: 'CAM-002', minOrder: 6,
    name: 'Camiseta Oversize French Terry',
    category: 'camisetas', price: 3.50,
    image: '/images/products/camiseta-blanca.jpg',
    description: 'Rizo francés 240 g/m². Corte oversize con dobladillo caído. Muy vendida.',
    variants: makeVariants([C.hueso, C.oliva, C.terracota, C.gris]),
  },
  {
    id: 'pan-003', reference: 'PAN-003', minOrder: 6,
    name: 'Jogger Felpa Perchada',
    category: 'pantalones', price: 5.90,
    image: '/images/products/pantalon-jogger.jpg',
    description: 'Felpa perchada con puño elástico y cordón. Cómodo y de alta demanda.',
    variants: makeVariants([C.gris, C.negro, C.hueso], [['Hueso', 'XXL']]),
  },
  {
    id: 'cha-002', reference: 'CHA-002', minOrder: 6,
    name: 'Blazer Satin Negro',
    category: 'chaquetas', price: 9.50,
    image: '/images/products/blazer-negro.jpg',
    description: 'Blazer en tela satinada con ribetes acanalados. Tendencia sostenida.',
    variants: makeVariants([C.negro, C.marino, C.oliva], [['Verde oliva', 'XXL']]),
  },
  {
    id: 'cam-003', reference: 'CAM-003', minOrder: 12,
    name: 'Polo Piqué Clásico',
    category: 'camisetas', price: 4.50,
    image: '/images/products/camiseta-gris.jpg',
    description: 'Piqué de algodón, cuello acanalado y tres botones. Básico de temporada.',
    variants: makeVariants([C.blanco, C.marino, C.burdeos], [['Burdeos', 'XXL']]),
  },
  {
    id: 'ves-001', reference: 'VES-001', minOrder: 6,
    name: 'Vestido Básico Midi',
    category: 'vestidos-faldas', price: 5.90,
    image: '/images/products/vestido-midi.jpg',
    description: 'Jersey suave, largo midi, corte A. Muy solicitado en tiendas de moda casual.',
    variants: makeVariants([C.negro, C.camel, C.burdeos, C.marino]),
  },
  {
    id: 'dep-003', reference: 'DEP-003', minOrder: 6,
    name: 'Short Deportivo Básico',
    category: 'deportiva', price: 3.50,
    image: '/images/products/pantalon-jeans.jpg',
    description: 'Poliéster ligero con forro interior y cordón ajustable.',
    variants: makeVariants([C.negro, C.gris, C.marino, C.rojo]),
  },

  // ══ RESTO DEL CATÁLOGO ════════════════════════════════════════════════════

  // ── CAMISETAS
  {
    id: 'cam-004', reference: 'CAM-004', minOrder: 6,
    name: 'Camiseta Manga Larga Lisa',
    category: 'camisetas', price: 3.20,
    description: 'Punto liso manga larga 160 g/m². Temporada otoño-invierno. Alta rotación.',
    variants: makeVariants([C.negro, C.blanco, C.marino, C.antracita]),
  },

  // ── PANTALONES
  {
    id: 'pan-001', reference: 'PAN-001', minOrder: 6,
    name: 'Vaquero Slim Denim Elástico',
    category: 'pantalones', price: 7.50,
    image: '/images/products/pantalon-jeans.jpg',
    description: 'Denim elástico 11 oz, corte slim, cinco bolsillos. Lavado uniforme por lote.',
    variants: makeVariants([C.denim, C.negro, C.antracita], [['Negro', 'S']]),
  },
  {
    id: 'pan-002', reference: 'PAN-002', minOrder: 6,
    name: 'Pantalón Chino Sarga',
    category: 'pantalones', price: 6.90,
    description: 'Sarga de algodón con elastano. Versátil, de vestir o casual.',
    variants: makeVariants([C.beige, C.marino, C.caza, C.gris]),
  },

  // ── BLUSAS Y CAMISAS
  {
    id: 'blu-001', reference: 'BLU-001', minOrder: 6,
    name: 'Blusa Básica Manga Larga',
    category: 'blusas-camisas', price: 3.90,
    image: '/images/products/blusa-blanca.jpg',
    description: 'Tejido liso ligero, escote redondo. Muy combinable, alta rotación.',
    variants: makeVariants([C.blanco, C.negro, C.rosa, C.azulCla]),
  },
  {
    id: 'blu-003', reference: 'BLU-003', minOrder: 6,
    name: 'Blusa Satinada Manga Corta',
    category: 'blusas-camisas', price: 4.90,
    description: 'Tejido satinado con caída suave. Aspecto elegante a precio mayorista.',
    variants: makeVariants([C.negro, C.blanco, C.camel, C.burdeos]),
  },
  {
    id: 'blu-004', reference: 'BLU-004', minOrder: 12,
    name: 'Camisa Oxford Botones',
    category: 'blusas-camisas', price: 6.20,
    description: 'Oxford algodón 100%, corte regular. Básico de fondo de armario.',
    variants: makeVariants([C.blanco, C.azulCla, C.marino], [['Azul claro', 'XXL']]),
  },

  // ── CHAQUETAS
  {
    id: 'cha-003', reference: 'CHA-003', minOrder: 6,
    name: 'Cazadora Ligera Cortavientos',
    category: 'chaquetas', price: 7.90,
    description: 'Nailon ligero, cortavientos. Ideal para primavera y otoño.',
    variants: makeVariants([C.negro, C.azulMed, C.caqui]),
  },

  // ── VESTIDOS Y FALDAS
  {
    id: 'ves-003', reference: 'VES-003', minOrder: 6,
    name: 'Vestido Camisero Lino',
    category: 'vestidos-faldas', price: 6.50,
    image: '/images/products/vestido-midi.jpg',
    description: 'Estilo camisero en mezcla de lino. Corte relajado y transpirable.',
    variants: makeVariants([C.hueso, C.azulCla, C.terracota]),
  },
  {
    id: 'ves-004', reference: 'VES-004', minOrder: 6,
    name: 'Falda Plisada Satinada',
    category: 'vestidos-faldas', price: 5.20,
    description: 'Mini-falda plisada en satén ligero. Alta rotación en temporada.',
    variants: makeVariants([C.negro, C.rosa, C.camel, C.marino]),
  },

  // ── SUDADERAS
  {
    id: 'sud-002', reference: 'SUD-002', minOrder: 6,
    name: 'Sudadera Sin Capucha Crew',
    category: 'sudaderas', price: 5.20,
    image: '/images/products/sudadera-gris.jpg',
    description: 'Cuello redondo en felpa. Versión clásica sin capucha, fácil de revender.',
    variants: makeVariants([C.gris, C.negro, C.tostado, C.azulMed]),
  },
  {
    id: 'sud-003', reference: 'SUD-003', minOrder: 6,
    name: 'Hoodie Oversize Crop',
    category: 'sudaderas', price: 7.20,
    description: 'Corte oversize con bajo recortado. Muy pedido en tiendas de moda joven.',
    variants: makeVariants([C.hueso, C.rosa, C.oliva], [['Rosa palo', 'XXL']]),
  },

  // ── CONJUNTOS
  {
    id: 'con-001', reference: 'CON-001', minOrder: 6,
    name: 'Conjunto Chándal Felpa 300g',
    category: 'conjuntos', price: 9.90,
    description: 'Sudadera + pantalón a juego en felpa 300 g/m². Se vende como conjunto.',
    variants: makeVariants([C.gris, C.negro, C.marino], [['Azul marino', 'S']]),
  },
  {
    id: 'con-002', reference: 'CON-002', minOrder: 6,
    name: 'Set Verano Lino',
    category: 'conjuntos', price: 8.90,
    description: 'Camisa + pantalón corto en mezcla de lino. Fresco y elegante.',
    variants: makeVariants([C.hueso, C.terracota, C.salvia]),
  },
  {
    id: 'con-003', reference: 'CON-003', minOrder: 6,
    name: 'Conjunto Deportivo Técnico',
    category: 'conjuntos', price: 7.90,
    description: 'Camiseta técnica + short a juego. Equipos y tiendas de deporte.',
    variants: makeVariants([C.negro, C.marino, C.rojo]),
  },
  {
    id: 'con-004', reference: 'CON-004', minOrder: 6,
    name: 'Co-ord Punto Canalé',
    category: 'conjuntos', price: 9.50,
    description: 'Top + pantalón en punto canalé. Co-ord de tendencia para revendedores.',
    variants: makeVariants([C.camel, C.oliva, C.antracita]),
  },

  // ── CALZADO
  {
    id: 'zap-001', reference: 'ZAP-001', minOrder: 6,
    name: 'Zapatillas Básicas Lona',
    category: 'calzado', price: 7.50,
    image: '/images/products/zapatillas-blancas.jpg',
    description: 'Lona 100%, suela vulcanizada. S=36-37, M=38-39, L=40-41, XL=42-43.',
    variants: makeVariants([C.blanco, C.negro, C.marino]),
  },
  {
    id: 'zap-002', reference: 'ZAP-002', minOrder: 6,
    name: 'Botines Chelsea Elástico',
    category: 'calzado', price: 9.90,
    image: '/images/products/botas-negras.jpg',
    description: 'Piel sintética, elásticos laterales. S=36-37, M=38-39, L=40-41, XL=42.',
    variants: makeVariants([C.negro, C.marron], [['Marrón', 'XXL']]),
  },
  {
    id: 'zap-003', reference: 'ZAP-003', minOrder: 6,
    name: 'Sandalias Planas Tiras',
    category: 'calzado', price: 5.90,
    description: 'Tiras cruzadas, suela plana de goma. Temporada primavera-verano.',
    variants: makeVariants([C.negro, C.beige, C.terracota]),
  },

  // ── ACCESORIOS
  {
    id: 'acc-001', reference: 'ACC-001', minOrder: 12,
    name: 'Gorra Básica 6 Panel',
    category: 'accesorios', price: 2.90,
    image: '/images/products/gorra-negra.jpg',
    description: 'Algodón 100%, cierre ajustable. Talla única. Muy alta rotación.',
    variants: makeVariants([C.negro, C.blanco, C.marino, C.gris]),
  },
  {
    id: 'acc-002', reference: 'ACC-002', minOrder: 10,
    name: 'Bolso Tote Canvas',
    category: 'accesorios', price: 3.50,
    description: 'Canvas grueso 10 oz, asas reforzadas. Perfecto para personalizar o revender.',
    variants: makeVariants([C.negro, C.hueso, C.marino]),
  },
  {
    id: 'acc-003', reference: 'ACC-003', minOrder: 12,
    name: 'Cinturón Cuero PU Liso',
    category: 'accesorios', price: 3.90,
    description: 'Cuero sintético, hebilla metálica. S=75-80cm, M=85-90cm, L=95-100cm.',
    variants: makeVariants([C.negro, C.marron, C.camel]),
  },
  {
    id: 'acc-004', reference: 'ACC-004', minOrder: 12,
    name: 'Bufanda Básica Acrílico',
    category: 'accesorios', price: 2.50,
    description: 'Acrílico suave, 180x30cm. Talla única. Ideal para surtido de temporada.',
    variants: makeVariants([C.negro, C.grisCla, C.marino, C.burdeos]),
  },

  // ── ROPA DEPORTIVA
  {
    id: 'dep-001', reference: 'DEP-001', minOrder: 6,
    name: 'Camiseta Técnica Dry-Fit',
    category: 'deportiva', price: 3.90,
    description: 'Poliéster 100%, tejido de secado rápido. Perfecto para equipaciones.',
    variants: makeVariants([C.negro, C.marino, C.rojo, C.blanco]),
  },
  {
    id: 'dep-002', reference: 'DEP-002', minOrder: 6,
    name: 'Leggings Deportivos 7/8',
    category: 'deportiva', price: 4.90,
    description: 'Nailon/elastano, cinturilla alta. Largo 7/8. Muy solicitados.',
    variants: makeVariants([C.negro, C.marino, C.antracita]),
  },
  {
    id: 'dep-004', reference: 'DEP-004', minOrder: 6,
    name: 'Conjunto Deportivo Mujer',
    category: 'deportiva', price: 7.90,
    description: 'Top deportivo + leggings a juego. Tejido compresivo con UV protection.',
    variants: makeVariants([C.negro, C.rosa, C.azulMed], [['Rosa palo', 'XXL']]),
  },
];

// ─── Usuarios de prueba ───────────────────────────────────────────────────────
export const SEED_USERS: User[] = [
  {
    id: 'u-cliente',
    name: 'Cliente Demo',
    email: 'cliente@modaadam.com',
    password: 'cliente123',
    role: 'cliente',
  },
  {
    id: 'u-trabajador',
    name: 'Adam (Trabajador)',
    email: 'admin@modaadam.com',
    password: 'admin123',
    role: 'trabajador',
  },
];
