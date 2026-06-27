'use client';

// ============================================================================
//  EL ALMACÉN (STORE)
//  Es el "cerebro" de la app. Guarda en memoria: productos, carrito, usuario
//  conectado y pedidos. Y lo PERSISTE en el navegador con localStorage, para que
//  al recargar la página no se pierda nada.
//
//  Cualquier componente puede usar estos datos y acciones con el hook useStore().
//
//  👉 EN REAL: todo esto se sustituiría por llamadas a una base de datos en el
//     servidor (por ejemplo Supabase) y una autenticación segura. Aquí lo
//     simulamos en el propio navegador para que la demo funcione sin nada externo.
// ============================================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CartItem,
  Order,
  Product,
  Role,
  SafeUser,
  User,
  Variant,
} from './types';
import { MIN_ORDER } from './constants';
import { SEED_PRODUCTS, SEED_USERS } from './seed-data';
import { totalPrice, totalUnits } from './format';

// Nombres de las "cajas" donde guardamos cada cosa en localStorage.
const LS = {
  products: 'moda-adam:products',
  users: 'moda-adam:users',
  cart: 'moda-adam:cart',
  orders: 'moda-adam:orders',
  currentUser: 'moda-adam:current-user',
  dataVersion: 'moda-adam:data-version',
};

// Cuando cambia el seed de productos (nuevas imágenes, nuevas referencias) se sube
// este número para que los navegadores con datos viejos recarguen los productos.
const DATA_VERSION = 'v2';

// Lee un valor de localStorage de forma segura (si falla, devuelve un valor por defecto).
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Quita la contraseña de un usuario antes de usarlo en la interfaz.
const toSafe = (u: User): SafeUser => {
  const { password, ...rest } = u;
  return rest;
};

// "Resultado" sencillo para login/registro: ¿salió bien? y si no, ¿por qué?
type Result = { ok: boolean; error?: string };

// Todo lo que el store ofrece al resto de la app.
interface StoreValue {
  hydrated: boolean; // ¿ya cargamos los datos del navegador? (evita parpadeos)

  // Productos
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setVariantStock: (productId: string, variantId: string, stock: number) => void;

  // Sesión / usuarios
  currentUser: SafeUser | null;
  login: (email: string, password: string, requireRole?: Role) => Result;
  register: (data: { name: string; email: string; password: string }) => Result;
  logout: () => void;

