export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type OrderStatus = 'pendiente' | 'preparacion' | 'enviado' | 'entregado';
export type UserRole = 'mayorista' | 'admin';
export type Category = 'camisetas' | 'pantalones' | 'conjuntos' | 'accesorios';

export interface Profile {
  id: string;
  email: string;
  empresa: string;
  telefono: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: Category;
  precio_mayorista: number;
  imagen?: string;
  referencia: string;
  activo: boolean;
  created_at: string;
}

// { S: 2, M: 4, L: 4, XL: 2, XXL: 0 }
export type Surtido = Partial<Record<Size, number>>;

export interface CartItem {
  product: Product;
  surtido: Surtido;
  cantidad_total: number;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  estado: OrderStatus;
  stripe_session_id?: string;
  created_at: string;
  profiles?: Profile;
}

export interface OrderDetail {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  surtido_json: Surtido;
  products?: Product;
}
