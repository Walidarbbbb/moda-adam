import type { Category, Size } from './types';

export const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const MIN_ORDER = 6;

export const CATEGORIES: { slug: Category; label: string; tagline: string }[] = [
  { slug: 'camisetas',      label: 'Camisetas',          tagline: 'Básicas, oversize, estampadas, polos' },
  { slug: 'pantalones',     label: 'Pantalones',          tagline: 'Jeans, chinos, joggers, cargo' },
  { slug: 'blusas-camisas', label: 'Blusas y Camisas',    tagline: 'Botones, casual, formal, lino' },
  { slug: 'chaquetas',      label: 'Chaquetas',           tagline: 'Denim, bomber, parka, cazadora' },
  { slug: 'vestidos-faldas',label: 'Vestidos y Faldas',   tagline: 'Casual, midi, maxi, cargo' },
  { slug: 'sudaderas',      label: 'Sudaderas',           tagline: 'Hoodie, básicas, oversize, crop' },
  { slug: 'conjuntos',      label: 'Conjuntos',           tagline: 'Co-ords, chándals, sets coordinados' },
  { slug: 'calzado',        label: 'Calzado',             tagline: 'Zapatillas, botas, botines, sandalias' },
  { slug: 'accesorios',     label: 'Accesorios',          tagline: 'Gorras, bolsos, cinturones, bufandas' },
  { slug: 'deportiva',      label: 'Ropa Deportiva',      tagline: 'Camisetas técnicas, shorts, leggings' },
];

export const BUSINESS = {
  name: 'Moda Adam',
  tagline: 'Ropa al por mayor',
  address: 'Calle Teros, 30 — Polígono Industrial El Bosch, 03330 Crevillent (Alicante)',
  hours: 'Lun–Vie 9:00–18:00',
  email: 'pedidos@modaadam.es',
  phone: '+34 955 146 737',
};

export const WHATSAPP_NUMBER = '34955146737';