  // Carrito
  cart: CartItem[];
  cartUnits: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: Variant, qty: number) => void;
  updateQty: (productId: string, variantId: string, qty: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;

  // Pedidos
  orders: Order[];
  myOrders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (payment: { name: string; number: string }) => Order | null;

  // Utilidad de demo
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Importante: arrancamos con los datos de ejemplo (igual en servidor y navegador),
  // y SOLO después de montar leemos lo guardado en localStorage. Así evitamos
  // errores de "hidratación" (que el HTML del servidor no coincida con el del navegador).
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 1) Al montar, cargamos lo que hubiera guardado en el navegador.
  //    Si la versión del seed ha cambiado, recargamos los productos para que
  //    las nuevas imágenes y referencias aparezcan sin que el usuario tenga que
  //    limpiar manualmente el navegador.
  useEffect(() => {
    const storedVersion = read<string>(LS.dataVersion, '');
    const seedChanged = storedVersion !== DATA_VERSION;

    setProducts(seedChanged ? SEED_PRODUCTS : read(LS.products, SEED_PRODUCTS));
    setUsers(read(LS.users, SEED_USERS));
    setCart(read(LS.cart, []));
    setOrders(read(LS.orders, []));
    setCurrentUser(read(LS.currentUser, null));

    if (seedChanged) {
      window.localStorage.setItem(LS.dataVersion, DATA_VERSION);
      window.localStorage.setItem(LS.products, JSON.stringify(SEED_PRODUCTS));
    }
    setHydrated(true);
  }, []);

  // 2) Cada vez que algo cambia (y ya estamos hidratados), lo guardamos.
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LS.products, JSON.stringify(products));
  }, [products, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LS.users, JSON.stringify(users));
  }, [users, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LS.cart, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LS.orders, JSON.stringify(orders));
  }, [orders, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(LS.currentUser, JSON.stringify(currentUser));
  }, [currentUser, hydrated]);

  // -------------------- PRODUCTOS --------------------
  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  // Crea (si no existe) o actualiza (si existe) un producto.
  const upsertProduct = useCallback((p: Product) => {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Cambia las unidades de una variante (poner 0 = marcar como AGOTADO).
  const setVariantStock = useCallback(
    (productId: string, variantId: string, stock: number) => {
      const safe = Math.max(0, Math.floor(stock || 0));
      setProducts((prev) =>
        prev.map((p) =>
          p.id !== productId
            ? p
            : {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, stock: safe } : v,
                ),
              },
        ),
      );
    },
    [],
  );

  // -------------------- SESIÓN --------------------
  const login = useCallback(
    (email: string, password: string, requireRole?: Role): Result => {
      const u = users.find(
        (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password,
      );
      if (!u) return { ok: false, error: 'Email o contraseña incorrectos.' };
      if (requireRole && u.role !== requireRole) {
        return {
          ok: false,
          error:
            requireRole === 'trabajador'
              ? 'Esta cuenta no es de trabajador. Usa una cuenta del personal.'
              : 'Esta cuenta no es de cliente.',
        };
      }
      setCurrentUser(toSafe(u));
      return { ok: true };
    },
    [users],
  );

  const register = useCallback(
    (data: { name: string; email: string; password: string }): Result => {
      const email = data.email.trim().toLowerCase();
      if (!data.name.trim()) return { ok: false, error: 'Escribe tu nombre.' };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
        return { ok: false, error: 'Escribe un email válido.' };
      if (data.password.length < 6)
        return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
      if (users.some((u) => u.email.toLowerCase() === email))
        return { ok: false, error: 'Ya existe una cuenta con ese email.' };

      const nuevo: User = {
        id: `u-${Date.now()}`,
        name: data.name.trim(),
        email,
        password: data.password, // DEMO: en real iría cifrada en el servidor.
        role: 'cliente',
      };
      setUsers((prev) => [...prev, nuevo]);
      setCurrentUser(toSafe(nuevo)); // al registrarse, queda con la sesión iniciada
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  // -------------------- CARRITO --------------------
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product: Product, variant: Variant, qty: number) => {
    const minimo = product.minOrder ?? MIN_ORDER;
    const cantidad = Math.min(Math.max(qty, minimo), variant.stock);
    if (cantidad <= 0) return;
    setCart((prev) => {
      const i = prev.findIndex(
        (it) => it.productId === product.id && it.variantId === variant.id,
      );
      if (i >= 0) {
        // Ya estaba esa variante: sumamos cantidad (sin pasar del stock).
        const copia = [...prev];
        copia[i] = { ...copia[i], qty: Math.min(copia[i].qty + cantidad, variant.stock) };
        return copia;
      }
      const item: CartItem = {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        reference: product.reference,
        color: variant.color,
        colorHex: variant.colorHex,
        size: variant.size,
        price: product.price,
        image: product.image,
        qty: cantidad,
      };
      return [...prev, item];
    });
    setIsCartOpen(true); // abrimos el carrito lateral al añadir
  }, []);

  const updateQty = useCallback((productId: string, variantId: string, qty: number) => {
    setCart((prev) =>
      prev.map((it) => {
        if (it.productId !== productId || it.variantId !== variantId) return it;
        const prod = products.find((p) => p.id === productId);
        const minimo = prod?.minOrder ?? MIN_ORDER;
        return { ...it, qty: Math.max(qty, minimo) };
      }),
    );
  }, [products]);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((it) => !(it.productId === productId && it.variantId === variantId)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartUnits = useMemo(() => totalUnits(cart), [cart]);
  const cartTotal = useMemo(() => totalPrice(cart), [cart]);

  // -------------------- PEDIDOS --------------------
  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  // Pedidos del usuario conectado (más recientes primero).
  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter((o) => o.userId === currentUser.id)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [orders, currentUser]);

  // "Paga" (simulado) y confirma el pedido: lo guarda, descuenta stock y vacía el carrito.
  const placeOrder = useCallback(
    (payment: { name: string; number: string }): Order | null => {
      if (!currentUser || cart.length === 0) return null;

      const year = new Date().getFullYear();
      const numero = String(orders.length + 1).padStart(4, '0');
      const last4 = payment.number.replace(/\D/g, '').slice(-4) || '0000';

      const order: Order = {
        id: `MA-${year}-${numero}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        items: cart,
        total: cartTotal,
        units: cartUnits,
        createdAt: new Date().toISOString(),
        status: 'confirmado',
        payment: { name: payment.name, last4 },
      };

      // 👉 EN REAL: aquí se cobraría con Stripe (crear PaymentIntent) y solo si el
      //    pago se confirma se guardaría el pedido en la base de datos.

      // Descontamos del stock las unidades vendidas.
      setProducts((prev) =>
        prev.map((p) => {
          const lineas = cart.filter((it) => it.productId === p.id);
          if (lineas.length === 0) return p;
          return {
            ...p,
            variants: p.variants.map((v) => {
              const linea = lineas.find((l) => l.variantId === v.id);
              return linea ? { ...v, stock: Math.max(0, v.stock - linea.qty) } : v;
            }),
          };
        }),
      );

      setOrders((prev) => [order, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      return order;
    },
    [currentUser, cart, cartTotal, cartUnits, orders.length],
  );

  // -------------------- REINICIAR DEMO --------------------
  // Borra lo guardado y vuelve a los datos de ejemplo. Útil para empezar de cero.
  const resetDemo = useCallback(() => {
    Object.values(LS).forEach((k) => window.localStorage.removeItem(k));
    setProducts(SEED_PRODUCTS);
    setUsers(SEED_USERS);
    setCart([]);
    setOrders([]);
    setCurrentUser(null);
    setIsCartOpen(false);
  }, []);

  const value: StoreValue = useMemo(
    () => ({
      hydrated,
      products,
      getProduct,
      upsertProduct,
      deleteProduct,
      setVariantStock,
      currentUser,
      login,
      register,
      logout,
      cart,
      cartUnits,
      cartTotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      orders,
      myOrders,
      getOrder,
      placeOrder,
      resetDemo,
    }),
    [
      hydrated, products, getProduct, upsertProduct, deleteProduct, setVariantStock,
      currentUser, login, register, logout,
      cart, cartUnits, cartTotal, isCartOpen, openCart, closeCart, addToCart,
      updateQty, removeFromCart, clearCart,
      orders, myOrders, getOrder, placeOrder, resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Hook para usar el store desde cualquier componente: const { cart, addToCart } = useStore();
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore() debe usarse dentro de <StoreProvider>.');
  return ctx;
}
