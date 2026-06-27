export type Category =
  | 'camisetas'
  | 'pantalones'
  | 'blusas-camisas'
  | 'chaquetas'
  | 'vestidos-faldas'
  | 'sudaderas'
  | 'conjuntos'
  | 'calzado'
  | 'accesorios'
  | 'deportiva';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Role = 'cliente' | 'trabajador';

export interface Variant {
  id: string;
  size: Size;
  color: string;
  colorHex: string;
  stock: number;
}

export interface Product {
  id: string;
  reference: string;
  name: string;
  category: Category;
  price: number;
  minOrder: number;
  image?: string;
  description?: string;
  variants: Variant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  reference: string;
  color: string;
  colorHex: string;
  size: Size;
  price: number;
  image?: string;
  qty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type SafeUser = Omit<User, 'password'>;

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  total: number;
  units: number;
  createdAt: string;
  status: 'confirmado';
  payment: { name: string; last4: string };
}
